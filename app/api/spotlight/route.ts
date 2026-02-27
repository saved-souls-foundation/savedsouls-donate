import { NextResponse } from "next/server";
import { fetchAnimalsFromApi } from "@/lib/animals-api";
import {
  getISOWeekNumber,
  getSpotlightDogIndex,
  getSpotlightCatIndex,
} from "@/lib/spotlight";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 uur cache, week wisselt maar 1x per week

export async function GET() {
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
    const week = getISOWeekNumber();
    const dogIndex = getSpotlightDogIndex(week, dogs.length);
    const catIndex = getSpotlightCatIndex(week, cats.length);

    const dog = dogs.length > 0 ? dogs[dogIndex] : null;
    const cat = cats.length > 0 ? cats[catIndex] : null;

    return NextResponse.json({
      week,
      dog,
      cat,
    });
  } catch (e) {
    console.error("Spotlight API error:", e);
    return NextResponse.json(
      { error: "Failed to load spotlight animals", week: getISOWeekNumber(), dog: null, cat: null },
      { status: 502 }
    );
  }
}
