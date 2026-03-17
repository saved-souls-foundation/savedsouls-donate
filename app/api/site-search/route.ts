import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { SEARCH_INDEX } from "@/lib/search-index";

const MAX_QUERY_LENGTH = 500;

type SiteSearchResult = { path: string; reason: string };

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const { query = "", locale = "en", turnstileToken } = b;

    const q = typeof query === "string" ? query.trim() : "";
    if (!q || q.length > MAX_QUERY_LENGTH) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const skipTurnstile =
      process.env.NODE_ENV === "development" && !turnstileToken?.trim();
    if (!skipTurnstile) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Security check failed" },
          { status: 403 }
        );
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ results: [] });
    }

    const context = SEARCH_INDEX.map(
      (page) =>
        `${page.path}: ${page.title[locale as keyof typeof page.title] ?? page.title.en} — ${page.description[locale as keyof typeof page.description] ?? page.description.en}`
    ).join("\n");

    const userMessage = `Query: ${q}\n\nPages:\n${context}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
        max_tokens: 300,
        system: `You are a site search assistant for Saved Souls Foundation website about animal rescue in Thailand. Based on the user query, return the most relevant pages as JSON.
Return ONLY valid JSON, nothing else.
Format: {"results": [{"path": "...", "reason": "..."}]}
Maximum 5 results. Reason max 8 words. Reason in the same language as the query.`,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = (await res.json()) as { content?: { type: string; text: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as { results?: SiteSearchResult[] };
    const results = Array.isArray(parsed.results) ? parsed.results.slice(0, 5) : [];

    return NextResponse.json({
      results: results.filter(
        (r) => r && typeof r.path === "string" && typeof r.reason === "string"
      ),
    });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
