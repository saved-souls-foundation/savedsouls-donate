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
  const { data, error: e } = await supabase!
    .from("newsletter_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
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
  if (typeof body.titel === "string") payload.titel = body.titel.trim();
  if (typeof body.subject_nl === "string") payload.subject_nl = body.subject_nl.trim();
  if (typeof body.subject_en === "string") payload.subject_en = body.subject_en.trim();
  if (typeof body.body_nl === "string") payload.body_nl = body.body_nl.trim();
  if (typeof body.body_en === "string") payload.body_en = body.body_en.trim();
  if (typeof body.volgorde === "number") payload.volgorde = body.volgorde;

  const { data, error: e } = await supabase!
    .from("newsletter_templates")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { error: e } = await supabase!.from("newsletter_templates").delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
