import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

/** Parse "Name <email@domain.com>" of "email@domain.com" → { name, email } */
function parseFrom(from: string): { van_naam: string | null; van_email: string | null } {
  const trimmed = (from ?? "").trim();
  if (!trimmed) return { van_naam: null, van_email: null };
  const match = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { van_naam: match[1].trim() || null, van_email: match[2].trim() || null };
  }
  return { van_naam: null, van_email: trimmed };
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhooks/resend] RESEND_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Missing body" }, { status: 400 });
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("[webhooks/resend] Missing Svix headers");
      return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
    }

    let payload: { type?: string; data?: { email_id?: string; from?: string; subject?: string } };
    try {
      const resend = new Resend(process.env.RESEND_API_KEY ?? undefined);
      const event = resend.webhooks.verify({
        payload: rawBody,
        headers: { id: svixId, timestamp: svixTimestamp, signature: svixSignature },
        webhookSecret: secret,
      });
      payload = event as typeof payload;
    } catch (e) {
      console.error("[webhooks/resend] Signature verification failed:", e);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (payload.type !== "email.received") {
      return NextResponse.json({ received: true });
    }

    const emailId = payload.data?.email_id;
    if (!emailId) {
      console.error("[webhooks/resend] email.received without data.email_id");
      return NextResponse.json({ error: "Missing email_id" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[webhooks/resend] RESEND_API_KEY required to fetch email content");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    let html: string | null = null;
    let text: string | null = null;
    let fromHeader = payload.data?.from ?? "";
    let subject = payload.data?.subject ?? "";

    try {
      const resend = new Resend(apiKey);
      const { data: emailData, error } = await resend.emails.receiving.get(emailId);
      if (error) {
        console.error("[webhooks/resend] Failed to fetch email content:", error);
        // Still save with metadata from webhook
      } else if (emailData) {
        html = (emailData as { html?: string }).html ?? null;
        text = (emailData as { text?: string }).text ?? null;
        fromHeader = (emailData as { from?: string }).from ?? fromHeader;
        subject = (emailData as { subject?: string }).subject ?? subject;
      }
    } catch (e) {
      console.error("[webhooks/resend] Receiving.get exception:", e);
    }

    const { van_naam, van_email } = parseFrom(fromHeader);
    const inhoud = (html ?? text ?? "").trim() || null;

    try {
      const admin = createAdminClient();
      const row = {
        van_email: van_email ?? null,
        van_naam: van_naam ?? null,
        onderwerp: subject || null,
        inhoud,
        bron: "resend_webhook",
        status: "in_behandeling",
      };
      const { error: insertErr } = await admin.from("incoming_emails").insert(row);
      if (insertErr) {
        console.error("[webhooks/resend] incoming_emails insert failed – full supabaseError:", JSON.stringify(insertErr, null, 2));
        return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
      }
    } catch (e) {
      console.error("[webhooks/resend] Supabase/incoming_emails error:", e);
      return NextResponse.json({ error: "Database not configured or insert failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhooks/resend] Unexpected error:", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
