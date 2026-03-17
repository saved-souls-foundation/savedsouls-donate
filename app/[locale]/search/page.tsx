"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
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
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" noOverlay speed={0.2}>
      <div className="min-h-screen bg-white dark:bg-stone-900">
        <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-4"
            >
              ← {locale === "nl" ? "Terug" : "Back"}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-4 py-3 mb-8">
            <span className="text-[18px] text-[#2aa348]" aria-hidden>✦</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder={locale === "nl" ? "Zoek dieren, pagina's, gidsen..." : "Search animals, pages, guides..."}
              aria-label={t("siteSearchPlaceholder")}
              autoFocus
              className="flex-1 min-w-0 text-base bg-transparent border-none outline-none text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
            />
          </div>

          {!query.trim() ? (
            <div className="flex flex-wrap gap-2">
              {QUICK_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    updateQuery(q);
                    inputRef.current?.focus();
                  }}
                  className="text-sm border border-stone-200 dark:border-stone-600 rounded-[20px] px-4 py-2 text-stone-600 dark:text-stone-400 hover:border-[#2aa348] hover:text-[#2aa348] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="space-y-4">
              <p className="text-stone-600 dark:text-stone-400">
                {locale === "nl"
                  ? `Geen resultaten gevonden voor '${query}'.`
                  : `No results found for '${query}'.`}
              </p>
              <Link
                href="/gidsen"
                className="inline-block text-[#2aa348] hover:underline font-medium"
              >
                {locale === "nl"
                  ? "Probeer andere zoektermen of bekijk alle gidsen →"
                  : "Try other search terms or view all guides →"}
              </Link>
            </div>
          ) : (
            <section>
              <p className="text-[11px] uppercase tracking-[0.06em] text-stone-500 dark:text-stone-400 mb-3">
                {locale === "nl" ? "Pagina's" : "Pages"}
              </p>
              <ul className="space-y-0">
                {results.map((entry) => (
                  <li key={entry.path}>
                    <Link
                      href={entry.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[#f7faf8] dark:hover:bg-stone-800"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                        style={{ background: "#EAF3DE", color: "#27500A" }}
                      >
                        ✦
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-stone-800 dark:text-stone-200 block">
                          {getPageTitle(entry, locale)}
                        </span>
                        <span className="text-[12px] text-stone-500 dark:text-stone-400 mt-0.5 block line-clamp-2">
                          {getPageDescription(entry, locale)}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 text-stone-400" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </ParallaxPage>
  );
}
