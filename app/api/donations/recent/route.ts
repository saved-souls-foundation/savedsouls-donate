import { NextRequest, NextResponse } from "next/server";

const LOCALE_MAP: Record<string, string> = {
  nl: "nl-NL",
  en: "en-GB",
  de: "de-DE",
  th: "th-TH",
  es: "es-ES",
  ru: "ru-RU",
};

/** Placeholder donaties – vaste spreiding over laatste 6 dagen (vandaag, 2h, 1d, 2d, 4d, 5d) */
const PLACEHOLDER_AMOUNTS = [
  { amount: 25, currency: "EUR" },
  { amount: 50, currency: "EUR" },
  { amount: 15, currency: "EUR" },
  { amount: 100, currency: "EUR" },
  { amount: 50, currency: "EUR" },
];

/** Offsets in uren – max 6 dagen terug (23 feb → 17 feb), nooit ouder */
const OFFSETS_HOURS = [0, 3, 24, 48, 72, 120];

function getPlaceholderDonations(): { amount: number; currency: string; createdAt: string }[] {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  return PLACEHOLDER_AMOUNTS.map((d, i) => ({
    ...d,
    createdAt: new Date(now - OFFSETS_HOURS[i % OFFSETS_HOURS.length] * hourMs).toISOString(),
  }));
}

export type RecentDonation = {
  amount: number;
  currency: string;
  timeAgo: string;
};

function formatTimeAgo(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  const loc = LOCALE_MAP[locale] || "en-GB";
  return date.toLocaleDateString(loc, { day: "numeric", month: "short" });
}

function formatDonation(amount: number, currency: string, locale: string): string {
  const sym = currency === "EUR" ? "€" : currency === "THB" ? "฿" : currency + " ";
  const loc = LOCALE_MAP[locale] || "en-GB";
  return `${sym}${amount.toLocaleString(loc, { maximumFractionDigits: 0 })}`;
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "en";
  const placeholderData = getPlaceholderDonations();
  const donations = placeholderData.map((d) => ({
    display: `${formatDonation(d.amount, d.currency, locale)} – ${formatTimeAgo(d.createdAt, locale)}`,
    amount: d.amount,
    currency: d.currency,
  }));
  return NextResponse.json({ donations }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
