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

const LEVEL_ORDER = ["platinum", "gold", "silver", "bronze"] as const;
const STATUS_VALUES = ["actief", "inactief", "verlopen", "in_onderhandeling", "verwijderd"] as const;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data: sponsor, error: e } = await supabase!.from("sponsors").select("*").eq("id", id).maybeSingle();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  if (!sponsor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const row = sponsor as Record<string, unknown>;
  if (row.status === "verwijderd") return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sponsor);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bedrijfsnaam = typeof body.bedrijfsnaam === "string" ? body.bedrijfsnaam.trim() : "";
  const contactpersoon_naam = typeof body.contactpersoon_naam === "string" ? body.contactpersoon_naam.trim() : "";
  const contactpersoon_email = typeof body.contactpersoon_email === "string" ? body.contactpersoon_email.trim().toLowerCase() : "";
  const contactpersoon_telefoon = typeof body.contactpersoon_telefoon === "string" ? body.contactpersoon_telefoon.trim() || null : null;
  const website = typeof body.website === "string" ? body.website.trim() || null : null;
  const niveau = LEVEL_ORDER.includes((body.niveau as (typeof LEVEL_ORDER)[number]) ?? "bronze") ? (body.niveau as (typeof LEVEL_ORDER)[number]) : "bronze";
  const bedrag_per_maand = typeof body.bedrag_per_maand === "number" ? body.bedrag_per_maand : (typeof body.bedrag_per_maand === "string" && body.bedrag_per_maand !== "" ? parseFloat(body.bedrag_per_maand) : null);
  const bijdrage_type = body.bijdrage_type === "geld" || body.bijdrage_type === "producten" || body.bijdrage_type === "diensten" || body.bijdrage_type === "combinatie" ? body.bijdrage_type : "geld";
  const omschrijving = typeof body.omschrijving === "string" ? body.omschrijving.trim() || null : null;
  const contract_start = typeof body.contract_start === "string" ? body.contract_start.trim() || null : null;
  const contract_eind = typeof body.contract_eind === "string" ? body.contract_eind.trim() || null : null;
  const status = STATUS_VALUES.includes((body.status as (typeof STATUS_VALUES)[number]) ?? "actief") ? (body.status as (typeof STATUS_VALUES)[number]) : "actief";
  const notities = typeof body.notities === "string" ? body.notities.trim() || null : null;

  if (!bedrijfsnaam || !contactpersoon_naam || !contactpersoon_email) {
    return NextResponse.json({ error: "bedrijfsnaam, contactpersoon_naam and contactpersoon_email are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactpersoon_email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const { data, error: updateErr } = await supabase!
    .from("sponsors")
    .update({
      bedrijfsnaam,
      contactpersoon_naam,
      contactpersoon_email,
      contactpersoon_telefoon,
      website,
      niveau,
      bedrag_per_maand: bedrag_per_maand ?? null,
      bijdrage_type,
      omschrijving,
      contract_start,
      contract_eind,
      status,
      notities,
    })
    .eq("id", id)
    .select()
    .single();
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: updateErr.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: e } = await supabase!
    .from("sponsors")
    .update({ status: "verwijderd" })
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
