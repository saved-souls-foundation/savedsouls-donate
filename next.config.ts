import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  experimental: {
    // Uit om "Persisting failed" / SST-writefouten te voorkomen (Turbopack cache)
    turbopackFileSystemCacheForDev: false,
  },
  async redirects() {
    return [
      { source: "/pressПресса", destination: "/nl/press", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.savedsouls-foundation.com" }],
        destination: "https://www.savedsouls-foundation.org/:path*",
        permanent: true,
      },
    ];
  },
  // Cache voor build-bestanden (hashes in naam → veilig lang cachen, geen stale content)
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.google-analytics.com https://analytics.google.com https://www.paypal.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: https://www.google.com https://www.google.nl https://www.google.de https://www.google.co.uk https://www.google.fr https://www.google.es https://www.google.it https://www.google.be https://www.google.ca https://www.google.com.au https://googleads.g.doubleclick.net; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://www.google.com https://www.google.nl https://www.google.de https://www.google.co.uk https://www.google.fr https://www.google.es https://www.google.it https://www.google.be https://www.google.ca https://www.google.com.au https://stats.g.doubleclick.net https://googleads.g.doubleclick.net; frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://www.paypal.com https://challenges.cloudflare.com; media-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              'camera=(), microphone=(), geolocation=(), payment=(self "https://www.paypal.com"), usb=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "db.savedsouls-foundation.org", pathname: "/**" },
      { protocol: "https", hostname: "ae-pic-a1.aliexpress-media.com", pathname: "/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
