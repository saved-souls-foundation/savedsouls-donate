/**
 * Cron: elk uur. Verstuurt geplande nieuwsbrieven (newsletter_drafts met scheduled_at <= now).
 * Beveiligd met Vercel CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runNewsletterSend } from "@/lib/runNewsletterSend";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { data: drafts, error: fetchErr } = await admin
    .from("newsletter_drafts")
    .select("id, subject_nl, subject_en, body_nl, body_en, scheduled_at")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .is("verstuurd_op", null);

  if (fetchErr) {
    console.error("[cron/newsletter] fetch drafts error:", fetchErr);
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  const list = drafts ?? [];
  const results: { id: string; totalSent: number; failed: number }[] = [];

  for (const draft of list) {
    const payload: Record<string, unknown> = {
      subject_nl: draft.subject_nl ?? "",
      subject_en: draft.subject_en ?? "",
      body_nl: draft.body_nl ?? "",
      body_en: draft.body_en ?? "",
    };
    try {
      const { totalSent, failed } = await runNewsletterSend(payload, null);
      await admin
        .from("newsletter_drafts")
        .update({ verstuurd_op: new Date().toISOString() })
        .eq("id", draft.id);
      results.push({ id: draft.id, totalSent, failed });
      console.log("[cron/newsletter] Sent draft", draft.id, "totalSent=", totalSent, "failed=", failed);
    } catch (e) {
      console.error("[cron/newsletter] Send failed for draft", draft.id, e);
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
