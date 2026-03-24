import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getAdoptConfirmationHtml, getAdoptConfirmationText } from "@/lib/emailAdoptConfirmation";
import { getAdoptNotificationHtml } from "@/lib/emailAdoptNotification";

const TO_PRIMARY = "info@savedsouls-foundation.org";
const TO_MIKE_MONITOR = "mike@savedsouls-foundation.org";
// From moet op het in Resend geverifieerde domein zijn (bijv. savedsouls-foundation.org), anders komt mail niet aan.
const FROM_EMAIL = process.env.RESEND_FROM || "Saved Souls Website <info@savedsouls-foundation.org>";
const REPLY_TO = "info@savedsouls-foundation.org";

const AUTO_REPLY_SUBJECT = "We received your adoption inquiry – Saved Souls Foundation";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const valid = await verifyTurnstile(b.turnstileToken);
    if (!valid) {
      return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
    }
    const name = b.name;
    const email = b.email;
    const city = b.city;
    const country = b.country;
    const experience = b.experience;
    const about = b.about;
    const animalName = b.animalName || "";
    const animalId = b.animalId || "";

    if (!name || !email || !city || !country || !experience || !about) {
      return NextResponse.json(
        { error: "Name, email, city, country, experience and about are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
    }

    const text = [
      "Adoption Inquiry",
      "================",
      "",
      "Name: " + name,
      "Email: " + email,
      "City: " + city,
      "Country: " + country,
      "",
      animalName ? "Interested in: " + animalName + (animalId ? " (ID: " + animalId + ")" : "") + "\n" : "",
      "Experience with dogs:",
      experience,
      "",
      "About and motivation:",
      about,
    ]
      .filter(Boolean)
      .join("\n");

    const subjectLine = "[Adoption Inquiry] " + name + (animalName ? " – " + animalName : "");

    // 1. Eerst auto-reply naar bezoeker (HTML met footer, kleuren, donatieknop, naam + dier)
    const confirmParams = { recipientName: name, animalName: animalName || undefined };
    const autoRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        replyTo: REPLY_TO,
        subject: AUTO_REPLY_SUBJECT,
        text: getAdoptConfirmationText(confirmParams),
        html: getAdoptConfirmationHtml(confirmParams),
      }),
    });
    if (!autoRes.ok) {
      const err = await autoRes.text();
      console.error("[Resend] adopt-inquiry auto-reply error:", autoRes.status, err);
      return NextResponse.json({ error: "Failed to send confirmation." }, { status: 502 });
    }

    await delay(600);
    const notifHtml = getAdoptNotificationHtml({
      name,
      email,
      city,
      country,
      animalName: animalName || undefined,
      animalId: animalId || undefined,
      motivation: [experience, about].filter(Boolean).join("\n\n"),
    });

    // 2. Daarna notificatie naar team (zakelijke HTML-mail)
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_PRIMARY, TO_MIKE_MONITOR],
        replyTo: REPLY_TO,
        subject: subjectLine,
        text,
        html: notifHtml,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Resend] adopt-inquiry send error:", res.status, err);
      return NextResponse.json({ error: "Failed to send inquiry." }, { status: 502 });
    }

    if (isSupabaseAdminConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("adoption_applications").insert({
          email,
          name,
          city,
          country,
          experience,
          about,
          animal_name: animalName || null,
          animal_id: animalId || null,
          step: 1,
        });
        await supabase.from("incoming_emails").insert({
          van_email: email,
          van_naam: name,
          onderwerp: subjectLine,
          inhoud: text,
          bron: "adopt_inquiry",
          status: "in_behandeling",
        });
      } catch (e) {
        console.error("Supabase adoption_applications or incoming_emails insert failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Adopt-inquiry API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
