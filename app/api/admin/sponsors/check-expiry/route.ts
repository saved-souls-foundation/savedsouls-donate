import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/sendMail";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@savedsouls-foundation.org";

/** Allow either cron secret (Vercel Cron) or admin session */
async function allowCronOrAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { allowed: true as const, supabase: createAdminClient() };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false as const, supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { allowed: false as const, supabase: null };
  return { allowed: true as const, supabase };
}

export async function GET(request: NextRequest) {
  const { allowed, supabase } = await allowCronOrAdmin(request);
  if (!allowed || !supabase) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const nowStr = now.toISOString().slice(0, 10);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const { data: expiring } = await supabase
    .from("sponsors")
    .select("id, bedrijfsnaam, contract_eind")
    .eq("status", "actief")
    .lte("contract_eind", in30Days)
    .gte("contract_eind", nowStr)
    .eq("herinnering_verstuurd", false);

  const { data: toExpire } = await supabase
    .from("sponsors")
    .select("id")
    .eq("status", "actief")
    .lt("contract_eind", nowStr);

  const idsToSetReminder = (expiring ?? []).map((r: { id: string }) => r.id);
  const idsToSetExpired = (toExpire ?? []).map((r: { id: string }) => r.id);

  if (idsToSetReminder.length > 0) {
    await supabase.from("sponsors").update({ herinnering_verstuurd: true }).in("id", idsToSetReminder);
  }
  if (idsToSetExpired.length > 0) {
    await supabase.from("sponsors").update({ status: "verlopen" }).in("id", idsToSetExpired);
  }

  const count = expiring?.length ?? 0;
  if (count > 0 && ADMIN_EMAIL) {
    const lines = (expiring ?? []).map(
      (r: { bedrijfsnaam: string | null; contract_eind: string | null }) => `- ${r.bedrijfsnaam ?? "—"} (contract until ${r.contract_eind ?? "—"})`
    );
    const subject = `${count} sponsor contract(s) expiring soon`;
    const body = `The following sponsor contract(s) expire within 30 days:\n\n${lines.join("\n")}`;
    await sendMail({ to: ADMIN_EMAIL, subject, text: body });
  }

  return NextResponse.json({
    ok: true,
    reminderSent: count,
    setExpired: idsToSetExpired.length,
  });
}
