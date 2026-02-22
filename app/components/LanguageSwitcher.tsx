"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_FLAGS: Record<string, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  th: "🇹🇭",
  ru: "🇷🇺",
};

const RADIUS = 42;
const FLAG_SIZE = 36;
const RADIUS_COMPACT = 26;
const FLAG_SIZE_COMPACT = 24;

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const radius = compact ? RADIUS_COMPACT : RADIUS;
  const flagSize = compact ? FLAG_SIZE_COMPACT : FLAG_SIZE;
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname}`;
    router.push(newPath);
  };

  const locales = routing.locales;
  const angleStep = 360 / locales.length;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: radius * 2 + flagSize, height: radius * 2 + flagSize }}
      role="group"
      aria-label="Taal kiezen"
    >
      {/* Wereldbol in het midden */}
      <div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ fontSize: compact ? "1rem" : "1.5rem" }}
      >
        🌍
      </div>

      {/* Roteerende vlaggen eromheen */}
      <div className="lang-orbit absolute inset-0">
        {locales.map((loc, i) => {
          const angle = (angleStep * i - 90) * (Math.PI / 180);
          const x = 50 + (radius / (radius + flagSize / 2)) * 50 * Math.cos(angle);
          const y = 50 + (radius / (radius + flagSize / 2)) * 50 * Math.sin(angle);
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={`lang-flag absolute flex items-center justify-center rounded-full transition-all hover:scale-110 touch-manipulation ${
                loc === locale
                  ? "bg-stone-200 dark:bg-stone-700 ring-2 ring-green-500 dark:ring-green-600"
                  : "bg-white/90 dark:bg-stone-800/90 shadow-md hover:bg-stone-100 dark:hover:bg-stone-700"
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: flagSize,
                height: flagSize,
                transform: "translate(-50%, -50%)",
                fontSize: flagSize * 0.65,
              }}
              title={loc}
            >
              {LOCALE_FLAGS[loc] ?? loc}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .lang-orbit {
          animation: orbit 24s linear infinite;
        }
        .lang-orbit:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
