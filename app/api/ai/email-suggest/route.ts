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
    const { subject, body, category, language } = await req.json();
    const lang = langMap[language as keyof typeof langMap] || "Dutch";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Je bent een vriendelijke medewerker van Saved Souls Foundation,
een dierenopvang sanctuary in Chiang Mai, Thailand.
Schrijf een professioneel maar warm antwoord op deze email in het ${lang}.

Email onderwerp: ${subject ?? ""}
Email inhoud: ${body ?? ""}
Categorie: ${category ?? ""}

Schrijf ALLEEN de antwoordtekst. Geen onderwerp, geen "Beste Claude".
Begin direct met de begroeting. Maximaal 150 woorden. Warm en behulpzaam.`,
        },
      ],
    });

    const suggestion =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ suggestion });
  } catch (e) {
    console.error("AI email-suggest error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI suggest failed" },
      { status: 500 }
    );
  }
}
