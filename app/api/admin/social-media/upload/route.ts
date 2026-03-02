import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "social-media-uploads";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin)
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: null };
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Bestand te groot (max 50 MB)" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Alleen jpg, png, gif, mp4, mov toegestaan" },
      { status: 400 }
    );
  }

  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `uploads/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
