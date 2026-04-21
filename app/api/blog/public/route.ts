import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * Publieke lijst van gepubliceerde blogposts (geen auth).
 * Lijst zonder volledige inhoud — detail via /api/blog/public/[slug].
 * Tijdelijk revalidate=0 zodat nieuwe publicaties direct zichtbaar zijn (geen lange edge-cache).
 */
export const revalidate = 0;

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("posts")
      .select("id, slug, titel, gepubliceerd_op, category, hero_image")
      .in("status", ["published", "Gepubliceerd"])
      .not("gepubliceerd_op", "is", null)
      .order("gepubliceerd_op", { ascending: false, nullsFirst: false });

    const count = rows?.length ?? 0;
    console.log("[blog/public] Gepubliceerde posts opgehaald:", count);

    if (error) {
      console.error("[blog/public] DB-fout:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts = (rows ?? []).map((row) => ({
      id: row.id,
      slug: row.slug ?? row.id,
      title: row.titel,
      published_at: row.gepubliceerd_op,
      category: row.category ?? null,
      hero_image: row.hero_image ?? null,
    }));

    return NextResponse.json({ posts });
  } catch (e) {
    console.error("[blog/public] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
