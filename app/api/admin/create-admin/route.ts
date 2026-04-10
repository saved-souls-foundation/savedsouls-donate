import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase admin is niet geconfigureerd." }, { status: 503 });
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: profile } = await serverClient
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.is_admin !== true) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  let body: { voornaam?: string; achternaam?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body." }, { status: 400 });
  }

  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() : "";
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() : "";
  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!voornaam || !achternaam || !emailRaw || !password) {
    return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Wachtwoord moet minimaal 8 tekens zijn." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailRaw)) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const now = new Date().toISOString();

  const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
    email: emailRaw,
    password,
    email_confirm: true,
  });

  if (authError) {
    const msg = (authError.message || "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists") || authError.status === 422) {
      return NextResponse.json({ error: "Dit e-mailadres is al geregistreerd." }, { status: 409 });
    }
    return NextResponse.json({ error: authError.message || "Account aanmaken mislukt." }, { status: 400 });
  }

  const newId = newUser?.user?.id;
  if (!newId) {
    return NextResponse.json({ error: "Gebruiker kon niet worden aangemaakt." }, { status: 500 });
  }

  const { error: profileError } = await adminClient.from("profiles").upsert(
    {
      id: newId,
      email: emailRaw,
      voornaam,
      achternaam,
      role: "admin",
      is_admin: true,
      aangemeld_op: now,
      updated_at: now,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    await adminClient.auth.admin.deleteUser(newId);
    return NextResponse.json(
      { error: "Profiel aanmaken mislukt, account teruggedraaid." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    email: emailRaw,
    voornaam,
    achternaam,
  });
}
