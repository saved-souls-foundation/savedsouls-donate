import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin)
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

export async function GET() {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const [
      spotlightRes,
      emailsRes,
      blogRes,
      costRes,
      activityRes,
      spotlightPostsRes,
      conceptsRes,
    ] = await Promise.all([
      admin
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("source", "test-24h")
        .gte("gepubliceerd_op", twentyFourHoursAgo),
      admin
        .from("incoming_emails")
        .select("id", { count: "exact", head: true })
        .not("ai_processed_at", "is", null)
        .gte("ai_processed_at", twentyFourHoursAgo),
      admin
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("source", "ai-generated")
        .gte("gepubliceerd_op", sevenDaysAgo),
      admin
        .from("ai_usage_log")
        .select("estimated_cost_usd")
        .gte("created_at", startOfMonth),
      admin
        .from("ai_usage_log")
        .select("id, model, input_tokens, output_tokens, task, estimated_cost_usd, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("posts")
        .select("id, titel, status, gepubliceerd_op, animal_id, hero_image, slug")
        .eq("category", "spotlight")
        .in("source", ["test-24h", "manual"])
        .order("gepubliceerd_op", { ascending: false, nullsFirst: false })
        .limit(5),
      admin
        .from("posts")
        .select("id, titel, inhoud, created_at")
        .eq("status", "concept")
        .eq("source", "ai-generated")
        .order("created_at", { ascending: false }),
    ]);

    const spotlightToday = spotlightRes.count ?? 0;
    const emailsToday = emailsRes.count ?? 0;
    const blogThisWeek = blogRes.count ?? 0;
    const costRows = costRes.data ?? [];
    const costThisMonth = costRows.reduce((sum, r) => sum + Number(r.estimated_cost_usd ?? 0), 0);

    const recentActivity = (activityRes.data ?? []).map((r) => ({
      id: r.id,
      model: r.model,
      input_tokens: r.input_tokens,
      output_tokens: r.output_tokens,
      task: r.task ?? null,
      estimated_cost_usd: r.estimated_cost_usd != null ? Number(r.estimated_cost_usd) : null,
      created_at: r.created_at,
    }));

    const spotlightPosts = (spotlightPostsRes.data ?? []).map((r) => ({
      id: r.id,
      titel: r.titel ?? null,
      status: r.status ?? null,
      gepubliceerd_op: r.gepubliceerd_op ?? null,
      animal_id: r.animal_id ?? null,
      hero_image: r.hero_image ?? null,
      slug: r.slug ?? null,
    }));

    const blogConcepts = (conceptsRes.data ?? []).map((r) => ({
      id: r.id,
      titel: r.titel ?? null,
      inhoud: r.inhoud ?? null,
      created_at: r.created_at ?? null,
    }));

    return NextResponse.json({
      spotlightToday,
      emailsToday,
      blogThisWeek,
      costThisMonth,
      recentActivity,
      spotlightPosts,
      blogConcepts,
    });
  } catch (e) {
    console.error("[dashboard/ai-stats]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
