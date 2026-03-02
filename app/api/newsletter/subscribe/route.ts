import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";

const VALID_TAAL = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;
const BASE_URL = "https://www.savedsouls-foundation.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() || null : null;
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() || null : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : null;
  const rawTaal = typeof body.taal === "string" ? body.taal.trim().toLowerCase() : "nl";
  const taal = VALID_TAAL.includes(rawTaal as (typeof VALID_TAAL)[number]) ? rawTaal : "nl";
  const language = taal;

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, actief, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.actief) {
      return NextResponse.json({ message: "already subscribed" }, { status: 200 });
    }
    const { error: updateErr } = await supabase
      .from("newsletter_subscribers")
      .update({
        actief: true,
        uitgeschreven_op: null,
        voornaam: voornaam ?? undefined,
        achternaam: achternaam ?? undefined,
        type: type ?? undefined,
        language,
      })
      .eq("id", existing.id);
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }
    return NextResponse.json({ message: "reactivated" }, { status: 200 });
  }

  const unsubscribe_token = crypto.randomUUID();
  const { data: inserted, error: insertErr } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email,
      voornaam,
      achternaam,
      type,
      language,
      actief: true,
      unsubscribe_token,
    })
    .select("id")
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: insertErr.code === "23505" ? 409 : 500 });
  }

  const unsubscribeUrl = `${BASE_URL}/${taal}/unsubscribe?token=${encodeURIComponent(unsubscribe_token)}`;

  const { data: templateRow } = await supabase
    .from("email_templates")
    .select("onderwerp, inhoud_nl, inhoud_en")
    .eq("categorie", "nieuwsbrief_bevestiging")
    .eq("actief", true)
    .maybeSingle();

  const subject = templateRow?.onderwerp ?? "Nieuwsbrief aanmelding – Saved Souls Foundation";
  const useNl = taal === "nl";
  const rawBody = useNl ? templateRow?.inhoud_nl : templateRow?.inhoud_en;
  const bodyText = (rawBody ?? (useNl ? "Je bent aangemeld voor onze nieuwsbrief." : "You have been subscribed to our newsletter."))
    .replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl)
    .replace(/\{\{email\}\}/g, email);
  const bodyHtml = `<p>${bodyText.split(/\n/).map((line) => escapeHtml(line)).join("</p><p>")}</p><p style="font-size:12px;color:#666;"><a href="${escapeHtml(unsubscribeUrl)}">${useNl ? "Uitschrijven" : "Unsubscribe"}</a></p>`;

  await sendMail({
    to: email,
    subject,
    text: bodyText,
    html: bodyHtml,
  });

  return NextResponse.json({ message: "subscribed", id: inserted?.id }, { status: 201 });
}
