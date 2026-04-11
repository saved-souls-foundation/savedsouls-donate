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

export async function GET(_request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const [{ count: onbeantwoord }, { count: beantwoord }, sentEmailsCountRes] = await Promise.all([
    supabase!.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").is("beantwoord_op", null),
    supabase!
      .from("incoming_emails")
      .select("*", { count: "exact", head: true })
      .or("status.eq.verstuurd,ai_processed_at.not.is.null"),
    supabase!.from("sent_emails").select("*", { count: "exact", head: true }),
  ]);

  let sentEmailsCount = sentEmailsCountRes.count ?? 0;
  if (sentEmailsCountRes.error && (sentEmailsCountRes.error.code === "PGRST204" || /column|schema/i.test(sentEmailsCountRes.error.message ?? ""))) {
    const retry = await supabase!.from("sent_emails").select("*", { count: "exact", head: true });
    sentEmailsCount = retry.error ? 0 : retry.count ?? 0;
  }

  return NextResponse.json({
    onbeantwoord: onbeantwoord ?? 0,
    beantwoord: beantwoord ?? 0,
    verzonden: sentEmailsCount,
  });
}
