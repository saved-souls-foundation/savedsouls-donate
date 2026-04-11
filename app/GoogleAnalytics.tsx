"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-LWC1BYBJE4";
const LOAD_DELAY_MS = 3500;

/**
 * GA4-config pas na LOAD_DELAY_MS. gtag.js wordt al in root layout geladen (Google Ads);
 * hier alleen nog G- measurement config — geen tweede gtag.js-request.
 * Consent default staat in layout (denied); bij accepteren cookiebanner wordt storage geüpdatet.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const timeoutId = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
      }

      const hasGtagJs = document.querySelector(
        'script[src^="https://www.googletagmanager.com/gtag/js"]',
      );
      if (hasGtagJs) {
        window.gtag("config", GA_MEASUREMENT_ID);
        return;
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
