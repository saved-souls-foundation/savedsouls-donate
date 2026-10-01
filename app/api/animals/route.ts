import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  ANIMALS_CACHE_TAG,
  ANIMALS_REVALIDATE_SECONDS,
  fetchAnimalsFromApi,
  toSlimAnimalRecord,
} from "@/lib/animals-api";

export const revalidate = ANIMALS_REVALIDATE_SECONDS;

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=7200";

const getCachedAnimals = unstable_cache(
  fetchAnimalsFromApi,
  ["api-animals"],
  { revalidate: ANIMALS_REVALIDATE_SECONDS, tags: [ANIMALS_CACHE_TAG] }
);

export async function GET() {
  try {
    const { dogs, cats } = await getCachedAnimals();
    const slimDogs = dogs.map(toSlimAnimalRecord);
    const slimCats = cats.map(toSlimAnimalRecord);
    return NextResponse.json(
      { dogs: slimDogs, cats: slimCats, all: [...slimDogs, ...slimCats] },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch (e) {
    console.error("Animals API error:", e);
    return NextResponse.json(
      { error: "Failed to load animals from database" },
      { status: 502 }
    );
  }
}
