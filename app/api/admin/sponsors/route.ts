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

const LEVEL_ORDER = ["platinum", "gold", "silver", "bronze"] as const;
const STATUS_VALUES = ["actief", "inactief", "verlopen", "in_onderhandeling", "verwijderd"] as const;

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const niveau = searchParams.get("niveau")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  let q = supabase!
    .from("sponsors")
    .select("id, bedrijfsnaam, contactpersoon_naam, contactpersoon_email, logo_url, niveau, bedrag_per_maand, contract_start, contract_eind, status, website, bijdrage_type, created_at, updated_at", { count: "exact" })
    .neq("status", "verwijderd");
  if (search) q = q.or(`bedrijfsnaam.ilike.%${search}%,contactpersoon_email.ilike.%${search}%`);
  if (niveau && niveau !== "all") q = q.eq("niveau", niveau);
  if (status && status !== "all") q = q.eq("status", status);
  q = q.order("bedrijfsnaam").order("created_at", { ascending: false }).range(from, from + limit - 1);

  const { data: rows, error: e, count } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });

  const total = count ?? 0;
  return NextResponse.json({ data: rows ?? [], total, page, limit });
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
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
  const contract_eind = typeof body.contract_eind === "string" ? body.contract_eind.trim() : "";
  const status = STATUS_VALUES.includes((body.status as (typeof STATUS_VALUES)[number]) ?? "in_onderhandeling") ? (body.status as (typeof STATUS_VALUES)[number]) : "in_onderhandeling";
  const notities = typeof body.notities === "string" ? body.notities.trim() || null : null;

  if (!bedrijfsnaam || !contactpersoon_naam || !contactpersoon_email) {
    return NextResponse.json({ error: "bedrijfsnaam, contactpersoon_naam and contactpersoon_email are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactpersoon_email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }
  if (!contract_eind) {
    return NextResponse.json({ error: "contract_eind is required" }, { status: 400 });
  }

  const { data, error: insertErr } = await supabase!
    .from("sponsors")
    .insert({
      bedrijfsnaam,
      contactpersoon_naam,
      contactpersoon_email,
      contactpersoon_telefoon,
      website,
      niveau,
      bedrag_per_maand: bedrag_per_maand ?? null,
      bijdrage_type,
      omschrijving,
      contract_start: contract_start || new Date().toISOString().slice(0, 10),
      contract_eind,
      status,
      notities,
    })
    .select("id")
    .single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: insertErr.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}
