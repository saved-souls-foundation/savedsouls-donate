import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { sendMail, delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getEmailFooterHtml, getEmailFooterText } from "@/lib/emailFooter";

const TO_VOLUNTEER = "info@savedsouls-foundation.org";
const TO_MIKE_MONITOR = "mike@savedsouls-foundation.org";
const REPLY_TO = "info@savedsouls-foundation.com";

const AUTO_REPLY_SUBJECT = "We received your volunteer application – Saved Souls Foundation";
const GREEN = "#2aa348";
const FOOTER_BG = "#1a3d2b";

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildAutoReplyHtml(): string {
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">We received your application</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    <p style="margin:0 0 16px;">Dear friend,</p>
    <p style="margin:0 0 16px;">Thank you for your interest in volunteering at Saved Souls Foundation! We have received your application and our team will get back to you within 48 hours.</p>
    <p style="margin:0 0 24px;">We look forward to welcoming you to our sanctuary in Khon Kaen, Thailand!</p>
    <p style="margin:0;">With gratitude,<br><strong>The Saved Souls Team</strong><br>Khon Kaen, Thailand</p>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

function buildNotificationHtml(params: {
  name: string;
  email: string;
  city: string;
  country: string;
  dates: string;
  experience: string;
  motivation: string;
}): string {
  const { name, email, city, country, dates, experience, motivation } = params;
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${GREEN};color:#fff;padding:20px 24px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">New volunteer signup – Saved Souls Foundation</h1>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#64748b;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:${GREEN};">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Country</td><td style="padding:8px 0;">${escapeHtml(country)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">City</td><td style="padding:8px 0;">${escapeHtml(city)}</td></tr>
      ${dates ? `<tr><td style="padding:8px 0;color:#64748b;">Availability / Preferred dates</td><td style="padding:8px 0;">${escapeHtml(dates)}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#64748b;">Experience with animals</td><td style="padding:8px 0;">${escapeHtml(experience)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Motivation</td><td style="padding:8px 0;line-height:1.5;">${escapeHtml(motivation).replace(/\n/g, "<br>")}</td></tr>
    </table>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

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
    const autoReplyText = `Dear friend,

Thank you for your interest in volunteering at Saved Souls Foundation! We have received your application and our team will get back to you within 48 hours.

We look forward to welcoming you to our sanctuary in Khon Kaen, Thailand!

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://www.savedsouls-foundation.com${getEmailFooterText()}`;

    const autoRes = await sendMail({
      to: email,
      subject: AUTO_REPLY_SUBJECT,
      text: autoReplyText,
      html: buildAutoReplyHtml(),
      replyTo: REPLY_TO,
    });
    if (!autoRes.success) {
      console.error("[Resend] volunteer-signup auto-reply error:", autoRes.error);
      return NextResponse.json({ error: "Failed to send confirmation." }, { status: 502 });
    }

    await delay(600);

    const notifHtml = buildNotificationHtml({ name, email, city, country, dates, experience, motivation });
    const res = await sendMail({
      to: [TO_VOLUNTEER, TO_MIKE_MONITOR],
      subject: subjectLine,
      text,
      html: notifHtml,
      replyTo: REPLY_TO,
    });
    if (!res.success) {
      console.error("[Resend] volunteer-signup send error:", res.error);
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
        await supabase.from("incoming_emails").insert({
          van_email: email,
          van_naam: name,
          onderwerp: subjectLine,
          inhoud: text,
          bron: "vrijwilliger_aanmelding",
          status: "in_behandeling",
        });
      } catch (e) {
        console.error("Supabase volunteer_applications or incoming_emails insert failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Volunteer-signup API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
