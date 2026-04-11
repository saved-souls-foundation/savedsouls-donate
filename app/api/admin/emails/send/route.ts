import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, NOTIFICATION_EMAILS } from "@/lib/sendMail";
import { logSentEmail } from "@/lib/sentEmailsLog";

/** From moet formaat "Name <email@domain.com>" hebben voor Resend (geverifieerd domein). */
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "Saved Souls Foundation <info@savedsouls-foundation.org>";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;">${body.replace(/\n/g, "<br>\n")}</body></html>`;
}

/**
 * Verstuur een nieuwe e-mail (niet gekoppeld aan inkomende mail, of als antwoord met optional incoming_email_id).
 * POST body: { to_email, bcc?, subject, body, incoming_email_id? }
 * `bcc`: komma-gescheiden of array van e-mailadressen (bulk vanuit admin-lijsten).
 * Logt in sent_emails (lib/sentEmailsLog: probeert EN/NL/minimaal schema). Bij log-falen: altijd 200 + success: true (mail is verstuurd).
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    let body: { to_email?: string; bcc?: string | string[]; subject?: string; body?: string; incoming_email_id?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    let to_email = typeof body.to_email === "string" ? body.to_email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const bodyText = typeof body.body === "string" ? body.body.trim() : "";
    const incoming_email_id = typeof body.incoming_email_id === "string" ? body.incoming_email_id : undefined;

    const bccList: string[] = Array.isArray(body.bcc)
      ? body.bcc.map((e) => (typeof e === "string" ? e.trim().toLowerCase() : "")).filter(Boolean)
      : typeof body.bcc === "string"
        ? body.bcc
            .split(/[,;\s]+/)
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean)
        : [];

    if (!subject) {
      return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }
    if (!bodyText) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    if (bccList.length > 0 && !to_email) {
      to_email = NOTIFICATION_EMAILS[0];
    }
    if (!to_email) {
      return NextResponse.json({ error: "to_email is required (of vul BCC-ontvangers in)" }, { status: 400 });
    }

    const html = wrapHtml(bodyText);
    const text = bodyText.replace(/<[^>]+>/g, "");

    console.log("[admin/emails/send] RESEND_API_KEY present:", Boolean(process.env.RESEND_API_KEY), "| from:", RESEND_FROM, "| to:", to_email, "| bcc count:", bccList.length);

    const result = await sendMail({
      from: RESEND_FROM,
      to: to_email,
      ...(bccList.length > 0 ? { bcc: bccList } : {}),
      subject,
      text,
      html,
    });

    if (!result.success) {
      const errMsg = result.error ?? "Send failed";
      console.error("[admin/emails/send] Resend foutmelding:", errMsg);
      const isDomainError = /domain|verif|verified/i.test(String(errMsg));
      const clientMessage = isDomainError
        ? "Verzenden mislukt. Controleer de e-mailinstellingen (domein)."
        : errMsg;
      return NextResponse.json({ error: clientMessage }, { status: 502 });
    }

    // Alle database-schrijfacties via admin client (RLS omzeild)
    const admin = createAdminClient();
    let verwerktDoor: string | null = null;
    try {
      const sessionSupabase = await createClient();
      const { data: { user } } = await sessionSupabase.auth.getUser();
      verwerktDoor = user?.id ?? null;
    } catch {
      // session optional voor verwerkt_door
    }

    if (incoming_email_id) {
      const now = new Date().toISOString();
      await admin
        .from("incoming_emails")
        .update({
          status: "verstuurd",
          beantwoord_op: now,
          verwerkt_door: verwerktDoor,
          verwerkt_op: now,
        })
        .eq("id", incoming_email_id);
    }

    const logTo = bccList.length > 0 ? `${to_email} (+${bccList.length} bcc)` : to_email.trim();
    const logged = await logSentEmail(admin, {
      type: "email_assistant",
      to: logTo.slice(0, 500),
      subject: subject.trim(),
      bodyPreview: bodyText.slice(0, 500).trim() || null,
      referenceId: incoming_email_id ?? null,
      referenceType: incoming_email_id ? "incoming_email" : null,
    });
    if (!logged) console.error("[admin/emails/send] Mail verzonden maar sent_emails-log mislukt (zie Supabase-schema).");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/emails/send] Unexpected error:", e);
    return NextResponse.json({ error: "Versturen mislukt" }, { status: 500 });
  }
}
