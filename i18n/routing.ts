import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "nl", "en", "de", "es", "th", "ru", "fr",
    "pl", "sv", "cs", "de-CH", "ko", "ja",
  ],
  defaultLocale: "nl",
  localePrefix: "always",
});
