/**
 * Cron: maandag 09:00 UTC. Herinnering om Google Ads-weekcijfers in te voeren.
 * Beveiligd met Vercel CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 */
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : "https://www.savedsouls-foundation.org";
  const href = `${base}/nl/admin/google-ads`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1e293b;">
  <p>Hallo,</p>
  <p>Dit is je wekelijkse herinnering om de <strong>Google Ads</strong>-statistieken bij te werken.</p>
  <p><a href="${href}" style="color: #0d9488;">Open het Google Ads-dashboard →</a></p>
  <p style="font-size: 12px; color: #64748b;">${href}</p>
</body>
</html>
`.trim();

  const text = `Wekelijkse herinnering: voer je Google Ads-cijfers in.\n\n${href}`;

  const result = await sendMail({
    to: "mike@savedsouls-foundation.org",
    subject: "Google Ads — wekelijkse update invoeren",
    text,
    html,
  });

  if (!result.success) {
    console.error("[cron/google-ads-reminder] sendMail:", result.error);
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
