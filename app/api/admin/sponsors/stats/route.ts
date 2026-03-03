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

  const { count: activeCount } = await supabase!
    .from("sponsors")
    .select("*", { count: "exact", head: true })
    .eq("status", "actief");

  const { data: activeRows } = await supabase!
    .from("sponsors")
    .select("bedrag_per_maand, niveau")
    .eq("status", "actief");

  let totalMonthly = 0;
  const perLevel = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  (activeRows ?? []).forEach((r: { bedrag_per_maand: number | null; niveau: string | null }) => {
    totalMonthly += Number(r.bedrag_per_maand ?? 0);
    const n = (r.niveau ?? "").toLowerCase();
    if (n in perLevel) (perLevel as Record<string, number>)[n]++;
  });

  const now = new Date();
  const nowStr = now.toISOString().slice(0, 10);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { data: expiringRows } = await supabase!
    .from("sponsors")
    .select("bedrijfsnaam")
    .eq("status", "actief")
    .gte("contract_eind", nowStr)
    .lte("contract_eind", in30Days);

  const expiringNames = (expiringRows ?? []).map((r: { bedrijfsnaam: string | null }) => r.bedrijfsnaam ?? "—");

  return NextResponse.json({
    activeCount: activeCount ?? 0,
    totalMonthly,
    perLevel,
    expiringCount: expiringNames.length,
    expiringNames,
  });
}
