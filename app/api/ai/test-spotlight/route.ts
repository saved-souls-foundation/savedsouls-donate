import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";
import { fetchAnimalsFromApi, type AnimalRecord } from "@/lib/animals-api";

/** Zelfde logica als in app/api/blog/route.ts */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfTodayISO = startOfToday.toISOString();

  const { count: postsTodayCount } = await admin
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("category", "spotlight")
    .eq("source", "test-24h")
    .gte("created_at", startOfTodayISO);

  const postsToday = postsTodayCount ?? 0;
  if (postsToday >= 48) {
    return NextResponse.json({
      done: true,
      message: "24h test voltooid",
    });
  }

  const { data: usedRows } = await admin
    .from("posts")
    .select("animal_id")
    .eq("source", "test-24h")
    .not("animal_id", "is", null);
  const usedAnimalIds = new Set((usedRows ?? []).map((r: { animal_id: string | null }) => r.animal_id).filter(Boolean) as string[]);

  const { dogs, cats } = await fetchAnimalsFromApi();
  const wantDog = postsToday % 2 === 0;
  const list = wantDog ? dogs : cats;
  const type: "dog" | "cat" = wantDog ? "dog" : "cat";
  const available = list.filter((a) => !usedAnimalIds.has(a.id));
  const animal: AnimalRecord | null = available[0] ?? list[0] ?? null;

  if (!animal) {
    return NextResponse.json(
      { error: "Geen beschikbaar dier voor spotlight" },
      { status: 500 }
    );
  }

  const naam = animal.name ?? "Onbekend";
  const soort = animal.type === "dog" ? "hond" : "kat";
  const leeftijd = animal.age ?? "onbekend";
  const verhaal = animal.story ?? "Geen verhaal beschikbaar.";

  const bodyPrompt = `Schrijf een aantrekkelijke adoptie spotlight van 200-250 woorden voor ${naam} (${soort}).

Dier info:
- Naam: ${naam}
- Soort: ${soort}
- Leeftijd: ${leeftijd}
- Verhaal: ${verhaal}

Structuur:
1. Pakkende titel regel (niet herhalen, alleen in de tekst)
2. Emotionele openingszin
3. Verhaal en persoonlijkheid (2-3 zinnen)
4. Wat dit dier bijzonder maakt (1-2 zinnen)
5. Warme adoptie call-to-action

Schrijf in het Nederlands. Warm, persoonlijk, geen clichés.`;

  let inhoud: string;
  try {
    inhoud = await callClaude(bodyPrompt, {
      model: "haiku",
      maxTokens: 500,
      taskName: "test-spotlight-body",
    });
  } catch (e) {
    console.error("[test-spotlight] Claude body error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Claude body failed" },
      { status: 500 }
    );
  }

  const headerPrompt = `Maak een pakkende header/titel van max 8 woorden voor een adoptie spotlight over ${naam} de ${soort}. Begin met '🐾 Adoptie Spotlight:' `;

  let titel: string;
  try {
    titel = await callClaude(headerPrompt, {
      model: "haiku",
      maxTokens: 50,
      taskName: "test-spotlight-header",
    });
    titel = titel.trim();
    if (!titel.startsWith("🐾")) titel = `🐾 Adoptie Spotlight: ${titel}`;
  } catch (e) {
    console.error("[test-spotlight] Claude header error:", e);
    titel = `🐾 Adoptie Spotlight: ${naam} – ${soort}`;
  }

  const now = new Date().toISOString();
  const slug = `spotlight-${slugify(naam)}-${Date.now()}`;

  const { data: post, error: insertErr } = await admin
    .from("posts")
    .insert({
      titel,
      inhoud,
      status: "published",
      gepubliceerd_op: now,
      category: "spotlight",
      source: "test-24h",
      animal_id: animal.id,
      type: "spotlight",
      slug,
      hero_image: animal.image ?? null,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error("[test-spotlight] posts insert error:", insertErr);
    return NextResponse.json(
      { error: insertErr.message },
      { status: 500 }
    );
  }

  const postId = (post as { id: string })?.id;
  const newCount = postsToday + 1;

  return NextResponse.json({
    success: true,
    postId,
    animalName: naam,
    titel,
    postsToday: newCount,
    remaining: 48 - newCount,
  });
}
