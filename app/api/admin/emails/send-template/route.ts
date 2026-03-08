import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { sendMail, delay } from "@/lib/sendMail";

const MAX_RECIPIENTS = 100;
const MAX_EMAILS_PER_DAY = 200;
const ORGANISATIE = "Saved Souls Foundation";

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "Saved Souls Website <info@savedsouls-foundation.com>";
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

function getSubjectAndContent(
  template: Record<string, unknown>,
  locale: string
): { subject: string; content: string } {
  const lang = ["nl", "en", "es", "ru", "th", "de", "fr"].includes(locale) ? locale : "nl";
  const onderwerpKey = `onderwerp_${lang}`;
  const inhoudKey = `inhoud_${lang}`;
  const subject =
    (template[onderwerpKey] as string) ??
    (template.onderwerp as string) ??
    (template.onderwerp_nl as string) ??
    "";
  const content =
    (template[inhoudKey] as string) ??
    (template[`inhoud_${lang}`] as string) ??
    (template.inhoud_nl as string) ??
    (template.inhoud_en as string) ??
    "";
  return { subject, content };
}

function replacePlaceholders(text: string, naam: string): string {
  return text
    .replace(/\{\{naam\}\}/g, naam || " ")
    .replace(/\{\{organisatie\}\}/g, ORGANISATIE);
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;">${body}</body></html>`;
}

export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  let body: { templateId?: string; recipients?: Array<{ naam?: string; email?: string }>; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const templateId = typeof body.templateId === "string" ? body.templateId.trim() : "";
  const recipients = Array.isArray(body.recipients) ? body.recipients : [];
  const locale = typeof body.locale === "string" ? body.locale.trim() || "nl" : "nl";

  console.log("send-template called", { templateId, recipients });

  if (!templateId) return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  if (recipients.length === 0) return NextResponse.json({ error: "recipients is required" }, { status: 400 });
  if (recipients.length > MAX_RECIPIENTS) {
    return NextResponse.json({ error: `Max ${MAX_RECIPIENTS} ontvangers per keer` }, { status: 400 });
  }

  const normalized: Array<{ naam: string; email: string }> = [];
  for (const r of recipients) {
    const email = typeof r.email === "string" ? r.email.trim().toLowerCase() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
    normalized.push({
      naam: typeof r.naam === "string" ? r.naam.trim() : "",
      email,
    });
  }
  if (normalized.length === 0) return NextResponse.json({ error: "Geen geldige ontvangers" }, { status: 400 });

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayStartStr = todayStart.toISOString();
  const { count: sentToday } = await admin!
    .from("template_send_log")
    .select("*", { count: "exact", head: true })
    .eq("status", "verstuurd")
    .gte("verstuurd_op", todayStartStr);
  const sentTodayNum = sentToday ?? 0;
  if (sentTodayNum + normalized.length > MAX_EMAILS_PER_DAY) {
    return NextResponse.json(
      { error: `Max ${MAX_EMAILS_PER_DAY} e-mails per dag. Vandaag al ${sentTodayNum} verstuurd.` },
      { status: 429 }
    );
  }

  const { data: template, error: templateErr } = await admin!
    .from("email_templates")
    .select("*")
    .eq("id", templateId)
    .maybeSingle();

  if (templateErr || !template) {
    console.error("send-template: template fetch failed", { templateErr: templateErr?.message, templateId });
    return NextResponse.json({ error: "Template niet gevonden" }, { status: 404 });
  }
  const templateKeys = Object.keys(template as Record<string, unknown>);
  console.log("send-template: template loaded", { templateId, naam: (template as { naam?: string }).naam, locale, templateColumnNames: templateKeys });

  const { subject: subjectBase, content: contentBase } = getSubjectAndContent(template as Record<string, unknown>, locale);
  console.log("send-template: subject and content length", { subjectLength: subjectBase.length, contentLength: contentBase.length });

  let success = 0;
  let errors = 0;

  for (let i = 0; i < normalized.length; i++) {
    const { naam, email } = normalized[i];
    const subject = replacePlaceholders(subjectBase, naam);
    const content = replacePlaceholders(contentBase, naam);
    const html = wrapHtml(content);
    const text = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

    const mailOptions = {
      from: getFromEmail(),
      to: email,
      subject,
      text,
      html,
    };
    console.log("send-template: sending mail", { to: email, subject: subject.slice(0, 50), hasHtml: !!html });

    let result: { success: boolean; error?: string };
    try {
      result = await sendMail(mailOptions);
      if (!result.success) {
        console.error("sendMail error (returned):", result.error);
      }
    } catch (err) {
      console.error("sendMail error:", err);
      result = { success: false, error: err instanceof Error ? err.message : String(err) };
    }

    await admin!.from("template_send_log").insert({
      template_id: templateId,
      ontvanger_email: email,
      ontvanger_naam: naam || null,
      status: result.success ? "verstuurd" : "mislukt",
    });

    if (result.success) success++;
    else errors++;

    if (i < normalized.length - 1) await delay(600);
  }

  if (isSupabaseAdminConfigured()) {
    try {
      await admin!.from("ai_usage_log").insert({
        model: "resend",
        input_tokens: 0,
        output_tokens: success,
        task: "email_template_send",
        estimated_cost_usd: 0,
      });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ success, errors });
}
