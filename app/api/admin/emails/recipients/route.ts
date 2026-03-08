import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  return { error: null, admin: createAdminClient() };
}

export type RecipientRow = { email: string; naam: string };

export async function GET(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.trim() ?? "";
  const search = searchParams.get("search")?.trim() ?? "";
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") ?? "200", 10)));

  if (!type) return NextResponse.json({ error: "type is required (inbox|adoptanten|vrijwilligers|nieuwsbrief)" }, { status: 400 });

  if (type === "inbox") {
    let q = admin!
      .from("incoming_emails")
      .select("van_email, van_naam")
      .not("van_email", "is", null)
      .limit(limit);
    if (search) q = q.or(`van_email.ilike.%${search}%,van_naam.ilike.%${search}%`);
    q = q.order("ontvangen_op", { ascending: false });
    const { data: rows } = await q;
    const data: RecipientRow[] = (rows ?? []).map((r: { van_email: string | null; van_naam: string | null }) => ({
      email: (r.van_email ?? "").trim().toLowerCase(),
      naam: [r.van_naam].filter(Boolean).join(" ").trim() || "",
    })).filter((r: RecipientRow) => r.email);
    return NextResponse.json({ data });
  }

  if (type === "adoptanten") {
    let q = admin!
      .from("profiles")
      .select("email, voornaam, achternaam")
      .eq("role", "adoptant")
      .or("verwijderd.eq.false,verwijderd.is.null")
      .not("email", "is", null)
      .limit(limit);
    if (search) q = q.or(`email.ilike.%${search}%,voornaam.ilike.%${search}%,achternaam.ilike.%${search}%`);
    const { data: rows } = await q;
    const data: RecipientRow[] = (rows ?? []).map((r: { email: string | null; voornaam: string | null; achternaam: string | null }) => ({
      email: (r.email ?? "").trim().toLowerCase(),
      naam: [r.voornaam, r.achternaam].filter(Boolean).join(" ").trim() || "",
    })).filter((r: RecipientRow) => r.email);
    return NextResponse.json({ data });
  }

  if (type === "vrijwilligers") {
    let q = admin!
      .from("volunteer_onboarding")
      .select("email, voornaam, achternaam")
      .not("email", "is", null)
      .limit(limit);
    if (search) q = q.or(`email.ilike.%${search}%,voornaam.ilike.%${search}%,achternaam.ilike.%${search}%`);
    const { data: rows } = await q;
    const data: RecipientRow[] = (rows ?? []).map((r: { email: string | null; voornaam: string | null; achternaam: string | null }) => ({
      email: (r.email ?? "").trim().toLowerCase(),
      naam: [r.voornaam, r.achternaam].filter(Boolean).join(" ").trim() || "",
    })).filter((r: RecipientRow) => r.email);
    return NextResponse.json({ data });
  }

  if (type === "nieuwsbrief") {
    let q = admin!
      .from("newsletter_subscribers")
      .select("email, voornaam, achternaam")
      .limit(limit);
    if (search) q = q.or(`email.ilike.%${search}%,voornaam.ilike.%${search}%,achternaam.ilike.%${search}%`);
    q = q.order("aangemeld_op", { ascending: false });
    const { data: rows } = await q;
    const data: RecipientRow[] = (rows ?? []).map((r: { email: string | null; voornaam: string | null; achternaam: string | null }) => ({
      email: (r.email ?? "").trim().toLowerCase(),
      naam: [r.voornaam, r.achternaam].filter(Boolean).join(" ").trim() || "",
    })).filter((r: RecipientRow) => r.email);
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
