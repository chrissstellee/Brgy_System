// /app/api/ai/route.ts or /pages/api/ai.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY; // Make sure this is set in .env.local

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Gemini API] Error:", data);
      return NextResponse.json(
        { success: false, error: data.error?.message || "Unknown error", details: data },
        { status: response.status }
      );
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("[AI Route] Unexpected Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
