import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  let body: { amount?: number; currency?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const amount = Number(body.amount);
  const currency = (body.currency as string) ?? "EUR";
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  const orderId = await createPayPalOrder(amount, currency);
  if (!orderId) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
  return NextResponse.json({ orderId });
}
