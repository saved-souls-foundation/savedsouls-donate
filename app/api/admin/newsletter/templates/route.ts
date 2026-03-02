import { NextResponse } from "next/server";
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
    .select("id, titel, subject_nl, subject_en, body_nl, body_en")
    .order("volgorde", { ascending: true });

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ templates: data ?? [] });
}
