import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET: lijst dieren (id = UUID, naam) voor agenda dropdown; admin only */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dieren")
    .select("id, naam, soort")
    .order("naam");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const list = (data ?? []).map((d) => ({
    id: d.id,
    name: d.naam ?? "",
    type: (d.soort === "kat" ? "cat" : "dog") as "dog" | "cat",
  }));
  return NextResponse.json({ dogs: list.filter((a) => a.type === "dog"), cats: list.filter((a) => a.type === "cat"), all: list });
}
