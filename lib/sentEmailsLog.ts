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

function isSchemaError(err: { code?: string; message?: string }): boolean {
  return (err.code === "PGRST204" || /column|schema|cache|does not exist/i.test(err.message ?? "")) ?? false;
}

/**
 * Schrijft een regel in sent_emails. Probeert meerdere schema-varianten (EN, NL, minimaal)
 * zodat het werkt ongeacht productie-migraties.
 * @returns true als gelogd, false bij fout (mail is dan wel verstuurd)
 */
export async function logSentEmail(admin: SupabaseClient, payload: SentEmailPayload): Promise<boolean> {
  const { type, to, subject, bodyPreview, referenceId, referenceType, meta } = payload;
  const refId = referenceId ?? null;
  const refType = referenceType ?? null;
  const metaVal = meta ?? {};

  // 1) Volledig Engels (migratie 20250305)
  let res = await admin.from("sent_emails").insert({
    type,
    to_email: to,
    subject,
    body_preview: bodyPreview,
    reference_id: refId,
    reference_type: refType,
    meta: metaVal,
  }).select("id").single();
  if (!res.error) return true;
  if (!isSchemaError(res.error)) {
    console.error("[sentEmailsLog]", res.error.code, res.error.message);
    return false;
  }

  // 2) Volledig Nederlands (productie met NL kolommen)
  res = await admin.from("sent_emails").insert({
    type,
    aan: to,
    onderwerp: subject,
    inhoud: bodyPreview,
    verstuurd_op: new Date().toISOString(),
    reference_id: refId,
    reference_type: refType,
    meta: metaVal,
  }).select("id").single();
  if (!res.error) return true;
  if (!isSchemaError(res.error)) {
    console.error("[sentEmailsLog]", res.error.code, res.error.message);
    return false;
  }

  // 3) Minimaal Engels (zonder body_preview, voor tabellen waar die kolom ontbreekt)
  res = await admin.from("sent_emails").insert({
    type,
    to_email: to,
    subject,
    reference_id: refId,
    reference_type: refType,
    meta: metaVal,
  }).select("id").single();
  if (!res.error) return true;
  if (!isSchemaError(res.error)) {
    console.error("[sentEmailsLog]", res.error.code, res.error.message);
    return false;
  }

  // 4) Minimaal Nederlands
  res = await admin.from("sent_emails").insert({
    type,
    aan: to,
    onderwerp: subject,
    verstuurd_op: new Date().toISOString(),
    reference_id: refId,
    reference_type: refType,
    meta: metaVal,
  }).select("id").single();
  if (!res.error) return true;

  console.error("[sentEmailsLog] all insert attempts failed", res.error?.code, res.error?.message);
  return false;
}
