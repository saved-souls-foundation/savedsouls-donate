import { NextResponse } from "next/server";
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

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: e } = await supabase!
    .from("newsletter_subscribers")
    .select("language")
    .eq("actief", true);

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });

  const byLanguage: Record<string, number> = { nl: 0, en: 0, es: 0, ru: 0, th: 0, de: 0, fr: 0 };
  const rows = data ?? [];
  for (const row of rows) {
    const lang = (row as { language?: string }).language ?? "nl";
    if (byLanguage[lang] != null) byLanguage[lang]++;
    else byLanguage[lang] = 1;
  }
  return NextResponse.json({ total: rows.length, byLanguage });
}
