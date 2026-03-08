import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ROWS = 1000;
const BATCH_SIZE = 5;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

function splitNaam(naam: string): { voornaam: string; achternaam: string } {
  const t = (naam ?? "").trim();
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { voornaam: "", achternaam: "" };
  if (parts.length === 1) return { voornaam: parts[0], achternaam: "" };
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

  type ParsedRow = {
    rowIndex: number;
    voornaam: string;
    achternaam: string;
    email: string;
    land: string | null;
    bedragStr: string;
    datum: string | null;
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
    const { voornaam, achternaam } = splitNaam(naam);
    const land = (r.land ?? "").trim() || null;
    const bedragStr = (r.bedrag ?? "").trim();
    const datum = (r.datum ?? "").trim() || null;
    parsed.push({ rowIndex: i + 2, voornaam, achternaam, email, land, bedragStr, datum });
  }

  for (let b = 0; b < parsed.length; b += BATCH_SIZE) {
    const batch = parsed.slice(b, b + BATCH_SIZE);
    const upsertRows = batch.map((p) => ({
      voornaam: p.voornaam,
      achternaam: p.achternaam,
      email: p.email,
      land: p.land ?? "NL",
    }));
    const { data: upserted, error: e } = await admin!
      .from("donors")
      .upsert(upsertRows, { onConflict: "email" })
      .select("id, email");
    if (e) {
      batch.forEach((p) => details.push(`Rij ${p.rowIndex}: ${e.message}`));
      continue;
    }
    success += batch.length;
    const emailToId = new Map<string, string>((upserted ?? []).map((row) => [row.email, row.id]));
    for (const p of batch) {
      if (p.bedragStr && p.datum) {
        const bedrag = parseFloat(p.bedragStr.replace(",", ".")) || 0;
        if (bedrag > 0) {
          const donorId = emailToId.get(p.email);
          if (donorId) {
            await admin!.from("donations").insert({
              donor_id: donorId,
              bedrag,
              valuta: "EUR",
              methode: "overig",
              status: "voltooid",
              donatie_datum: p.datum.includes("T") ? p.datum : `${p.datum}T12:00:00Z`,
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ success, errors: rows.length - success, details });
}
