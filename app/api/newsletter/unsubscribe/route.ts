import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Mask email for display: j***@example.com */
function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length === 0) return "***" + domain;
  return local[0] + "***" + domain;
}

/**
 * GET /api/newsletter/unsubscribe?token=xxx
 * No auth. Handles: success (unsubscribed), already (already inactive or invalid token), error.
 * On success: sets actief = false, uitgeschreven_op = now(), returns maskedEmail.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? null;
  if (!token) {
    return NextResponse.json({ status: "already" as const }, { status: 200 });
  }

  try {
    const supabase = createAdminClient();
    const { data: row, error: selectErr } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, actief")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (selectErr) {
      console.error("[newsletter] unsubscribe select error:", selectErr);
      return NextResponse.json({ status: "error" as const }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ status: "already" as const }, { status: 200 });
    }

    if (row.actief === false) {
      return NextResponse.json({ status: "already" as const }, { status: 200 });
    }

    const { error: updateErr } = await supabase
      .from("newsletter_subscribers")
      .update({ actief: false, uitgeschreven_op: new Date().toISOString() })
      .eq("id", row.id);

    if (updateErr) {
      console.error("[newsletter] unsubscribe update error:", updateErr);
      return NextResponse.json({ status: "error" as const }, { status: 500 });
    }

    const maskedEmail = row.email ? maskEmail(row.email) : undefined;
    return NextResponse.json({ status: "success" as const, maskedEmail }, { status: 200 });
  } catch (e) {
    console.error("[newsletter] unsubscribe exception:", e);
    return NextResponse.json({ status: "error" as const }, { status: 500 });
  }
}
