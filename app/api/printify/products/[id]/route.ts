import { NextRequest, NextResponse } from "next/server";
import { fetchPrintifyProduct } from "@/lib/printify";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const product = await fetchPrintifyProduct(id.trim());
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[printify/products/[id]] GET error:", message);
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: "Failed to load product" }, { status });
  }
}
