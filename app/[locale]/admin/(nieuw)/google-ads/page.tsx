import { setRequestLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import GoogleAdsClient from "./GoogleAdsClient";

export const metadata = {
  title: "Google Ads | Admin",
  robots: { index: false, follow: false },
};

export type GoogleAdsStatRow = {
  id: string;
  campaign_name: string;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  conversions: number | null;
  cost_per_conversion: number | null;
  week_start: string;
  created_at: string | null;
};

export default async function AdminGoogleAdsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let rows: GoogleAdsStatRow[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("google_ads_stats").select("*").order("week_start", { ascending: false });
    rows = (data ?? []) as GoogleAdsStatRow[];
  } catch {
    rows = [];
  }

  return <GoogleAdsClient initialRows={rows} locale={locale} />;
}
