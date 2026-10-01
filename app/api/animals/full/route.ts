import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  ANIMALS_CACHE_TAG,
  ANIMALS_REVALIDATE_SECONDS,
  fetchAnimalsFromApi,
} from "@/lib/animals-api";

/** Zelfde payload als vroeger /api/animals — alleen voor adopt detailpagina's (story, images). */
export const revalidate = 3600;

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=7200";

const getCachedAnimals = unstable_cache(
  fetchAnimalsFromApi,
  ["api-animals-full"],
  { revalidate: ANIMALS_REVALIDATE_SECONDS, tags: [ANIMALS_CACHE_TAG] }
);

export async function GET() {
  try {
    const { dogs, cats } = await getCachedAnimals();
    return NextResponse.json(
      { dogs, cats, all: [...dogs, ...cats] },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch (e) {
    console.error("Animals full API error:", e);
    return NextResponse.json(
      { error: "Failed to load animals from database" },
      { status: 502 }
    );
  }
}
