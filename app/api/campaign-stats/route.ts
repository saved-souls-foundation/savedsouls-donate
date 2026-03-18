/**
 * GET /api/campaign-stats — laatste campaign_stats voor emergency/frontend.
 * Cache: revalidate elke 3600 seconden.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export async function GET() {
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
    return NextResponse.json({
      raised: 0,
      goal: 120_000,
      donations: [],
      updated_at: null,
    });
  }

  return NextResponse.json({
    raised: data.raised_eur,
    goal: data.goal_eur,
    donations: data.donations ?? [],
    updated_at: data.updated_at,
  });
}
