import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  try {
    await admin.rpc("stop_test_spotlight_cron");
  } catch (e) {
    console.error("[test-spotlight/stop] cron unschedule error:", e);
  }

  const { data: updated, error: updateErr } = await admin
    .from("posts")
    .update({ status: "concept" })
    .eq("source", "test-24h")
    .eq("status", "published")
    .select("id");

  if (updateErr) {
    console.error("[test-spotlight/stop] posts update error:", updateErr);
    return NextResponse.json(
      { error: updateErr.message },
      { status: 500 }
    );
  }

  const postsArchived = (updated ?? []).length;

  return NextResponse.json({
    stopped: true,
    postsArchived,
  });
}
