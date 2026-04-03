import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 500;
const MAX_ANIMALS = 100;

type AnimalInput = {
  id: string;
  name?: string | null;
  story?: string | null;
  character?: string | null;
};

type MatchItem = { id: string; reason: string };

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const { animals = [], query = "", locale = "", turnstileToken } = b;

    const q = typeof query === "string" ? query.trim() : "";
    if (!q || q.length > MAX_QUERY_LENGTH) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const skipTurnstile = !turnstileToken?.trim();
    if (!skipTurnstile) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Security check failed" },
          { status: 403 }
        );
      }
    }

    const list = Array.isArray(animals) ? animals.slice(0, MAX_ANIMALS) : [];
    if (list.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ matches: [] });
    }

    const animalsText = list
      .map((a: AnimalInput) => {
        const id = a?.id ?? "";
        const name = a?.name ?? "";
        const story = a?.story ?? "";
        const char = a?.character ?? "";
        return `id: ${id}\nname: ${name}\nstory: ${story}${char ? `\ncharacter: ${char}` : ""}`;
      })
      .join("\n---\n");

    const userMessage = `Query: ${q}\n\nAnimals:\n${animalsText}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
        max_tokens: 400,
        system: `You are an adoption assistant for an animal rescue sanctuary in Khon Kaen, Thailand.
Each request includes a user line "Query: ..." and a list of animals (id, name, story). Read THAT query literally: note temperament (e.g. calm/rustig vs playful/speels), age cues (puppy, senior, oud), energy, and any other words. Compare each animal's story (and name if relevant) to those cues.
Rank by fit to THIS query only: best matches first. Different queries must yield different orderings and usually different id lists when stories differ—never output the same generic shortlist for every query. Omit animals with no clear link to the query.
Return ONLY valid JSON, nothing else.
Format: {"matches": [{"id": "...", "reason": "..."}]}
Maximum 8 matches. Use each id exactly as provided. Reasons in the same language as the query; briefly tie each reason to wording from that animal's story.`,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ matches: [] });
    }

    const data = (await res.json()) as { content?: { type: string; text: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as { matches?: MatchItem[] };
    const matches = Array.isArray(parsed.matches) ? parsed.matches.slice(0, 8) : [];

    return NextResponse.json({
      matches: matches.filter((m) => m && typeof m.id === "string" && typeof m.reason === "string"),
    });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}
