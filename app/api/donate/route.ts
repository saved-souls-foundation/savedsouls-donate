import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const SUBJECT = "💛 New donation inquiry - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";

const CONFIRMATION_SUBJECT = "We received your donation inquiry – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for your interest in supporting Saved Souls Foundation. We have received your message and our team will get back to you within 48 hours.

Every contribution helps us care for rescued dogs and cats in Thailand.

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.com`;

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
      text: CONFIRMATION_TEXT,
      replyTo: REPLY_TO,
    });
    if (!autoReply.success) {
      return NextResponse.json({ error: autoReply.error || "Failed to send confirmation." }, { status: 502 });
    }

    await delay(600);
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
    console.error("Donate API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
