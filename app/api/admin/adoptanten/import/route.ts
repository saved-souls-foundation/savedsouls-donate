import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ROWS = 1000;

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
  let updated = 0;
  let inserted = 0;
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
    const { voornaam, achternaam } = splitNaam(naam);
    const notities = [r.telefoon, r.land, r.stad, r.dier_naam, r.adoptiedatum, r.notities]
      .filter(Boolean)
      .map((x) => (x ?? "").trim())
      .filter(Boolean)
      .join(" | ") || null;

    const { data: existing } = await admin!
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      const { error: updateErr } = await admin!
        .from("profiles")
        .update({
          voornaam,
          achternaam,
          notities,
          role: "adoptant",
          verwijderd: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updateErr) {
        details.push(`Rij ${i + 2}: ${updateErr.message}`);
        continue;
      }
      updated++;
    } else {
      const id = crypto.randomUUID();
      const { error: insertErr } = await admin!
        .from("profiles")
        .insert({
          id,
          email,
          voornaam,
          achternaam,
          role: "adoptant",
          notities,
          huidige_stap: 1,
          aangemeld_op: new Date().toISOString(),
        });
      if (insertErr) {
        details.push(`Rij ${i + 2}: ${insertErr.message}`);
        continue;
      }
      inserted++;
    }
  }

  const success = updated + inserted;
  const message = `${success} succesvol geïmporteerd (waarvan ${updated} updates, ${inserted} nieuw)`;
  return NextResponse.json({ success, errors: rows.length - success, details, updated, inserted, message });
}
