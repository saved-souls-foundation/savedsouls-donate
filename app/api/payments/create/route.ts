import { NextRequest, NextResponse } from "next/server";
import createMollieClient from "@mollie/api-client";

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 50000;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment system not configured. Please use PayPal." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const amountCents = Math.round(Number(body.amount) * 100);
    const locale = String(body.locale || "en").slice(0, 2);
    const message = typeof body.message === "string" ? body.message.slice(0, 280) : undefined;

    if (!Number.isFinite(amountCents) || amountCents < MIN_AMOUNT * 100 || amountCents > MAX_AMOUNT * 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(req);
    const redirectUrl = `${baseUrl}/${locale}/thank-you?payment=mollie`;
    const webhookUrl = `${baseUrl}/api/payments/webhook`;

    const mollieClient = createMollieClient({ apiKey });
    const payment = await mollieClient.payments.create({
      amount: {
        value: (amountCents / 100).toFixed(2),
        currency: "EUR",
      },
      description: `Donation to Saved Souls Foundation`,
      redirectUrl,
      webhookUrl,
      metadata: {
        purpose: "donation",
        locale,
        ...(message && { donorMessage: message }),
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl, paymentId: payment.id });
  } catch (err) {
    console.error("Mollie payment create error:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try PayPal instead." },
      { status: 500 }
    );
  }
}
