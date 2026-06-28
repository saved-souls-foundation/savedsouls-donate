/**
 * Google Ads conversion (AW) — zie layout gtag.js load.
 * {@link https://support.google.com/google-ads/answer/6331314}
 */

console.log('BUILD-TIME CHECK:', process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL);

export const GOFUNDME_CAMPAIGN_URL =
  "https://www.gofundme.com/f/300-dogs-fighting-to-survive-in-thailand-be-their-hope";

/**
 * Bouwt een absolute URL voor navigatie na de conversion-callback (next-intl-paden).
 */
export function resolveDonationNavigationUrl(href: string, locale: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (href.startsWith("/#")) {
    return `${origin}/${locale}${href.slice(1)}`;
  }
  const hashIdx = href.indexOf("#");
  const pathOnly = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
  if (pathOnly.startsWith("#")) {
    return `${origin}/${locale}${pathOnly}${hash}`;
  }
  const path = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  return `${origin}/${locale}${path}${hash}`;
}

/**
 * Tweede argument wordt genegeerd (backward compatible met oudere aanroepen elders in de repo).
 */
export function gtagReportConversion(url?: string, _legacy?: unknown): boolean {
  if (typeof window === "undefined") return false;

  if (typeof window.gtag !== "function") {
    if (url) window.location.href = url;
    return false;
  }

  let navigated = false;
  const callback = () => {
    if (url && !navigated) {
      navigated = true;
      window.location.href = url;
    }
  };

  if (url) setTimeout(callback, 1000);

  window.gtag("event", "conversion", {
    send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL}`,
    value: 1.0,
    currency: "USD",
    event_callback: callback,
  });
  return false;
}
