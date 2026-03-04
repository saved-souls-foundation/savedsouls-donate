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
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const { data: posts, error: e } = await supabase!
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ posts: posts ?? [] });
}

export async function POST(req: Request) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;

  const body = await req.json();

  const { data, error: e } = await supabase!
    .from("posts")
    .insert(body)
    .select()
    .single();

  if (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ post: data });
}
