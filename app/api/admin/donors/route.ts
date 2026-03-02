import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase };
}

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") === "recurring" ? "recurring" : "onetime";
  const search = searchParams.get("search")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";
  const dateFrom = searchParams.get("dateFrom")?.trim() ?? "";
  const dateTo = searchParams.get("dateTo")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  if (tab === "onetime") {
    let donorIdsFilter: string[] | null = null;
    if (dateFrom || dateTo) {
      let dq = supabase!.from("donations").select("donor_id").eq("status", "voltooid");
      if (dateFrom) dq = dq.gte("donatie_datum", dateFrom);
      if (dateTo) dq = dq.lte("donatie_datum", dateTo + "T23:59:59.999Z");
      const { data: dons } = await dq;
      donorIdsFilter = [...new Set((dons ?? []).map((d: { donor_id: string }) => d.donor_id))];
      if (donorIdsFilter.length === 0) return NextResponse.json({ data: [], total: 0, page, limit, tab: "onetime" });
    }
    let q = supabase!
      .from("donors")
      .select("id, voornaam, achternaam, email, land", { count: "exact" })
      .eq("verwijderd", false);
    if (donorIdsFilter) q = q.in("id", donorIdsFilter);
    if (search) q = q.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
    if (country) q = q.eq("land", country);
    q = q.order("achternaam").range(from, from + limit - 1);
    const { data: donors, error: e, count } = await q;
    if (e) return NextResponse.json({ error: e.message }, { status: 500 });
    const list = donors ?? [];
    const ids = list.map((d: { id: string }) => d.id);
    const agg: Record<string, { total: number; count: number; last: string | null }> = {};
    ids.forEach((id: string) => { agg[id] = { total: 0, count: 0, last: null }; });
    if (ids.length > 0) {
      let dq = supabase!.from("donations").select("donor_id, bedrag, donatie_datum").in("donor_id", ids).eq("status", "voltooid");
      if (dateFrom) dq = dq.gte("donatie_datum", dateFrom);
      if (dateTo) dq = dq.lte("donatie_datum", dateTo + "T23:59:59.999Z");
      const { data: dons } = await dq;
      (dons ?? []).forEach((d: { donor_id: string; bedrag: number; donatie_datum: string | null }) => {
        if (!agg[d.donor_id]) return;
        agg[d.donor_id].total += Number(d.bedrag) || 0;
        agg[d.donor_id].count += 1;
        if (d.donatie_datum && (!agg[d.donor_id].last || d.donatie_datum > agg[d.donor_id].last!)) agg[d.donor_id].last = d.donatie_datum;
      });
    }
    const data = list.map((d: { id: string; voornaam: string | null; achternaam: string | null; email: string | null; land: string | null }) => ({
      ...d,
      total_donated: agg[d.id]?.total ?? 0,
      last_donation: agg[d.id]?.last ?? null,
      donation_count: agg[d.id]?.count ?? 0,
    }));
    return NextResponse.json({ data, total: count ?? 0, page, limit, tab: "onetime" });
  }

  let rq = supabase!
    .from("recurring_donations")
    .select("id, donor_id, bedrag, valuta, frequentie, status, start_datum, volgende_betaling_datum, methode, provider_subscription_id", { count: "exact" });
  if (status && status !== "all") rq = rq.eq("status", status);
  const { data: recs, error: re } = await rq;
  if (re) return NextResponse.json({ error: re.message }, { status: 500 });
  const recList = recs ?? [];
  const donorIds = [...new Set(recList.map((r: { donor_id: string }) => r.donor_id))];
  if (donorIds.length === 0) return NextResponse.json({ data: [], total: 0, page, limit, tab: "recurring" });
  let dq = supabase!.from("donors").select("id, voornaam, achternaam, email, land").in("id", donorIds).eq("verwijderd", false);
  if (search) dq = dq.or(`voornaam.ilike.%${search}%,achternaam.ilike.%${search}%,email.ilike.%${search}%`);
  const { data: donorList } = await dq;
  const donorMap: Record<string, { id: string; voornaam: string | null; achternaam: string | null; email: string | null; land: string | null }> = {};
  (donorList ?? []).forEach((d: { id: string }) => { donorMap[d.id] = d as typeof donorMap[string]; });
  const merged = recList
    .map((r: { donor_id: string; id: string; bedrag: number; valuta: string | null; frequentie: string | null; status: string; start_datum: string | null; volgende_betaling_datum: string | null; methode: string | null; provider_subscription_id: string | null }) => {
      const donor = donorMap[r.donor_id];
      if (!donor) return null;
      return { ...donor, recurring_id: r.id, amount: r.bedrag, valuta: r.valuta ?? "EUR", frequentie: r.frequentie, status: r.status, start_datum: r.start_datum, volgende_betaling_datum: r.volgende_betaling_datum, methode: r.methode, provider_subscription_id: r.provider_subscription_id };
    })
    .filter(Boolean);
  const total = merged.length;
  const paginated = merged.slice(from, from + limit);
  return NextResponse.json({ data: paginated, total, page, limit, tab: "recurring" });
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() : "";
  const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const telefoon = typeof body.telefoon === "string" ? body.telefoon.trim() || null : null;
  const type = body.type === "bedrijf" || body.type === "persoon" ? body.type : "persoon";
  const bedrijfsnaam = type === "bedrijf" && typeof body.bedrijfsnaam === "string" ? body.bedrijfsnaam.trim() || null : null;
  const land = typeof body.land === "string" ? body.land.trim() || null : null;
  const notities = typeof body.notities === "string" ? body.notities.trim() || null : null;

  if (!voornaam || !achternaam || !email) {
    return NextResponse.json({ error: "voornaam, achternaam and email are required" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const { data, error: e } = await supabase!
    .from("donors")
    .insert({ voornaam, achternaam, email, telefoon, type, bedrijfsnaam, land: land || "NL", notities })
    .select("id")
    .single();
  if (e) return NextResponse.json({ error: e.message }, { status: e.code === "23505" ? 409 : 500 });
  return NextResponse.json(data);
}
