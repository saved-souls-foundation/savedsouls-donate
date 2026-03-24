import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendTelegram(chatId: number, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );
}

export async function POST(req: NextRequest) {
  let chatId = 0;
  try {
    const body = await req.json();
    const message = body.message?.text;
    chatId = body.message?.chat?.id;

    if (!message) return NextResponse.json({ ok: true });

    await sendTelegram(chatId, `⏳ Bezig met verwerken: "${message}"`);

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

    await sendTelegram(chatId, `🧠 Claude zegt: ${responseText}`);

    const actie = JSON.parse(responseText);
    const { error } = await supabase.from(actie.type).insert(actie.data);

    if (error) {
      await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
    } else {
      await sendTelegram(chatId, `✅ Opgeslagen als ${actie.type}!`);
    }
  } catch (e: any) {
    if (chatId) await sendTelegram(chatId, `❌ Fout: ${e.message}`);
  }

  return NextResponse.json({ ok: true });
}