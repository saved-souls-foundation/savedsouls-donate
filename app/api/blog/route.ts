import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin)
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const admin = createAdminClient();
  const { data: rows, error: e } = await admin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ posts: rows ?? [] });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const insertData = {
    titel: body.title ?? null,
    inhoud: body.body ?? null,
    body_en: body.body_en ?? null,
    body_th: body.body_th ?? null,
    category: body.category ?? "nieuws",
    status: body.status ?? "concept",
    source: body.source ?? "manual",
    slug: body.slug ?? null,
    meta_description: body.meta_description ?? null,
    gepubliceerd_op: body.published_at ? new Date(body.published_at).toISOString() : null,
  };
  console.log("[blog] Poging publiceren:", insertData);
  const admin = createAdminClient();
  const { data, error: e } = await admin.from("posts").insert(insertData).select().single();
  console.log("[blog] DB Resultaat:", e);

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ post: data });
}
