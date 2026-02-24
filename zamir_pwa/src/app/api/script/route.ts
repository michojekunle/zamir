import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      Transform the following Holy Scripture into a high-fidelity 'Composition Plan' optimized for the ElevenLabs Music AI (v1).

      SCRIPTURE: "${text}"
      USER MOOD HINT: ${mood || "Peaceful"}
      USER TEMPO HINT: ${tempo || "Moderate"} (Target: ${targetBpm})

      QUINTESSENTIAL PROMPTING GUIDELINES (USE THESE):
      1. GENRE & EMOTION: Combine abstract mood descriptors (e.g., "ethereal", "reverent", "atmospheric") with detailed musical language (e.g., "dissonant strings", "swelling pads").
      2. MUSICAL CONTROL: Always include BPM (e.g., "${targetBpm}") and a Key Signature (e.g., "in D Major" or "in G Minor") in the global styles.
      3. VOCAL TEXTURE: Use expressive descriptors for vocals like "breathy", "soulful", "raw", "harmonized", or "a cappella". 
      4. ISOLATION: Use the word "solo" for focused instruments (e.g., "solo acoustic guitar").
      5. STRUCTURE: Ensure sections flow logically: Intro (Atmosphere), Chorus (Main Scripture), and Outro (Resolution).

      OUTPUT FORMAT (JSON ONLY):
      {
        "composition_plan": {
          "positive_global_styles": ["Detailed genre & technical descriptors including ${targetBpm} and Key"],
          "negative_global_styles": ["distorted", "aggressive", "electronic drums"],
          "sections": [
            {
              "section_name": "Intro",
              "positive_local_styles": ["Abstract & technical styling for intro"],
              "negative_local_styles": ["heavy percussion"],
              "duration_ms": 12000,
              "lines": ["An introductory poetic line echoing the scripture theme"]
            },
            {
              "section_name": "Chorus",
              "positive_local_styles": ["Main melodic structure, harmonized expressive vocals"],
              "negative_local_styles": ["silence"],
              "duration_ms": 30000,
              "lines": ["${text}"]
            },
            {
              "section_name": "Outro",
              "positive_local_styles": ["Fading resolution, ambient textures"],
              "negative_local_styles": ["vocals"],
              "duration_ms": 10000,
              "lines": ["A final fading blessing line"]
            }
          ]
        }
      }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional music producer specialized in AI prompting. Use specific BPM, Key Signatures, and expressive vocal textures. Output JSON only.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.75,
      });

      const response = JSON.parse(
        completion.choices[0].message.content || "{}",
      );
      return NextResponse.json(response);
    } catch (openAiError: any) {
      console.error("OpenAI Error:", openAiError.message);

      // Fallback with optimized styles
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
    console.error("Critical Script API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
