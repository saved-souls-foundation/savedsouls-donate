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

function fullName(voornaam: string | null, achternaam: string | null): string {
  return [voornaam, achternaam].filter(Boolean).join(" ").trim() || "";
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";
  const language = searchParams.get("language")?.trim() ?? "";

  let q = supabase!
    .from("newsletter_subscribers")
    .select("email, voornaam, achternaam, type, language, actief, aangemeld_op, uitgeschreven_op");

  if (status === "actief") q = q.eq("actief", true);
  else if (status === "inactief") q = q.eq("actief", false);
  if (type === "persoon" || type === "bedrijf") q = q.eq("type", type);
  if (language && language !== "all") q = q.eq("language", language);
  if (search) q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  q = q.order("aangemeld_op", { ascending: false });

  const { data, error: e } = await q;
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });

  const rows = data ?? [];
  const headers = ["name", "email", "type", "language", "actief", "aangemeld_op", "uitgeschreven_op"];
  const csv = [
    headers.join(","),
    ...rows.map((r: { voornaam?: string | null; achternaam?: string | null; email?: string; type?: string | null; language?: string | null; actief?: boolean; aangemeld_op?: string; uitgeschreven_op?: string | null }) =>
      [
        escapeCsv(fullName(r.voornaam ?? null, r.achternaam ?? null)),
        escapeCsv(String(r.email ?? "")),
        escapeCsv(String(r.type ?? "")),
        escapeCsv(String(r.language ?? "")),
        r.actief ? "true" : "false",
        escapeCsv(String(r.aangemeld_op ?? "")),
        escapeCsv(String(r.uitgeschreven_op ?? "")),
      ].join(",")
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=newsletter-subscribers.csv",
    },
  });
}
