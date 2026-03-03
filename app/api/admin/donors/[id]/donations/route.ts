import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

const VALID_VALUTA = ["EUR", "USD", "GBP", "THB"] as const;
const VALID_METHODE = ["ideal", "paypal", "creditcard", "bank", "mollie", "stripe", "contant", "overig"] as const;
const VALID_STATUS = ["voltooid", "in_behandeling", "mislukt", "terugbetaald"] as const;

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
  const valuta = VALID_VALUTA.includes((body.valuta as string) as (typeof VALID_VALUTA)[number]) ? (body.valuta as string) : "EUR";
  const methode = VALID_METHODE.includes((body.methode as string) as (typeof VALID_METHODE)[number]) ? (body.methode as string) : null;
  const status = VALID_STATUS.includes((body.status as string) as (typeof VALID_STATUS)[number]) ? (body.status as string) : "voltooid";
  const donatie_datum = typeof body.donatie_datum === "string" && body.donatie_datum ? (body.donatie_datum as string).slice(0, 10) : new Date().toISOString().slice(0, 10);
  const betalingskenmerk = typeof body.betalingskenmerk === "string" ? body.betalingskenmerk.trim() || null : null;
  const campagne = typeof body.campagne === "string" ? body.campagne.trim() || null : null;
  const anoniem = body.anoniem === true;
  const { data, error: e } = await supabase!
    .from("donations")
    .insert({ donor_id, bedrag, valuta, methode, status, donatie_datum: donatie_datum + "T12:00:00Z", betalingskenmerk, campagne, anoniem })
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
