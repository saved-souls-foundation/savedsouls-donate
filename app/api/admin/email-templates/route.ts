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

export async function GET(_request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { data: templates, error: e } = await supabase!.from("email_templates").select("*").order("naam");
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  const { data: usageRows } = await supabase!
    .from("incoming_emails")
    .select("ai_suggestie_template_id")
    .eq("status", "verstuurd")
    .not("ai_suggestie_template_id", "is", null);
  const usageByTemplate: Record<string, number> = {};
  for (const row of usageRows ?? []) {
    const id = (row as { ai_suggestie_template_id: string | null }).ai_suggestie_template_id;
    if (id) usageByTemplate[id] = (usageByTemplate[id] ?? 0) + 1;
  }
  const result = (templates ?? []).map((t: { id: string }) => ({
    ...t,
    usage_count: usageByTemplate[t.id] ?? 0,
  }));
  return NextResponse.json(result);
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
  const naam = typeof body.naam === "string" ? body.naam.trim() : "";
  const categorie = typeof body.categorie === "string" ? body.categorie.trim() || null : null;
  const actief = body.actief !== false;
  const payload: Record<string, unknown> = { naam: naam || null, categorie, actief };
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

  const { data, error: insertErr } = await supabase!.from("email_templates").insert(payload).select("id").single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json(data);
}
