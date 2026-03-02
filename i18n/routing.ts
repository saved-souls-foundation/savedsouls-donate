import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en", "de", "es", "th", "ru", "fr"],
  defaultLocale: "nl",
  localePrefix: "always",
});
