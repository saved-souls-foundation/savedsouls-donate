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

/**
 * POST /api/admin/emails/mark-read
 * Body: { id: string } — incoming_emails.id
 * Zet gelezen = true zodat de notificatie-badge daalt.
 */
export async function POST(request: NextRequest) {
  try {
    const { error, supabase } = await requireAdmin();
    if (error) return error;

    let body: { id?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error: updateError } = await supabase!
      .from("incoming_emails")
      .update({ gelezen: true })
      .eq("id", id);

    if (updateError) {
      console.error("[admin/emails/mark-read] update failed:", updateError);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/emails/mark-read] Unexpected error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
