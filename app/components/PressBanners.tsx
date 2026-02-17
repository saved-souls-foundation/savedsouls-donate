"use client";

const BANNERS = [
  { name: "728×90 Leaderboard", w: 728, h: 90, en: "/banners/728x90-leaderboard-en.html", nl: "/banners/728x90-leaderboard-nl.html" },
  { name: "970×250 Billboard", w: 970, h: 250, en: "/banners/970x250-billboard-en.html", nl: "/banners/970x250-billboard-nl.html" },
  { name: "300×250 Rectangle", w: 300, h: 250, en: "/banners/300x250-rectangle-en.html", nl: "/banners/300x250-rectangle-nl.html" },
  { name: "336×280 Large Rectangle", w: 336, h: 280, en: "/banners/336x280-large-rectangle-en.html", nl: null },
  { name: "160×600 Skyscraper", w: 160, h: 600, en: "/banners/160x600-skyscraper-en.html", nl: "/banners/160x600-skyscraper-nl.html" },
  { name: "320×50 Mobile", w: 320, h: 50, en: "/banners/320x50-mobile-en.html", nl: "/banners/320x50-mobile-nl.html" },
  { name: "250×250 Square", w: 250, h: 250, en: "/banners/250x250-square-en.html", nl: "/banners/250x250-square-nl.html" },
  { name: "200×200 Round", w: 200, h: 200, en: "/banners/200x200-round-en.html", nl: "/banners/200x200-round-nl.html" },
  { name: "300×600 Half Page", w: 300, h: 600, en: "/banners/300x600-halfpage-en.html", nl: null },
  { name: "468×60 Full Banner", w: 468, h: 60, en: "/banners/468x60-banner-en.html", nl: "/banners/468x60-banner-nl.html" },
  // Blue shelter dogs & cats
  { name: "728×90 Leaderboard (Blue)", w: 728, h: 90, en: "/banners/728x90-leaderboard-blue-en.html", nl: "/banners/728x90-leaderboard-blue-nl.html" },
  { name: "970×250 Billboard (Blue)", w: 970, h: 250, en: "/banners/970x250-billboard-blue-en.html", nl: "/banners/970x250-billboard-blue-nl.html" },
  { name: "300×250 Rectangle (Blue)", w: 300, h: 250, en: "/banners/300x250-rectangle-blue-en.html", nl: "/banners/300x250-rectangle-blue-nl.html" },
  { name: "336×280 Large Rectangle (Blue)", w: 336, h: 280, en: "/banners/336x280-large-rectangle-blue-en.html", nl: "/banners/336x280-large-rectangle-blue-nl.html" },
  { name: "160×600 Skyscraper (Blue)", w: 160, h: 600, en: "/banners/160x600-skyscraper-blue-en.html", nl: "/banners/160x600-skyscraper-blue-nl.html" },
  { name: "320×50 Mobile (Blue)", w: 320, h: 50, en: "/banners/320x50-mobile-blue-en.html", nl: "/banners/320x50-mobile-blue-nl.html" },
  { name: "250×250 Square (Blue)", w: 250, h: 250, en: "/banners/250x250-square-blue-en.html", nl: "/banners/250x250-square-blue-nl.html" },
  { name: "468×60 Full Banner (Blue)", w: 468, h: 60, en: "/banners/468x60-banner-blue-en.html", nl: "/banners/468x60-banner-blue-nl.html" },
  { name: "320×100 Large Mobile (Blue)", w: 320, h: 100, en: "/banners/320x100-large-mobile-blue-en.html", nl: "/banners/320x100-large-mobile-blue-nl.html" },
];

function getScale(w: number, h: number): number {
  const maxW = 280;
  const maxH = 180;
  return Math.min(maxW / w, maxH / h, 1);
}

export default function PressBanners({ locale = "en", subtitle }: { locale?: string; subtitle?: string }) {
  const lang = locale === "nl" ? "nl" : "en";

  return (
    <div className="space-y-6">
      {subtitle && (
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {subtitle}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BANNERS.map((b) => {
          const src = lang === "nl" && b.nl ? b.nl : b.en;
          const scale = getScale(b.w, b.h);
          const displayW = Math.round(b.w * scale);
          const displayH = Math.round(b.h * scale);
          return (
            <div
              key={b.name}
              className="rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 p-4"
            >
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">{b.name}</p>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg bg-white dark:bg-stone-900"
                style={{ width: displayW, height: displayH }}
              >
                <div
                  style={{
                    width: b.w,
                    height: b.h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <iframe
                    src={src}
                    title={b.name}
                    width={b.w}
                    height={b.h}
                    className="border-0 block"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </a>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium hover:underline"
                style={{ color: "#2aa348" }}
              >
                Open full size ↗
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
