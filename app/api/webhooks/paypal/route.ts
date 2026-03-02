import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";
import { verifyPayPalWebhookSignature } from "@/lib/paypal";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@savedsouls-foundation.org";

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const headers = {
    "paypal-transmission-id": request.headers.get("paypal-transmission-id"),
    "paypal-transmission-time": request.headers.get("paypal-transmission-time"),
    "paypal-transmission-sig": request.headers.get("paypal-transmission-sig"),
    "paypal-auth-algo": request.headers.get("paypal-auth-algo"),
    "paypal-cert-url": request.headers.get("paypal-cert-url"),
  };
  const valid = await verifyPayPalWebhookSignature(rawBody, headers);
  if (!valid) {
    console.error("[webhooks/paypal] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  let event: PayPalWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PayPalWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const eventType = event.event_type;
  const resource = event.resource ?? {};
  const supabase = createAdminClient();

  if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
    const amount = resource.amount as { value?: string; currency_code?: string } | undefined;
    const value = amount?.value ? parseFloat(amount.value) : 0;
    const currency = (amount?.currency_code as string) ?? "EUR";
    const captureId = (resource.id as string) ?? "";
    const payer = resource.payer as { email_address?: string; name?: { given_name?: string; surname?: string } } | undefined;
    const payerEmail = payer?.email_address ?? "";
    const givenName = payer?.name?.given_name ?? "";
    const surname = payer?.name?.surname ?? "";
    if (!payerEmail || value <= 0) return NextResponse.json({ received: true });
    let { data: donor } = await supabase.from("donors").select("id").eq("email", payerEmail).maybeSingle();
    if (!donor) {
      const { data: inserted } = await supabase.from("donors").insert({
        email: payerEmail,
        voornaam: givenName || null,
        achternaam: surname || null,
        type: "persoon",
      }).select("id").single();
      donor = inserted;
    }
    const donorId = donor?.id ?? null;
    const now = new Date().toISOString();
    await supabase.from("donations").insert({
      donor_id: donorId,
      bedrag: value,
      valuta: currency,
      methode: "paypal",
      status: "voltooid",
      donatie_datum: now,
      betalingskenmerk: captureId,
    });
    return NextResponse.json({ received: true });
  }

  if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const subscriptionId = (resource.id as string) ?? "";
    const subscriber = resource.subscriber as { email_address?: string; name?: { given_name?: string; surname?: string } } | undefined;
    const email = subscriber?.email_address ?? "";
    const givenName = subscriber?.name?.given_name ?? "";
    const surname = subscriber?.name?.surname ?? "";
    const plan = resource.plan as { billing_cycles?: Array<{ tenure_type?: string; pricing_scheme?: { fixed_price?: { value?: string; currency_code?: string } } }> } | undefined;
    const firstCycle = plan?.billing_cycles?.[0];
    const amountStr = firstCycle?.pricing_scheme?.fixed_price?.value ?? "0";
    const amount = parseFloat(amountStr) || 0;
    const currency = (firstCycle?.pricing_scheme?.fixed_price?.currency_code as string) ?? "EUR";
    if (!email || !subscriptionId) return NextResponse.json({ received: true });
    let { data: donor } = await supabase.from("donors").select("id").eq("email", email).maybeSingle();
    if (!donor) {
      const { data: inserted } = await supabase.from("donors").insert({
        email,
        voornaam: givenName || null,
        achternaam: surname || null,
        type: "persoon",
      }).select("id").single();
      donor = inserted;
    }
    if (!donor?.id) return NextResponse.json({ received: true });
    const now = new Date().toISOString().slice(0, 10);
    await supabase.from("recurring_donations").insert({
      donor_id: donor.id,
      bedrag: amount,
      valuta: currency,
      frequentie: "maandelijks",
      provider_subscription_id: subscriptionId,
      status: "actief",
      start_datum: now,
      methode: "paypal",
    });
    return NextResponse.json({ received: true });
  }

  if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subscriptionId = (resource.id as string) ?? "";
    const { data: rec } = await supabase.from("recurring_donations").select("id, donor_id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const now = new Date().toISOString().slice(0, 10);
    await supabase.from("recurring_donations").update({ status: "gestopt", eind_datum: now }).eq("id", rec.id);
    const { data: donor } = await supabase.from("donors").select("voornaam, achternaam").eq("id", rec.donor_id).single();
    const name = donor ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ") : "Unknown";
    await sendMail({
      to: ADMIN_EMAIL,
      subject: "PayPal recurring donation stopped",
      text: `Subscription ${subscriptionId} (donor: ${name}) has been cancelled.`,
    });
    return NextResponse.json({ received: true });
  }

  if (eventType === "PAYMENT.SALE.COMPLETED") {
    const billingAgreementId = (resource.billing_agreement_id as string) ?? (resource.custom as string) ?? "";
    const saleId = (resource.id as string) ?? "";
    const amount = resource.amount as { total?: string; currency?: string } | undefined;
    const total = amount?.total ? parseFloat(amount.total) : 0;
    const { data: rec } = await supabase.from("recurring_donations").select("id, donor_id").eq("provider_subscription_id", billingAgreementId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nowStr = now.toISOString().slice(0, 10);
    const nextStr = nextMonth.toISOString().slice(0, 10);
    await supabase.from("recurring_donations").update({
      laatste_betaling_datum: nowStr,
      volgende_betaling_datum: nextStr,
    }).eq("id", rec.id);
    await supabase.from("donations").insert({
      donor_id: (rec as { donor_id: string }).donor_id,
      bedrag: total,
      valuta: (amount?.currency as string) ?? "EUR",
      methode: "paypal",
      status: "voltooid",
      donatie_datum: now.toISOString(),
      betalingskenmerk: saleId,
    });
    return NextResponse.json({ received: true });
  }

  if (eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED") {
    const subscriptionId = (resource.id as string) ?? (resource.billing_agreement_id as string) ?? "";
    if (!subscriptionId) return NextResponse.json({ received: true });
    const { data: rec } = await supabase.from("recurring_donations").select("id, mislukte_betalingen, donor_id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const fails = ((rec as { mislukte_betalingen: number }).mislukte_betalingen ?? 0) + 1;
    const newStatus = fails >= 3 ? "betalingsprobleem" : "actief";
    await supabase.from("recurring_donations").update({ mislukte_betalingen: fails, status: newStatus }).eq("id", rec.id);
    if (newStatus === "betalingsprobleem") {
      const { data: donor } = await supabase.from("donors").select("voornaam, achternaam").eq("id", rec.donor_id).single();
      const name = donor ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ") : "Unknown";
      await sendMail({
        to: ADMIN_EMAIL,
        subject: "PayPal recurring donation: payment failed",
        text: `Subscription ${subscriptionId} (donor: ${name}) has failed ${fails} time(s). Status set to betalingsprobleem.`,
      });
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
