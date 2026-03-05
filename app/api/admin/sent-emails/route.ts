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

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  const admin = createAdminClient();
  // Probeer Engels (migratie 20250305), bij schemafout Nederlands
  let raw: Record<string, unknown>[] = [];
  let count: number | null = 0;
  const qEn = admin
    .from("sent_emails")
    .select("id, type, to_email, subject, body_preview, sent_at, reference_id, meta", { count: "exact" })
    .order("sent_at", { ascending: false })
    .range(from, from + limit - 1);
  const qEnFiltered = type === "step_notify" || type === "email_assistant" ? qEn.eq("type", type) : qEn;
  const resultEn = await qEnFiltered;
  if (resultEn.error && (resultEn.error.code === "PGRST204" || /column|schema/i.test(resultEn.error.message ?? ""))) {
    const qNl = admin
      .from("sent_emails")
      .select("id, type, aan, onderwerp, inhoud, verstuurd_op, reference_id, meta", { count: "exact" })
      .order("verstuurd_op", { ascending: false })
      .range(from, from + limit - 1);
    const resultNl = await (type === "step_notify" || type === "email_assistant" ? qNl.eq("type", type) : qNl);
    if (resultNl.error) return NextResponse.json({ error: resultNl.error.message }, { status: 500 });
    raw = (resultNl.data ?? []) as Record<string, unknown>[];
    count = resultNl.count ?? 0;
  } else {
    if (resultEn.error) return NextResponse.json({ error: resultEn.error.message }, { status: 500 });
    raw = (resultEn.data ?? []) as Record<string, unknown>[];
    count = resultEn.count ?? 0;
  }
  // Normaliseer naar frontend-formaat (aan, onderwerp, inhoud, verstuurd_op)
  const data = raw.map((row: Record<string, unknown>) => ({
    id: row.id,
    type: row.type,
    aan: row.aan ?? row.to_email ?? "",
    onderwerp: row.onderwerp ?? row.subject ?? "",
    inhoud: row.inhoud ?? row.body_preview ?? null,
    verstuurd_op: row.verstuurd_op ?? row.sent_at ?? "",
    reference_id: row.reference_id ?? null,
    meta: row.meta ?? null,
  }));
  return NextResponse.json({ data, total: count, page, limit });
}
