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
    const { voornaam, achternaam } = splitNaam(naam);
    const phone = (r.telefoon ?? "").trim() || null;
    const city = (r.land ?? "").trim() || null;
    const area = (r.taken ?? "").trim() || null;

    const { data: existing } = await admin!.from("volunteer_onboarding").select("user_id").eq("email", email).maybeSingle();
    if (existing) {
      await admin!
        .from("volunteer_onboarding")
        .update({ voornaam, achternaam, phone, city, area, updated_at: new Date().toISOString() })
        .eq("user_id", existing.user_id);
      success++;
      continue;
    }

    let userId: string;
    try {
      const password = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
      const { data: newUser, error: createErr } = await admin!.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr) {
        if (createErr.message?.toLowerCase().includes("already") || createErr.status === 422) {
          details.push(`Rij ${i + 2}: E-mail bestaat al`);
        } else {
          details.push(`Rij ${i + 2}: ${createErr.message}`);
        }
        continue;
      }
      userId = newUser?.user?.id ?? "";
    } catch (err) {
      details.push(`Rij ${i + 2}: ${err instanceof Error ? err.message : "Gebruiker aanmaken mislukt"}`);
      continue;
    }
    if (!userId) {
      details.push(`Rij ${i + 2}: Gebruiker kon niet worden aangemaakt`);
      continue;
    }

    const { error: insertErr } = await admin!.from("volunteer_onboarding").insert({
      user_id: userId,
      voornaam,
      achternaam,
      email,
      phone,
      city,
      area,
      step: 1,
    });
    if (insertErr) {
      details.push(`Rij ${i + 2}: ${insertErr.message}`);
      continue;
    }
    success++;
  }

  return NextResponse.json({ success, errors: rows.length - success, details });
}
