import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Alleen veilige storage-paden: geen path traversal, geen absolute paden, redelijke lengte. */
function isValidStoragePath(path: string): boolean {
  const trimmed = path.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 512) return false;
  if (trimmed.includes("..")) return false;
  if (trimmed.startsWith("/")) return false;
  // Toegestaan: letters, cijfers, slash, streepje, underscore, punt (voor extensie)
  if (!/^[a-zA-Z0-9/_.-]+$/.test(trimmed)) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    // ——— Stap 1: Sessie ———
    const cookieStore = await cookies();
    const serverSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    // ——— Stap 2: Profiel / admin-rechten ———
    const { data: profile } = await serverSupabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
    const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
    }

    // ——— Stap 3: Path-validatie (geen lege of kwaadaardige string) ———
    let body: { path?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Ongeldige JSON-body." }, { status: 400 });
    }
    const pathRaw = body?.path;
    if (typeof pathRaw !== "string" || !isValidStoragePath(pathRaw)) {
      return NextResponse.json({ error: "Ongeldig of onveilig path." }, { status: 400 });
    }
    const path = pathRaw.trim();

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("volunteer-docs")
      .createSignedUrl(path, 60);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ url: data.signedUrl });
  } catch (e) {
    console.error("[admin/signed-url]", e);
    return NextResponse.json({ error: "Kon signed URL niet aanmaken." }, { status: 500 });
  }
}
