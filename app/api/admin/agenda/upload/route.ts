import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "agenda-attachments";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}

export async function POST(request: NextRequest) {
  const err = await requireAdmin();
  if (err.error) return err.error;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file?.size) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Max 10 MB" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Alleen PDF, JPG, PNG" }, { status: 400 });

  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `attachments/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, { contentType: file.type, upsert: false });
  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
