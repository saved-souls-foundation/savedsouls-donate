import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "dier-fotos";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isVrijwilliger = profile?.role === "vrijwilliger";
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isVrijwilliger && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }
  const dierId = formData.get("dier_id")?.toString()?.trim();
  const notitie = formData.get("notitie")?.toString()?.trim() ?? null;
  const file = formData.get("file") as File | null;
  if (!dierId || !file?.size) return NextResponse.json({ error: "dier_id and file required" }, { status: 400 });

  const admin = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
  const path = `${dierId}/${Date.now()}.${safeExt}`;

  const buf = await file.arrayBuffer();
  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadErr) {
    console.error("[portal/dier-foto] upload error:", uploadErr);
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const fotoUrl = urlData?.publicUrl ?? path;

  const { error: insertErr } = await admin.from("dier_fotos").insert({
    dier_id: dierId,
    foto_url: fotoUrl,
    notitie,
    gemaakt_door: user.id,
  });
  if (insertErr) {
    console.error("[portal/dier-foto] dier_fotos insert error:", insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, foto_url: fotoUrl });
}
