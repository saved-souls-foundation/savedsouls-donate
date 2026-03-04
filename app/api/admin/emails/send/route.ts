import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "info@savedsouls-foundation.com";

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
 * POST body: { to_email, subject, body, incoming_email_id? }
 */
export async function POST(request: NextRequest) {
  try {
    const { error, supabase } = await requireAdmin();
    if (error) return error;

    let body: { to_email?: string; subject?: string; body?: string; incoming_email_id?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const to_email = typeof body.to_email === "string" ? body.to_email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const bodyText = typeof body.body === "string" ? body.body.trim() : "";
    const incoming_email_id = typeof body.incoming_email_id === "string" ? body.incoming_email_id : undefined;

    if (!to_email || !subject) {
      return NextResponse.json({ error: "to_email and subject are required" }, { status: 400 });
    }
    if (!bodyText) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    const html = wrapHtml(bodyText);
    const text = bodyText.replace(/<[^>]+>/g, "");

    const result = await sendMail({
      from: RESEND_FROM,
      to: to_email,
      subject,
      text,
      html,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Send failed" }, { status: 502 });
    }

    if (incoming_email_id) {
      const { data: { user } } = await supabase!.auth.getUser();
      await supabase!
        .from("incoming_emails")
        .update({
          status: "verstuurd",
          verwerkt_door: user?.id ?? null,
          verwerkt_op: new Date().toISOString(),
        })
        .eq("id", incoming_email_id);
    }

    // sent_emails (migration 20250305): aan→to_email, onderwerp→subject, inhoud→body_preview, verstuurd_op→sent_at
    const verstuurdOp = new Date().toISOString();
    const { error: insertErr } = await supabase!.from("sent_emails").insert({
      type: "email_assistant",
      to_email,       // aan
      subject,        // onderwerp
      body_preview: bodyText.replace(/\s+/g, " ").trim().slice(0, 500), // inhoud (preview)
      sent_at: verstuurdOp, // verstuurd_op
      reference_id: incoming_email_id ?? null,
      reference_type: incoming_email_id ? "incoming_email" : null,
    });
    if (insertErr) {
      console.error("[admin/emails/send] sent_emails insert failed:", insertErr);
      return NextResponse.json({ error: "Mail verstuurd maar opslaan in log mislukt" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/emails/send] Unexpected error:", e);
    return NextResponse.json({ error: "Versturen mislukt" }, { status: 500 });
  }
}
