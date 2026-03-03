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

const VALID_LANGUAGE = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { data, error: e } = await supabase!
    .from("newsletter_subscribers")
    .select("*")
    .eq("id", id)
    .single();
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

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() || null : null;
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() || null : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : null;
  const rawLang = typeof body.language === "string" ? body.language.trim().toLowerCase() : "nl";
  const language = VALID_LANGUAGE.includes(rawLang as (typeof VALID_LANGUAGE)[number]) ? rawLang : "nl";

  const { data, error: e } = await supabase!
    .from("newsletter_subscribers")
    .update({ email, voornaam, achternaam, type, language })
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const actief = body.actief === true || body.actief === false ? body.actief : undefined;
  if (actief === undefined) {
    return NextResponse.json({ error: "actief (boolean) is required" }, { status: 400 });
  }
  const update: { actief: boolean; uitgeschreven_op: string | null } = {
    actief,
    uitgeschreven_op: actief ? null : new Date().toISOString(),
  };
  const { data, error: e } = await supabase!
    .from("newsletter_subscribers")
    .update(update)
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
  const { data, error: e } = await supabase!
    .from("newsletter_subscribers")
    .update({ actief: false, uitgeschreven_op: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
