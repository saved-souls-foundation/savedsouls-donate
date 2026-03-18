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
  // "€2,856 raised of €120K" of "€ 2,856 raised"
  const withGoal = html.match(/€\s*([\d.,]+)\s*raised\s+of\s+€/i);
  if (withGoal) {
    const num = parseInt(withGoal[1].replace(/[.,\s]/g, ""), 10);
    if (!Number.isNaN(num) && num < 1_000_000) return num;
  }
  const direct = html.match(/€\s*([\d.,]+)\s*raised/i);
  if (direct) {
    const num = parseInt(direct[1].replace(/[.,\s]/g, ""), 10);
    if (!Number.isNaN(num) && num < 1_000_000) return num;
  }
  // Fallback: tekst tussen eerste € en "raised" — eerste getal
  const raisedIdx = html.search(/\braised\s+of\s+€/i);
  if (raisedIdx > 0) {
    const snippet = html.slice(0, raisedIdx);
    const lastEur = snippet.match(/€\s*([\d.,]+)\s*$/);
    if (lastEur) {
      const num = parseInt(lastEur[1].replace(/[.,\s]/g, ""), 10);
      if (!Number.isNaN(num) && num < 1_000_000) return num;
    }
  }
  return null;
}

const UI_LABELS = new Set([
  "skip to content", "share", "read more", "read story", "donate", "see all",
  "see top", "recent donation", "top donation", "organizer", "message", "new",
]);

function parseDonationsFromHtml(html: string): DonationEntry[] {
  const donations: DonationEntry[] = [];
  // Alleen "Name donated €100" — echte donorregels
  const donatedRe = /([A-Za-zÀ-ÿ\s]+)\s+donated\s+€\s*([\d.,]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = donatedRe.exec(html)) !== null) {
    const name = m[1].trim();
    const amount = parseInt(m[2].replace(/[.,\s]/g, ""), 10);
    const nameLower = name.toLowerCase();
    if (
      name.length >= 2 &&
      name.length <= 50 &&
      !Number.isNaN(amount) &&
      amount > 0 &&
      amount < 100_000 &&
      !UI_LABELS.has(nameLower) &&
      !/^\d+$/.test(name)
    ) {
      donations.push({ name, amount, currency: "EUR" });
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
