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

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayStr = todayStart.toISOString();

  const [
    { count: pending },
    { count: sentToday },
    { count: ignored },
    { count: onbeantwoord },
  ] = await Promise.all([
    supabase!.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling"),
    supabase!.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "verstuurd").gte("verwerkt_op", todayStr),
    supabase!.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "geneigeerd"),
    supabase!.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false"),
  ]);

  return NextResponse.json({
    pending: pending ?? 0,
    sentToday: sentToday ?? 0,
    ignored: ignored ?? 0,
    onbeantwoord: onbeantwoord ?? 0,
  });
}
