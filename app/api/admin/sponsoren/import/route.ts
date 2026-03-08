import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ROWS = 1000;
const BATCH_SIZE = 5;
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

  type ParsedRow = {
    rowIndex: number;
    bedrijfsnaam: string;
    contactpersoon_naam: string;
    contactpersoon_email: string;
    bedrag_per_maand: number | null;
    contract_start: string;
    contract_eind: string | null;
    niveau: (typeof NIVEAU_VALUES)[number];
    status: string;
  };

  const parsed: ParsedRow[] = [];
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
    const bedragStr = (r.bedrag ?? "").trim();
    const bedrag_per_maand = bedragStr ? parseFloat(bedragStr.replace(",", ".")) || null : null;
    const startdatum = (r.startdatum ?? "").trim() || null;
    const contract_eind = (r.einddatum ?? "").trim() || null;
    const pakket = (r.pakket ?? "").trim().toLowerCase();
    const niveau = NIVEAU_VALUES.includes(pakket as (typeof NIVEAU_VALUES)[number]) ? (pakket as (typeof NIVEAU_VALUES)[number]) : "bronze";
    const status = (() => {
      const s = (r.status ?? "").toLowerCase().trim();
      if (s === "active" || s === "actief") return "actief";
      if (s === "inactive" || s === "inactief") return "inactief";
      if (s === "verlopen" || s === "expired") return "verlopen";
      return "actief";
    })();
    parsed.push({
      rowIndex: i + 2,
      bedrijfsnaam: naam,
      contactpersoon_naam: naam,
      contactpersoon_email: email,
      bedrag_per_maand,
      contract_start: startdatum || new Date().toISOString().slice(0, 10),
      contract_eind,
      niveau,
      status,
    });
  }

  for (let b = 0; b < parsed.length; b += BATCH_SIZE) {
    const batch = parsed.slice(b, b + BATCH_SIZE);
    const upsertRows = batch.map((p) => ({
      bedrijfsnaam: p.bedrijfsnaam,
      contactpersoon_naam: p.contactpersoon_naam,
      contactpersoon_email: p.contactpersoon_email,
      bedrag_per_maand: p.bedrag_per_maand,
      contract_start: p.contract_start,
      contract_eind: p.contract_eind,
      niveau: p.niveau,
      status: p.status,
      updated_at: new Date().toISOString(),
    }));
    const { error: e } = await admin!
      .from("sponsors")
      .upsert(upsertRows, { onConflict: "contactpersoon_email" });
    if (e) {
      batch.forEach((p) => details.push(`Rij ${p.rowIndex}: ${e.message}`));
    } else {
      success += batch.length;
    }
  }

  return NextResponse.json({ success, errors: rows.length - success, details });
}
