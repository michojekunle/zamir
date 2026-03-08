import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
);

export async function POST(req: Request) {
  try {
    const { book, chapter, version } = await req.json();

    if (!book || !chapter || !version) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // 1. First Attempt: Try the free bible-api.com for the requested version
    // It supports many versions like KJV, WEB, ALMEIDA, etc.
    try {
      const res = await fetch(
        `https://bible-api.com/${book}+${chapter}?translation=${version}`,
      );
      if (res.ok) {
        const data = await res.json();
        const verses = data.verses.map((v: any) => ({
          number: v.verse,
          text: v.text.trim(),
        }));
        return NextResponse.json({ verses });
      }
    } catch (e) {
      console.warn("External Bible API failed, trying fallback...");
    }

    // 2. Second Attempt: If the version isn't on the free API (like NIV/TPT), try Gemini
    // We use gemini-2.5-flash as it is fast and capable
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const prompt = `
          You are a Bible scholar. Return the full text of ${book} Chapter ${chapter} in the ${version.toUpperCase()} translation.
          Format the output as a JSON array of objects with "number" (integer or string) and "text" (string) keys under a "verses" property.
          Return ONLY strictly valid JSON. Do not include any markdown formatting, code blocks or commentary.
          Example: {"verses": [{"number": 1, "text": "In the beginning..."}]}
        `;

        const model = genAI.getGenerativeModel({
          model: "models/gemini-2.5-flash",
        });
        const result = await model.generateContent(prompt);
        const content = result.response.text();

        const cleanContent = content.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanContent || "{}");
        const verses = data.verses || data;

        if (Array.isArray(verses) && verses.length > 0) {
          return NextResponse.json({ verses });
        }
      } catch (geminiError: any) {
        console.error("Gemini Fallback Error:", geminiError.message);
        // Do not throw here, proceed to the final safety fallback
      }
    }

    // 3. Final Safety Fallback: Use KJV from the free API
    // This ensures the user NEVER sees an error screen, even if OpenAI's quota is empty
    const safetyRes = await fetch(
      `https://bible-api.com/${book}+${chapter}?translation=kjv`,
    );
    if (safetyRes.ok) {
      const safetyData = await safetyRes.json();
      const verses = safetyData.verses.map((v: any) => ({
        number: v.verse,
        text: v.text.trim(),
      }));
      // We return the KJV verses but keep the user on their selected version (or inform them)
      return NextResponse.json({
        verses,
        fallback: true,
        message: "Requested version unavailable (Quota). Showing KJV instead.",
      });
    }

    return NextResponse.json(
      { error: "Scripture service unavailable" },
      { status: 503 },
    );
  } catch (error: any) {
    console.error("Critical Bible API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
