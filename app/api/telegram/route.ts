import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message?.text;
  const chatId = body.message?.chat?.id;

  if (!message) return NextResponse.json({ ok: true });

  const claude = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `Je bent een assistent voor SavedSouls Foundation. 
Zet berichten om naar JSON. Mogelijke types:
- rooster_wijziging: { naam, datum, tijd, actie }
- afspraak: { datum, beschrijving, persoon }
- vrijwilliger: { naam, email, rol, actie }
- mail_taak: { onderwerp, van, prioriteit }
- sponsor: { naam, bedrag, datum }
- donatie: { naam, bedrag, datum }
- adoptant: { naam, dier, datum }

Antwoord ALLEEN met geldig JSON: { "type": "...", "data": {...} }`,
    messages: [{ role: "user", content: message }],
  });

  const responseText =
    claude.content[0].type === "text" ? claude.content[0].text : "";
  let bevestiging = "✅ Verwerkt!";

  try {
    const actie = JSON.parse(responseText);
    const { error } = await supabase.from(actie.type).insert(actie.data);
    if (error) throw error;
    bevestiging = `✅ Opgeslagen als ${actie.type}!\n\n${JSON.stringify(actie.data, null, 2)}`;
  } catch (e) {
    bevestiging = `❌ Fout: kon niet verwerken.\nClaude zei: ${responseText}`;
  }

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: bevestiging }),
    }
  );

  return NextResponse.json({ ok: true });
}