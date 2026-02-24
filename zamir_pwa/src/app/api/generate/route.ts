import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    // Default to 'Rachel' similar neutral voice if none provided
    const id = voiceId || "21m00Tcm4TlvDq8ikWAM";

    // ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${id}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs error:", errorData);
      throw new Error(
        `ElevenLabs API error: ${response.status} ${response.statusText} - ${errorData}`,
      );
    }

    // Pass the audio buffer directly to the client
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
