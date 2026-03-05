import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

/** POST: nieuw dier aanmaken */
export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const naam = typeof body.naam === "string" ? body.naam.trim() || null : null;
  const soort = (body.soort === "hond" || body.soort === "kat" || body.soort === "overig") ? body.soort : "hond";
  const ras = typeof body.ras === "string" ? body.ras.trim() || null : null;
  const leeftijd = typeof body.leeftijd === "string" ? body.leeftijd.trim() || null : null;
  const geslacht = (body.geslacht === "M" || body.geslacht === "V" || body.geslacht === "male" || body.geslacht === "female") ? body.geslacht : null;
  const status = (body.status === "in_opvang" || body.status === "foster" || body.status === "geadopteerd" || body.status === "overleden") ? body.status : "in_opvang";
  const foto_url = typeof body.foto_url === "string" ? body.foto_url.trim() || null : null;
  const beschrijving = typeof body.beschrijving === "string" ? body.beschrijving.trim() || null : null;
  const locatie = typeof body.locatie === "string" ? body.locatie.trim() || null : null;
  const medisch_urgent = body.medisch_urgent === true || body.medisch_urgent === "true";

  const { data, error: e } = await admin!.from("dieren").insert({
    naam,
    soort,
    ras,
    leeftijd,
    geslacht,
    status,
    foto_url,
    beschrijving,
    locatie,
    medisch_urgent,
    aangemeld_op: new Date().toISOString(),
  }).select("id").single();

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ id: data?.id });
}
