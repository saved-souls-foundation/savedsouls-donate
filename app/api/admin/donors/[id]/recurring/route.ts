import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase };
}

const VALID_FREQ = ["maandelijks", "kwartaal", "jaarlijks"] as const;
const VALID_STATUS = ["actief", "gepauzeerd", "gestopt"] as const;
const VALID_METHODE = ["stripe", "mollie", "bank", "paypal"] as const;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id: donor_id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const bedrag = typeof body.bedrag === "number" ? body.bedrag : parseFloat(String(body.bedrag ?? "0"));
  if (Number.isNaN(bedrag) || bedrag <= 0) return NextResponse.json({ error: "bedrag is required and must be positive" }, { status: 400 });
  const valuta = typeof body.valuta === "string" && ["EUR", "USD", "GBP", "THB"].includes(body.valuta) ? body.valuta : "EUR";
  const frequentie = VALID_FREQ.includes((body.frequentie as string) as (typeof VALID_FREQ)[number]) ? (body.frequentie as string) : "maandelijks";
  const methode = VALID_METHODE.includes((body.methode as string) as (typeof VALID_METHODE)[number]) ? (body.methode as string) : null;
  const provider_subscription_id = typeof body.provider_subscription_id === "string" ? body.provider_subscription_id.trim() || null : null;
  const start_datum = typeof body.start_datum === "string" && body.start_datum ? (body.start_datum as string).slice(0, 10) : new Date().toISOString().slice(0, 10);
  const status = VALID_STATUS.includes((body.status as string) as (typeof VALID_STATUS)[number]) ? (body.status as string) : "actief";
  const { data: existing } = await supabase!.from("recurring_donations").select("id").eq("donor_id", donor_id).maybeSingle();
  if (existing) {
    const { data, error: e } = await supabase!
      .from("recurring_donations")
      .update({ bedrag, valuta, frequentie, methode, provider_subscription_id, start_datum, status })
      .eq("id", existing.id)
      .select()
      .single();
    if (e) return NextResponse.json({ error: e.message }, { status: 500 });
    return NextResponse.json(data);
  }
  const { data, error: e } = await supabase!
    .from("recurring_donations")
    .insert({ donor_id, bedrag, valuta, frequentie, methode, provider_subscription_id, start_datum, status })
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id: donor_id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const status = body.status === "gepauzeerd" || body.status === "gestopt" || body.status === "betalingsprobleem" ? body.status : "actief";
  const { data: rec } = await supabase!.from("recurring_donations").select("id").eq("donor_id", donor_id).maybeSingle();
  if (!rec) return NextResponse.json({ error: "No recurring donation found" }, { status: 404 });
  const update: Record<string, unknown> = { status };
  if (body.volgende_betaling_datum !== undefined) update.volgende_betaling_datum = typeof body.volgende_betaling_datum === "string" ? body.volgende_betaling_datum.slice(0, 10) : null;
  const { data, error: e } = await supabase!.from("recurring_donations").update(update).eq("id", (rec as { id: string }).id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
