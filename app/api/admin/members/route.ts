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

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  let q = supabase!.from("members").select("id, voornaam, achternaam, email, telefoon, type, bedrijfsnaam, status, lid_sinds, notities, created_at", { count: "exact" });

  if (status && status !== "all") q = q.eq("status", status);
  if (type && type !== "all") q = q.eq("type", type);

  if (search) {
    q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  }

  q = q.order("created_at", { ascending: false }).range(from, from + limit - 1);

  const { data, error: e, count } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit });
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
  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() : "";
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const telefoon = typeof body.telefoon === "string" ? body.telefoon.trim() : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : "persoon";
  const bedrijfsnaam = type === "bedrijf" && typeof body.bedrijfsnaam === "string" ? body.bedrijfsnaam.trim() : null;
  const status = body.status === "inactief" ? "inactief" : "actief";
  const lid_sinds = typeof body.lid_sinds === "string" && body.lid_sinds ? body.lid_sinds : new Date().toISOString().slice(0, 10);
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
    .insert({ voornaam, achternaam, email, telefoon, type, bedrijfsnaam, status, lid_sinds, notities })
    .select("id")
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}
