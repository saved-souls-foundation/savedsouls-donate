import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, delay } from "@/lib/sendMail";

const BASE_URL = (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim())
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : "https://www.savedsouls-foundation.com";
const BATCH_SIZE = 50;
const LANGUAGES = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

/** Unsubscribe link text per language for the newsletter email footer */
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

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient(), userId: user.id };
}

function getSubject(payload: Record<string, unknown>, lang: string): string {
  const key = `subject_${lang}` as keyof typeof payload;
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function getBody(payload: Record<string, unknown>, lang: string): string {
  const key = `body_${lang}` as keyof typeof payload;
  return typeof payload[key] === "string" ? (payload[key] as string) : "";
}

function appendUnsubscribe(html: string, unsubscribeUrl: string, linkText: string): string {
  const safeUrl = unsubscribeUrl.replace(/"/g, "&quot;");
  const safeText = linkText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const block = `<p style="margin-top:24px;font-size:12px;color:#666;"><a href="${safeUrl}">${safeText}</a></p>`;
  return html + block;
}

export async function POST(request: NextRequest) {
  const { error, supabase, userId } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: subscribers, error: fetchErr } = await supabase!
    .from("newsletter_subscribers")
    .select("id, email, language, unsubscribe_token")
    .eq("actief", true);

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  const list = subscribers ?? [];

  let totalSent = 0;
  let failed = 0;
  for (let i = 0; i < list.length; i++) {
    const sub = list[i] as { email: string; language: string | null; unsubscribe_token: string | null };
    const lang = (LANGUAGES.includes(sub.language as Lang) ? sub.language : "en") as Lang;
    const subject = getSubject(body, lang) || getSubject(body, "en") || getSubject(body, "nl");
    const rawBody = getBody(body, lang) || getBody(body, "en") || getBody(body, "nl");
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
  const { error: insertErr } = await supabase!.from("newsletter_sends").insert({
    subject_nl: body.subject_nl ?? null,
    subject_en: body.subject_en ?? null,
    subject_es: body.subject_es ?? null,
    subject_ru: body.subject_ru ?? null,
    subject_th: body.subject_th ?? null,
    subject_de: body.subject_de ?? null,
    subject_fr: body.subject_fr ?? null,
    body_nl: body.body_nl ?? null,
    body_en: body.body_en ?? null,
    body_es: body.body_es ?? null,
    body_ru: body.body_ru ?? null,
    body_th: body.body_th ?? null,
    body_de: body.body_de ?? null,
    body_fr: body.body_fr ?? null,
    sent_by: userId,
    recipient_count: totalSent,
    status,
  });

  if (insertErr) {
    console.error("[newsletter/send] insert newsletter_sends error:", insertErr);
  }

  return NextResponse.json({ success: true, total_sent: totalSent, failed });
}
