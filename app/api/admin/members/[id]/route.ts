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
  const { data, error: e } = await supabase!.from("members").select("*").eq("id", id).single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json(data);
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
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const telefoon = typeof body.telefoon === "string" ? body.telefoon.trim() : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : "persoon";
  const bedrijfsnaam = type === "bedrijf" && typeof body.bedrijfsnaam === "string" ? body.bedrijfsnaam.trim() : null;
  const status = body.status === "verwijderd" || body.status === "inactief" ? body.status : "actief";
  const lid_sinds = typeof body.lid_sinds === "string" ? body.lid_sinds || null : null;
  const notities = typeof body.notities === "string" ? body.notities.trim() || null : null;

  if (!voornaam || !achternaam || !email) {
    return NextResponse.json({ error: "voornaam, achternaam and email are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const { data, error: e } = await supabase!
    .from("members")
    .update({ voornaam, achternaam, email, telefoon, type, bedrijfsnaam, status, lid_sinds, notities })
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: e } = await supabase!
    .from("members")
    .update({ status: "verwijderd" })
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
