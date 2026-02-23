import { NextResponse } from "next/server";
import { fetchSponsorAnimalsFromApi } from "@/lib/sponsor-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { dogs, cats } = await fetchSponsorAnimalsFromApi();
    return NextResponse.json({ dogs, cats });
  } catch (e) {
    console.error("Sponsor animals API error:", e);
    return NextResponse.json(
      { error: "Failed to load sponsor animals" },
      { status: 502 }
    );
  }
}
