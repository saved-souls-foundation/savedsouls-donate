/**
 * LINE Messaging API webhook.
 * Ontvangt berichten, verifieert handtekening, slaat op in incoming_emails met bron 'line'.
 * Env: LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN (voor later antwoorden).
 */
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hash = createHmac("sha256", secret).update(body).digest("base64");
  return hash === signature;
}

type LineMessageEvent = {
  type: string;
  message?: { type: string; text?: string; id?: string };
  source?: { type: string; userId?: string; groupId?: string };
  replyToken?: string;
  webhookEventId?: string;
  timestamp?: number;
};

type LineWebhookBody = { destination?: string; events?: LineMessageEvent[] };

export async function GET() {
  return NextResponse.json({ ok: true, message: "LINE webhook endpoint" });
}

export async function POST(request: NextRequest) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) {
    console.error("[webhooks/line] LINE_CHANNEL_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-line-signature") ?? "";
  const rawBody = await request.text();
  if (!rawBody) return NextResponse.json({ error: "Missing body" }, { status: 400 });

  if (!verifySignature(rawBody, signature, secret)) {
    console.error("[webhooks/line] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: LineWebhookBody;
  try {
    body = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = body.events ?? [];
  const admin = createAdminClient();

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text") continue;
    const text = event.message.text ?? "";
    const userId = event.source?.userId ?? "";

    const row = {
      van_email: null as string | null,
      van_naam: userId ? `Line: ${userId.slice(0, 12)}…` : "Line gebruiker",
      onderwerp: "Line bericht",
      inhoud: text,
      ontvangen_op: new Date().toISOString(),
      bron: "line",
      status: "in_behandeling",
    };

    try {
      const { data: inserted, error } = await admin.from("incoming_emails").insert(row).select("id").single();
      if (error) console.error("[webhooks/line] insert error:", error);
      else console.log("[webhooks/line] Saved Line message id=", inserted?.id);
    } catch (e) {
      console.error("[webhooks/line] DB error:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
