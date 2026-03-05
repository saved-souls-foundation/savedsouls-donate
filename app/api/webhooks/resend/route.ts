import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzeIncomingEmail } from "@/lib/claudeAnalyze";
import { sendMail } from "@/lib/sendMail";
import { logSentEmail } from "@/lib/sentEmailsLog";
import { getEmailFooterHtml } from "@/lib/emailFooter";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "Saved Souls Foundation <info@savedsouls-foundation.com>";
const AUTO_SEND_CONFIDENCE_THRESHOLD = 0.6;

const LANG_KEYS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

function getTemplateContent(template: Record<string, unknown>, taal: string): { onderwerp: string; inhoud: string } {
  const lang = LANG_KEYS.includes(taal as (typeof LANG_KEYS)[number]) ? taal : "nl";
  const inhoudKey = `inhoud_${lang}`;
  const onderwerpKey = `onderwerp_${lang}`;
  const inhoud = (template[inhoudKey] as string) ?? (template.inhoud_nl as string) ?? (template.inhoud_en as string) ?? "";
  const onderwerp = (template[onderwerpKey] as string) ?? (template.onderwerp as string) ?? "";
  return { onderwerp, inhoud };
}

function replacePlaceholders(text: string, naam: string | null, dier: string | null): string {
  return text
    .replace(/\{\{naam\}\}/g, naam ?? "")
    .replace(/\{\{dier\}\}/g, dier ?? "")
    .replace(/\{\{organisatie\}\}/g, "Saved Souls Foundation");
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;">${body}</body></html>`;
}

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
  console.log("[webhooks/resend] POST received");
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

    // email.sent = outbound delivery (we acknowledge, no DB write); email.received = inbound (process below)
    if (payload.type === "email.sent") {
      console.log("[webhooks/resend] email.sent acknowledged", payload.data?.email_id ?? "");
      return NextResponse.json({ received: true });
    }
    if (payload.type !== "email.received") {
      console.log("[webhooks/resend] Event genegeerd: type=", payload.type);
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

    console.log("[webhooks/resend] email.received – email_id=", emailId, "from=", fromHeader, "subject=", subject?.slice(0, 50));

    const admin = createAdminClient();
    const row = {
      van_email: van_email ?? null,
      van_naam: van_naam ?? null,
      onderwerp: subject || null,
      inhoud,
      ontvangen_op: new Date().toISOString(),
      bron: "inkomend",
      status: "in_behandeling",
    };
    const { data: inserted, error: insertErr } = await admin.from("incoming_emails").insert(row).select("id").single();
    if (insertErr) {
      console.error("[webhooks/resend] incoming_emails insert failed – full supabaseError:", JSON.stringify(insertErr, null, 2));
      return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
    }
    const incomingId = inserted?.id;
    console.log("[webhooks/resend] Saved to incoming_emails id=", incomingId);

    // AI-analyse + optioneel automatisch antwoord (confidence >= 60%)
    try {
      const { data: templates } = await admin.from("email_templates").select("id, naam, categorie").eq("actief", true);
      const list = (templates ?? []).map((t: { id: string; naam: string | null; categorie: string | null }) => ({ id: t.id, naam: t.naam, categorie: t.categorie }));
      const result = await analyzeIncomingEmail(van_naam, van_email, subject || null, inhoud, list);
      const { taal, categorie, template_id, confidence, personalisatie } = result;
      let ai_gegenereerd_antwoord = "";
      if (template_id) {
        const { data: template } = await admin.from("email_templates").select("*").eq("id", template_id).maybeSingle();
        if (template) {
          const { inhoud: templateInhoud } = getTemplateContent(template as Record<string, unknown>, taal);
          const naam = personalisatie?.naam ?? (van_naam ?? "").split(/\s+/)[0] ?? null;
          const dier = personalisatie?.dier ?? null;
          ai_gegenereerd_antwoord = replacePlaceholders(templateInhoud, naam, dier);
        }
      }
      await admin
        .from("incoming_emails")
        .update({
          ai_categorie: categorie,
          ai_suggestie_template_id: template_id || null,
          ai_confidence: confidence,
          ai_gegenereerd_antwoord: ai_gegenereerd_antwoord || null,
          taal: taal || null,
        })
        .eq("id", incomingId);

      const shouldAutoSend = confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD && ai_gegenereerd_antwoord.trim().length > 0 && (van_email ?? "").trim().length > 0;
      if (shouldAutoSend) {
        const to = (van_email ?? "").trim();
        const replySubject = `Re: ${subject || "Your message"}`;
        const bodyContent = wrapHtml(ai_gegenereerd_antwoord.replace(/\n/g, "<br>\n"));
        const html = bodyContent.replace("</body></html>", getEmailFooterHtml() + "</body></html>");
        const sendResult = await sendMail({
          from: RESEND_FROM,
          to,
          subject: replySubject,
          text: ai_gegenereerd_antwoord.replace(/<[^>]+>/g, ""),
          html,
        });
        if (sendResult.success) {
          await admin
            .from("incoming_emails")
            .update({
              status: "verstuurd",
              ai_automatisch_verstuurd: true,
              verwerkt_op: new Date().toISOString(),
            })
            .eq("id", incomingId);
          await logSentEmail(admin, {
            type: "email_assistant",
            to,
            subject: replySubject,
            bodyPreview: ai_gegenereerd_antwoord.replace(/\s+/g, " ").trim().slice(0, 500) || null,
            referenceId: incomingId,
            referenceType: "incoming_email",
          });
          console.log("[webhooks/resend] Auto-reply sent to", to, "confidence=", confidence);
        } else {
          console.error("[webhooks/resend] Auto-reply send failed:", sendResult.error);
        }
      }
    } catch (aiErr) {
      console.error("[webhooks/resend] AI analysis or auto-reply error (email already saved):", aiErr);
      // Mail is already in DB; do not fail the webhook
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhooks/resend] Unexpected error:", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
