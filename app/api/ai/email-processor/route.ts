import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";
import { EMAIL_CLASSIFY_PROMPT, EMAIL_REPLY_PROMPT } from "@/lib/ai/prompts";
import { sendMail } from "@/lib/sendMail";

const ACCENT_GREEN = "#2aa348";
const BASE_URL = "https://www.savedsouls-foundation.org";
const FOOTER_BG = "#1a3d2b";
const ORG_NAME = "Saved Souls Foundation";

const FOOTER_SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/SavedSoulsFoundation/" },
  { name: "Instagram", href: "https://www.instagram.com/savedsoulsfoundation" },
  { name: "YouTube", href: "https://www.youtube.com/@savedsoulsfoundation" },
  { name: "TikTok", href: "https://www.tiktok.com/@savedsoulsfoundation" },
];

const REPLY_HEADER_TITLE: Record<string, string> = {
  nl: "Antwoord op uw bericht",
  en: "Response to your message",
  th: "ตอบกลับข้อความของคุณ",
  de: "Antwort auf Ihre Nachricht",
  fr: "Réponse à votre message",
  es: "Respuesta a su mensaje",
  ru: "Ответ на ваше сообщение",
};

const FOOTNOTE_BY_LANG: Record<string, string> = {
  nl: "---\nDit is een automatisch gegenereerd antwoord. Heeft u nog vragen of wilt u persoonlijk contact? Stuur dan een email naar info@savedsouls-foundation.org",
  en: "---\nThis is an automatically generated response. If you have further questions or would like personal contact, please email info@savedsouls-foundation.org",
  th: "---\nนี่คือการตอบกลับอัตโนมัติ หากมีคำถามเพิ่มเติม กรุณาติดต่อ info@savedsouls-foundation.org",
  de: "---\nDies ist eine automatisch generierte Antwort. Bei weiteren Fragen wenden Sie sich bitte an info@savedsouls-foundation.org",
  fr: "---\nCeci est une réponse générée automatiquement. Pour toute question, contactez info@savedsouls-foundation.org",
  es: "---\nEsta es una respuesta generada automáticamente. Para más preguntas contacte info@savedsouls-foundation.org",
  ru: "---\nЭто автоматически сгенерированный ответ. По вопросам пишите на info@savedsouls-foundation.org",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getReplyHeaderTitle(lang: string): string {
  const key = (lang || "nl").slice(0, 2).toLowerCase();
  return REPLY_HEADER_TITLE[key] ?? REPLY_HEADER_TITLE.nl;
}

function getFootnote(lang: string): string {
  const key = (lang || "nl").slice(0, 2).toLowerCase();
  return FOOTNOTE_BY_LANG[key] ?? FOOTNOTE_BY_LANG.nl;
}

function buildAutoReplyStyleHtml(bodyHtml: string, footnoteHtml: string, lang: string): string {
  const title = getReplyHeaderTitle(lang);
  const sigHtml = "Het Saved Souls Team, Khon Kaen, Thailand".replace(/, /g, "<br>");
  const contactPageUrl = `${BASE_URL}/${lang === "nl" ? "nl" : lang === "de" ? "de" : lang === "es" ? "es" : lang === "th" ? "th" : lang === "ru" ? "ru" : "en"}/contact`;
  const contactHintHtml = `Voor adres, openingstijden en telefoon: <a href="${escapeHtml(contactPageUrl)}" style="color:${ACCENT_GREEN};">${escapeHtml(contactPageUrl)}</a>`;
  const socialLinksHtml = FOOTER_SOCIALS.map(
    (s) => `<a href="${escapeHtml(s.href)}" style="color:#fff;text-decoration:none;font-size:13px;opacity:0.9;">${escapeHtml(s.name)}</a>`
  ).join(" &nbsp;·&nbsp; ");
  const footerMission = "Sinds 2010 geven wij gebroken zielen een tweede kans — in Khon Kaen, Thailand.";
  const websiteLinkHtml = `<a href="${BASE_URL}" style="color:#fff;text-decoration:underline;opacity:0.95;">${escapeHtml(BASE_URL)}</a>`;
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">${escapeHtml(title)}</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">${escapeHtml(ORG_NAME)}</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    ${bodyHtml}
    <div style="margin-top:20px;color:#888;font-size:12px;line-height:1.4;">${footnoteHtml}</div>
  </div>
  <div style="padding:16px 24px;background:#f9f9f9;font-size:13px;color:#666;">
    ${sigHtml}
  </div>
  <div style="padding:12px 24px;border-top:1px solid #eee;font-size:13px;color:#555;">
    ${contactHintHtml}
  </div>
  <div style="background:${FOOTER_BG};color:#fff;padding:20px 24px;text-align:center;font-size:13px;">
    <p style="margin:0 0 4px;font-weight:600;">${escapeHtml(ORG_NAME)}</p>
    <p style="margin:0 0 10px;opacity:0.85;line-height:1.4;">${escapeHtml(footerMission)}</p>
    <p style="margin:0 0 12px;font-size:12px;">${websiteLinkHtml}</p>
    <p style="margin:0;font-size:12px;">${socialLinksHtml}</p>
  </div>
</div></body></html>`;
}

const INHOUD_BY_LANG: Record<string, string> = {
  nl: "inhoud_nl",
  en: "inhoud_en",
  es: "inhoud_es",
  ru: "inhoud_ru",
  th: "inhoud_th",
  de: "inhoud_de",
  fr: "inhoud_fr",
};

function parseClassifyResponse(raw: string): {
  category: string;
  urgency: string;
  language: string;
} {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as {
      category?: string;
      urgency?: string;
      language?: string;
    };
    return {
      category: typeof parsed.category === "string" ? parsed.category : "algemeen",
      urgency: typeof parsed.urgency === "string" ? parsed.urgency : "normaal",
      language: typeof parsed.language === "string" ? parsed.language : "nl",
    };
  } catch {
    return { category: "algemeen", urgency: "normaal", language: "nl" };
  }
}

/** Bij adoptie-emails: extraheer diernaam uit inhoud voor {{dier}} in templates. */
function extractDierNaamFromAdoptieEmail(text: string): string | null {
  const raw = (text ?? "").trim();
  if (!raw) return null;
  const patterns: RegExp[] = [
    /\bvoor\s+([^\n,.\])]+?)(?=\s*[.\n,]|$)/i,
    /\badoptie\s+van\s+([^\n,.\])]+?)(?=\s*[.\n,]|$)/i,
    /\binteresse\s+in\s+([^\n,.\])]+?)(?=\s*[.\n,]|$)/i,
    /\banimal\s*:\s*([^\n,.\])]+?)(?=\s*[.\n,]|$)/i,
    /\bdier\s*:\s*([^\n,.\])]+?)(?=\s*[.\n,]|$)/i,
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m && m[1]) {
      const naam = m[1].trim();
      if (naam.length > 0 && naam.length < 80) return naam;
    }
  }
  const idMatch = raw.match(/([^\n,(]+?)\s*\(\s*ID\s*:\s*\d+\s*\)/i);
  if (idMatch && idMatch[1]) {
    const naam = idMatch[1].trim();
    if (naam.length > 0 && naam.length < 80) return naam;
  }
  return null;
}

function getTemplateText(
  template: Record<string, unknown>,
  language: string
): string | null {
  const col = INHOUD_BY_LANG[language] ?? INHOUD_BY_LANG.nl;
  const text = template[col];
  if (typeof text === "string" && text.trim()) return text.trim();
  const fallback = template.inhoud_nl;
  if (typeof fallback === "string" && fallback.trim()) return fallback.trim();
  return null;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { emailId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const emailId = body.emailId;
  if (!emailId || typeof emailId !== "string") {
    return NextResponse.json(
      { error: "emailId is required" },
      { status: 400 }
    );
  }

  console.log("[email-processor] Auto-reply gestart voor email", emailId);
  const admin = createAdminClient();
  const { data: email, error: fetchError } = await admin
    .from("incoming_emails")
    .select("id, onderwerp, inhoud, van_naam, van_email, ai_processed_at")
    .eq("id", emailId)
    .maybeSingle();

  if (fetchError) {
    console.error("[email-processor] Fout:", fetchError.message);
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }
  if (!email) {
    console.error("[email-processor] Fout: Email not found", emailId);
    return NextResponse.json(
      { error: "Email not found" },
      { status: 404 }
    );
  }
  if (email.ai_processed_at != null) {
    return NextResponse.json(
      { skipped: true, reason: "already processed" },
      { status: 200 }
    );
  }

  const subject = (email.onderwerp ?? "") as string;
  const emailBody = (email.inhoud ?? "") as string;

  const classifyPrompt = EMAIL_CLASSIFY_PROMPT(emailBody, subject);
  let classifyRaw: string;
  try {
    classifyRaw = await callClaude(classifyPrompt, {
      model: "haiku",
      maxTokens: 120,
      taskName: "email-classify",
    });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error("[email-processor] Fout:", errMsg);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }

  const { category, urgency, language } = parseClassifyResponse(classifyRaw);

  let aiDierNaam: string | null = null;
  if (category === "adoptie") {
    aiDierNaam = extractDierNaamFromAdoptieEmail(emailBody);
  }

  let suggestedReply: string;
  let usedTemplate = false;

  const { data: templates } = await admin
    .from("email_templates")
    .select("id, naam, categorie, inhoud_nl, inhoud_en, inhoud_es, inhoud_ru, inhoud_th, inhoud_de, inhoud_fr")
    .eq("categorie", category)
    .eq("actief", true)
    .not("naam", "ilike", "%ontvangen%")
    .order("naam", { ascending: true })
    .limit(1);

  const templateRow = templates?.[0] as Record<string, unknown> | undefined;
  const templateText = templateRow ? getTemplateText(templateRow, language) : null;

  if (templateText) {
    const adapterPrompt = `Gebruik onderstaande sjabloon als STIJLGIDS. Schrijf een ECHT inhoudelijk antwoord op de vraag van de afzender; niet alleen de sjabloon overschrijven.
Beantwoord de specifieke vraag van de afzender inhoudelijk. Ga in op wat er gevraagd wordt.
Vervang [NAAM] en {{naam}} door de naam van de afzender als die bekend is, anders laat weg.
Schrijf in taal: ${language}. Sjabloon (stijlgids): ${templateText}`;
    try {
      suggestedReply = await callClaude(adapterPrompt, {
        model: "haiku",
        maxTokens: 200,
        taskName: "email-template-adapt",
      });
      usedTemplate = true;
    } catch (e) {
      console.error("[email-processor] Fout (template adapt):", e instanceof Error ? e.message : e);
      suggestedReply = templateText;
      usedTemplate = true;
    }
  } else {
    try {
      suggestedReply = await callClaude(
        EMAIL_REPLY_PROMPT(emailBody, category, language),
        {
          model: "haiku",
          maxTokens: 350,
          taskName: "email-reply",
        }
      );
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Reply generation failed";
      console.error("[email-processor] Fout:", errMsg);
      return NextResponse.json(
        { error: errMsg },
        { status: 500 }
      );
    }
  }

  const vanNaam = (email.van_naam ?? "").toString().trim();
  suggestedReply = suggestedReply
    .replace(/\[NAAM\]/g, vanNaam)
    .replace(/\{\{naam\}\}/gi, vanNaam);

  const { error: updateError } = await admin
    .from("incoming_emails")
    .update({
      ai_category: category,
      ai_urgency: urgency,
      ai_language: language,
      ai_suggested_reply: suggestedReply,
      ai_used_template: usedTemplate,
      ai_categorie: category,
      taal: language,
      ai_gegenereerd_antwoord: suggestedReply,
      ai_dier_naam: aiDierNaam,
    })
    .eq("id", emailId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  const vanEmail = (email.van_email ?? "").toString().trim();
  if (vanEmail) {
    const replySubject = "Re: " + (subject || "Your message");
    const bodyHtml =
      suggestedReply.includes("<") && suggestedReply.includes(">")
        ? suggestedReply
        : escapeHtml(suggestedReply).replace(/\n/g, "<br>\n");
    const footnoteText = getFootnote(language);
    const footnoteHtml = escapeHtml(footnoteText).replace(/\n/g, "<br>\n");
    const html = buildAutoReplyStyleHtml(bodyHtml, footnoteHtml, language);
    console.log("Sending email to:", vanEmail);
    const result = await sendMail({
      to: vanEmail,
      subject: replySubject,
      text: suggestedReply.replace(/<[^>]+>/g, "").trim() + "\n\n" + footnoteText,
      html,
      replyTo: process.env.RESEND_FROM_EMAIL,
    });
    console.log("sendMail result:", JSON.stringify(result));
    if (result.success) {
      const { error: updateErr } = await admin
        .from("incoming_emails")
        .update({
          status: "verstuurd",
          beantwoord_op: new Date().toISOString(),
          ai_processed_at: new Date().toISOString(),
          ai_automatisch_verstuurd: true,
          verwerkt_op: new Date().toISOString(),
        } as Record<string, unknown>)
        .eq("id", emailId);
      if (updateErr) {
        console.error("[email-processor] Fout: status update mislukt:", updateErr.message);
      }
      try {
        await admin.from("ai_usage_log").insert({
        model: "resend",
        input_tokens: 0,
        output_tokens: 0,
        task: "email-sent",
        estimated_cost_usd: null,
      });
      } catch (logErr) {
        console.error("[email-processor] ai_usage_log insert failed:", logErr);
      }
    } else {
      console.error("[email-processor] Fout: sendMail failed:", result.error);
      try {
        await admin.from("ai_usage_log").insert({
        model: "resend",
        input_tokens: 0,
        output_tokens: 0,
        task: "email-send-failed",
        estimated_cost_usd: null,
      });
      } catch (logErr) {
        console.error("[email-processor] ai_usage_log insert failed:", logErr);
      }
    }
  }

  return NextResponse.json({
    success: true,
    emailId,
    category,
    urgency,
    language,
    usedTemplate,
  });
}
