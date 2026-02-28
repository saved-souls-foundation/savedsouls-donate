"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { GuideGroup } from "@/lib/gidsen-data";

const CATEGORY_ACCENTS = [
  "#2aa348",   // green
  "#f59e0b",   // amber
  "#2dd4bf",   // teal
  "#34d399",   // emerald
  "#38bdf8",   // sky
  "#a78bfa",   // violet
  "#fb7185",   // rose
  "#fb923c",   // orange
];

type Props = {
  groups: GuideGroup[];
  accentGreen: string;
};

export default function GidsenAccordion({ groups, accentGreen }: Props) {
  const tCommon = useTranslations("common");
  const tGetInvolved = useTranslations("getInvolved");
  const refs = useRef<Record<string, HTMLDetailsElement | null>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  const applyHash = () => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hash && groups.some((g) => g.placeholderKey === hash)) {
      setOpenId(hash);
      const el = refs.current[hash];
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  useEffect(() => {
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [groups]);

  return (
    <div className="divide-y divide-stone-200 dark:divide-stone-700">
      {groups.map((group, index) => (
        <details
          key={group.placeholderKey}
          id={group.placeholderKey}
          ref={(r) => { refs.current[group.placeholderKey] = r; }}
          className="group transition-colors"
          style={{ borderLeft: `4px solid ${CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length]}` }}
          open={openId ? openId === group.placeholderKey : index === 0}
        >
          <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors">
            <span className="font-medium text-stone-900 dark:text-stone-100" style={{ color: accentGreen }}>
              {tGetInvolved(group.placeholderKey)}
            </span>
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-stone-400 dark:text-stone-500 transition-transform group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {group.links.map((link) => (
                <Link
                  key={link.href + link.labelKey}
                  href={link.href}
                  className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.labelKey === "rawHide"
                      ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#2aa348]/10 hover:text-[#2aa348] dark:hover:bg-[#2aa348]/15 dark:hover:text-[#4ade80]"
                  }`}
                >
                  {tCommon(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
