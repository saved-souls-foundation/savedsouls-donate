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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: e } = await supabase!.from("email_templates").select("*").eq("id", id).maybeSingle();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  const payload: Record<string, unknown> = {};
  if (typeof body.naam === "string") payload.naam = body.naam.trim() || null;
  if (typeof body.categorie === "string") payload.categorie = body.categorie.trim() || null;
  if (typeof body.actief === "boolean") payload.actief = body.actief;
  const langs = ["nl", "en", "es", "ru", "th", "de", "fr"];
  for (const lang of langs) {
    const o = body[`onderwerp_${lang}`];
    const i = body[`inhoud_${lang}`];
    if (typeof o === "string") payload[`onderwerp_${lang}`] = o.trim() || null;
    if (typeof i === "string") payload[`inhoud_${lang}`] = i.trim() || null;
  }
  if (typeof body.onderwerp === "string") payload.onderwerp = body.onderwerp.trim() || null;
  if (typeof body.inhoud_nl === "string") payload.inhoud_nl = body.inhoud_nl.trim() || null;
  if (typeof body.inhoud_en === "string") payload.inhoud_en = body.inhoud_en.trim() || null;

  const { data, error: e } = await supabase!.from("email_templates").update(payload).eq("id", id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: e } = await supabase!.from("email_templates").delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
