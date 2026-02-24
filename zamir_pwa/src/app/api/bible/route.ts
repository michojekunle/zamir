import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // 2. Second Attempt: If the version isn't on the free API (like NIV/TPT), try OpenAI
    // We use gpt-4o-mini here as it is significantly cheaper and faster
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `
          Return the full text of ${book} Chapter ${chapter} in the ${version.toUpperCase()} translation.
          Format the output as a JSON array of objects with "number" (integer) and "text" (string) keys.
          Return ONLY THE JSON. Do not include any commentary.
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Using mini to save quota/costs
          messages: [
            {
              role: "system",
              content:
                "You are a Bible scholar. Return exact scripture text in JSON format.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        const data = JSON.parse(content || "{}");
        const verses = data.verses || data;

        if (Array.isArray(verses) && verses.length > 0) {
          return NextResponse.json({ verses });
        }
      } catch (openAiError: any) {
        console.error(
          "OpenAI Fallback Error (likely quota):",
          openAiError.message,
        );
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
