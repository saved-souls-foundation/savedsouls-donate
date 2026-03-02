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
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  let q = supabase!.from("calendar_events").select("*").order("start_time", { ascending: true });
  if (start) q = q.gte("start_time", start);
  if (end) q = q.lte("start_time", end);
  const { data, error: e } = await q;
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
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const row = {
    title,
    description: body.description ?? null,
    category: body.category ?? "afspraak",
    start_time: body.start_time,
    end_time: body.end_time ?? null,
    location: body.location ?? null,
    animal_id: body.animal_id ?? null,
    animal_name: body.animal_name ?? null,
    assigned_to: body.assigned_to ?? null,
    attachment_url: body.attachment_url ?? null,
    lab_result_status: body.lab_result_status ?? null,
    lab_result_notes: body.lab_result_notes ?? null,
    is_recurring: !!body.is_recurring,
    updated_at: new Date().toISOString(),
  };

  const { data, error: insertErr } = await supabase!.from("calendar_events").insert(row).select().single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ data });
}
