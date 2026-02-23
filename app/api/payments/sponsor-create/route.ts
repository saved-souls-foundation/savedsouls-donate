import { NextRequest, NextResponse } from "next/server";
import createMollieClient, { PaymentMethod } from "@mollie/api-client";

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Min 300 THB ≈ 7.5 EUR, max 50000 EUR */
const MIN_EUR = 1;
const MAX_EUR = 50000;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment system not configured. Please use PayPal or bank transfer." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const locale = String(body.locale || "en").slice(0, 2);
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const message = typeof body.message === "string" ? body.message.slice(0, 500) : undefined;
    const animalId = String(body.animalId || "");
    const animalName = String(body.animalName || "").slice(0, 100);
    const animalType = String(body.animalType || "dog").toLowerCase();
    const amountThb = Number(body.amountThb) || 300;
    const method = body.method === "paypal" ? PaymentMethod.paypal : undefined;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const useThb = method === PaymentMethod.paypal;
    let amountValue: string;
    let currency: string;

    if (useThb) {
      const thb = Math.max(100, Math.round(amountThb));
      amountValue = thb.toFixed(2);
      currency = "THB";
    } else {
      const amountCents = Math.round(amount * 100);
      if (!Number.isFinite(amountCents) || amountCents < MIN_EUR * 100 || amountCents > MAX_EUR * 100) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }
      amountValue = (amountCents / 100).toFixed(2);
      currency = "EUR";
    }

    const baseUrl = getBaseUrl(req);
    const redirectUrl = `${baseUrl}/${locale}/thank-you?payment=mollie&sponsor=1&animal=${encodeURIComponent(animalId)}`;
    const webhookUrl = `${baseUrl}/api/payments/webhook`;

    const mollieClient = createMollieClient({ apiKey });
    const payment = await mollieClient.payments.create({
      amount: {
        value: amountValue,
        currency,
      },
      method,
      description: `Sponsorship ${animalName} – Saved Souls Foundation`,
      redirectUrl,
      webhookUrl,
      metadata: {
        purpose: "sponsor",
        locale,
        animalId,
        animalName,
        animalType: animalType === "cat" ? "cat" : "dog",
        amountThb: String(amountThb),
        sponsorName: name,
        sponsorEmail: email,
        ...(message && { sponsorMessage: message }),
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl, paymentId: payment.id });
  } catch (err) {
    console.error("Sponsor payment create error:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try PayPal or bank transfer." },
      { status: 500 }
    );
  }
}
