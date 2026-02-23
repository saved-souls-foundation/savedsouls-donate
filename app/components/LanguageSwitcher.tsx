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

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
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

  return (
    <div ref={containerRef} className="relative" role="group" aria-label="Taal kiezen">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors ${
          compact ? "px-2 py-1.5 text-sm" : "px-3 py-2 text-sm"
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
