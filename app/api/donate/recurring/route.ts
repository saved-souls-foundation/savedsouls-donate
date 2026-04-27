import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, getMollieClient } from "@/lib/mollie";
import type { SequenceType } from "@mollie/api-client";
import { z } from "zod";

type RecurringDonateBody = {
  amount?: number;
  locale?: string;
  name?: string;
  email?: string;
};

const DESCRIPTION = "Maandelijkse donatie Saved Souls Foundation";
const ALLOWED_LOCALES = ["nl", "en", "de", "es", "fr", "ru", "th"] as const;
const MAX_AMOUNT = 10000;

const RecurringSchema = z.object({
  amount: z.number().min(1).max(MAX_AMOUNT),
  locale: z.enum(ALLOWED_LOCALES).default("nl"),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

function normalizeAmount(value: number): string {
  return value.toFixed(2);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as RecurringDonateBody;
    const parsedBody = RecurringSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Ongeldige invoer voor maandelijkse donatie." },
        { status: 400 }
      );
    }
    const body = parsedBody.data;
    const localeCandidate = body.locale;
    const locale = ALLOWED_LOCALES.includes(localeCandidate) ? localeCandidate : "nl";
    const amountValue = normalizeAmount(body.amount);
    const name =
      typeof body.name === "string" && body.name.trim() !== ""
        ? body.name.trim()
        : "Saved Souls Donateur";
    const email =
      typeof body.email === "string" && body.email.trim() !== ""
        ? body.email.trim()
        : "donateur@savedsouls-foundation.org";
    const baseUrl = getBaseUrl();
    const redirectUrl = `${baseUrl}/${locale}/bedankt`;
    const webhookUrl = `${baseUrl}/api/webhook/mollie`;
    const mollie = getMollieClient();

    const customer = await mollie.customers.create({
      name,
      email,
      metadata: {
        locale,
      },
    });

    const payment = await mollie.payments.create({
      customerId: customer.id,
      sequenceType: "first" as SequenceType,
      amount: {
        currency: "EUR",
        value: amountValue,
      },
      description: DESCRIPTION,
      redirectUrl,
      webhookUrl,
      metadata: {
        type: "recurring-first-payment",
        locale,
        recurringAmount: amountValue,
        customerId: customer.id,
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      throw new Error("Geen checkout URL ontvangen van Mollie.");
    }

    return NextResponse.json({
      checkoutUrl,
    });
  } catch (error) {
    console.error("[donate/recurring] create recurring flow failed:", error);
    return NextResponse.json(
      { error: "Maandelijkse donatie starten mislukt. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
