import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Lijst dieren (id, naam) voor dropdown; alleen voor ingelogde vrijwilliger of admin */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isVrijwilliger = profile?.role === "vrijwilliger";
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isVrijwilliger && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dieren")
    .select("id, naam")
    .order("naam");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dieren: data ?? [] });
}
