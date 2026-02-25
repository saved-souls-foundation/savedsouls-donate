"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Accessibility, Waves, Star } from "lucide-react";

const ICON_GREEN = "#2d7a3a";

const STAT_ITEMS = [
  { key: "souls", icon: Heart, valueKey: "statsSouls", labelKey: "statsSoulsLabel" },
  { key: "wheelchairs", icon: Accessibility, valueKey: "statsWheelchairs", labelKey: "statsWheelchairsLabel" },
  { key: "swim", icon: Waves, valueKey: "statsSwim", labelKey: "statsSwimLabel" },
  { key: "since", icon: Star, valueKey: "statsSince", labelKey: "statsSinceLabel" },
] as const;

export default function TrustStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const t = useTranslations("home");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-white py-5 md:py-4 border-b border-[#f0f0f0]"
      aria-label="Trust statistics"
    >
      {/* Desktop: horizontal row with dividers */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {STAT_ITEMS.map((item, i) => (
          <div key={item.key} className="flex items-center gap-8 md:gap-12">
            <div
              className={`trust-stat-item flex flex-col items-center gap-1 transition-all duration-500 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
            >
              <div className="flex items-center gap-1.5">
                <item.icon size={16} color={ICON_GREEN} aria-hidden />
                <span className="font-bold text-lg text-gray-900">{t(item.valueKey)}</span>
              </div>
              <span className="text-xs text-gray-400 font-normal">{t(item.labelKey)}</span>
            </div>
            {i < STAT_ITEMS.length - 1 && (
              <div
                className="w-px h-8 bg-[#e5e7eb] shrink-0"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: 2x2 grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-4">
        {STAT_ITEMS.map((item, i) => (
          <div
            key={item.key}
            className={`trust-stat-item flex flex-col items-center gap-1 transition-all duration-500 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
          >
            <div className="flex items-center gap-1.5">
              <item.icon size={16} color={ICON_GREEN} aria-hidden />
              <span className="font-bold text-lg text-gray-900">{t(item.valueKey)}</span>
            </div>
            <span className="text-xs text-gray-400 font-normal">{t(item.labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
