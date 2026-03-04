import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
);

export async function POST(req: Request) {
  try {
    const { text, mood, tempo } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No scripture provided" },
        { status: 400 },
      );
    }

    // Map tempo labels to BPM ranges
    const bpmMap: Record<string, string> = {
      Slow: "60-75 BPM",
      Moderate: "85-110 BPM",
      Fast: "125-145 BPM",
    };
    const targetBpm = bpmMap[tempo as string] || "90 BPM";

    const prompt = `
      You are a master of divine songcraft and a high-end music producer. 
      Transform the following Holy Scripture into a high-fidelity 'Composition Plan' optimized for AI Music Generation.

      SCRIPTURE: "${text}"
      USER MOOD HINT: ${mood || "Peaceful"}
      USER TEMPO HINT: ${tempo || "Moderate"} (Target: ${targetBpm})

      QUINTESSENTIAL PROMPTING GUIDELINES:
      1. GENRE & EMOTION: Combine abstract mood descriptors (e.g., "ethereal", "reverent", "atmospheric") with detailed musical language.
      2. MUSICAL CONTROL: Always include BPM (e.g., "${targetBpm}") and a Key Signature (e.g., "in D Major") in the styles.
      3. VOCAL TEXTURE: Use expressive descriptors like "breathy", "soulful", "raw", or "harmonized".
      4. STRUCTURE: Ensure sections flow logically: Intro, Chorus, and Outro.

      OUTPUT FORMAT (STRICT JSON ONLY):
      {
        "composition_plan": {
          "positive_global_styles": ["Detailed genre & technical descriptors"],
          "negative_global_styles": ["distorted", "aggressive"],
          "sections": [
            {
              "section_name": "Intro",
              "positive_local_styles": ["Intro styling"],
              "negative_local_styles": ["percussion"],
              "duration_ms": 12000,
              "lines": ["Introductory poetic line"]
            },
            {
              "section_name": "Chorus",
              "positive_local_styles": ["Main structure, harmonized vocals"],
              "negative_local_styles": ["silence"],
              "duration_ms": 30000,
              "lines": ["${text}"]
            },
            {
              "section_name": "Outro",
              "positive_local_styles": ["Resolution"],
              "negative_local_styles": ["vocals"],
              "duration_ms": 10000,
              "lines": ["Final blessing line"]
            }
          ]
        }
      }
    `;

    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean potential markdown code blocks
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const response = JSON.parse(cleanJson);

      return NextResponse.json(response);
    } catch (geminiError: any) {
      console.error("Gemini Error:", geminiError.message);

      // Fallback
      return NextResponse.json({
        composition_plan: {
          positive_global_styles: [
            mood || "Peaceful",
            "cinematic orchestral",
            targetBpm,
            "in C Major",
          ],
          negative_global_styles: ["noisy", "drums"],
          sections: [
            {
              section_name: "Chorus",
              positive_local_styles: [
                "soulful harmonized a cappella vocals",
                "ethereal pads",
              ],
              negative_local_styles: ["percussion"],
              duration_ms: 30000,
              lines: [text],
            },
          ],
        },
      });
    }
  } catch (error: any) {
    console.error("Critical Gemini Script API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
