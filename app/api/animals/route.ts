import { NextResponse } from "next/server";
import { fetchAnimalsFromApi } from "@/lib/animals-api";

export async function GET() {
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
    return NextResponse.json({ dogs, cats, all: [...dogs, ...cats] });
  } catch (e) {
    console.error("Animals API error:", e);
    return NextResponse.json(
      { error: "Failed to load animals from database" },
      { status: 502 }
    );
  }
}
