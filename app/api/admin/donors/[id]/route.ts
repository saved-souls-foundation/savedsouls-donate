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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data: donor, error: e } = await supabase!.from("donors").select("*").eq("id", id).maybeSingle();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  if (!donor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: donations } = await supabase!.from("donations").select("id, bedrag, valuta, methode, status, donatie_datum, betalingskenmerk, anoniem, campagne, created_at").eq("donor_id", id).order("donatie_datum", { ascending: false });
  const { data: recurring } = await supabase!.from("recurring_donations").select("*").eq("donor_id", id).maybeSingle();
  const totalDonated = (donations ?? []).filter((d: { status: string }) => d.status === "voltooid").reduce((s: number, d: { bedrag: number }) => s + Number(d.bedrag), 0);
  return NextResponse.json({ donor, donations: donations ?? [], recurring: recurring ?? null, total_donated: totalDonated });
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
  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() : "";
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const telefoon = typeof body.telefoon === "string" ? body.telefoon.trim() || null : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : "persoon";
  const bedrijfsnaam = type === "bedrijf" && typeof body.bedrijfsnaam === "string" ? body.bedrijfsnaam.trim() || null : null;
  const land = typeof body.land === "string" ? body.land.trim() || null : null;
  const notities = typeof body.notities === "string" ? body.notities.trim() || null : null;
  if (!voornaam || !achternaam || !email) {
    return NextResponse.json({ error: "voornaam, achternaam and email are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  const { data, error: e } = await supabase!.from("donors").update({ voornaam, achternaam, email, telefoon, type, bedrijfsnaam, land, notities }).eq("id", id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: e } = await supabase!.from("donors").delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
