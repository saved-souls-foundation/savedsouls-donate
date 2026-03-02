import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>;

  // Fallback: als een top-level namespace ontbreekt (bijv. admin in de/es/ru/th), vul aan uit defaultLocale
  if (locale !== routing.defaultLocale) {
    try {
      const defaultMessages = (await import(`../messages/${routing.defaultLocale}.json`)).default as Record<string, unknown>;
      const merged = { ...messages };
      for (const key of Object.keys(defaultMessages)) {
        if (merged[key] === undefined || merged[key] === null) {
          merged[key] = defaultMessages[key];
        }
      }
      messages = merged;
    } catch {
      // negeer; gebruik alleen huidige locale
    }
  }

  return {
    locale,
    messages,
  };
});
