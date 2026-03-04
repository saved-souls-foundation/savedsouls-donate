import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null, userId: user.id };
}

/** GET: alle gezondheidsentries voor dit dier */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id: dierId } = await params;
  if (!dierId) return NextResponse.json({ error: "id required" }, { status: 400 });
  const admin = createAdminClient();
  const { data, error: e } = await admin
    .from("dier_gezondheid")
    .select("id, dier_id, datum, type, omschrijving, gewicht, dierenarts, kosten, bijlagen, aangemaakt_door, created_at")
    .eq("dier_id", dierId)
    .order("datum", { ascending: false });
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/** POST: nieuwe gezondheidsentry */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId } = await requireAdmin();
  if (error) return error;
  const { id: dierId } = await params;
  if (!dierId) return NextResponse.json({ error: "id required" }, { status: 400 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const datum = typeof body.datum === "string" ? body.datum : null;
  const type = typeof body.type === "string" ? body.type : null;
  const omschrijving = typeof body.omschrijving === "string" ? body.omschrijving : null;
  const gewicht = typeof body.gewicht === "number" ? body.gewicht : (typeof body.gewicht === "string" && body.gewicht !== "" ? parseFloat(body.gewicht) : null);
  const dierenarts = typeof body.dierenarts === "string" ? body.dierenarts : null;
  const kosten = typeof body.kosten === "number" ? body.kosten : (typeof body.kosten === "string" && body.kosten !== "" ? parseFloat(body.kosten) : null);
  const bijlagen = body.bijlagen ?? null;

  const admin = createAdminClient();
  const { data, error: insertErr } = await admin
    .from("dier_gezondheid")
    .insert({
      dier_id: dierId,
      datum: datum ? new Date(datum).toISOString().slice(0, 10) : null,
      type,
      omschrijving,
      gewicht: gewicht ?? null,
      dierenarts,
      kosten: kosten ?? null,
      bijlagen,
      aangemaakt_door: userId ?? null,
    })
    .select()
    .single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
