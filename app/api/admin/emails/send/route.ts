import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";

/** From moet formaat "Name <email@domain.com>" hebben voor Resend (geverifieerd domein). */
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "Saved Souls Foundation <info@savedsouls-foundation.com>";

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
 * Logt in sent_emails met Nederlandse kolommen: aan, onderwerp, inhoud, verstuurd_op.
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
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

    console.log("[admin/emails/send] RESEND_API_KEY present:", Boolean(process.env.RESEND_API_KEY), "| from:", RESEND_FROM, "| to:", to_email);

    const result = await sendMail({
      from: RESEND_FROM,
      to: to_email,
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
      await admin
        .from("incoming_emails")
        .update({
          status: "verstuurd",
          verwerkt_door: verwerktDoor,
          verwerkt_op: new Date().toISOString(),
        })
        .eq("id", incoming_email_id);
    }

    const verstuurdOp = new Date().toISOString();
    const insertData = {
      type: "email_assistant" as const,
      aan: to_email,
      onderwerp: subject,
      inhoud: bodyText,
      verstuurd_op: verstuurdOp,
      reference_id: incoming_email_id ?? null,
      reference_type: incoming_email_id ? "incoming_email" : null,
    };
    console.log("[admin/emails/send] Poging tot opslaan in DB:", insertData);
    const { data: insertedRow, error: insertErr } = await admin.from("sent_emails").insert(insertData).select("id").single();
    console.log("[admin/emails/send] Resultaat van DB:", { error: insertErr, insertedId: insertedRow?.id });
    if (insertErr) {
      console.error("[admin/emails/send] sent_emails insert failed – full supabaseError:", JSON.stringify(insertErr, null, 2));
      return NextResponse.json({ error: "Mail verstuurd maar opslaan in log mislukt" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/emails/send] Unexpected error:", e);
    return NextResponse.json({ error: "Versturen mislukt" }, { status: 500 });
  }
}
