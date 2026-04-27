import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, getMollieClient } from "@/lib/mollie";
import { z } from "zod";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;
const ALLOWED_LOCALES = ["nl", "en", "de", "es", "fr", "ru", "th"] as const;

const DonateSchema = z.object({
  amount: z.number().min(MIN_AMOUNT).max(MAX_AMOUNT),
  locale: z.enum(ALLOWED_LOCALES).default("nl"),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsedBody = DonateSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Minimale donatie is EUR 1,00" }, { status: 400 });
    }
    const body = parsedBody.data;
    const amount = body.amount;
    const locale = ALLOWED_LOCALES.includes(body.locale) ? body.locale : "nl";

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
    console.error("[mollie]", error);
    return NextResponse.json({ error: "Betaling kon niet worden gestart" }, { status: 500 });
  }
}
