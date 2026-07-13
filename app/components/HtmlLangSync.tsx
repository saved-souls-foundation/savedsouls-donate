"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

const LOCALE_TO_LANG: Record<string, string> = {
  nl: "nl",
  en: "en",
  de: "de",
  es: "es",
  th: "th",
  ru: "ru",
  fr: "fr",
  pl: "pl",
  sv: "sv",
  cs: "cs",
  "de-CH": "de-CH",
  ko: "ko",
  ja: "ja",
  da: "da",
  no: "no",
  "zh-TW": "zh-Hant",
  it: "it",
  "pt-BR": "pt-BR",
  zh: "zh",
  ms: "ms",
  vi: "vi",
};

/** Keeps <html lang> in sync on client-side locale navigations. */
export default function HtmlLangSync() {
  const locale = useLocale();

  useEffect(() => {
    const lang = LOCALE_TO_LANG[locale] || locale;
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [locale]);

  return null;
}
