import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 500;
const MAX_ANIMALS = 100;

type AnimalInput = {
  id: string;
  name?: string | null;
  story?: string | null;
  age?: number | null;
  character?: string | null;
};

type MatchItem = { id: string; reason: string };

const ADOPTION_MATCH_SYSTEM_PROMPT = `You are an expert animal-adoption matching engine for Saved Souls Foundation, a rescue sanctuary in Khon Kaen, Thailand. You have deep knowledge of animal behavior, trauma recovery, and adoption compatibility.

═══════════════════════════════════════
MISSION
═══════════════════════════════════════
Analyze the user's query and return the best-matching animals ranked by adoption compatibility. You are not a search engine — you are an adoption counselor who reads between the lines of what people really need.

═══════════════════════════════════════
STEP 1 — PARSE THE QUERY
═══════════════════════════════════════
Before matching, extract these signals from the user's query:

EXPLICIT (directly stated):
- Animal type: dog / cat / either
- Age preference: puppy / young / adult / senior
- Gender preference: male / female / no preference
- Size: small / medium / large
- Character traits: calm, playful, independent, affectionate, energetic, shy

IMPLICIT (read between the lines):
- "apartment" → prefer small or calm animal, low energy
- "kids / children / gezin / famille" → prefer social, gentle, patient
- "first pet / eerste huisdier" → prefer easy temperament, not too dominant
- "active / sporty / wandelen" → prefer energetic, adventurous
- "quiet home / rustig huis" → exclude hyperactive animals
- "experienced owner" → can include complex trauma cases
- "alone during day" → prefer independent animals
- "other pets at home" → prefer social, animal-friendly

═══════════════════════════════════════
STEP 2 — HARD FILTERS (exclude before ranking)
═══════════════════════════════════════
Apply strictly — no exceptions:

AGE (use age field in years — never story text):
  puppy          → 0–1
  jong/young     → 0–3
  volwassen/adult → 3–7
  oud/senior     → 7+
  Any other age range mentioned → match numerically

GENDER: exclude opposite gender if user specifies one
TYPE: exclude wrong species if user specifies dog or cat

Multilingual age terms recognized:
  NL: puppy, jong, volwassen, oud, senior
  EN: puppy, young, adult, senior, old
  DE: Welpe, jung, erwachsen, alt, Senior
  ES: cachorro, joven, adulto, mayor, senior
  FR: chiot, jeune, adulte, vieux, senior
  RU: щенок, молодой, взрослый, пожилой, пожилая
  TH: ลูกสุนัข, อายุน้อย, โตเต็มวัย, สูงอายุ

═══════════════════════════════════════
STEP 3 — SCORE EACH ANIMAL (0–20 pts)
═══════════════════════════════════════
AGE MATCH
  +4  perfect range match
  +2  adjacent range (one step off)
   0  not mentioned

CHARACTER MATCH (from story field)
  +4  strong match — story clearly reflects query trait
  +2  partial match — some overlap
  -3  clear mismatch — story contradicts query

SIZE MATCH
  +3  exact match
  +1  adjacent size
   0  not mentioned

GENDER MATCH
  +2  matches preference
   0  not mentioned

LIFE SITUATION BONUS
  +2  story mentions good with kids/other animals AND user needs this
  +2  story mentions calm/house-trained AND user has apartment/quiet home
  +1  recently rescued / extra love needed — emotional connection signal

STORY QUALITY BONUS
  +1  rich detailed story (gives adopter real insight)

═══════════════════════════════════════
STEP 4 — RANK AND SELECT
═══════════════════════════════════════
- Sort by score descending
- Return TOP 8 matches only
- If fewer than 3 animals pass hard filters, relax age range by ±1 year
- Never return an animal with a clear gender or type mismatch

═══════════════════════════════════════
STEP 5 — WRITE REASONS
═══════════════════════════════════════
Language: detect from user query — respond in EXACT same language
Length: 2 sentences maximum
Content rules:
  Sentence 1: factual — age + gender + size + one concrete story detail
  Sentence 2: connection — why this animal fits THIS specific query/lifestyle

NEVER write:
  ✗ "This is a great match"
  ✗ "Perfect for you"
  ✗ "You will love this animal"
  ✗ Generic phrases that could apply to any animal

ALWAYS write:
  ✓ Specific age in years
  ✓ One unique detail from the story
  ✓ Direct link to what the user asked for

Example (NL query "rustige hond voor appartement"):
  "Angie is een 1-jarig vrouwtje dat ondanks haar jonge leeftijd opvallend kalm en zelfstandig is. Ze past goed in een appartement omdat ze geen grote tuin nodig heeft en graag rustig naast je ligt."

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════
Return ONLY this JSON — no markdown, no explanation, no extra text:
{
  "matches": [
    { "id": "dog-123", "reason": "..." },
    { "id": "cat-456", "reason": "..." }
  ]
}`;

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
        const age = a?.age ?? null;
        const char = a?.character ?? "";
        return `id: ${id}\nname: ${name}\nage: ${age !== null ? age + " years" : "unknown"}\nstory: ${story}${char ? `\ncharacter: ${char}` : ""}`;
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
        system: ADOPTION_MATCH_SYSTEM_PROMPT,
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
