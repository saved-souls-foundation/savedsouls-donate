"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { SEARCH_INDEX, type SearchPage } from "@/lib/search-index";
import { ChevronRight } from "lucide-react";

const MAX_RESULTS = 20;

const QUICK_QUERIES = [
  "rustige hond",
  "vlooien bestrijding",
  "adoptie Thailand",
  "eerste hond in huis",
];

function getPageTitle(page: SearchPage, locale: string): string {
  return page.title[locale as keyof typeof page.title] ?? page.title.en;
}

function getPageDescription(page: SearchPage, locale: string): string {
  return page.description[locale as keyof typeof page.description] ?? page.description.en;
}

export default function SearchPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQ = searchParams.get("q") ?? "";
  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches = SEARCH_INDEX.filter((entry) => {
      const label = (entry.title[locale as keyof typeof entry.title] ?? entry.title.en ?? "").toLowerCase();
      const desc = (entry.description[locale as keyof typeof entry.description] ?? entry.description.en ?? "").toLowerCase();
      return label.includes(q) || desc.includes(q) || entry.path.toLowerCase().includes(q);
    });
    return matches.slice(0, MAX_RESULTS);
  }, [query, locale]);

  const updateQuery = (q: string) => {
    setQuery(q);
    const path = q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search";
    router.replace(path);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 mb-6 flex items-center gap-1"
        >
          ← {locale === "nl" ? "Terug" : "Back"}
        </button>

        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 dark:border-stone-700">
            <span style={{ color: "#2aa348", fontSize: "18px" }} aria-hidden>✦</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder={locale === "nl" ? "Zoek dieren, pagina's, gidsen..." : "Search animals, pages, guides..."}
              aria-label={t("siteSearchPlaceholder")}
              autoFocus
              className="flex-1 min-w-0 text-base bg-transparent outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-700">
            {!query.trim() ? null : results.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-stone-400">
                {locale === "nl"
                  ? `Geen resultaten gevonden voor '${query}'.`
                  : `No results found for '${query}'.`}
                {" "}
                <Link href="/gidsen" className="text-[#2aa348] hover:underline">
                  {locale === "nl" ? "Bekijk alle gidsen →" : "View all guides →"}
                </Link>
              </div>
            ) : (
              <>
                <div className="px-5 py-2 bg-stone-50/80 dark:bg-stone-700/30">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    {locale === "nl" ? "Pagina's" : "Pages"}
                  </p>
                </div>
                {results.map((entry) => (
                  <Link
                    key={entry.path}
                    href={entry.path}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm bg-green-50"
                      style={{ color: "#2aa348" }}
                      aria-hidden
                    >
                      ✦
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-stone-800 dark:text-stone-200 block">
                        {getPageTitle(entry, locale)}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 block line-clamp-1">
                        {getPageDescription(entry, locale)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-stone-300 dark:text-stone-500" aria-hidden />
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {!query.trim() && (
          <>
            <p className="text-xs text-stone-400 text-center mt-6 mb-3">
              {locale === "nl" ? "Snel zoeken" : "Quick search"}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    updateQuery(q);
                    inputRef.current?.focus();
                  }}
                  className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-full px-3 py-1.5 text-sm text-stone-600 dark:text-stone-400 hover:border-green-400 hover:text-green-700 dark:hover:border-green-500 dark:hover:text-green-400 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
