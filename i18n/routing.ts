import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "nl", "en", "de", "de-CH", "es", "th", "ru", "fr",
    "pl", "sv", "cs", "ko", "ja",
    "da", "no", "zh-TW", "it", "pt-BR",
    "zh", "ms", "vi"
  ],
  defaultLocale: "nl",
  localePrefix: "always",
});
