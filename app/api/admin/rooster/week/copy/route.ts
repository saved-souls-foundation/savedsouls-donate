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

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: { week_start?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const weekStart = body.week_start;
  if (!weekStart || typeof weekStart !== "string") return NextResponse.json({ error: "week_start required" }, { status: 400 });
  const prev = new Date(weekStart);
  prev.setDate(prev.getDate() - 7);
  const prevWeekStart = prev.toISOString().slice(0, 10);
  const { data: source } = await supabase!.from("roster_shifts").select("*").eq("week_start", prevWeekStart);
  if (!source?.length) return NextResponse.json({ data: { copied: 0 } });
  const rows = source.map((s: Record<string, unknown>) => ({
    volunteer_id: s.volunteer_id,
    volunteer_name: s.volunteer_name,
    volunteer_color: s.volunteer_color,
    zone: s.zone,
    task: s.task,
    day_of_week: s.day_of_week,
    time_slot: s.time_slot,
    week_start: weekStart,
    notes: s.notes,
  }));
  const { error: insertErr } = await supabase!.from("roster_shifts").insert(rows);
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ data: { copied: rows.length } });
}
