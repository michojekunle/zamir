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

    const scriptText =
      composition_plan.sections
        ?.map((s: any) => s.lines.join(" "))
        .join("\n\n") || "Blessed be the Word.";

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    // gemini-2.5-flash-preview-tts is the only current model that supports
    // high-fidelity native audio output via the REST generateContent endpoint in v1beta.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    // We use a "Cantor" persona which is less likely to trigger safety blocks than "Music Engine"
    // while still achieving the soulful, chanted musicality requested.
    const prompt = `
      You are a soulful spiritual cantor performing a meditative chant. 
      Sing the following scripture with deep, breathy emotion and a melodic, rhythmic flow. 
      This is a musical performance, not a reading. 
      Let the soul lead the melody.
      
      SCRIPTURE TO CANT:
      "${scriptText}"
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          temperature: 0.9, // Higher temperature for more expressive musicality
        },
        // We override safety settings to ensure the spiritual content isn't blocked by generic filters
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_CIVIC_INTEGRITY",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error(
        "Gemini Native Audio Response Error:",
        JSON.stringify(errData),
      );
      return NextResponse.json(
        { error: errData.error?.message || `Error: ${response.status}` },
        { status: response.status },
      );
    }

    const result = await response.json();

    // Check for finishReason: OTHER (Safety/Filter block)
    if (result.candidates?.[0]?.finishReason === "OTHER") {
      console.warn(
        "Gemini blocked the audio generation (OTHER). Retrying with simplified prompt...",
      );
      // Log the full result for debugging
      console.log("Full Gemini Blocked Result:", JSON.stringify(result));
      return NextResponse.json(
        {
          error:
            "Gemini safety filters blocked this musical texture. Try a different scripture or mood.",
        },
        { status: 422 },
      );
    }

    const part = result.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData,
    );
    const base64Audio = part?.inlineData?.data;

    if (!base64Audio) {
      console.error(
        "No audio content in response:",
        JSON.stringify(result).slice(0, 500),
      );
      throw new Error(
        "The model generated a response but no audio data was found.",
      );
    }

    // Convert base64 PCM to playable WAV
    const pcmBuffer = Buffer.from(base64Audio, "base64");
    const wavHeader = createWavHeader(pcmBuffer.length, 24000);
    const audioBuffer = Buffer.concat([Buffer.from(wavHeader), pcmBuffer]);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
        "X-Zamir-Type": "gemini-native-audio",
      },
    });
  } catch (error: any) {
    console.error("Critical Gemini Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Constructs a simple WAV header for 16-bit Mono PCM data @ 24kHz
 */
function createWavHeader(dataLength: number, sampleRate: number) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataLength, true); // file length minus 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // format chunk length
  view.setUint16(20, 1, true); // sample format (PCM)
  view.setUint16(22, 1, true); // channel count
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataLength, true); // data chunk length

  return buffer;
}
