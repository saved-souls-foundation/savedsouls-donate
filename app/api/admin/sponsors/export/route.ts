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

function escapeCsv(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const niveau = searchParams.get("niveau")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";

  let q = supabase!
    .from("sponsors")
    .select("bedrijfsnaam, contactpersoon_naam, contactpersoon_email, contactpersoon_telefoon, website, niveau, bedrag_per_maand, bijdrage_type, omschrijving, contract_start, contract_eind, status, notities, created_at, updated_at")
    .neq("status", "verwijderd");
  if (search) q = q.or(`bedrijfsnaam.ilike.%${search}%,contactpersoon_email.ilike.%${search}%`);
  if (niveau && niveau !== "all") q = q.eq("niveau", niveau);
  if (status && status !== "all") q = q.eq("status", status);
  q = q.order("bedrijfsnaam");

  const { data: rows, error: e } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });

  const headers = ["bedrijfsnaam", "contactpersoon_naam", "contactpersoon_email", "contactpersoon_telefoon", "website", "niveau", "bedrag_per_maand", "bijdrage_type", "omschrijving", "contract_start", "contract_eind", "status", "notities", "created_at", "updated_at"];
  const csv = [headers.join(","), ...(rows ?? []).map((r: Record<string, unknown>) => headers.map((h) => escapeCsv(String(r[h] ?? ""))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=sponsors.csv",
    },
  });
}
