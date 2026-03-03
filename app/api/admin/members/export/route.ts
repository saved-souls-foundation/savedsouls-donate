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
  const status = searchParams.get("status")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";

  let q = supabase!.from("members").select("voornaam, achternaam, email, telefoon, type, bedrijfsnaam, status, lid_sinds, notities");
  if (status && status !== "all") q = q.eq("status", status);
  if (type && type !== "all") q = q.eq("type", type);
  if (search) q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  q = q.order("created_at", { ascending: false });

  const { data, error: e } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });

  const rows = data ?? [];
  const headers = ["voornaam", "achternaam", "email", "telefoon", "type", "bedrijfsnaam", "status", "lid_sinds", "notities"];
  const csv = [headers.join(","), ...rows.map((r: Record<string, unknown>) => headers.map((h) => escapeCsv(String(r[h] ?? ""))).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=members.csv",
    },
  });
}
