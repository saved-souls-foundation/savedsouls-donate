import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";
import { EMAIL_CLASSIFY_PROMPT, EMAIL_REPLY_PROMPT } from "@/lib/ai/prompts";

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

  const admin = createAdminClient();
  const { data: email, error: fetchError } = await admin
    .from("incoming_emails")
    .select("id, onderwerp, inhoud, van_naam, van_email")
    .eq("id", emailId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }
  if (!email) {
    return NextResponse.json(
      { error: "Email not found" },
      { status: 404 }
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
    console.error("[email-processor] classify error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Classify failed" },
      { status: 500 }
    );
  }

  const { category, urgency, language } = parseClassifyResponse(classifyRaw);

  let suggestedReply: string;
  let usedTemplate = false;

  const { data: templates } = await admin
    .from("email_templates")
    .select("id, naam, categorie, inhoud_nl, inhoud_en, inhoud_es, inhoud_ru, inhoud_th, inhoud_de, inhoud_fr")
    .eq("categorie", category)
    .eq("actief", true)
    .limit(1);

  const templateRow = templates?.[0] as Record<string, unknown> | undefined;
  const templateText = templateRow ? getTemplateText(templateRow, language) : null;

  if (templateText) {
    const adapterPrompt = `Pas deze sjabloontekst aan voor deze specifieke email.
Vul [NAAM] in als je de naam kent uit de email, anders laat weg.
Vertaal naar ${language} als de sjabloon niet in die taal is.
Wijzig verder NIETS aan de inhoud. Sjabloon: ${templateText}`;
    try {
      suggestedReply = await callClaude(adapterPrompt, {
        model: "haiku",
        maxTokens: 200,
        taskName: "email-template-adapt",
      });
      usedTemplate = true;
    } catch (e) {
      console.error("[email-processor] template adapt error:", e);
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
      console.error("[email-processor] reply error:", e);
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Reply generation failed" },
        { status: 500 }
      );
    }
  }

  const { error: updateError } = await admin
    .from("incoming_emails")
    .update({
      ai_category: category,
      ai_urgency: urgency,
      ai_language: language,
      ai_suggested_reply: suggestedReply,
      ai_used_template: usedTemplate,
      ai_processed_at: new Date().toISOString(),
    })
    .eq("id", emailId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
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
