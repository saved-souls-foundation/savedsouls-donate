import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * Eén gepubliceerde post ophalen op slug (publiek, geen auth).
 * Kolommen: titel, inhoud, gepubliceerd_op.
 * Tijdelijk revalidate=0 — zelfde reden als /api/blog/public.
 */
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data: row, error } = await admin
      .from("posts")
      .select("id, slug, titel, inhoud, gepubliceerd_op, body_en, body_th, category, source, hero_image")
      .in("status", ["published", "Gepubliceerd"])
      .not("gepubliceerd_op", "is", null)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[blog/public/slug] DB-fout:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      post: {
        id: row.id,
        slug: row.slug ?? row.id,
        titel: row.titel,
        inhoud: row.inhoud,
        body_en: row.body_en,
        body_th: row.body_th,
        gepubliceerd_op: row.gepubliceerd_op,
        category: row.category,
        source: row.source,
        hero_image: row.hero_image ?? null,
      },
    });
  } catch (e) {
    console.error("[blog/public/slug] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch post" },
      { status: 500 }
    );
  }
}
