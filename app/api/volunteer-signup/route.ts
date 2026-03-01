import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

const TO_VOLUNTEER = "info@savedsouls-foundation.org";
const TO_MIKE_MONITOR = "mike@savedsouls-foundation.org";
// From moet op het in Resend geverifieerde domein zijn (bijv. savedsouls-foundation.com), anders komt mail niet aan.
const FROM_EMAIL = process.env.RESEND_FROM || "Saved Souls Website <info@savedsouls-foundation.com>";
const REPLY_TO = "info@savedsouls-foundation.com";

const AUTO_REPLY_SUBJECT = "We received your volunteer application – Saved Souls Foundation";
const AUTO_REPLY_TEXT = `Dear friend,

Thank you for your interest in volunteering at Saved Souls Foundation! We have received your application and our team will get back to you within 48 hours.

We look forward to welcoming you to our sanctuary in Khon Kaen, Thailand!

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.org`;

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
    const dates = b.dates || "";
    const experience = b.experience;
    const motivation = b.motivation;

    if (!name || !email || !city || !country || !experience || !motivation) {
      return NextResponse.json(
        { error: "Name, email, city, country, experience and motivation are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
    }

    const text = [
      "Volunteer Sign-up",
      "==================",
      "",
      "Name: " + name,
      "Email: " + email,
      "City: " + city,
      "Country: " + country,
      "",
      dates ? "Preferred dates: " + dates + "\n" : "",
      "Experience with animals:",
      experience,
      "",
      "Why do you want to volunteer:",
      motivation,
    ]
      .filter(Boolean)
      .join("\n");

    const subjectLine = "[Volunteer Sign-up] " + name;

    const autoRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        replyTo: REPLY_TO,
        subject: AUTO_REPLY_SUBJECT,
        text: AUTO_REPLY_TEXT,
      }),
    });
    if (!autoRes.ok) {
      const err = await autoRes.text();
      console.error("[Resend] volunteer-signup auto-reply error:", autoRes.status, err);
      return NextResponse.json({ error: "Failed to send confirmation." }, { status: 502 });
    }

    await delay(600);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_VOLUNTEER, TO_MIKE_MONITOR],
        replyTo: REPLY_TO,
        subject: subjectLine,
        text,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Resend] volunteer-signup send error:", res.status, err);
      return NextResponse.json({ error: "Failed to send application." }, { status: 502 });
    }

    if (isSupabaseAdminConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("volunteer_applications").insert({
          email,
          name,
          city,
          country,
          dates: dates || null,
          experience,
          motivation,
          step: 1,
        });
      } catch (e) {
        console.error("Supabase volunteer_applications insert failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Volunteer-signup API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
