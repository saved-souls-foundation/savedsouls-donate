import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

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

  if (e) {
    console.error("[blog] GET error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ posts: rows ?? [] });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const titel = body.title ?? body.titel ?? null;
  const inhoud = body.body ?? body.inhoud ?? null;
  const status = body.status ?? "concept";
  const isPublished = status === "published" || status === "Gepubliceerd";
  const gepubliceerdOp = body.published_at
    ? new Date(body.published_at).toISOString()
    : isPublished
      ? new Date().toISOString()
      : null;

  let slug: string | null =
    (typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : null) || null;
  if (!slug && titel) {
    slug = slugify(titel) || null;
  }
  if (!slug) {
    slug = `post-${Date.now()}`;
  }

  const insertData = {
    titel,
    inhoud,
    body_en: body.body_en ?? null,
    body_th: body.body_th ?? null,
    category: body.category ?? "nieuws",
    status,
    source: body.source ?? "manual",
    slug,
    meta_description: body.meta_description ?? null,
    gepubliceerd_op: gepubliceerdOp,
  };
  console.log("[blog] POST insert:", { titel: insertData.titel?.slice(0, 40), status, slug });
  const admin = createAdminClient();
  const { data, error: e } = await admin.from("posts").insert(insertData).select().single();

  if (e) {
    console.error("[blog] POST DB error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  console.log("[blog] POST success, id:", data?.id);
  return NextResponse.json({ post: data });
}
