import type { MetadataRoute } from "next";

const BASE_URL = "https://www.savedsouls-foundation.com";
const LOCALES = ["nl", "en", "de", "es", "th", "ru", "fr"];
const ADOPT_PROFILE_DISALLOW = LOCALES.flatMap((locale) => [
  `/${locale}/adopt/dog/`,
  `/${locale}/adopt/cat/`,
]);

const DISALLOW = ["/admin", "/api/", ...ADOPT_PROFILE_DISALLOW];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: [
          "GPTBot", "ChatGPT-User", "Google-Extended",
          "Anthropic-AI", "Claude-Web", "ClaudeBot",
          "Claude-SearchBot", "PerplexityBot", "Cohere-AI", "Bytespider"
        ],
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
