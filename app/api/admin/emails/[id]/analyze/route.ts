import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { analyzeIncomingEmail } from "@/lib/claudeAnalyze";
import { sendMail } from "@/lib/sendMail";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "info@savedsouls-foundation.com";
const AUTO_SEND_CONFIDENCE_THRESHOLD = 0.6;

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;">${body}</body></html>`;
}

const LANG_KEYS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

function getTemplateContent(template: Record<string, unknown>, taal: string): { onderwerp: string; inhoud: string } {
  const lang = LANG_KEYS.includes(taal as (typeof LANG_KEYS)[number]) ? taal : "nl";
  const inhoudKey = `inhoud_${lang}`;
  const onderwerpKey = `onderwerp_${lang}`;
  let inhoud = (template[inhoudKey] as string) ?? (template.inhoud_nl as string) ?? (template.inhoud_en as string) ?? "";
  const onderwerp = (template[onderwerpKey] as string) ?? (template.onderwerp as string) ?? "";
  return { onderwerp, inhoud };
}

function replacePlaceholders(text: string, naam: string | null, dier: string | null): string {
  return text
    .replace(/\{\{naam\}\}/g, naam ?? "")
    .replace(/\{\{dier\}\}/g, dier ?? "")
    .replace(/\{\{organisatie\}\}/g, "Saved Souls Foundation");
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const { data: email, error: emailErr } = await supabase!.from("incoming_emails").select("*").eq("id", id).maybeSingle();
  if (emailErr || !email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: templates } = await supabase!.from("email_templates").select("id, naam, categorie").eq("actief", true);
  const list = (templates ?? []).map((t: { id: string; naam: string | null; categorie: string | null }) => ({ id: t.id, naam: t.naam, categorie: t.categorie }));

  let result: Awaited<ReturnType<typeof analyzeIncomingEmail>>;
  try {
    result = await analyzeIncomingEmail(
      email.van_naam,
      email.van_email,
      email.onderwerp,
      email.inhoud,
      list
    );
  } catch (e) {
    console.error("[emails/analyze]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Analysis failed" }, { status: 500 });
  }

  const { taal, categorie, template_id, confidence, personalisatie } = result;
  let ai_gegenereerd_antwoord = "";
  let suggestedTemplateName: string | null = null;

  if (template_id) {
    const { data: template } = await supabase!.from("email_templates").select("*").eq("id", template_id).maybeSingle();
    if (template) {
      suggestedTemplateName = (template as { naam?: string }).naam ?? null;
      const { onderwerp: _subj, inhoud } = getTemplateContent(template as Record<string, unknown>, taal);
      const naam = personalisatie?.naam ?? (email.van_naam ?? "").split(/\s+/)[0] ?? null;
      const dier = personalisatie?.dier ?? null;
      ai_gegenereerd_antwoord = replacePlaceholders(inhoud, naam, dier);
    }
  }

  const { error: updateErr } = await supabase!
    .from("incoming_emails")
    .update({
      ai_categorie: categorie,
      ai_suggestie_template_id: template_id || null,
      ai_confidence: confidence,
      ai_gegenereerd_antwoord: ai_gegenereerd_antwoord || null,
      taal: taal || null,
    })
    .eq("id", id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  const shouldAutoSend = confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD && ai_gegenereerd_antwoord.trim().length > 0;
  let autoSent = false;

  if (shouldAutoSend) {
    const to = (email.van_email as string) ?? "";
    if (to) {
      const subject = `Re: ${(email.onderwerp as string) ?? "Your message"}`;
      const html = wrapHtml(ai_gegenereerd_antwoord.replace(/\n/g, "<br>\n"));
      const sendResult = await sendMail({
        from: RESEND_FROM,
        to,
        subject,
        text: ai_gegenereerd_antwoord.replace(/<[^>]+>/g, ""),
        html,
      });
      if (sendResult.success) {
        const { data: { user } } = await supabase!.auth.getUser();
        await supabase!
          .from("incoming_emails")
          .update({
            status: "verstuurd",
            verwerkt_door: user?.id ?? null,
            verwerkt_op: new Date().toISOString(),
          })
          .eq("id", id);
        autoSent = true;
        if (isSupabaseAdminConfigured()) {
          try {
            const admin = createAdminClient();
            await admin.from("sent_emails").insert({
              type: "email_assistant",
              to_email: to,
              subject,
              body_preview: ai_gegenereerd_antwoord.replace(/\s+/g, " ").trim().slice(0, 500),
              reference_id: id,
              reference_type: "incoming_email",
            });
          } catch (logErr) {
            console.error("[emails/analyze] sent_emails insert failed:", logErr);
          }
        }
      }
    }
  }

  return NextResponse.json({
    taal,
    categorie,
    template_id,
    confidence,
    personalisatie: personalisatie ?? { naam: null, dier: null },
    suggestedTemplateName,
    ai_gegenereerd_antwoord,
    autoSent,
    autoSentMessage: autoSent ? "Automatisch verstuurd" : undefined,
  });
}
