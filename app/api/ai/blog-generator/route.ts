import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";
import { fetchAnimalsFromApi, type AnimalRecord } from "@/lib/animals-api";

const SPOTLIGHT_PROMPT = (dier: {
  naam: string;
  soort: string;
  ras: string | null;
  leeftijd: string | null;
  beschrijving: string | null;
  medisch_urgent: boolean;
  aangemeld_op: string | null;
  created_at: string | null;
}) => {
  const aankomstdatum = dier.aangemeld_op ?? dier.created_at ?? "onbekend";
  const datumStr =
    aankomstdatum !== "onbekend"
      ? new Date(aankomstdatum).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "onbekend";
  const medisch = dier.medisch_urgent ? "Heeft medische aandacht nodig." : "Geen bijzondere medische notities.";
  return `Schrijf een warm, emotioneel blog-spotlight van 200-250 woorden voor ${dier.naam ?? "dit dier"}.

Info over dit dier:
- Soort: ${dier.soort ?? "onbekend"}, Ras: ${dier.ras ?? "onbekend"}
- Leeftijd: ${dier.leeftijd ?? "onbekend"}
- Verhaal: ${dier.beschrijving ?? "Geen beschrijving."}
- Gezondheid: ${medisch}
- Bij ons sinds: ${datumStr}

Structuur:
1. Pakkende openingszin met de naam van het dier
2. Hoe gevonden/gered + persoonlijkheid
3. Wat dit dier bijzonder maakt
4. Warme call-to-action voor adoptie

Schrijf in het Nederlands. Warm en persoonlijk. Geen clichés.
Geen titels of headers in de tekst zelf.`;
};

function toSpotlightDier(animal: AnimalRecord): {
  animal: AnimalRecord;
  naam: string;
  soort: string;
  ras: string | null;
  leeftijd: string | null;
  beschrijving: string | null;
  medisch_urgent: boolean;
  aangemeld_op: string | null;
  created_at: string | null;
} {
  const soort = animal.type === "dog" ? "hond" : "kat";
  return {
    animal,
    naam: animal.name ?? "Onbekend",
    soort,
    ras: null,
    leeftijd: animal.age ?? null,
    beschrijving: animal.story ?? null,
    medisch_urgent: false,
    aangemeld_op: null,
    created_at: null,
  };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { dogs, cats } = await fetchAnimalsFromApi();
  const { data: logRows } = await admin.from("spotlight_log").select("animal_id, animal_type");
  const spotted = new Set<string>();
  (logRows ?? []).forEach((r: { animal_id: string; animal_type: string }) => spotted.add(`${r.animal_type}:${r.animal_id}`));

  const pickOne = <T extends AnimalRecord>(list: T[], type: "dog" | "cat"): T | null => {
    const notSpotted = list.filter((a) => !spotted.has(`${type}:${a.id}`));
    return notSpotted[0] ?? null;
  };

  let hond = pickOne(dogs, "dog");
  let kat = pickOne(cats, "cat");

  if (!hond && dogs.length > 0) {
    await admin.from("spotlight_log").delete().eq("animal_type", "dog");
    hond = dogs[0];
  }
  if (!kat && cats.length > 0) {
    await admin.from("spotlight_log").delete().eq("animal_type", "cat");
    kat = cats[0];
  }

  const toProcess: AnimalRecord[] = [];
  if (hond) toProcess.push(hond);
  if (kat) toProcess.push(kat);

  const results: { animal_id: string; title: string; post_id?: string }[] = [];

  for (const animal of toProcess) {
    const dier = toSpotlightDier(animal);
    const prompt = SPOTLIGHT_PROMPT({
      naam: dier.naam,
      soort: dier.soort,
      ras: dier.ras,
      leeftijd: dier.leeftijd,
      beschrijving: dier.beschrijving,
      medisch_urgent: dier.medisch_urgent,
      aangemeld_op: dier.aangemeld_op,
      created_at: dier.created_at,
    });

    let content: string;
    try {
      content = await callClaude(prompt, {
        model: "haiku",
        maxTokens: 450,
        taskName: "blog-spotlight",
      });
    } catch (e) {
      console.error("[blog-generator] Claude error:", e);
      results.push({ animal_id: animal.id, title: `Spotlight: ${animal.name ?? animal.id}` });
      continue;
    }

    const title = `Spotlight: ${animal.name ?? "Dier"} – Saved Souls Foundation`;

    const insertData = {
      titel: title,
      inhoud: content,
      status: "concept",
      category: "spotlight",
      source: "manual",
      animal_id: animal.id,
      type: "spotlight",
      hero_image: animal.image ?? null,
    };
    console.log("[blog-generator] posts insert data:", insertData);

    const { data: post, error: insertErr } = await admin
      .from("posts")
      .insert(insertData)
      .select("id")
      .single();

    if (insertErr) {
      console.error("[blog-generator] posts insert error:", insertErr);
      results.push({ animal_id: animal.id, title });
      continue;
    }

    console.log("[blog-generator] posts insert success:", post);

    await admin.from("spotlight_log").insert({
      animal_id: animal.id,
      animal_type: animal.type,
    });

    results.push({
      animal_id: animal.id,
      title,
      post_id: (post as { id: string })?.id,
    });
  }

  return NextResponse.json({ generated: results.length, results });
}
