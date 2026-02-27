import type { Metadata } from "next";

const BASE_URL = "https://www.savedsouls-foundation.com";
const LOCALES = ["nl", "en", "de", "es", "th", "ru"] as const;

/**
 * Genereert hreflang-alternates voor meertalige SEO.
 * @param pathWithoutLocale - Pad zonder locale, bijv. "/donate" of "/"
 * @param currentLocale - Huidige locale voor canonical URL
 */
export function alternatesForPath(
  pathWithoutLocale: string,
  currentLocale: string
): Metadata["alternates"] {
  const path = pathWithoutLocale === "/" ? "" : pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const pathSegment = path === "" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${BASE_URL}/${locale}${pathSegment}`;
  }
  return {
    canonical: `${BASE_URL}/${currentLocale}${pathSegment}`,
    languages,
  };
}
