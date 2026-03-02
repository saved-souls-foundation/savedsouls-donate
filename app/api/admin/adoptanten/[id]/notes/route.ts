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

/** PATCH: notities van een adoptant (profiles.notities) bijwerken */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  let body: { notities?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const notities = typeof body.notities === "string" ? body.notities : "";
  const { data, error: e } = await supabase
    .from("profiles")
    .update({ notities: notities || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, notities, updated_at")
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(data);
}
