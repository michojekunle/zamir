import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
);

/**
 * POST /api/script-suno
 *
 * Takes scripture text + mood/tempo and uses Gemini to produce
 * Suno-optimized lyrics, style descriptor, and title.
 *
 * Body: { text: string, mood: string, tempo: string }
 * Returns: { lyrics: string, style: string, title: string }
 */
export async function POST(req: Request) {
  try {
    const { text, mood, tempo } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No scripture provided" },
        { status: 400 },
      );
    }

    const tempoMap: Record<string, string> = {
      Slow: "slow, 65 bpm",
      Moderate: "mid-tempo, 95 bpm",
      Fast: "upbeat, 130 bpm",
    };
    const tempoHint = tempoMap[tempo] || "mid-tempo";

    const moodDescriptors: Record<string, string> = {
      Peaceful: "peaceful, serene, ambient, gentle",
      Joyful: "joyful, uplifting, bright, celebratory",
      Intense: "intense, powerful, dramatic, building",
      Reflective: "reflective, contemplative, introspective, warm",
      Calm: "calm, soothing, minimal, meditative",
    };
    const moodHint = moodDescriptors[mood] || "peaceful, serene";

    const prompt = `You are a talented Christian songwriting producer optimizing scripture for Suno AI music generation.

SCRIPTURE: "${text}"
USER MOOD: ${mood || "Peaceful"}
USER TEMPO: ${tempo || "Moderate"}

YOUR TASK:
1. Transform the scripture into singable LYRICS. Make them poetic, rhythmic, and musical.
   - Add a [Verse] and [Chorus] structure using Suno metatags
   - You may paraphrase lightly for rhythm, but keep the scriptural meaning intact
   - Use natural vocal phrasing — short lines that breathe
   - Maximum 3000 characters
   
2. Create a STYLE descriptor (max 200 characters) that combines:
   - Genre: gospel, worship, contemporary christian, spiritual
   - Mood: ${moodHint}
   - Tempo: ${tempoHint}
   - Vocal quality: soulful, breathy, warm, harmonized
   - Instrumentation hints: piano, strings, pads, acoustic guitar
   
3. Create a short TITLE (max 80 characters) inspired by the scripture.

OUTPUT FORMAT (strict JSON only, no markdown):
{
  "lyrics": "[Verse 1]\\nLine one of verse...\\nLine two...\\n\\n[Chorus]\\nChorus line one...\\nChorus line two...\\n\\n[Verse 2]\\nVerse two line one...\\n\\n[Outro]\\nFinal line...",
  "style": "gospel worship, soulful female vocals, piano, strings, ${tempoHint}, ${moodHint}",
  "title": "A Beautiful Title"
}`;

    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean markdown code fences if present
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      // Validate the response
      if (!parsed.lyrics || !parsed.style || !parsed.title) {
        throw new Error("Incomplete response from Gemini");
      }

      // Enforce Suno limits
      return NextResponse.json({
        lyrics: parsed.lyrics.slice(0, 3000),
        style: parsed.style.slice(0, 200),
        title: parsed.title.slice(0, 80),
      });
    } catch (geminiError: any) {
      console.error("Gemini Script Error:", geminiError.message);

      // Fallback: deterministic scripture-to-lyrics conversion
      const lines = text.split(/[.;!?]+/).filter((l: string) => l.trim());
      const verseLyrics = lines.map((line: string) => line.trim()).join("\n");

      return NextResponse.json({
        lyrics: `[Verse]\n${verseLyrics}\n\n[Chorus]\n${lines[0]?.trim() || text.slice(0, 80)}`,
        style:
          `gospel worship, soulful vocals, piano, strings, ${tempoHint}, ${moodHint}`.slice(
            0,
            200,
          ),
        title: `${text.slice(0, 40)}...`.slice(0, 80),
      });
    }
  } catch (error: any) {
    console.error("Critical Script-Suno API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
