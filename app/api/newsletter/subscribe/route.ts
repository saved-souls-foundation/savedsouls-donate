import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const VALID_TAAL = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

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

  const naam = [voornaam, achternaam].filter(Boolean).join(" ").trim() || undefined;
  const { sendNewsletterConfirmation } = await import("@/lib/newsletterConfirmation");
  sendNewsletterConfirmation({ email, naam });

  return NextResponse.json({ message: "subscribed", id: inserted?.id }, { status: 201 });
}
