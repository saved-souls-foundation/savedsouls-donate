import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase };
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get("week_start");
  if (!weekStart) return NextResponse.json({ error: "week_start required" }, { status: 400 });
  const { data, error: e } = await supabase!
    .from("roster_shifts")
    .select("*")
    .eq("week_start", weekStart)
    .order("zone")
    .order("day_of_week")
    .order("time_slot");
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const volunteer_id = body.volunteer_id ?? null;
  const volunteer_name = typeof body.volunteer_name === "string" ? body.volunteer_name : "";
  const volunteer_color = typeof body.volunteer_color === "string" ? body.volunteer_color : "#0d9488";
  const zone = typeof body.zone === "string" ? body.zone : "";
  const task = typeof body.task === "string" ? body.task : "";
  const day_of_week = typeof body.day_of_week === "number" ? body.day_of_week : 0;
  const time_slot = typeof body.time_slot === "string" ? body.time_slot : "ochtend";
  const week_start = typeof body.week_start === "string" ? body.week_start : "";
  const notes = body.notes != null ? String(body.notes) : null;
  if (!zone || !task || !week_start) return NextResponse.json({ error: "zone, task, week_start required" }, { status: 400 });
  const row = {
    volunteer_id,
    volunteer_name: volunteer_name || null,
    volunteer_color: volunteer_color || null,
    zone,
    task,
    day_of_week,
    time_slot,
    week_start,
    notes,
  };
  const { data, error: insertErr } = await supabase!.from("roster_shifts").insert(row).select().single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ data });
}
