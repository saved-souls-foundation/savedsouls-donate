import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

const ALLOWED_CAMPAIGNS = ["Emergency Donaties", "Sponsors", "Volunteers"] as const;

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const admin = createAdminClient();
  const { data, error: qErr } = await admin.from("google_ads_stats").select("*").order("week_start", { ascending: false });
  if (qErr) {
    console.error("[admin/google-ads] GET:", qErr);
    return NextResponse.json({ error: qErr.message }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const campaign_name = typeof body.campaign_name === "string" ? body.campaign_name.trim() : "";
  if (!ALLOWED_CAMPAIGNS.includes(campaign_name as (typeof ALLOWED_CAMPAIGNS)[number])) {
    return NextResponse.json({ error: "Ongeldige campagnenaam" }, { status: 400 });
  }

  const impressions = Math.max(0, Math.floor(Number(body.impressions ?? 0)));
  const clicks = Math.max(0, Math.floor(Number(body.clicks ?? 0)));
  const conversions = Math.max(0, Math.floor(Number(body.conversions ?? 0)));
  const ctr = Number(body.ctr ?? 0);
  if (!Number.isFinite(ctr) || ctr < 0) {
    return NextResponse.json({ error: "Ongeldige CTR" }, { status: 400 });
  }
  const week_start = typeof body.week_start === "string" ? body.week_start.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week_start)) {
    return NextResponse.json({ error: "Ongeldige week_start (YYYY-MM-DD)" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error: insErr } = await admin
    .from("google_ads_stats")
    .insert({
      campaign_name,
      impressions,
      clicks,
      ctr,
      conversions,
      cost_per_conversion: 0,
      week_start,
    })
    .select()
    .single();

  if (insErr) {
    console.error("[admin/google-ads] POST:", insErr);
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
