import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";

const SUBJECT = "💌 New contact message - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";
/** Kopie auto-reply altijd naar dit adres (valt soms niet aan bij submitter). */
const AUTO_REPLY_CC = "kleinjansmike@gmail.com";

const CONFIRMATION_SUBJECT = "We received your message – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for contacting Saved Souls Foundation. We have received your message and will get back to you as soon as possible, usually within 48 hours.

If your inquiry is urgent, you can also reach us directly at info@savedsouls-foundation.org.

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.com`;

const ACCENT_GREEN = "#2aa348";
const DONATE_URL = "https://www.savedsouls-foundation.com/en/donate";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(name: string, email: string, subject: string, message: string): string {
  const subj = subject ? escapeHtml(subject) : "";
  const msg = escapeHtml(message).replace(/\n/g, "<br>");
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:20px 24px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">💌 New contact message</h1>
    <p style="margin:8px 0 0;opacity:0.95;font-size:14px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#666;width:90px;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:${ACCENT_GREEN};">${escapeHtml(email)}</a></td></tr>
      ${subj ? `<tr><td style="padding:8px 0;color:#666;">Subject</td><td style="padding:8px 0;">${subj}</td></tr>` : ""}
    </table>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid #eee;">
      <p style="margin:0 0 8px;color:#666;font-size:13px;">Message</p>
      <div style="line-height:1.5;color:#333;">${msg}</div>
    </div>
  </div>
</div></body></html>`;
}

function buildAutoReplyHtml(includeDonateButton: boolean): string {
  const buttonBlock = includeDonateButton
    ? `<p style="margin:0 0 24px;">If your inquiry is urgent, you can also reach us at <a href="mailto:info@savedsouls-foundation.org" style="color:${ACCENT_GREEN};">info@savedsouls-foundation.org</a>.</p>
    <a href="${DONATE_URL}" style="display:inline-block;background:${ACCENT_GREEN};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">Support our work – Donate</a>`
    : `<p style="margin:0 0 24px;">If your inquiry is urgent, you can also reach us at <a href="mailto:info@savedsouls-foundation.org" style="color:${ACCENT_GREEN};">info@savedsouls-foundation.org</a>.</p>`;
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">We received your message</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    <p style="margin:0 0 16px;">Dear friend,</p>
    <p style="margin:0 0 16px;">Thank you for contacting Saved Souls Foundation. We have received your message and will get back to you within 48 hours.</p>
    ${buttonBlock}
  </div>
  <div style="padding:16px 24px;background:#f9f9f9;font-size:13px;color:#666;">
    With gratitude,<br>The Saved Souls Team<br>Khon Kaen, Thailand
  </div>
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const name = b.name?.trim();
    const email = b.email?.trim();
    const subject = b.subject?.trim() || "";
    const message = b.message?.trim();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    const text =
      "Name: " +
      name +
      "\nEmail: " +
      email +
      (subject ? "\nSubject: " + subject : "") +
      "\n\n" +
      message;

    // Auto-reply: bezoeker krijgt versie mét donatieknop, organisatie (Mike) kopie zónder knop
    const autoReplyVisitor = await sendMail({
      to: email,
      subject: CONFIRMATION_SUBJECT,
      text: CONFIRMATION_TEXT,
      html: buildAutoReplyHtml(true),
      replyTo: REPLY_TO,
    });
    if (!autoReplyVisitor.success) {
      return NextResponse.json({ error: autoReplyVisitor.error || "Failed to send confirmation." }, { status: 502 });
    }
    if (email.toLowerCase() !== AUTO_REPLY_CC.toLowerCase()) {
      await delay(600);
      const autoReplyMike = await sendMail({
        to: AUTO_REPLY_CC,
        subject: CONFIRMATION_SUBJECT,
        text: CONFIRMATION_TEXT,
        html: buildAutoReplyHtml(false),
        replyTo: REPLY_TO,
      });
      if (!autoReplyMike.success) {
        return NextResponse.json({ error: autoReplyMike.error || "Failed to send confirmation copy." }, { status: 502 });
      }
    }

    // Resend: max 2 requests/sec – pauze tussen sends
    await delay(600);

    const notifHtml = buildNotificationHtml(name, email, subject, message);
    // Notificatie (ingevuld formulier) naar info@ + directe kopie naar Mike
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
    const notifMike = await sendMail({
      to: AUTO_REPLY_CC,
      subject: SUBJECT,
      text,
      html: notifHtml,
      replyTo: REPLY_TO,
    });
    if (!notifMike.success) {
      return NextResponse.json({ error: notifMike.error || "Failed to send notification." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
