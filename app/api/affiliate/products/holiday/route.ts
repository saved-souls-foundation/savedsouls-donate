import { readFileSync } from "fs";
import { resolve } from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const path = resolve(process.cwd(), "lib/affiliate-holiday-products.json");
    const data = readFileSync(path, "utf-8");
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (e) {
    console.error("Affiliate holiday API:", e);
    return NextResponse.json([], { status: 200 });
  }
}
