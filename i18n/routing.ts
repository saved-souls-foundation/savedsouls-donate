import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en", "de", "th", "ru"],
  defaultLocale: "nl",
  localePrefix: "always",
});
