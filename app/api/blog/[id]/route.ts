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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const admin = createAdminClient();
  const { data, error: e } = await admin.from("posts").select("*").eq("id", id).single();

  if (e) return NextResponse.json({ error: e.message }, { status: 404 });
  return NextResponse.json({ post: data });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...(body.titel != null && { titel: body.titel }),
    ...(body.title != null && { titel: body.title }),
    ...(body.inhoud != null && { inhoud: body.inhoud }),
    ...(body.body != null && { inhoud: body.body }),
    ...(body.body_en != null && { body_en: body.body_en }),
    ...(body.body_th != null && { body_th: body.body_th }),
    ...(body.category != null && { category: body.category }),
    ...(body.status != null && { status: body.status }),
    ...(body.source != null && { source: body.source }),
    ...(body.slug != null && { slug: body.slug }),
    ...(body.meta_description != null && { meta_description: body.meta_description }),
    ...(body.gepubliceerd_op != null && { gepubliceerd_op: body.gepubliceerd_op }),
    ...(body.published_at != null && { gepubliceerd_op: body.published_at ? new Date(body.published_at).toISOString() : null }),
  };

  const admin = createAdminClient();
  const { data, error: e } = await admin
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const admin = createAdminClient();
  const { error: e } = await admin.from("posts").delete().eq("id", id);

  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
