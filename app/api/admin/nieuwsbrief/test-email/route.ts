import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/sendMail";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: { email?: string; naam?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ongeldig of ontbrekend e-mailadres" }, { status: 400 });
  }

  const naam = typeof body.naam === "string" ? body.naam.trim() : "";

  const { success, error: sendError } = await sendMail({
    to: email,
    subject: "Test nieuwsbrief – Saved Souls Foundation",
    text: `Hallo${naam ? ` ${naam}` : ""},\n\nDit is een testmail van de nieuwsbrief van Saved Souls Foundation.\n\nAls je dit ontvangt, werkt de test goed.\n\nMet vriendelijke groet,\nSaved Souls Foundation`,
    html: `<p>Hallo${naam ? ` ${naam}` : ""},</p><p>Dit is een testmail van de nieuwsbrief van Saved Souls Foundation.</p><p>Als je dit ontvangt, werkt de test goed.</p><p>Met vriendelijke groet,<br>Saved Souls Foundation</p>`,
  });

  if (!success) {
    return NextResponse.json({ error: sendError ?? "Verzenden mislukt" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
