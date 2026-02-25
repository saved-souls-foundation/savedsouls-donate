"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";

/** Taalnamen (Nederlands, niet Nederland) */
const LOCALE_NAMES: Record<string, string> = {
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
  es: "Español",
  th: "ไทย",
  ru: "Русский",
};

/** Short codes for minimal inline display */
const LOCALE_SHORT: Record<string, string> = {
  nl: "NL",
  en: "EN",
  de: "DE",
  es: "ES",
  th: "TH",
  ru: "RU",
};

export default function LanguageSwitcher({ compact = false, minimal = false, overlay = false }: { compact?: boolean; minimal?: boolean; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    setOpen(false);
    router.push(pathname, { locale: newLocale });
  };

  const locales = routing.locales;
  const currentName = LOCALE_NAMES[locale] ?? locale;

  // Minimal: plain text "NL · EN · DE ..." – no dropdown, each clickable
  if (minimal) {
    return (
      <div className={`flex items-center gap-1 text-xs ${overlay ? "text-white" : "text-stone-500 dark:text-stone-400"}`} role="group" aria-label="Taal kiezen">
        {locales.map((loc) => (
          <span key={loc} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchLocale(loc)}
              className={`transition-colors ${overlay ? "hover:text-white/90" : "hover:text-stone-700 dark:hover:text-stone-200"} ${
                loc === locale ? (overlay ? "font-medium text-white" : "font-medium text-stone-700 dark:text-stone-200") : ""
              }`}
            >
              {LOCALE_SHORT[loc] ?? loc.toUpperCase()}
            </button>
            {loc !== locales[locales.length - 1] && <span className={overlay ? "text-white/70 select-none" : "text-stone-400 dark:text-stone-500 select-none"}>·</span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" role="group" aria-label="Taal kiezen">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-lg border transition-colors ${
          compact ? "px-2 py-1.5 text-sm" : "px-3 py-2 text-sm"
        } ${
          overlay
            ? "border-white/60 bg-white/10 text-white hover:bg-white/20"
            : "border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="locale-listbox"
      >
        <span>{currentName}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id="locale-listbox"
          role="listbox"
          className="absolute right-0 top-full mt-1 py-2 min-w-[140px] rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 shadow-xl z-[120]"
        >
          {locales.map((loc) => (
            <li key={loc} role="option" aria-selected={loc === locale}>
              <button
                type="button"
                onClick={() => switchLocale(loc)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  loc === locale
                    ? "bg-[#2aa348]/15 text-[#2aa348] dark:bg-[#2aa348]/25 font-medium"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                }`}
              >
                {LOCALE_NAMES[loc] ?? loc}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
