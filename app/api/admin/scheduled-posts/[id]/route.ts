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

const STATUSES = ["concept", "gepland", "geplaatst", "mislukt"] as const;
const PLATFORMS = ["facebook", "instagram", "tiktok", "youtube", "reddit", "x"] as const;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.content === "string") updates.inhoud = body.content.trim();
  if (Array.isArray(body.media_urls))
    updates.media_urls = (body.media_urls as string[]).filter((u) => typeof u === "string");
  if (typeof body.scheduled_at === "string") updates.gepland_op = body.scheduled_at ? new Date(body.scheduled_at).toISOString() : null;
  if (typeof body.campaign_label === "string") updates.campaign_label = body.campaign_label.trim() || null;
  if (STATUSES.includes((body.status as (typeof STATUSES)[number]) ?? "concept"))
    updates.status = body.status;
  if (typeof body.platform === "string" && PLATFORMS.includes(body.platform as (typeof PLATFORMS)[number]))
    updates.platform = body.platform;

  const admin = createAdminClient();
  const { data, error: e } = await admin
    .from("scheduled_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  const row = data as { inhoud?: string; gepland_op?: string | null } & typeof data;
  return NextResponse.json({
    data: { ...row, content: row.inhoud, scheduled_at: row.gepland_op ?? null },
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error: e } = await admin.from("scheduled_posts").delete().eq("id", id);

  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json({ success: true });
}
