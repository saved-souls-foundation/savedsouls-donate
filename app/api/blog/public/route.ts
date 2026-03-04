import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * Publieke lijst van gepubliceerde blogposts (geen auth).
 * Gebruikt Nederlandse kolommen: titel, inhoud, gepubliceerd_op.
 * Status: 'published' of 'Gepubliceerd' (beide worden gematcht).
 */
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("posts")
      .select("id, slug, titel, inhoud, gepubliceerd_op, category, source")
      .or("status.eq.published,status.eq.Gepubliceerd")
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
      titel: row.titel,
      inhoud: row.inhoud,
      gepubliceerd_op: row.gepubliceerd_op,
      category: row.category,
      source: row.source,
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
