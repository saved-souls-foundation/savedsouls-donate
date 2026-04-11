import type { SupabaseClient } from "@supabase/supabase-js";

type SentEmailPayload = {
  type: "email_assistant" | "step_notify" | "other";
  to: string;
  subject: string;
  bodyPreview: string | null;
  referenceId?: string | null;
  referenceType?: string | null;
  /** Genegeerd bij insert — live `sent_emails` heeft geen meta-kolom. */
  meta?: Record<string, unknown> | null;
};

/**
 * Schrijft een regel in sent_emails (Nederlandse kolommen, productie).
 * @returns true als gelogd, false bij fout (mail is dan wel verstuurd)
 */
export async function logSentEmail(admin: SupabaseClient, payload: SentEmailPayload): Promise<boolean> {
  const { type, to, subject, bodyPreview, referenceId, referenceType } = payload;
  const refId = referenceId ?? null;
  const refType = referenceType ?? null;

  const res = await admin
    .from("sent_emails")
    .insert({
      type,
      aan: to,
      onderwerp: subject,
      inhoud: bodyPreview,
      verstuurd_op: new Date().toISOString(),
      reference_id: refId,
      reference_type: refType,
    })
    .select("id")
    .single();

  if (!res.error) return true;

  console.error("[sentEmailsLog]", res.error.code, res.error.message);
  return false;
}
