import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async redirects() {
    return [
      { source: "/pressПресса", destination: "/nl/press", permanent: true },
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
