"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Accessibility, Waves, Star } from "lucide-react";

const ICON_GREEN = "#2d7a3a";

const STAT_ITEMS = [
  { key: "souls",       icon: Heart,          valueKey: "statsSouls",       labelKey: "statsSoulsLabel",       target: 2500, suffix: "+" },
  { key: "wheelchairs", icon: Accessibility,  valueKey: "statsWheelchairs", labelKey: "statsWheelchairsLabel", target: 47,   suffix: "+" },
  { key: "swim",        icon: Waves,           valueKey: "statsSwim",        labelKey: "statsSwimLabel",        target: 120,  suffix: "+" },
  { key: "since",       icon: Star,            valueKey: "statsSince",       labelKey: "statsSinceLabel",       target: 1999, suffix: ""  },
] as const;

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const from = target > 1000 ? target - 300 : 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

function StatItem({
  item,
  index,
  inView,
  label,
  staticValue,
}: {
  item: (typeof STAT_ITEMS)[number];
  index: number;
  inView: boolean;
  label: string;
  staticValue?: string;
}) {
  const count = useCountUp(item.target, inView && !staticValue);
  const formatted = item.target >= 1000
    ? count.toLocaleString("nl-NL")
    : count.toString();

  const displayValue = staticValue != null
    ? staticValue
    : inView ? `${formatted}${item.suffix}` : "—";

  return (
    <div
      className={`trust-stat-item flex flex-col items-center gap-1 transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
    >
      <div className="flex items-center gap-1.5">
        <item.icon size={16} color={ICON_GREEN} aria-hidden />
        <span className="font-bold text-lg text-gray-900 tabular-nums">
          {displayValue}
        </span>
      </div>
      <span className="text-xs text-gray-400 font-normal">{label}</span>
    </div>
  );
}

export default function TrustStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const t = useTranslations("home");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
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
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {STAT_ITEMS.map((item, i) => (
          <div key={item.key} className="flex items-center gap-8 md:gap-12">
            <StatItem item={item} index={i} inView={inView} label={t(item.labelKey)} staticValue={item.key === "since" ? t(item.valueKey) : undefined} />
            {i < STAT_ITEMS.length - 1 && (
              <div className="w-px h-8 bg-[#e5e7eb] shrink-0" aria-hidden />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: 2×2 grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-4">
        {STAT_ITEMS.map((item, i) => (
          <StatItem key={item.key} item={item} index={i} inView={inView} label={t(item.labelKey)} staticValue={item.key === "since" ? t(item.valueKey) : undefined} />
        ))}
      </div>
    </section>
  );
}
