import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "blog-images";
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn("[blog/upload] auth: no user session");
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) {
    console.warn("[blog/upload] auth: forbidden for user", user.id);
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { error: null };
}

async function ensureBlogImagesBucket(admin: ReturnType<typeof createAdminClient>): Promise<void> {
  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) {
    console.warn("[blog/upload] listBuckets:", listError.message);
  }
  if (!listError && buckets?.some((b) => b.name === BUCKET)) {
    return;
  }

  const { error: createError } = await admin.storage.createBucket(BUCKET, { public: true });
  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    console.warn("[blog/upload] createBucket:", createError.message);
  }
}

/** Health check: bevestigt dat de route gedeployed is en of Supabase admin is geconfigureerd. */
export async function GET() {
  const configured = isSupabaseAdminConfigured();
  console.log("[blog/upload] GET health", { configured, bucket: BUCKET });
  return NextResponse.json({
    ok: true,
    route: "/api/admin/blog/upload",
    supabaseAdminConfigured: configured,
    bucket: BUCKET,
  });
}

export async function POST(request: NextRequest) {
  console.log("[blog/upload] POST received");

  if (!isSupabaseAdminConfigured()) {
    console.error(
      "[blog/upload] Supabase admin not configured — check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel"
    );
    return NextResponse.json(
      {
        error:
          "Supabase admin niet geconfigureerd. Stel NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in op Vercel.",
      },
      { status: 503 }
    );
  }

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
    console.error("[blog/upload] formData parse error:", e);
    return NextResponse.json({ error: "Ongeldig formulier" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file?.size) {
    console.warn("[blog/upload] no file in formData");
    return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  }

  console.log("[blog/upload] file:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Bestand te groot (max 10 MB)" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    console.warn("[blog/upload] rejected mime type:", file.type);
    return NextResponse.json(
      { error: `Alleen jpg, png, gif, webp toegestaan (ontvangen: ${file.type || "onbekend"})` },
      { status: 400 }
    );
  }

  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `uploads/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error("[blog/upload] createAdminClient failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Supabase admin client mislukt" },
      { status: 503 }
    );
  }

  await ensureBlogImagesBucket(admin);

  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadErr) {
    console.error("[blog/upload] storage.upload failed:", {
      bucket: BUCKET,
      path,
      message: uploadErr.message,
    });
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  console.log("[blog/upload] success:", { path, url: urlData.publicUrl });
  return NextResponse.json({ url: urlData.publicUrl, path });
}
