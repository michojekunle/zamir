import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { composition_plan } = await req.json();

    if (!composition_plan) {
      return NextResponse.json(
        { error: "No composition plan provided" },
        { status: 400 },
      );
    }

    // Ensure mandatory negative style fields exist to avoid 422 errors
    const cleanedPlan = {
      ...composition_plan,
      negative_global_styles: composition_plan.negative_global_styles || [],
      sections:
        composition_plan.sections?.map((s: any) => ({
          ...s,
          negative_local_styles: s.negative_local_styles || [],
        })) || [],
    };

    // ElevenLabs Music API (v1/music/stream)
    const response = await fetch("https://api.elevenlabs.io/v1/music/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        model_id: "music_v1",
        composition_plan: cleanedPlan,
      }),
    });

    if (!response.ok) {
      // IF MUSIC API IS BLOCKED (Free Tier), FALLBACK TO SOULFUL VOICE READING (Aria)
      if (response.status === 402) {
        console.warn(
          "Music API requires paid plan. Falling back to High-Quality Ambient Reading...",
        );

        // Extract all lines from sections for the reading
        const scriptText =
          composition_plan.sections
            ?.map((s: any) => s.lines.join(" "))
            .join("\n\n") || "Blessed be the Word.";

        // Aria voice ID (Expressive, spiritual tone)
        const voiceId = "9BWtsmCjSgl994ZpSGLO";

        const ttsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
            },
            body: JSON.stringify({
              text: scriptText,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: 0.65,
                similarity_boost: 0.8,
                style: 0.45,
                use_speaker_boost: true,
              },
            }),
          },
        );

        if (ttsRes.ok) {
          const audioBuffer = await ttsRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
              "X-Zamir-Type": "ambient-reading",
            },
          });
        }
      }

      const errorData = await response.text();
      console.error("ElevenLabs Music API Error:", errorData);
      return NextResponse.json(
        { error: `Divine Studio error: ${response.status}. ${errorData}` },
        { status: response.status },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("Critical Generation Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
