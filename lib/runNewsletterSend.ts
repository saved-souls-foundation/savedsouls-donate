/**
 * Gedeelde logica: nieuwsbrief naar alle actieve abonnees sturen.
 * Gebruikt door POST /api/admin/newsletter/send en door /api/cron/newsletter.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, delay } from "@/lib/sendMail";

const BASE_URL = (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim())
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : "https://www.savedsouls-foundation.com";
const BATCH_SIZE = 50;
const LANGUAGES = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

const UNSUBSCRIBE_LINK_TEXT: Record<(typeof LANGUAGES)[number], string> = {
  nl: "Uitschrijven",
  en: "Unsubscribe",
  es: "Darse de baja",
  ru: "Отписаться",
  th: "ยกเลิกการสมัคร",
  de: "Abmelden",
  fr: "Se désinscrire",
};

type Lang = (typeof LANGUAGES)[number];

function getSubject(payload: Record<string, unknown>, lang: string): string {
  const key = `subject_${lang}`;
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function getBody(payload: Record<string, unknown>, lang: string): string {
  const key = `body_${lang}`;
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function appendUnsubscribe(html: string, unsubscribeUrl: string, linkText: string): string {
  const safeUrl = unsubscribeUrl.replace(/"/g, "&quot;");
  const safeText = linkText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return html + `<p style="margin-top:24px;font-size:12px;color:#666;"><a href="${safeUrl}">${safeText}</a></p>`;
}

export type RunNewsletterSendResult = { totalSent: number; failed: number; status: "sent" | "failed" | "partial" };

export async function runNewsletterSend(
  payload: Record<string, unknown>,
  sentByUserId: string | null
): Promise<RunNewsletterSendResult> {
  const supabase = createAdminClient();
  const { data: subscribers, error: fetchErr } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, language, unsubscribe_token")
    .eq("actief", true);

  if (fetchErr) throw new Error(fetchErr.message);
  const list = subscribers ?? [];

  let totalSent = 0;
  let failed = 0;
  for (let i = 0; i < list.length; i++) {
    const sub = list[i] as { email: string; language: string | null; unsubscribe_token: string | null };
    const lang = (LANGUAGES.includes(sub.language as Lang) ? sub.language : "en") as Lang;
    const subject = getSubject(payload, lang) || getSubject(payload, "en") || getSubject(payload, "nl");
    const rawBody = getBody(payload, lang) || getBody(payload, "en") || getBody(payload, "nl");
    if (!subject || !rawBody) continue;
    const token = sub.unsubscribe_token ?? "";
    const locale = lang;
    const unsubscribeUrl = `${BASE_URL}/${locale}/unsubscribe?token=${encodeURIComponent(token)}`;
    const linkText = UNSUBSCRIBE_LINK_TEXT[lang] ?? UNSUBSCRIBE_LINK_TEXT.en;
    const html = appendUnsubscribe(rawBody, unsubscribeUrl, linkText);
    const text = rawBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const result = await sendMail({ to: sub.email, subject, text, html });
    if (result.success) totalSent++;
    else failed++;

    if ((i + 1) % BATCH_SIZE === 0) await delay(1100);
  }

  const status = failed === 0 ? "sent" : list.length === failed ? "failed" : "partial";
  await supabase.from("newsletter_sends").insert({
    subject_nl: payload.subject_nl ?? null,
    subject_en: payload.subject_en ?? null,
    subject_es: payload.subject_es ?? null,
    subject_ru: payload.subject_ru ?? null,
    subject_th: payload.subject_th ?? null,
    subject_de: payload.subject_de ?? null,
    subject_fr: payload.subject_fr ?? null,
    body_nl: payload.body_nl ?? null,
    body_en: payload.body_en ?? null,
    body_es: payload.body_es ?? null,
    body_ru: payload.body_ru ?? null,
    body_th: payload.body_th ?? null,
    body_de: payload.body_de ?? null,
    body_fr: payload.body_fr ?? null,
    sent_by: sentByUserId,
    recipient_count: totalSent,
    status,
  });

  return { totalSent, failed, status };
}
