import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getEmailFooterHtml, getEmailFooterText } from "@/lib/emailFooter";

const SUBJECT = "💛 New donation inquiry - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.org";
const GREEN = "#2aa348";

const CONFIRMATION_SUBJECT = "We received your donation inquiry – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for your interest in supporting Saved Souls Foundation. We have received your message and our team will get back to you within 48 hours.

Every contribution helps us care for rescued dogs and cats in Thailand.

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.org`;

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildConfirmationHtml(): string {
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">We received your message</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    <p style="margin:0 0 16px;">Dear friend,</p>
    <p style="margin:0 0 16px;">Thank you for your interest in supporting Saved Souls Foundation. We have received your message and our team will get back to you within 48 hours.</p>
    <p style="margin:0 0 24px;">Every contribution helps us care for rescued dogs and cats in Thailand.</p>
    <p style="margin:0;">With gratitude,<br><strong>The Saved Souls Team</strong><br>Khon Kaen, Thailand</p>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

function buildNotificationHtml(name: string, email: string, amountStr: string, message: string): string {
  const msgHtml = message ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Message</td><td style="padding:8px 0;line-height:1.5;">${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>` : "";
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${GREEN};color:#fff;padding:20px 24px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">New donation inquiry – Saved Souls Foundation</h1>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#64748b;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:${GREEN};">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Amount / interest</td><td style="padding:8px 0;">${escapeHtml(amountStr)}</td></tr>
      ${msgHtml}
    </table>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const name = b.name?.trim();
    const email = b.email?.trim();
    const amount = b.amount?.trim() ?? b.amount;
    const message = b.message?.trim() || "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const amountStr = amount !== undefined && amount !== null && amount !== "" ? String(amount) : "(not specified)";
    const text = [
      "Name: " + name,
      "Email: " + email,
      "Amount / interest: " + amountStr,
      message ? "\nMessage:\n" + message : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (isSupabaseAdminConfigured()) {
      try {
        const admin = createAdminClient();
        await admin.from("incoming_emails").insert({
          van_email: email,
          van_naam: name,
          onderwerp: `Donatie-inquiry: ${name}`,
          inhoud: text,
          bron: "donatie_formulier",
          status: "in_behandeling",
        });
      } catch (e) {
        console.error("[donate] incoming_emails insert failed", e);
      }
    }

    const autoReply = await sendMail({
      to: email,
      subject: CONFIRMATION_SUBJECT,
      text: CONFIRMATION_TEXT + getEmailFooterText(),
      html: buildConfirmationHtml(),
      replyTo: REPLY_TO,
    });
    if (!autoReply.success) {
      return NextResponse.json({ error: autoReply.error || "Failed to send confirmation." }, { status: 502 });
    }

    await delay(600);
    const notifHtml = buildNotificationHtml(name, email, amountStr, message);
    for (const to of NOTIFICATION_EMAILS) {
      const notif = await sendMail({
        to,
        subject: SUBJECT,
        text,
        html: notifHtml,
        replyTo: REPLY_TO,
      });
      if (!notif.success) {
        return NextResponse.json({ error: notif.error || "Failed to send email." }, { status: 502 });
      }
      await delay(600);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Donate API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
