import type { SupabaseClient } from "@supabase/supabase-js";

type SentEmailPayload = {
  type: "email_assistant" | "step_notify" | "other";
  to: string;
  subject: string;
  bodyPreview: string | null;
  referenceId?: string | null;
  referenceType?: string | null;
  meta?: Record<string, unknown> | null;
};

/**
 * Schrijft een regel in sent_emails. Probeert eerst Engelse kolommen (migratie 20250305),
 * bij schemafout Nederlandse kolommen (productie kan afwijken).
 * @returns true als gelogd, false bij fout (mail is dan wel verstuurd)
 */
export async function logSentEmail(admin: SupabaseClient, payload: SentEmailPayload): Promise<boolean> {
  const { type, to, subject, bodyPreview, referenceId, referenceType, meta } = payload;
  const insertEn = {
    type,
    to_email: to,
    subject,
    body_preview: bodyPreview,
    reference_id: referenceId ?? null,
    reference_type: referenceType ?? null,
    meta: meta ?? {},
  };
  let res = await admin.from("sent_emails").insert(insertEn).select("id").single();
  if (res.error && (res.error.code === "PGRST204" || /column|schema|cache/i.test(res.error.message ?? ""))) {
    const insertNl = {
      type,
      aan: to,
      onderwerp: subject,
      inhoud: bodyPreview,
      verstuurd_op: new Date().toISOString(),
      reference_id: referenceId ?? null,
      reference_type: referenceType ?? null,
      meta: meta ?? {},
    };
    res = await admin.from("sent_emails").insert(insertNl).select("id").single();
  }
  if (res.error) {
    console.error("[sentEmailsLog]", res.error.code, res.error.message);
    return false;
  }
  return true;
}
