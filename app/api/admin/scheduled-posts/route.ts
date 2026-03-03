import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin)
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: e } = await supabase!
    .from("scheduled_posts")
    .select("*")
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

const PLATFORMS = ["facebook", "instagram", "tiktok", "youtube", "reddit", "x"] as const;
const STATUSES = ["concept", "gepland", "geplaatst", "mislukt"] as const;

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  const platforms = Array.isArray(body.platforms)
    ? (body.platforms as string[]).filter((p) => PLATFORMS.includes(p as (typeof PLATFORMS)[number]))
    : typeof body.platform === "string" && PLATFORMS.includes(body.platform as (typeof PLATFORMS)[number])
      ? [body.platform]
      : [];
  const status = STATUSES.includes((body.status as (typeof STATUSES)[number]) ?? "concept")
    ? (body.status as (typeof STATUSES)[number])
    : "concept";
  const scheduled_at =
    status === "gepland" && typeof body.scheduled_at === "string" && body.scheduled_at
      ? new Date(body.scheduled_at).toISOString()
      : null;
  const campaign_label =
    typeof body.campaign_label === "string" ? body.campaign_label.trim() || null : null;
  const media_urls = Array.isArray(body.media_urls)
    ? (body.media_urls as string[]).filter((u) => typeof u === "string")
    : [];

  if (!content) return NextResponse.json({ error: "content is required" }, { status: 400 });
  if (platforms.length === 0) return NextResponse.json({ error: "At least one platform is required" }, { status: 400 });

  const rows = platforms.map((platform) => ({
    platform,
    content,
    media_urls,
    scheduled_at,
    campaign_label,
    status,
  }));

  const { data: inserted, error: insertErr } = await supabase!
    .from("scheduled_posts")
    .insert(rows)
    .select("id, platform, content, media_urls, scheduled_at, campaign_label, status, created_at, updated_at");

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ data: inserted ?? [] });
}
