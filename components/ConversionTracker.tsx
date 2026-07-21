"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ConversionTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const rawAmount = searchParams?.get("amount");
    const value = rawAmount ? parseFloat(rawAmount) : undefined;
    const transactionId = `ssf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Google Ads conversie
    window.gtag("event", "conversion", {
      send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL}`,
      currency: "EUR",
      value: value || 0,
      transaction_id: transactionId,
    });

    // GA4 purchase event
    window.gtag("event", "purchase", {
      currency: "EUR",
      value: value || 0,
      transaction_id: transactionId,
    });
  }, [searchParams]);

  return null;
}
