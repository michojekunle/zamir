import { NextResponse } from "next/server";

const SUNO_API_BASE = "https://api.sunoapi.org";

// Polling config — exported so tests can override
export const POLL_CONFIG = {
  maxPolls: 18,
  intervalMs: 10_000,
  sleep: (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
};

/**
 * POST /api/generate-suno
 *
 * Expects JSON body:
 * {
 *   lyrics: string,        // The full lyrics (scripture text)
 *   style: string,         // Music style descriptor (max 200 chars)
 *   title: string,         // Track title (max 80 chars)
 *   instrumental?: boolean // If true, generates instrumental only
 * }
 *
 * Flow:
 * 1. Submits a generation request to SunoAPI.org custom mode (V4)
 * 2. Polls the record-info endpoint until the task completes or times out
 * 3. Returns the audio URL(s) to the client
 */
export async function POST(req: Request) {
  try {
    const { lyrics, style, title, instrumental } = await req.json();

    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Suno API key is not configured. Please add SUNO_API_KEY to your environment.",
        },
        { status: 500 },
      );
    }

    if (!lyrics && !instrumental) {
      return NextResponse.json(
        { error: "Please provide lyrics or enable instrumental mode." },
        { status: 400 },
      );
    }

    if (!style) {
      return NextResponse.json(
        { error: "Please provide a music style." },
        { status: 400 },
      );
    }

    // ── Step 1: Submit generation task ──
    const generateRes = await fetch(`${SUNO_API_BASE}/api/v1/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        customMode: true,
        instrumental: instrumental || false,
        prompt: lyrics || "",
        style: style.slice(0, 200),
        title: (title || "Zamir Scripture").slice(0, 80),
        model: "V4",
        callBackUrl: "https://zamir.vercel.app/api/suno-webhook", // Required by Suno API
      }),
    });

    if (!generateRes.ok) {
      const errText = await generateRes.text();
      console.error("Suno Generate Error:", generateRes.status, errText);
      return NextResponse.json(
        { error: `Suno generation failed (${generateRes.status}): ${errText}` },
        { status: generateRes.status },
      );
    }

    const generateData = await generateRes.json();

    // The response shape is: { code: 200, msg: "...", data: { taskId: "..." } }
    const taskId = generateData?.data?.taskId;

    if (!taskId) {
      console.error("Suno: No taskId returned", JSON.stringify(generateData));
      return NextResponse.json(
        { error: "Suno did not return a task ID. Please try again." },
        { status: 502 },
      );
    }

    // ── Step 2: Poll for completion ──
    // Suno typically takes 30-120 seconds. We poll every 10s for up to 3 minutes.
    for (let i = 0; i < POLL_CONFIG.maxPolls; i++) {
      await POLL_CONFIG.sleep(POLL_CONFIG.intervalMs);

      const queryRes = await fetch(
        `${SUNO_API_BASE}/api/v1/generate/record-info?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      if (!queryRes.ok) {
        console.warn(`Suno poll attempt ${i + 1} failed: ${queryRes.status}`);
        continue;
      }

      const queryData = await queryRes.json();
      const status = queryData?.data?.status;

      if (status === "SUCCESS" || status === "FIRST_SUCCESS") {
        // Extract audio URLs from the sunoData array
        const sunoData = queryData?.data?.response?.sunoData;
        if (!sunoData || sunoData.length === 0) {
          return NextResponse.json(
            { error: "Generation completed but no audio was returned." },
            { status: 502 },
          );
        }

        // Return the first track's streaming URL for immediate playback,
        // plus the full download URL
        const firstTrack = sunoData[0];
        return NextResponse.json({
          taskId,
          status: "SUCCESS",
          tracks: sunoData.map((track: any) => ({
            id: track.id || taskId,
            audioUrl: track.audioUrl,
            streamUrl: track.streamAudioUrl,
            imageUrl: track.imageUrl,
            title: track.title || title,
            style: track.tags || style,
            duration: track.duration,
            lyrics: track.prompt,
          })),
        });
      }

      if (
        status === "CREATE_TASK_FAILED" ||
        status === "GENERATE_AUDIO_FAILED" ||
        status === "CALLBACK_EXCEPTION" ||
        status === "SENSITIVE_WORD_ERROR"
      ) {
        const errMsg =
          queryData?.data?.errorMessage ||
          `Generation failed with status: ${status}`;
        console.error("Suno generation FAILED:", errMsg);
        return NextResponse.json({ error: errMsg }, { status: 422 });
      }

      // Otherwise still PENDING / TEXT_SUCCESS — keep polling
      console.log(
        `Suno poll ${i + 1}/${POLL_CONFIG.maxPolls}: status=${status}`,
      );
    }

    // Timed out
    return NextResponse.json(
      {
        error:
          "Music generation is taking longer than expected. Please try again shortly.",
        taskId,
      },
      { status: 408 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Critical Suno API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
