import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { fetchAnimalsFromApi, type AnimalRecord } from "@/lib/animals-api";
import {
  getISOWeekNumber,
  getSpotlightDogIndex,
  getSpotlightCatIndex,
} from "@/lib/spotlight";

const SPOTLIGHT_CACHE_CONTROL =
  "public, s-maxage=3600, stale-while-revalidate=86400";

function toSpotlightAnimal(a: AnimalRecord | null, type: "dog" | "cat") {
  if (!a) return null;
  return {
    id: a.id,
    name: a.name,
    thaiName: a.thaiName,
    type,
    image: a.image,
    description: (a.story || "").trim().slice(0, 280) || undefined,
  };
}

export async function GET() {
  const week = getISOWeekNumber();
  try {
    const getCached = unstable_cache(
      async () => {
        const { dogs, cats } = await fetchAnimalsFromApi();
        const dogIndex = getSpotlightDogIndex(week, dogs.length);
        const catIndex = getSpotlightCatIndex(week, cats.length);
        const dog = dogs.length > 0 ? dogs[dogIndex] : null;
        const cat = cats.length > 0 ? cats[catIndex] : null;
        return {
          week,
          dog: toSpotlightAnimal(dog, "dog"),
          cat: toSpotlightAnimal(cat, "cat"),
        };
      },
      ["spotlight-animals", String(week)],
      { revalidate: 3600 }
    );
    return NextResponse.json(await getCached(), {
      headers: { "Cache-Control": SPOTLIGHT_CACHE_CONTROL },
    });
  } catch (e) {
    console.error("Spotlight API error:", e);
    return NextResponse.json(
      { error: "Failed to load spotlight animals", week, dog: null, cat: null },
      { status: 502 }
    );
  }
}
