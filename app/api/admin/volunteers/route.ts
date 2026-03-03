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

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  let body: { voornaam?: string; achternaam?: string; email?: string; phone?: string; city?: string; area?: string; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Geldig e-mailadres is verplicht." }, { status: 400 });
  }

  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() || null : null;
  if (!voornaam) {
    return NextResponse.json({ error: "Voornaam is verplicht." }, { status: 400 });
  }

  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() || null : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() || null : null;
  const city = typeof body.city === "string" ? body.city.trim() || null : null;
  const area = typeof body.area === "string" ? body.area.trim() || null : null;
  const language = typeof body.language === "string" ? body.language.trim() || null : null;

  const { data: existing } = await supabase!
    .from("volunteer_onboarding")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "E-mail bestaat al." }, { status: 409 });
  }

  const password = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  const { data: newUser, error: createUserError } = await supabase!.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createUserError) {
    const msg = createUserError.message || "";
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered") || createUserError.status === 422) {
      return NextResponse.json({ error: "E-mail bestaat al." }, { status: 409 });
    }
    return NextResponse.json({ error: createUserError.message }, { status: 500 });
  }

  if (!newUser?.user?.id) {
    return NextResponse.json({ error: "Gebruiker kon niet worden aangemaakt." }, { status: 500 });
  }

  const { error: insertErr } = await supabase!.from("volunteer_onboarding").insert({
    user_id: newUser.user.id,
    voornaam,
    achternaam,
    email,
    phone,
    city,
    area,
    language,
    step: 1,
  });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user_id: newUser.user.id }, { status: 201 });
}
