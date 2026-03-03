import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Supabase Storage bucket for sponsor logos. Create in Dashboard → Storage → New bucket "sponsor-logos" (public if logo URLs should work without signed URLs). */
const BUCKET = "sponsor-logos";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

function getExt(mime: string): string {
  if (mime === "image/svg+xml") return "svg";
  if (mime === "image/png") return "png";
  return "jpg";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const { data: sponsor } = await supabase!.from("sponsors").select("id").eq("id", id).maybeSingle();
  if (!sponsor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file or empty file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG or SVG allowed" }, { status: 400 });
  }

  const ext = getExt(file.type);
  const path = `${id}/logo.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const logo_url = urlData.publicUrl;

  const { data: updated, error: updateErr } = await supabase!
    .from("sponsors")
    .update({ logo_url })
    .eq("id", id)
    .select("logo_url")
    .single();
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ logo_url: updated?.logo_url ?? logo_url });
}
