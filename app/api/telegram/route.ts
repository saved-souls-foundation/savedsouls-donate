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

    const actie = JSON.parse(responseText) as {
      type?: string;
      data?: Record<string, unknown>;
    };
    const type = typeof actie.type === "string" ? actie.type.trim() : "";
    const data =
      actie.data && typeof actie.data === "object" && actie.data !== null
        ? actie.data
        : {};

    if (type === "afspraak") {
      let start_time: string;
      try {
        const d = new Date(data.datum as string | number | Date);
        start_time = Number.isNaN(d.getTime())
          ? new Date().toISOString()
          : d.toISOString();
      } catch {
        start_time = new Date().toISOString();
      }
      const beschrijving =
        data.beschrijving != null ? String(data.beschrijving).trim() : "";
      const title = beschrijving.length > 0 ? beschrijving : "Afspraak";
      const persoon =
        data.persoon != null && String(data.persoon).trim().length > 0
          ? String(data.persoon).trim()
          : null;

      const row = {
        title,
        category: "appointment",
        start_time,
        description: persoon,
        location: null as string | null,
      };

      const { error } = await supabase.from("calendar_events").insert(row);
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(chatId, `✅ Opgeslagen als calendar_events (afspraak)!`);
      }
    } else if (type === "mail_taak") {
      const onderwerpRaw = data.onderwerp != null ? String(data.onderwerp).trim() : "";
      const onderwerp =
        onderwerpRaw.length > 0 ? onderwerpRaw : "Via Telegram";
      const vanNaamRaw = data.van != null ? String(data.van).trim() : "";
      const van_naam = vanNaamRaw.length > 0 ? vanNaamRaw : "Telegram";
      const prioriteit =
        data.prioriteit != null && String(data.prioriteit).trim().length > 0
          ? String(data.prioriteit).trim()
          : null;

      const row = {
        onderwerp,
        van_naam,
        van_email: "telegram@savedsouls.internal",
        inhoud: prioriteit,
        bron: "telegram",
        status: "in_behandeling" as const,
      };

      const { error } = await supabase.from("incoming_emails").insert(row);
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(chatId, `✅ Opgeslagen als incoming_emails (mail_taak)!`);
      }
    } else if (type === "sponsor") {
      const naam =
        data.naam != null && String(data.naam).trim().length > 0
          ? String(data.naam).trim()
          : null;
      const omschrijving =
        data.bedrag != null && String(data.bedrag).trim().length > 0
          ? `Bedrag: ${String(data.bedrag).trim()}`
          : null;

      const row = {
        bedrijfsnaam: naam,
        bedrag_per_maand: null as number | null,
        status: "actief" as const,
        notities: "Via Telegram op " + new Date().toLocaleDateString("nl-NL"),
        omschrijving,
        herinnering_verstuurd: false,
      };

      const { error } = await supabase.from("sponsors").insert(row);
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(chatId, `✅ Opgeslagen als sponsors (sponsor)!`);
      }
    } else {
      await sendTelegram(
        chatId,
        `⚠️ ${type || "(geen type)"} wordt nog niet automatisch opgeslagen.\n\nNoteer handmatig: ${JSON.stringify(data)}`
      );
    }
  } catch (e: any) {
    if (chatId) await sendTelegram(chatId, `❌ Fout: ${e.message}`);
  }

  return NextResponse.json({ ok: true });
}
