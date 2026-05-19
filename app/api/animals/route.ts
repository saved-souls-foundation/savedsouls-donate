import { NextResponse } from "next/server";
import { fetchAnimalsFromApi, toSlimAnimalRecord } from "@/lib/animals-api";

export const revalidate = 3600;

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=7200";

export async function GET() {
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
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
