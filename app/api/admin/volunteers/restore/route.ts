import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

type RestoreRow = {
  user_id: string;
  voornaam?: string | null;
  achternaam?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  area?: string | null;
  language?: string | null;
  step?: number | null;
};

/** Herstel volunteer_onboarding na DELETE (zelfde user_id; auth-user moet nog bestaan). */
export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: { rows?: RestoreRow[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) return NextResponse.json({ error: "rows required" }, { status: 400 });

  for (const r of rows) {
    if (!r.user_id || !r.email?.trim()) continue;
    const { error: e } = await supabase!.from("volunteer_onboarding").insert({
      user_id: r.user_id,
      voornaam: r.voornaam ?? null,
      achternaam: r.achternaam ?? null,
      email: r.email.trim().toLowerCase(),
      phone: r.phone ?? null,
      city: r.city ?? null,
      area: r.area ?? null,
      language: r.language ?? "nl",
      step: typeof r.step === "number" && r.step >= 1 && r.step <= 4 ? r.step : 1,
    });
    if (e && !/duplicate|unique|23505/i.test(e.message)) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
