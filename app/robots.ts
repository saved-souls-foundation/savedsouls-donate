import type { MetadataRoute } from "next";

const BASE_URL = "https://www.savedsouls-foundation.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // AI & LLM crawlers – we allow indexing; context in /ai.txt, /llms.txt, /context.json
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "Anthropic-AI", "Claude-Web", "PerplexityBot", "Cohere-AI", "Bytespider"],
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
