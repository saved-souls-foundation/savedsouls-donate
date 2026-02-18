"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

type ShelterItem = {
  name: string;
  url: string;
  email: string;
  location: string;
  color: string;
  icon: string;
  logo?: string;
};

type ShelterRegion = {
  region: string;
  items: ShelterItem[];
};

function filterShelters(shelters: ShelterRegion[], query: string): (ShelterItem & { region?: string })[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: (ShelterItem & { region?: string })[] = [];
  for (const region of shelters) {
    for (const item of region.items) {
      const matchName = item.name.toLowerCase().includes(q);
      const matchLocation = item.location.toLowerCase().includes(q);
      if (matchName || matchLocation) {
        results.push({ ...item, region: region.region });
      }
    }
  }
  return results;
}

function ShelterCard({
  s,
  visitSite,
}: {
  s: ShelterItem & { region?: string };
  visitSite: string;
}) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <div
        className="h-32 flex items-center justify-center text-5xl p-4"
        style={{ background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}99 100%)` }}
      >
        {"logo" in s && s.logo ? (
          s.logo.endsWith(".svg") ? (
            <img src={s.logo} alt={s.name} className="max-h-full w-auto object-contain" />
          ) : (
            <Image src={s.logo} alt={s.name} width={140} height={90} className="object-contain max-h-full w-auto" />
          )
        ) : (
          s.icon
        )}
      </div>
      <div className="p-5 bg-white dark:bg-stone-900">
        <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1 group-hover:underline">
          {s.name}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">{s.location}</p>
        <p className="text-xs text-stone-600 dark:text-stone-300 truncate" title={s.email}>
          ✉️ {s.email}
        </p>
        <span className="inline-block mt-3 text-sm font-medium" style={{ color: (s.color === "#ffffff" || s.color === "#fff") ? ACCENT_GREEN : s.color }}>
          {visitSite} →
        </span>
      </div>
    </a>
  );
}

export default function SheltersSearch({
  shelters,
  visitSite,
  searchPlaceholder,
  noResults,
  thailandTitle,
  europeTitle,
}: {
  shelters: ShelterRegion[];
  visitSite: string;
  searchPlaceholder: string;
  noResults: string;
  thailandTitle: string;
  europeTitle: string;
}) {
  const t = useTranslations("shelters");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => filterShelters(shelters, query), [shelters, query]);
  const hasResults = filtered.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-xl">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
            aria-label={searchPlaceholder}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-sm font-medium"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="mb-16">
          {hasResults ? (
            <>
              <p className="text-center text-stone-600 dark:text-stone-400 mb-6">
                {t("searchResultsFound", { count: filtered.length })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((s) => (
                  <ShelterCard key={s.name} s={s} visitSite={visitSite} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-stone-600 dark:text-stone-400 py-12">
              {noResults}
            </p>
          )}
        </div>
      ) : (
        <>
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
              <span>🇹🇭</span> {thailandTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelters[0].items.map((s) => (
                <ShelterCard key={s.name} s={s} visitSite={visitSite} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
              <span>🇪🇺</span> {europeTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelters[1].items.map((s) => (
                <ShelterCard key={s.name} s={s} visitSite={visitSite} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
