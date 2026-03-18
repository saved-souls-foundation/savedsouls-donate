/**
 * Cron: scrapet GoFundMe campaign (raised, laatste donaties) en slaat op in campaign_stats.
 * Alleen toegankelijk met CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 * Schedule: 0 20 * * * (20:00 UTC = 03:00 Thai tijd)
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const GOFUNDME_URL =
  "https://www.gofundme.com/f/300-dogs-fighting-to-survive-in-thailand-be-their-hope";
const CAMPAIGN_STATS_ID = "00000000-0000-0000-0000-000000000001";
const GOAL_EUR = 120_000;

type DonationEntry = { name: string; amount: number; currency: string };

function parseRaisedFromHtml(html: string): number | null {
  // "€2,856 raised" of "€2.856 raised" (EU format)
  const raisedMatch = html.match(/€\s*([\d.,]+)\s*raised/i);
  if (raisedMatch) {
    const num = parseInt(raisedMatch[1].replace(/[.,\s]/g, ""), 10);
    if (!Number.isNaN(num)) return num;
  }
  // "raised of €X" — soms staat alleen goal, dan zoeken we "X raised"
  const alt = html.match(/raised\s+of\s+€[\d.,]+/i);
  if (alt) {
    const before = html.slice(0, html.indexOf(alt[0]));
    const lastEur = before.match(/€\s*([\d.,]+)\s*$/);
    if (lastEur) {
      const num = parseInt(lastEur[1].replace(/[.,\s]/g, ""), 10);
      if (!Number.isNaN(num)) return num;
    }
  }
  return null;
}

function parseDonationsFromHtml(html: string): DonationEntry[] {
  const donations: DonationEntry[] = [];
  // "Name donated €100" of "Name donated €1,000"
  const donatedRe = /([A-Za-zÀ-ÿ\s]+)\s+donated\s+€\s*([\d.,]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = donatedRe.exec(html)) !== null) {
    const name = m[1].trim();
    const amount = parseInt(m[2].replace(/[.,\s]/g, ""), 10);
    if (name.length > 0 && !Number.isNaN(amount))
      donations.push({ name, amount, currency: "EUR" });
  }
  // Donations list: ">Name<" gevolgd door "€34" (link + bedrag)
  const linkAmountRe = /(?:>|"])\s*([A-Za-zÀ-ÿ\s]{2,50}?)\s*(?:<|\[).*?€\s*([\d.,]+)/g;
  while ((m = linkAmountRe.exec(html)) !== null) {
    const name = m[1].trim();
    const amount = parseInt(m[2].replace(/[.,\s]/g, ""), 10);
    if (name.length > 0 && !Number.isNaN(amount)) {
      const exists = donations.some((d) => d.name === name && d.amount === amount);
      if (!exists) donations.push({ name, amount, currency: "EUR" });
    }
  }
  // Unieke donaties, laatste 5
  const seen = new Set<string>();
  const unique = donations.filter((d) => {
    const key = `${d.name}-${d.amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.slice(-5);
}

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let html: string;
  try {
    const res = await fetch(GOFUNDME_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    console.error("[cron/scrape-gofundme] fetch error:", e);
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 502 }
    );
  }

  const raised = parseRaisedFromHtml(html);
  const donations = parseDonationsFromHtml(html);

  const admin = createAdminClient();
  const row = {
    id: CAMPAIGN_STATS_ID,
    raised_eur: raised ?? 0,
    goal_eur: GOAL_EUR,
    donations: donations as unknown as Record<string, unknown>[],
    gofundme_url: GOFUNDME_URL,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("campaign_stats").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    console.error("[cron/scrape-gofundme] upsert error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    raised: raised ?? 0,
    donations,
  });
}
