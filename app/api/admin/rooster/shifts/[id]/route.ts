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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updates: Record<string, unknown> = {};
  if (body.volunteer_id !== undefined) updates.volunteer_id = body.volunteer_id;
  if (body.volunteer_name !== undefined) updates.volunteer_name = body.volunteer_name;
  if (body.volunteer_color !== undefined) updates.volunteer_color = body.volunteer_color;
  if (body.zone !== undefined) updates.zone = body.zone;
  if (body.task !== undefined) updates.task = body.task;
  if (typeof body.day_of_week === "number") updates.day_of_week = body.day_of_week;
  if (body.time_slot !== undefined) updates.time_slot = body.time_slot;
  if (body.week_start !== undefined) updates.week_start = body.week_start;
  if (body.notes !== undefined) updates.notes = body.notes;
  const { data, error: e } = await supabase!.from("roster_shifts").update(updates).eq("id", id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error: e } = await supabase!.from("roster_shifts").delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json({ success: true });
}
