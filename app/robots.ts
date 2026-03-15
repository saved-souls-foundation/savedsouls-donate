import type { MetadataRoute } from "next";

const BASE_URL = "https://www.savedsouls-foundation.com";

/** Locales from i18n/routing – adopt profile paths per locale are disallowed so /adopt overview stays indexable. */
const LOCALES = ["nl", "en", "de", "es", "th", "ru", "fr"];
const ADOPT_PROFILE_DISALLOW = LOCALES.flatMap((locale) => [
  `/${locale}/adopt/dog/`,
  `/${locale}/adopt/cat/`,
]);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", ...ADOPT_PROFILE_DISALLOW],
      },
      // AI & LLM crawlers – we allow indexing; context in /ai.txt, /llms.txt, /context.json
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "Anthropic-AI", "Claude-Web", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Cohere-AI", "Bytespider"],
        allow: "/",
        disallow: ["/admin", "/api/", ...ADOPT_PROFILE_DISALLOW],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
