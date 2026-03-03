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

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const tab = request.nextUrl.searchParams.get("tab");
  if (tab !== "recurring") return NextResponse.json({});
  const { data: recs, error: e } = await supabase!.from("recurring_donations").select("bedrag, frequentie, status");
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  const list = recs ?? [];
  let activeCount = 0;
  let totalMonthlyAmount = 0;
  let paymentIssuesCount = 0;
  list.forEach((r: { bedrag: number; frequentie: string | null; status: string }) => {
    if (r.status === "actief") {
      activeCount++;
      const monthly = r.frequentie === "kwartaal" ? Number(r.bedrag) / 3 : r.frequentie === "jaarlijks" ? Number(r.bedrag) / 12 : Number(r.bedrag);
      totalMonthlyAmount += monthly;
    } else if (r.status === "betalingsprobleem") paymentIssuesCount++;
  });
  return NextResponse.json({ activeCount, totalMonthlyAmount, paymentIssuesCount });
}
