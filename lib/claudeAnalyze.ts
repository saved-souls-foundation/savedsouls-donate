/**
 * Call Anthropic Messages API for email analysis.
 * Requires ANTHROPIC_API_KEY. Model: claude-sonnet-4-6 or env ANTHROPIC_MODEL.
 */

const DEFAULT_MODEL = "claude-sonnet-4-6";

export type AnalyzeResult = {
  taal: string;
  categorie: string;
  template_id: string | null;
  confidence: number;
  personalisatie: { naam: string | null; dier: string | null };
};

export async function analyzeIncomingEmail(
  van_naam: string | null,
  van_email: string | null,
  onderwerp: string | null,
  inhoud: string | null,
  templatesList: { id: string; naam: string | null; categorie: string | null }[]
): Promise<AnalyzeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const templatesText = templatesList
    .map((t) => `- ${t.id} | ${t.naam ?? ""} | ${t.categorie ?? ""}`)
    .join("\n");

  const userPrompt = `Analyze this incoming email:
From: ${van_naam ?? ""} <${van_email ?? ""}>
Subject: ${onderwerp ?? ""}
Body:
${inhoud ?? ""}

Available templates:
${templatesText}

Respond with valid JSON only (no markdown, no code block):
{
  "taal": "nl|en|es|ru|th|de|fr",
  "categorie": "adoptie|vrijwilliger|donatie|sponsor|algemeen",
  "template_id": "uuid or null",
  "confidence": 0.0-1.0,
  "personalisatie": {
    "naam": "sender first name or null",
    "dier": "mentioned animal name or null"
  }
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { content: { type: string; text: string }[] };
  const text = data.content?.find((c) => c.type === "text")?.text ?? "";
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const parsed = JSON.parse(cleaned) as AnalyzeResult;
  if (typeof parsed.confidence !== "number") parsed.confidence = 0;
  if (!parsed.personalisatie) parsed.personalisatie = { naam: null, dier: null };
  return parsed;
}
