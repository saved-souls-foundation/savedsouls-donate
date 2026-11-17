import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.savedsouls-foundation.org";
const LOCALES = routing.locales;

const disallow = [
  "/admin",
  "/api/",
  // /go = doorstuurpagina naar Wikipedia; elke ?url= is uniek en ongecachet, dus crawlers kosten hier function-aanroepen
  "/go",
  ...LOCALES.flatMap((l) => [`/${l}/adopt/dog/`, `/${l}/adopt/cat/`, `/${l}/go`]),
].map((path) => `Disallow: ${path}`).join("\n");

const body = `# AI Content Signals
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no

User-agent: *
Allow: /
${disallow}

User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: Google-Extended
User-agent: Anthropic-AI
User-agent: Claude-Web
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: CCBot
User-agent: Cohere-AI
User-agent: Bytespider
Allow: /
${disallow}

Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;

export async function GET() {
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
