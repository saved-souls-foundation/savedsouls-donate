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

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: e } = await supabase!
    .from("newsletter_templates")
    .select("id, titel, subject_nl, subject_en, body_nl, body_en, volgorde")
    .order("volgorde", { ascending: true });

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ templates: data ?? [] });
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
  const titel = typeof body.titel === "string" ? body.titel.trim() : "";
  const subject_nl = typeof body.subject_nl === "string" ? body.subject_nl.trim() : "";
  const subject_en = typeof body.subject_en === "string" ? body.subject_en.trim() : "";
  const body_nl = typeof body.body_nl === "string" ? body.body_nl.trim() : "";
  const body_en = typeof body.body_en === "string" ? body.body_en.trim() : "";
  if (!titel) return NextResponse.json({ error: "titel is required" }, { status: 400 });

  const { data: maxRow } = await supabase!
    .from("newsletter_templates")
    .select("volgorde")
    .order("volgorde", { ascending: false })
    .limit(1)
    .maybeSingle();
  const volgorde = typeof (maxRow as { volgorde?: number } | null)?.volgorde === "number" ? (maxRow as { volgorde: number }).volgorde + 1 : 0;

  const { data, error: insertErr } = await supabase!
    .from("newsletter_templates")
    .insert({ titel, subject_nl: subject_nl || titel, subject_en: subject_en || titel, body_nl: body_nl || "", body_en: body_en || "", volgorde })
    .select("id")
    .single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json(data);
}
