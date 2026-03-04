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
  fr: "Français",
};

/** Short codes for minimal inline display */
const LOCALE_SHORT: Record<string, string> = {
  nl: "NL",
  en: "EN",
  de: "DE",
  es: "ES",
  th: "TH",
  ru: "RU",
  fr: "FR",
};

export default function LanguageSwitcher({ compact = false, minimal = false, overlay = false }: { compact?: boolean; minimal?: boolean; overlay?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div
        className="flex items-center gap-1 text-xs"
        style={{ minWidth: "80px" }}
        aria-hidden
        suppressHydrationWarning
      />
    );
  }

  // Minimal: compact "NL EN DE ..." zonder puntjes, dicht op elkaar – bij hover en gekozen taal oplichten
  if (minimal) {
    return (
      <div className={`flex items-center gap-0 text-xs ${overlay ? "text-white" : "text-stone-500 dark:text-stone-400"}`} role="group" aria-label="Taal kiezen" suppressHydrationWarning>
        {locales.map((loc) => {
          const isSelected = loc === locale;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={`transition-all rounded px-0.5 py-0.5 min-w-0 ${
                isSelected
                  ? overlay
                    ? "font-semibold text-white bg-white/25 shadow-sm"
                    : "font-semibold text-stone-800 dark:text-stone-100 bg-stone-200 dark:bg-stone-600 shadow-sm"
                  : overlay
                    ? "hover:font-medium hover:text-white hover:bg-white/15"
                    : "hover:font-medium hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-200/80 dark:hover:bg-stone-600/80"
              }`}
            >
              {LOCALE_SHORT[loc] ?? loc.toUpperCase()}
            </button>
          );
        })}
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
          className="absolute right-0 top-full mt-1 py-2 min-w-[160px] max-h-[70vh] overflow-y-auto rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 shadow-xl z-[120]"
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
