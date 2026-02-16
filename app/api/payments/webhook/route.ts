import { NextRequest, NextResponse } from "next/server";
import createMollieClient from "@mollie/api-client";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return new NextResponse("Not configured", { status: 503 });
    }

    // Mollie sends application/x-www-form-urlencoded with id=tr_xxx
    const contentType = req.headers.get("content-type") || "";
    let paymentId: string | null = null;
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      paymentId = new URLSearchParams(text).get("id");
    } else {
      const body = await req.json();
      paymentId = body?.id ?? null;
    }
    if (!paymentId) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const mollieClient = createMollieClient({ apiKey });
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === "paid") {
      // Optional: log to your database, send confirmation email, etc.
      // For now we rely on Mollie dashboard for tracking
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Mollie webhook error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
