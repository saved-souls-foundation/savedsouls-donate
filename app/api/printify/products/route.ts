import { NextResponse } from "next/server";
import { fetchPrintifyProducts } from "@/lib/printify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await fetchPrintifyProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error("[printify/products] GET error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
