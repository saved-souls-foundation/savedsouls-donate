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
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";
  const language = searchParams.get("language")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  let q = supabase!
    .from("newsletter_subscribers")
    .select("id, email, voornaam, achternaam, type, language, actief, aangemeld_op, uitgeschreven_op, unsubscribe_token", { count: "exact" });

  if (status === "actief") q = q.eq("actief", true);
  else if (status === "inactief") q = q.eq("actief", false);

  if (type === "persoon" || type === "bedrijf") q = q.eq("type", type);
  if (language && language !== "all") q = q.eq("language", language);

  if (search) {
    q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  }

  q = q.order("aangemeld_op", { ascending: false }).range(from, from + limit - 1);

  const { data, error: e, count } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit });
}
