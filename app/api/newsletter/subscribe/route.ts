import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/sendMail";

const VALID_TAAL = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;
const BASE_URL = "https://www.savedsouls-foundation.com";
const CONFIRM_SUBJECT = "✅ Je bent aangemeld voor de Saved Souls nieuwsbrief!";

/** From-adres moet een verified domein zijn in Resend (resend.com → Domains). */
const FROM_VERIFIED = "Saved Souls Foundation <info@savedsouls-foundation.com>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    return await handleSubscribe(request);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    console.error("[newsletter/subscribe] Unhandled error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleSubscribe(request: NextRequest) {
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

  console.log("[newsletter/subscribe] Received:", { email, voornaam: voornaam ?? null, achternaam: achternaam ?? null, type, language });

  let supabase: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient>;
  if (isSupabaseAdminConfigured()) {
    try {
      supabase = createAdminClient();
    } catch (e) {
      console.error("[newsletter/subscribe] Admin client failed, falling back to server client:", e);
      supabase = await createClient();
    }
  } else {
    supabase = await createClient();
  }
  console.log("[newsletter/subscribe] Using table: newsletter_subscribers");

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

  console.log("[newsletter/subscribe] Insert result:", inserted ? { id: inserted.id } : "none", insertErr ? { error: insertErr.message, code: insertErr.code } : "ok");

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: insertErr.code === "23505" ? 409 : 500 });
  }

  const naam = [voornaam, achternaam].filter(Boolean).join(" ") || (taal === "nl" ? "aanmelder" : "subscriber");
  const unsubscribeUrl = `${BASE_URL}/${taal}/unsubscribe?token=${encodeURIComponent(unsubscribe_token)}`;
  const useNl = taal === "nl";
  const html = useNl
    ? `
    <p>Beste ${escapeHtml(naam)},</p>
    <p>Welkom! Je bent succesvol aangemeld voor onze nieuwsbrief.</p>
    <p>Je ontvangt voortaan updates over onze dieren, vrijwilligers en activiteiten in Thailand.</p>
    <p><a href="${escapeHtml(unsubscribeUrl)}">Uitschrijven</a> kan altijd via deze link.</p>
    <p>Met warme groet,<br/>Het team van Saved Souls Foundation</p>
  `.trim()
    : `
    <p>Dear ${escapeHtml(naam)},</p>
    <p>Welcome! You have successfully subscribed to our newsletter.</p>
    <p>You will receive updates about our animals, volunteers and activities in Thailand.</p>
    <p>You can <a href="${escapeHtml(unsubscribeUrl)}">unsubscribe</a> at any time via this link.</p>
    <p>Kind regards,<br/>The Saved Souls Foundation team</p>
  `.trim();
  const text = useNl
    ? `Beste ${naam},\n\nWelkom! Je bent succesvol aangemeld voor onze nieuwsbrief.\n\nUitschrijven: ${unsubscribeUrl}\n\nMet warme groet,\nHet team van Saved Souls Foundation`
    : `Dear ${naam},\n\nWelcome! You have successfully subscribed to our newsletter.\n\nUnsubscribe: ${unsubscribeUrl}\n\nKind regards,\nThe Saved Souls Foundation team`;

  console.log("[newsletter/subscribe] Resend: API_KEY =", process.env.RESEND_API_KEY ? "set" : "missing", ", from =", FROM_VERIFIED);
  console.log("[newsletter/subscribe] Sending confirmation to", email);

  const mailResult = await sendMail({
    from: FROM_VERIFIED,
    to: email,
    subject: CONFIRM_SUBJECT,
    text,
    html,
  });

  console.log("[newsletter/subscribe] Mail result:", mailResult.success ? "sent" : mailResult.error);
  if (!mailResult.success) {
    console.error("[newsletter/subscribe] Confirmation email failed (subscription saved). Check Resend Domains: savedsouls-foundation.com must be Verified.", mailResult.error);
    // Niet blokkeren: aanmelding is gelukt
  }

  return NextResponse.json({ message: "subscribed", id: inserted?.id }, { status: 201 });
}
