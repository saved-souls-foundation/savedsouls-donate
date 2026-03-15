import { NextResponse } from "next/server";

const BASE_URL = "https://www.savedsouls-foundation.com";
const LOCALES = ["nl", "en", "de", "es", "th", "ru", "fr"];

const disallow = [
  "/admin",
  "/api/",
  ...LOCALES.flatMap((l) => [`/${l}/adopt/dog/`, `/${l}/adopt/cat/`]),
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
