import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ROWS = 1000;
const NIVEAU_VALUES = ["platinum", "gold", "silver", "bronze"] as const;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
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
    const naam = (r.naam ?? "").trim();
    const email = (r.email ?? "").trim().toLowerCase();
    if (!email || !emailRegex.test(email)) {
      details.push(`Rij ${i + 2}: Ongeldig of ontbrekend e-mailadres`);
      continue;
    }
    if (!naam) {
      details.push(`Rij ${i + 2}: Naam is verplicht`);
      continue;
    }
    const bedrijfsnaam = naam;
    const contactpersoon_naam = naam;
    const contactpersoon_email = email;
    const bedragStr = (r.bedrag ?? "").trim();
    const bedrag_per_maand = bedragStr ? parseFloat(bedragStr.replace(",", ".")) || null : null;
    const startdatum = (r.startdatum ?? "").trim() || null;
    const einddatum = (r.einddatum ?? "").trim() || null;
    const pakket = (r.pakket ?? "").trim().toLowerCase();
    const niveau = NIVEAU_VALUES.includes(pakket as (typeof NIVEAU_VALUES)[number]) ? (pakket as (typeof NIVEAU_VALUES)[number]) : "bronze";
    const notities = (r.notities ?? "").trim() || null;

    if (!einddatum) {
      details.push(`Rij ${i + 2}: Einddatum is verplicht`);
      continue;
    }

    const { data: existing } = await admin!
      .from("sponsors")
      .select("id")
      .eq("contactpersoon_email", email)
      .neq("status", "verwijderd")
      .maybeSingle();

    if (existing) {
      await admin!
        .from("sponsors")
        .update({
          bedrijfsnaam,
          contactpersoon_naam,
          contactpersoon_email,
          bedrag_per_maand,
          contract_start: startdatum || new Date().toISOString().slice(0, 10),
          contract_eind: einddatum,
          niveau,
          notities,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      success++;
    } else {
      const { error: insertErr } = await admin!
        .from("sponsors")
        .insert({
          bedrijfsnaam,
          contactpersoon_naam,
          contactpersoon_email,
          bedrag_per_maand,
          contract_start: startdatum || new Date().toISOString().slice(0, 10),
          contract_eind: einddatum,
          niveau,
          status: "in_onderhandeling",
          notities,
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
