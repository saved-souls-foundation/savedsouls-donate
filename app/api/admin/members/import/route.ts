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
    const voornaam = (r.voornaam ?? "").trim();
    const achternaam = (r.achternaam ?? "").trim();
    const email = (r.email ?? "").trim().toLowerCase();
    const telefoon = (r.telefoon ?? "").trim() || null;
    const geboortedatum = (r.geboortedatum ?? "").trim() || null;
    const lid_sinds = (r.lid_sinds ?? "").trim() || new Date().toISOString().slice(0, 10);
    let notities = (r.notities ?? "").trim() || null;
    if (geboortedatum) {
      notities = notities ? `${notities}\nGeboortedatum: ${geboortedatum}` : `Geboortedatum: ${geboortedatum}`;
    }

    if (!email || !emailRegex.test(email)) {
      details.push(`Rij ${i + 2}: Ongeldig of ontbrekend e-mailadres`);
      continue;
    }
    if (!voornaam || !achternaam) {
      details.push(`Rij ${i + 2}: Voornaam en achternaam zijn verplicht`);
      continue;
    }

    const { data: existing } = await admin!.from("members").select("id").eq("email", email).maybeSingle();
    if (existing) {
      const { error: updateErr } = await admin!
        .from("members")
        .update({
          voornaam,
          achternaam,
          telefoon,
          lid_sinds: lid_sinds.includes("T") ? lid_sinds.slice(0, 10) : lid_sinds,
          notities,
        })
        .eq("id", existing.id);
      if (updateErr) {
        details.push(`Rij ${i + 2}: ${updateErr.message}`);
        continue;
      }
      success++;
    } else {
      const { error: insertErr } = await admin!
        .from("members")
        .insert({
          voornaam,
          achternaam,
          email,
          telefoon,
          type: "persoon",
          bedrijfsnaam: null,
          status: "actief",
          lid_sinds: lid_sinds.includes("T") ? lid_sinds.slice(0, 10) : lid_sinds,
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
