"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Search } from "lucide-react";
import { SEARCH_INDEX } from "@/lib/search-index";

const MAX_RESULTS = 8;

export default function SiteSearch({ mobileIcon = false, desktopIconOnly = false, overlay = false }: { mobileIcon?: boolean; desktopIconOnly?: boolean; overlay?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches = SEARCH_INDEX.filter((entry) => {
      const label = t(entry.labelKey).toLowerCase();
      const pathMatch = entry.path.toLowerCase().includes(q);
      const labelMatch = label.includes(q);
      const keywordMatch = entry.keywords?.toLowerCase().includes(q);
      return labelMatch || pathMatch || !!keywordMatch;
    });
    return matches.slice(0, MAX_RESULTS);
  }, [query, t]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [query, results.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      if (mobileIcon) setMobileOverlayOpen(false);
      return;
    }
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[focusedIndex]) {
      e.preventDefault();
      window.location.href = `/${locale}${results[focusedIndex].path}`;
    }
  };

  // Mobile: alleen icoon-knop, klik opent overlay
  if (mobileIcon) {
    const openSearch = (e?: React.MouseEvent | React.TouchEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setMobileOverlayOpen(true);
    };
    return (
      <>
        <div
          role="button"
          tabIndex={0}
          onClick={openSearch}
          onTouchEnd={openSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openSearch();
            }
          }}
          className={`flex items-center justify-center min-w-[48px] min-h-[48px] p-3 rounded-lg border cursor-pointer select-none shrink-0 transition-colors ${
            overlay
              ? "border-white/60 bg-white/10 text-white active:bg-white/20"
              : "border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 active:bg-stone-200 dark:active:bg-stone-700"
          }`}
          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          aria-label={t("siteSearchPlaceholder")}
        >
          <Search className="w-5 h-5 shrink-0 pointer-events-none" />
        </div>
        {mobileOverlayOpen && (
          <div className="fixed inset-0 z-[200] bg-white dark:bg-stone-900 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-700">
              <div ref={containerRef} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("siteSearchPlaceholder")}
                  aria-label={t("siteSearchPlaceholder")}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-base placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileOverlayOpen(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400"
              >
                {t("siteSearchCancel")}
              </button>
            </div>
            {query.trim() && (
              <div className="flex-1 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <p className="px-4 py-4 text-stone-500 dark:text-stone-400">{t("siteSearchNoResults")}</p>
                ) : (
                  <div role="listbox" className="px-2">
                    {results.map((entry, i) => (
                      <Link
                        key={entry.path + entry.labelKey}
                        href={entry.path}
                        role="option"
                        onClick={() => setMobileOverlayOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base ${
                          i === focusedIndex
                            ? "bg-[#2aa348]/15 text-[#2aa348]"
                            : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        {t(entry.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // Desktop: icon only, click opens full-width overlay
  if (desktopIconOnly) {
    const openSearch = (e?: React.MouseEvent | React.TouchEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setMobileOverlayOpen(true);
    };
    return (
      <>
        <button
          type="button"
          onClick={openSearch}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
            overlay
              ? "text-white hover:text-white/90 hover:bg-white/10"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
          aria-label={t("siteSearchPlaceholder")}
        >
          <Search className="w-5 h-5 shrink-0" />
        </button>
        {mobileOverlayOpen && (
          <div className="fixed inset-0 z-[200] bg-white dark:bg-stone-900 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-700">
              <div ref={containerRef} className="flex-1 max-w-2xl mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("siteSearchPlaceholder")}
                  aria-label={t("siteSearchPlaceholder")}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-base placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileOverlayOpen(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400"
              >
                {t("siteSearchCancel")}
              </button>
            </div>
            {query.trim() && (
              <div className="flex-1 overflow-y-auto py-2 max-w-2xl mx-auto w-full">
                {results.length === 0 ? (
                  <p className="px-4 py-4 text-stone-500 dark:text-stone-400">{t("siteSearchNoResults")}</p>
                ) : (
                  <div role="listbox" className="px-2">
                    {results.map((entry, i) => (
                      <Link
                        key={entry.path + entry.labelKey}
                        href={entry.path}
                        role="option"
                        onClick={() => setMobileOverlayOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base ${
                          i === focusedIndex
                            ? "bg-[#2aa348]/15 text-[#2aa348]"
                            : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        {t(entry.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("siteSearchPlaceholder")}
          aria-label={t("siteSearchPlaceholder")}
          aria-expanded={isOpen && results.length > 0}
          aria-controls="search-results"
          id="site-search"
          className="w-full min-w-[140px] max-w-[200px] pl-9 pr-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
        />
      </div>
      {isOpen && query.trim() && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-600 shadow-xl z-[120] max-h-[320px] overflow-y-auto"
        >
          {results.length === 0 ? (
            <p className="px-4 py-2 text-sm text-stone-500 dark:text-stone-400">
              {t("siteSearchNoResults")}
            </p>
          ) : (
            results.map((entry, i) => (
              <Link
                key={entry.path + entry.labelKey}
                href={entry.path}
                role="option"
                aria-selected={i === focusedIndex}
                onMouseEnter={() => setFocusedIndex(i)}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  i === focusedIndex
                    ? "bg-[#2aa348]/15 text-[#2aa348] dark:bg-[#2aa348]/25 dark:text-[#2aa348]"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                }`}
              >
                {t(entry.labelKey)}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
