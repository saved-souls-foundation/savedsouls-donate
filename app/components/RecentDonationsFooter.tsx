"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

export default function RecentDonations() {
  const t = useTranslations("common");
  const locale = useLocale();
  const loc = locale ?? "en";
  const [donations, setDonations] = useState<{ display: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/donations/recent?locale=${loc}`)
      .then((res) => (cancelled ? undefined : res.json()))
      .then((data) => {
        if (!cancelled) setDonations(data?.donations ?? []);
      })
      .catch(() => {
        if (!cancelled) setDonations([]);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loc is stable; locale changes = page navigation = remount
  }, []);

  useEffect(() => {
    if (donations.length > 0) setMounted(true);
  }, [donations.length]);

  if (donations.length === 0) return null;

  const items = donations.slice(0, 6);
  const duplicated = [...items, ...items];

  return (
    <div
      className={`relative w-full mb-6 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600 overflow-hidden transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{ borderLeftWidth: 3, borderLeftColor: ACCENT_GREEN }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="animate-donation-shimmer absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#2aa348]/15 to-transparent"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <p
        className="relative text-xs font-semibold uppercase tracking-wider mb-3 animate-donation-fade-up flex items-center gap-2"
        style={{ color: ACCENT_GREEN, animationDelay: "0.1s", animationFillMode: "both" }}
      >
        <span className="animate-donation-heart text-base leading-none" aria-hidden>💚</span>
        {t("recentDonations")}
      </p>
      <div className="relative overflow-hidden">
        <div className="flex flex-nowrap gap-x-6 animate-donation-marquee w-max">
          {duplicated.map((d, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-sm text-stone-600 dark:text-stone-400 shrink-0 animate-donation-fade-up"
              style={{
                animationDelay: `${0.15 + i * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              {d.display}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
