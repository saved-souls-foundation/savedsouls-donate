import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const serverSupabase = await createClient();
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await serverSupabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data, error: debugError, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" });

  console.log("=== NEWSLETTER DEBUG ===");
  console.log("Count:", count);
  console.log("Error:", debugError);
  console.log("Data:", data);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";
  const language = searchParams.get("language")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  let q = supabase
    .from("newsletter_subscribers")
    .select("id, email, voornaam, achternaam, type, language, actief, aangemeld_op, uitgeschreven_op, unsubscribe_token", { count: "exact" });

  if (status === "actief") q = q.eq("actief", true);
  else if (status === "inactief") q = q.eq("actief", false);

  if (type === "persoon" || type === "bedrijf") q = q.eq("type", type);
  if (language && language !== "all") q = q.eq("language", language);

  if (search) {
    q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  }

  q = q.order("aangemeld_op", { ascending: false }).range(from, from + limit - 1);

  const { data: listData, error: e, count } = await q;
  console.log("[admin/newsletter] GET result:", { rowCount: listData?.length ?? 0, total: count ?? 0, page, limit, error: e?.message ?? null });
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data: listData ?? [], total: count ?? 0, page, limit });
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: { email?: string; voornaam?: string; achternaam?: string; language?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Geldig e-mailadres is verplicht." }, { status: 400 });
  }
  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() || null : null;
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() || null : null;
  const language = typeof body.language === "string" && ["nl", "en", "es", "ru", "th", "de", "fr"].includes(body.language) ? body.language : "nl";
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : null;

  const { data: existing } = await supabase!.from("newsletter_subscribers").select("id, actief").eq("email", email).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "Dit e-mailadres staat al in de lijst." }, { status: 409 });
  }

  const unsubscribe_token = crypto.randomUUID();
  const { data: inserted, error: insertErr } = await supabase!
    .from("newsletter_subscribers")
    .insert({
      email,
      voornaam,
      achternaam,
      type,
      language,
      actief: true,
      unsubscribe_token,
    })
    .select("id, email, aangemeld_op")
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  const { sendNewsletterConfirmation } = await import("@/lib/newsletterConfirmation");
  const naam = [voornaam, achternaam].filter(Boolean).join(" ").trim() || undefined;
  sendNewsletterConfirmation({ email, naam });

  return NextResponse.json({ data: inserted, message: "Abonnee toegevoegd." }, { status: 201 });
}
