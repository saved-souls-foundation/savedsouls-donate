import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();
const langMap: Record<string, string> = {
  nl: "Dutch",
  en: "English",
  th: "Thai",
};

export async function POST(req: Request) {
  try {
    const { prompt, language, platforms } = await req.json();
    const lang = langMap[language as keyof typeof langMap] || "Dutch";
    const isBlog = Array.isArray(platforms) && platforms.includes("blog");

    const systemPrompt = `Je bent een content schrijver voor Saved Souls Foundation,
een dierenopvang sanctuary in Chiang Mai, Thailand.
Je schrijft warme, authentieke verhalen die mensen bewegen om te helpen of adopteren.
Schrijf ALTIJD in het ${lang}. Geen hashtags tenzij gevraagd.`;

    const userPrompt = isBlog
      ? `Schrijf een volledig blogbericht (300-500 woorden) over: ${prompt ?? ""}.
Begin met een pakkende openingszin. Vertel het verhaal emotioneel en authentiek.
Eindig met een duidelijke call-to-action (adopteer, doneer, of deel).
Geen markdown headers, gewone alinea's.`
      : `Schrijf een social media bericht (max 300 woorden) over: ${prompt ?? ""}.
Warm, persoonlijk, met 2-3 relevante emoji's.
Eindig met een vraag of call-to-action.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: isBlog ? 1000 : 400,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ text });
  } catch (e) {
    console.error("AI write-post error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI write failed" },
      { status: 500 }
    );
  }
}
