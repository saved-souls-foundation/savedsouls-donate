/**
 * GET /api/campaign-stats — laatste campaign_stats voor emergency/frontend.
 * Cache: 1 uur via Cache-Control (geen build-time prerender).
 */
import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

const FALLBACK = {
  raised: 0,
  goal: 120_000,
  donations: [] as unknown[],
  updated_at: null as string | null,
};

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(FALLBACK, { headers: { "Cache-Control": CACHE_CONTROL } });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("campaign_stats")
    .select("raised_eur, goal_eur, donations, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(FALLBACK, { headers: { "Cache-Control": CACHE_CONTROL } });
  }

  return NextResponse.json(
    {
      raised: data.raised_eur,
      goal: data.goal_eur,
      donations: data.donations ?? [],
      updated_at: data.updated_at,
    },
    { headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
