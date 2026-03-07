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

  const { data: rows, error: e } = await admin
    .from("incoming_emails")
    .select(
      "id, van_naam, van_email, onderwerp, ontvangen_op, inhoud, ai_category, ai_urgency, ai_language, ai_suggested_reply, ai_used_template, ai_processed_at"
    )
    .not("ai_processed_at", "is", null)
    .order("ai_processed_at", { ascending: false })
    .limit(50);

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json(rows ?? []);
}
