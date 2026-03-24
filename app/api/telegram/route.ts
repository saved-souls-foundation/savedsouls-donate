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
Zet berichten om naar JSON. Geen uitleg, geen markdown, geen backticks.
Antwoord ALLEEN met pure JSON op één regel.
Huidig jaar is 2026. Gebruik altijd 2026 tenzij anders aangegeven.

Mogelijke types en velden:
- afspraak: { beschrijving, datum (YYYY-MM-DD), tijd (HH:MM), persoon }
- mail_taak: { onderwerp, van, prioriteit }
- sponsor: { naam, bedrag, datum (YYYY-MM-DD) }
- donatie: { naam, bedrag, datum (YYYY-MM-DD) }
- vrijwilliger: { naam, email, rol }
- adoptant: { naam, dier, datum (YYYY-MM-DD) }
- rooster_wijziging: { naam, datum (YYYY-MM-DD), tijd (HH:MM), actie }

Voorbeelden:
{"type":"afspraak","data":{"beschrijving":"dierenarts","datum":"2026-03-28","tijd":"14:00","persoon":"arts"}}
{"type":"mail_taak","data":{"onderwerp":"samenwerking","van":"ABC","prioriteit":"hoog"}}
{"type":"sponsor","data":{"naam":"Bedrijf XYZ","bedrag":"500","datum":"2026-03-24"}}`,
      messages: [{ role: "user", content: message }],
    });

    const responseText =
      claude.content[0].type === "text" ? claude.content[0].text.trim() : "";

    await sendTelegram(chatId, `🧠 Claude zegt: ${responseText}`);

    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const actie = JSON.parse(cleanJson) as {
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
        const datum = data.datum ? String(data.datum).trim() : "";
        const tijd = data.tijd ? String(data.tijd).trim() : "09:00";
        const datumStr = datum ? `${datum}T${tijd}:00+07:00` : "";
        const d = datumStr ? new Date(datumStr) : new Date();
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

      const { error } = await supabase.from("calendar_events").insert({
        title,
        category: "afspraak",
        start_time,
        description: persoon,
        location: null,
      });
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(
          chatId,
          `✅ Afspraak opgeslagen in agenda!\n📅 ${title} op ${data.datum} om ${data.tijd ?? "09:00"}`
        );
      }
    } else if (type === "mail_taak") {
      const onderwerp = data.onderwerp
        ? String(data.onderwerp).trim()
        : "Via Telegram";
      const van_naam = data.van ? String(data.van).trim() : "Telegram";
      const prioriteit = data.prioriteit
        ? String(data.prioriteit).trim()
        : null;

      const { error } = await supabase.from("incoming_emails").insert({
        onderwerp,
        van_naam,
        van_email: "telegram@savedsouls.internal",
        inhoud: prioriteit,
        bron: "telegram",
        status: "in_behandeling",
      });
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(
          chatId,
          `✅ Mail taak opgeslagen!\n📧 ${onderwerp} van ${van_naam}`
        );
      }
    } else if (type === "sponsor") {
      const naam = data.naam ? String(data.naam).trim() : null;
      const omschrijving = data.bedrag
        ? `Bedrag: ${String(data.bedrag).trim()}`
        : null;

      const { error } = await supabase.from("sponsors").insert({
        bedrijfsnaam: naam,
        bedrag_per_maand: null,
        status: "actief",
        notities: "Via Telegram op " + new Date().toLocaleDateString("nl-NL"),
        omschrijving,
        herinnering_verstuurd: false,
      });
      if (error) {
        await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
      } else {
        await sendTelegram(
          chatId,
          `✅ Sponsor opgeslagen!\n🏢 ${naam ?? "onbekend"}`
        );
      }
    } else {
      await sendTelegram(
        chatId,
        `⚠️ "${type || "onbekend"}" wordt nog niet automatisch opgeslagen.\n\nNoteer handmatig:\n${JSON.stringify(data, null, 2)}`
      );
    }
  } catch (e: any) {
    if (chatId) await sendTelegram(chatId, `❌ Fout: ${e.message}`);
  }

  return NextResponse.json({ ok: true });
}