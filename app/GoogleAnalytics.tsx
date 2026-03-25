"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-YT9LXHPDZT";
const LOAD_DELAY_MS = 3500;

/**
 * Laadt GA4 (gtag) pas na LOAD_DELAY_MS. Consent default staat in layout (denied);
 * pas bij 'granted' via cookiebanner wordt analytics_storage geüpdatet.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const timeoutId = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      script.onload = () => {
        window.gtag("js", new Date());
        window.gtag("config", GA_MEASUREMENT_ID);
      };
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
