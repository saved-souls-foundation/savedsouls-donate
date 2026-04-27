import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, getMollieClient } from "@/lib/mollie";
import type { SequenceType } from "@mollie/api-client";

type RecurringDonateBody = {
  amount?: number;
  locale?: string;
  name?: string;
  email?: string;
};

const DESCRIPTION = "Maandelijkse donatie Saved Souls Foundation";
const ALLOWED_LOCALES = new Set(["nl", "en", "de", "es", "th", "ru", "fr"]);

function resolveLocale(locale: string | undefined): string {
  const normalized = (locale || "nl").toLowerCase();
  return ALLOWED_LOCALES.has(normalized) ? normalized : "nl";
}

function normalizeAmount(value: number | undefined): string {
  const parsed = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "10.00";
  }
  return parsed.toFixed(2);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RecurringDonateBody;
    const locale = resolveLocale(body.locale);
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
