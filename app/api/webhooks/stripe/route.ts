import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@savedsouls-foundation.org";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

async function notifyAdminRecurringStatus(subscriptionId: string, status: string, donorName: string) {
  const subject = status === "betalingsprobleem"
    ? "Recurring donation: payment issue"
    : "Recurring donation: stopped";
  const text = `Subscription ${subscriptionId} (donor: ${donorName}) is now ${status}.`;
  await sendMail({ to: ADMIN_EMAIL, subject, text });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();
  if (!stripe || !secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[webhooks/stripe] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const supabase = createAdminClient();
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
    if (!subscriptionId) return NextResponse.json({ received: true });
    const { data: rec } = await supabase.from("recurring_donations").select("id, donor_id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const now = new Date().toISOString().slice(0, 10);
    const nextEnd = invoice.period_end ? new Date(invoice.period_end * 1000).toISOString().slice(0, 10) : null;
    await supabase.from("recurring_donations").update({
      laatste_betaling_datum: now,
      volgende_betaling_datum: nextEnd,
      mislukte_betalingen: 0,
      status: "actief",
    }).eq("id", rec.id);
    return NextResponse.json({ received: true });
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
    if (!subscriptionId) return NextResponse.json({ received: true });
    const { data: rec } = await supabase.from("recurring_donations").select("id, mislukte_betalingen, donor_id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const fails = (rec as { mislukte_betalingen: number }).mislukte_betalingen + 1;
    const status = fails >= 3 ? "betalingsprobleem" : "actief";
    await supabase.from("recurring_donations").update({ mislukte_betalingen: fails, status }).eq("id", rec.id);
    if (status === "betalingsprobleem") {
      const { data: donor } = await supabase.from("donors").select("voornaam, achternaam").eq("id", rec.donor_id).single();
      const name = donor ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ") : "Unknown";
      await notifyAdminRecurringStatus(subscriptionId, "betalingsprobleem", name);
    }
    return NextResponse.json({ received: true });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const { data: rec } = await supabase.from("recurring_donations").select("id, donor_id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    const now = new Date().toISOString().slice(0, 10);
    await supabase.from("recurring_donations").update({ status: "gestopt", eind_datum: now }).eq("id", rec.id);
    const { data: donor } = await supabase.from("donors").select("voornaam, achternaam").eq("id", rec.donor_id).single();
    const name = donor ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ") : "Unknown";
    await notifyAdminRecurringStatus(subscriptionId, "gestopt", name);
    return NextResponse.json({ received: true });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.paused") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const status = subscription.status === "paused" ? "gepauzeerd" : subscription.status === "canceled" || subscription.status === "unpaid" ? "gestopt" : "actief";
    const { data: rec } = await supabase.from("recurring_donations").select("id").eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!rec) return NextResponse.json({ received: true });
    await supabase.from("recurring_donations").update({ status }).eq("id", rec.id);
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
