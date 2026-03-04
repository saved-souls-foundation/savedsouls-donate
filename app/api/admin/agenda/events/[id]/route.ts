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

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const rawAnimalId = body.animal_id;
  const animalId = typeof rawAnimalId === "string" && rawAnimalId.trim() && uuidRegex.test(rawAnimalId.trim()) ? rawAnimalId.trim() : null;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...(typeof body.title === "string" && { title: body.title.trim() }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.category !== undefined && { category: body.category }),
    ...(body.start_time !== undefined && { start_time: body.start_time }),
    ...(body.end_time !== undefined && { end_time: body.end_time }),
    ...(body.location !== undefined && { location: body.location }),
    ...(body.animal_id !== undefined && { animal_id: animalId }),
    ...(body.animal_name !== undefined && { animal_name: body.animal_name }),
    ...(body.assigned_to !== undefined && { assigned_to: body.assigned_to }),
    ...(body.attachment_url !== undefined && { attachment_url: body.attachment_url }),
    ...(body.lab_result_status !== undefined && { lab_result_status: body.lab_result_status }),
    ...(body.lab_result_notes !== undefined && { lab_result_notes: body.lab_result_notes }),
    ...(body.is_recurring !== undefined && { is_recurring: !!body.is_recurring }),
  };

  const { data, error: e } = await supabase!.from("calendar_events").update(updates).eq("id", id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error: e } = await supabase!.from("calendar_events").delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "PGRST116" ? 404 : 500 });
  return NextResponse.json({ success: true });
}
