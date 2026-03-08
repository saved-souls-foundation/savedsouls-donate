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
  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() ?? "";
  const ai_categorie = searchParams.get("ai_categorie")?.trim() ?? "";
  const taal = searchParams.get("taal")?.trim() ?? "";
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  // Alle rijen uit incoming_emails (inkomend); createAdminClient omzeilt RLS
  let q = admin
    .from("incoming_emails")
    .select("id, van_email, van_naam, onderwerp, inhoud, ontvangen_op, ai_categorie, ai_confidence, ai_urgency, status, taal, ai_language, bron, ai_suggestie_template_id, ai_gegenereerd_antwoord, ai_automatisch_verstuurd", { count: "exact" });
  if (status && status !== "all") {
    if (status === "onbeantwoord") {
      q = q
        .eq("status", "in_behandeling")
        .is("beantwoord_op", null)
        .or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false");
    } else {
      q = q.eq("status", status);
    }
  }
  if (ai_categorie && ai_categorie !== "all") q = q.eq("ai_categorie", ai_categorie);
  if (taal && taal !== "all") q = q.eq("taal", taal);
  if (search) q = q.or(`van_email.ilike.%${search}%,van_naam.ilike.%${search}%,onderwerp.ilike.%${search}%,inhoud.ilike.%${search}%`);
  q = q.order("ontvangen_op", { ascending: false }).range(from, from + limit - 1);

  const { data: rows, error: e, count } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: rows ?? [], total: count ?? 0, page, limit });
}
