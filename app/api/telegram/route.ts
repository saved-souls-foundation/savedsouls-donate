import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tijdelijke opslag voor bevestigingen (in memory, per chatId)
const pendingConfirmations = new Map<number, {
  type: string;
  data: Record<string, unknown>;
  afzender: string;
  summary: string;
}>();

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

function toLocalISOString(datum: string, tijd: string): string {
  const str = `${datum}T${tijd}:00`;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 19);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 19);
}

function isZeker(data: Record<string, unknown>, type: string): boolean {
  if (type === "afspraak") {
    // Zeker als datum én tijd én beschrijving aanwezig zijn
    return !!(data.datum && data.tijd && data.beschrijving);
  }
  if (type === "mail_taak") {
    return !!(data.onderwerp && data.van);
  }
  if (type === "sponsor") {
    return !!(data.naam);
  }
  return true;
}

function maakSamenvatting(type: string, data: Record<string, unknown>): string {
  if (type === "afspraak") {
    return `📅 Afspraak: ${data.beschrijving ?? "?"} op ${data.datum ?? "?"} om ${data.tijd ?? "09:00"}`;
  }
  if (type === "mail_taak") {
    return `📧 Mail taak: "${data.onderwerp ?? "?"}" van ${data.van ?? "?"}`;
  }
  if (type === "sponsor") {
    return `🏢 Sponsor: ${data.naam ?? "?"} ${data.bedrag ? "€" + data.bedrag : ""}`;
  }
  if (type === "donatie") {
    return `💰 Donatie: ${data.naam ?? "?"} €${data.bedrag ?? "?"} op ${data.datum ?? "?"}`;
  }
  if (type === "vrijwilliger") {
    return `🙋 Vrijwilliger: ${data.naam ?? "?"} (${data.rol ?? "?"})`;
  }
  if (type === "adoptant") {
    return `🐾 Adoptant: ${data.naam ?? "?"} neemt ${data.dier ?? "?"} over`;
  }
  return `${type}: ${JSON.stringify(data)}`;
}

async function slaOp(
  chatId: number,
  type: string,
  data: Record<string, unknown>,
  afzender: string
) {
  if (type === "afspraak") {
    const datum = data.datum ? String(data.datum).trim() : "";
    const tijd = data.tijd ? String(data.tijd).trim() : "09:00";
    const start_time = datum
      ? toLocalISOString(datum, tijd)
      : new Date().toISOString().slice(0, 19);
    const beschrijving = data.beschrijving
      ? String(data.beschrijving).trim()
      : "";
    const title = beschrijving.length > 0 ? beschrijving : "Afspraak";
    const persoon =
      data.persoon && String(data.persoon).trim().length > 0
        ? String(data.persoon).trim()
        : null;
    const description = persoon
      ? `${persoon} (via ${afzender})`
      : `Via: ${afzender}`;

    const { error } = await supabase.from("calendar_events").insert({
      title,
      category: "afspraak",
      start_time,
      description,
      location: null,
    });

    if (error) {
      await sendTelegram(chatId, `❌ Supabase fout: ${error.message}`);
    } else {
      await sendTelegram(
        chatId,
        `✅ Afspraak opgeslagen!\n📅 ${title} op ${datum} om ${tijd}`
      );
    }
  } else if (type === "mail_taak") {
    const onderwerp = data.onderwerp
      ? String(data.onderwerp).trim()
      : "Via Telegram";
    const van = data.van ? String(data.van).trim() : "Telegram";
    const prioriteit = data.prioriteit
      ? String(data.prioriteit).trim()
      : null;

    const { error } = await supabase.from("incoming_emails").insert({
      onderwerp,
      van_naam: `${afzender}: ${van}`,
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
        `✅ Mail taak opgeslagen!\n📧 ${onderwerp} van ${van}`
      );
    }
  } else if (type === "sponsor") {
    const naam = data.naam ? String(data.naam).trim() : null;
    const omschrijving = data.bedrag
      ? `Bedrag: ${String(data.bedrag).trim()}`
      : null;
    const datum = new Date().toLocaleDateString("nl-NL");

    const { error } = await supabase.from("sponsors").insert({
      bedrijfsnaam: naam,
      bedrag_per_maand: null,
      status: "actief",
      notities: `Via Telegram door ${afzender} op ${datum}`,
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
      `⚠️ "${type}" wordt nog niet automatisch opgeslagen.\n\nNoteer handmatig:\n${JSON.stringify(data, null, 2)}`
    );
  }
}

export async function POST(req: NextRequest) {
  let chatId = 0;
  try {
    const body = await req.json();
    chatId = body.message?.chat?.id ?? 0;

    // Whitelist check
    const allowedIds = (process.env.TELEGRAM_ALLOWED_IDS ?? "")
      .split(",")
      .map((id) => id.trim());
    const fromId = String(body.message?.from?.id ?? "");
    if (!allowedIds.includes(fromId)) {
      await sendTelegram(chatId, "⛔ Je hebt geen toegang tot deze bot.");
      return NextResponse.json({ ok: true });
    }

    // Afzender naam
    const afzender =
      [body.message?.from?.first_name, body.message?.from?.last_name]
        .filter(Boolean)
        .join(" ") || "Onbekend";

    const message = body.message?.text?.trim();
    if (!message) return NextResponse.json({ ok: true });

    // Bevestiging afhandelen (ja/nee)
    const pending = pendingConfirmations.get(chatId);
    if (pending) {
      const antwoord = message.toLowerCase();
      if (["ja", "yes", "j", "y", "ok", "oke", "goed"].includes(antwoord)) {
        pendingConfirmations.delete(chatId);
        await sendTelegram(chatId, `⏳ Opslaan...`);
        await slaOp(chatId, pending.type, pending.data, pending.afzender);
      } else if (["nee", "no", "n", "niet", "stop", "annuleer"].includes(antwoord)) {
        pendingConfirmations.delete(chatId);
        await sendTelegram(chatId, `❌ Geannuleerd. Stuur een nieuw bericht!`);
      } else {
        // Nieuw bericht, oude bevestiging vergeten
        pendingConfirmations.delete(chatId);
        await sendTelegram(chatId, `ℹ️ Vorige actie geannuleerd. Verwerk nieuw bericht...`);
        // Verder verwerken als nieuw bericht (geen return)
      }
      if (["ja", "yes", "j", "y", "ok", "oke", "goed", "nee", "no", "n", "niet", "stop", "annuleer"].includes(antwoord)) {
        return NextResponse.json({ ok: true });
      }
    }

    await sendTelegram(chatId, `⏳ Bezig met verwerken...`);

    // Claude verwerkt het bericht
    const vandaag = new Date().toLocaleDateString("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const claude = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `Je bent een assistent voor SavedSouls Foundation.
Zet berichten om naar JSON. Geen uitleg, geen markdown, geen backticks.
Antwoord ALLEEN met pure JSON op één regel.
Vandaag is ${vandaag}.

Begrijp natuurlijke taal zoals:
- "aanstaande woensdag" → bereken de exacte datum
- "morgen" → morgen
- "volgende week dinsdag" → bereken de datum
- "24 maart" → gebruik huidig jaar

Geef ook een "zekerheid" veld mee: "hoog" als datum+tijd+beschrijving duidelijk zijn, anders "laag".

Mogelijke types:
- afspraak: { beschrijving, datum (YYYY-MM-DD), tijd (HH:MM), persoon, zekerheid }
- mail_taak: { onderwerp, van, prioriteit, zekerheid }
- sponsor: { naam, bedrag, datum (YYYY-MM-DD), zekerheid }
- donatie: { naam, bedrag, datum (YYYY-MM-DD), zekerheid }
- vrijwilliger: { naam, email, rol, zekerheid }
- adoptant: { naam, dier, datum (YYYY-MM-DD), zekerheid }
- rooster_wijziging: { naam, datum (YYYY-MM-DD), tijd (HH:MM), actie, zekerheid }

Voorbeelden:
{"type":"afspraak","data":{"beschrijving":"dierenarts","datum":"2026-03-28","tijd":"14:00","persoon":null,"zekerheid":"hoog"}}
{"type":"afspraak","data":{"beschrijving":"dierenarts","datum":"2026-03-25","tijd":"09:00","persoon":null,"zekerheid":"laag"}}
{"type":"mail_taak","data":{"onderwerp":"samenwerking","van":"ABC","prioriteit":"hoog","zekerheid":"hoog"}}`,
      messages: [{ role: "user", content: message }],
    });

    const responseText =
      claude.content[0].type === "text" ? claude.content[0].text.trim() : "";

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
      actie.data && typeof actie.data === "object" ? actie.data : {};

    const zekerheid = data.zekerheid ? String(data.zekerheid) : "laag";
    const zeker = zekerheid === "hoog" && isZeker(data, type);
    const samenvatting = maakSamenvatting(type, data);

    if (zeker) {
      // Direct opslaan
      await slaOp(chatId, type, data, afzender);
    } else {
      // Bevestiging vragen
      pendingConfirmations.set(chatId, { type, data, afzender, summary: samenvatting });
      await sendTelegram(
        chatId,
        `${samenvatting}\n\nKlopt dit? Antwoord met ja of nee`
      );
    }
  } catch (e: any) {
    pendingConfirmations.delete(chatId);
    if (chatId) {
      await sendTelegram(
        chatId,
        `❌ Kon bericht niet verwerken.\n\nProbeer het opnieuw met meer details, bijvoorbeeld:\n"Afspraak dierenarts woensdag 25 maart om 14:00"`
      );
    }
  }

  return NextResponse.json({ ok: true });
}