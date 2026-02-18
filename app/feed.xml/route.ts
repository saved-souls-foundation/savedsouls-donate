import { NextResponse } from "next/server";

const BASE_URL = "https://savedsouls-foundation.org";

const FEED_ITEMS = [
  { path: "/donate", title: "Donate", description: "Support Saved Souls Foundation. Every donation saves lives." },
  { path: "/adopt", title: "Adopt", description: "Adopt a dog or cat from our sanctuary in Khon Kaen, Thailand." },
  { path: "/sponsor", title: "Sponsor", description: "Sponsor a disabled or wheelchair dog with monthly support." },
  { path: "/volunteer", title: "Volunteer", description: "Volunteer at our sanctuary. Help dogs and cats in need." },
  { path: "/press", title: "Press & Media", description: "Press kit, logos, and media contact for journalists." },
  { path: "/contact", title: "Contact", description: "Get in touch with Saved Souls Foundation." },
  { path: "/shelters", title: "Shelters", description: "Partner shelters and animal rescues worldwide." },
  { path: "/faq", title: "FAQ", description: "Frequently asked questions about adoption, donations, and more." },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toUTCString();

  const items = FEED_ITEMS.map(
    (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${BASE_URL}${item.path}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${BASE_URL}${item.path}</guid>
    </item>`
  ).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Saved Souls Foundation</title>
    <link>${BASE_URL}</link>
    <description>Saved Souls Foundation - Animal sanctuary in Khon Kaen, Thailand. Rescue, adopt, donate, volunteer.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
