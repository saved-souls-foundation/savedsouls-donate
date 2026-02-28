import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";

const SUBJECT = "💌 New contact message - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";

const CONFIRMATION_SUBJECT = "We received your message – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for contacting Saved Souls Foundation. We have received your message and will get back to you as soon as possible, usually within 48 hours.

If your inquiry is urgent, you can also reach us directly at info@savedsouls-foundation.org.

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.com`;

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

    // Eerst auto-reply naar bezoeker, zodat die altijd bevestiging krijgt
    const autoReply = await sendMail({
      to: email,
      subject: CONFIRMATION_SUBJECT,
      text: CONFIRMATION_TEXT,
      replyTo: REPLY_TO,
    });
    if (!autoReply.success) {
      return NextResponse.json({ error: autoReply.error || "Failed to send confirmation." }, { status: 502 });
    }

    // Resend: max 2 requests/sec – pauze tussen sends
    await delay(600);

    // Daarna notificatie naar info@ (apart per ontvanger)
    for (const to of NOTIFICATION_EMAILS) {
      const notif = await sendMail({
        to,
        subject: SUBJECT,
        text,
        replyTo: REPLY_TO,
      });
      if (!notif.success) {
        return NextResponse.json({ error: notif.error || "Failed to send email." }, { status: 502 });
      }
      await delay(600);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
