import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await serverSupabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

const LANGS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

type RestoreSubscriber = {
  email?: string | null;
  voornaam?: string | null;
  achternaam?: string | null;
  type?: string | null;
  language?: string | null;
  actief?: boolean;
  aangemeld_op?: string | null;
  uitgeschreven_op?: string | null;
};

/** Herstel verwijderde abonnees zonder bevestigingsmail (admin bulk-undo). */
export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: { rows?: RestoreSubscriber[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body." }, { status: 400 });
  }
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) return NextResponse.json({ error: "rows required" }, { status: 400 });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const r of rows) {
    const email = typeof r.email === "string" ? r.email.trim().toLowerCase() : "";
    if (!email || !emailRegex.test(email)) continue;
    const { data: existing } = await supabase!.from("newsletter_subscribers").select("id").eq("email", email).maybeSingle();
    if (existing) continue;
    const language =
      typeof r.language === "string" && LANGS.includes(r.language as (typeof LANGS)[number])
        ? r.language
        : "nl";
    const type = r.type === "bedrijf" || r.type === "persoon" ? r.type : null;
    const actief = typeof r.actief === "boolean" ? r.actief : true;
    const { error: insErr } = await supabase!.from("newsletter_subscribers").insert({
      email,
      voornaam: typeof r.voornaam === "string" ? r.voornaam.trim() || null : null,
      achternaam: typeof r.achternaam === "string" ? r.achternaam.trim() || null : null,
      type,
      language,
      actief,
      aangemeld_op: typeof r.aangemeld_op === "string" && r.aangemeld_op ? r.aangemeld_op : new Date().toISOString(),
      uitgeschreven_op: typeof r.uitgeschreven_op === "string" && r.uitgeschreven_op ? r.uitgeschreven_op : null,
      unsubscribe_token: randomUUID(),
    });
    if (insErr && !/duplicate|unique|23505/i.test(insErr.message)) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
