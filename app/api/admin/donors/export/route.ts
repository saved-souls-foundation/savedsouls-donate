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

function escapeCsv(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";
  let q = supabase!.from("donors").select("id, voornaam, achternaam, email, telefoon, type, bedrijfsnaam, land, notities").eq("verwijderd", false);
  if (search) q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  if (country) q = q.eq("land", country);
  q = q.order("achternaam");
  const { data: donors, error: e } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  const list = donors ?? [];
  const ids = list.map((d: { id: string }) => d.id);
  const agg: Record<string, number> = {};
  ids.forEach((id: string) => { agg[id] = 0; });
  if (ids.length > 0) {
    const { data: dons } = await supabase!.from("donations").select("donor_id, bedrag").eq("status", "voltooid");
    (dons ?? []).forEach((d: { donor_id: string; bedrag: number }) => { if (agg[d.donor_id] != null) agg[d.donor_id] += Number(d.bedrag) || 0; });
  }
  const headers = ["voornaam", "achternaam", "email", "telefoon", "type", "bedrijfsnaam", "land", "total_donated", "notities"];
  const csv = [
    headers.join(","),
    ...list.map((r: Record<string, unknown>) =>
      headers.map((h) => escapeCsv(h === "total_donated" ? String(agg[r.id as string] ?? 0) : String(r[h] ?? ""))).join(",")
    ),
  ].join("\n");
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=donors.csv" },
  });
}
