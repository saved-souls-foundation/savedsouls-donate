import { NextResponse } from "next/server";
import { fetchAnimalsFromApi } from "@/lib/animals-api";

/** Zelfde payload als vroeger /api/animals — alleen voor adopt detailpagina's (story, images). */
export const revalidate = 60;

const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=120";

export async function GET() {
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
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
