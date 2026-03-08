import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ROWS = 1000;
const LANG_VALUES = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

function splitNaam(naam: string): { voornaam: string | null; achternaam: string | null } {
  const t = (naam ?? "").trim();
  if (!t) return { voornaam: null, achternaam: null };
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { voornaam: parts[0], achternaam: null };
  return { voornaam: parts[0], achternaam: parts.slice(1).join(" ") };
}

export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  let body: { rows?: Record<string, string>[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length > MAX_ROWS) {
    return NextResponse.json({ error: `Max ${MAX_ROWS} rijen per import` }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let success = 0;
  const details: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const email = (r.email ?? "").trim().toLowerCase();
    if (!email || !emailRegex.test(email)) {
      details.push(`Rij ${i + 2}: Ongeldig of ontbrekend e-mailadres`);
      continue;
    }
    const naam = (r.naam ?? "").trim();
    const { voornaam, achternaam } = splitNaam(naam);
    const taal = (r.taal ?? "").trim().toLowerCase();
    const language = LANG_VALUES.includes(taal as (typeof LANG_VALUES)[number]) ? (taal as (typeof LANG_VALUES)[number]) : "nl";
    const datumAangemeldRaw = (r.datum_aangemeld ?? "").trim() || (r.aangemeld_op ?? "").trim() || new Date().toISOString().split("T")[0];
    const datumAangemeld = datumAangemeldRaw.includes("T") ? datumAangemeldRaw : `${datumAangemeldRaw}T12:00:00Z`;
    const actiefStr = (r.actief ?? "true").trim().toLowerCase();
    const actief = actiefStr === "false" || actiefStr === "0" || actiefStr === "nee" ? false : true;

    const { data: existing } = await admin!.from("newsletter_subscribers").select("id").eq("email", email).maybeSingle();
    if (existing) {
      await admin!
        .from("newsletter_subscribers")
        .update({
          voornaam,
          achternaam,
          language,
          actief,
          aangemeld_op: datumAangemeld,
        })
        .eq("id", existing.id);
      success++;
    } else {
      const unsubscribe_token = crypto.randomUUID();
      const { error: insertErr } = await admin!
        .from("newsletter_subscribers")
        .insert({
          email,
          voornaam,
          achternaam,
          language,
          actief,
          unsubscribe_token,
          aangemeld_op: datumAangemeld,
        });
      if (insertErr) {
        details.push(`Rij ${i + 2}: ${insertErr.message}`);
        continue;
      }
      success++;
    }
  }

  return NextResponse.json({ success, errors: rows.length - success, details });
}
