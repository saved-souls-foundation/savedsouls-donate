import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, getMollieClient } from "@/lib/mollie";

const MIN_AMOUNT = 1;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { amount?: number; locale?: string };
    const amount = Number(body.amount);
    const locale = typeof body.locale === "string" && body.locale ? body.locale : "nl";

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
      return NextResponse.json({ error: "Minimale donatie is EUR 1,00" }, { status: 400 });
    }

    const mollieClient = getMollieClient();
    const baseUrl = getBaseUrl();
    const redirectUrl = `${baseUrl}/${locale}/bedankt`;
    const webhookUrl = `${baseUrl}/api/webhook/mollie`;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: amount.toFixed(2),
      },
      description: "Donatie Saved Souls Foundation",
      redirectUrl,
      webhookUrl,
    });

    const checkoutUrl = payment._links?.checkout?.href;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Geen checkout URL ontvangen" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl });
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("[mollie] ERROR:", msg);
  return NextResponse.json(
    { error: msg },
    { status: 500 }
  );
}
}
