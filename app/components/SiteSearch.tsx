"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { SEARCH_INDEX, type SearchPage } from "@/lib/search-index";
import TurnstileWidget from "@/app/components/TurnstileWidget";
import { ChevronRight } from "lucide-react";

const MAX_RESULTS = 8;
const AI_DEBOUNCE_MS = 300;
const MAX_ANIMAL_MATCHES = 3;

type AiResult = { path: string; reason: string };
type AnimalMatch = { id: string; name?: string; reason?: string; type?: string };
type AnimalRecord = { id: string; type: string; name?: string; story?: string; [key: string]: unknown };

const QUICK_QUERIES = [
  "rustige hond",
  "vlooien bestrijding",
  "adoptie Thailand",
  "eerste hond in huis",
];

function getPageTitle(page: SearchPage, locale: string): string {
  return page.title[locale as keyof typeof page.title] ?? page.title.en;
}

export default function SiteSearch({ mobileIcon = false, desktopIconOnly = false, overlay = false }: { mobileIcon?: boolean; desktopIconOnly?: boolean; overlay?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false);
  const [allAnimals, setAllAnimals] = useState<AnimalRecord[]>([]);
  const [animalMatches, setAnimalMatches] = useState<AnimalMatch[]>([]);
  const [aiResults, setAiResults] = useState<AiResult[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/animals")
      .then((r) => r.json())
      .then((data: { dogs?: AnimalRecord[]; cats?: AnimalRecord[] }) => {
        const dogs = (data.dogs ?? []).map((d: AnimalRecord) => ({ ...d, type: "dog" }));
        const cats = (data.cats ?? []).map((c: AnimalRecord) => ({ ...c, type: "cat" }));
        setAllAnimals([...dogs, ...cats]);
      })
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches = SEARCH_INDEX.filter((entry) => {
      const title = (entry.title[locale as keyof typeof entry.title] ?? entry.title.en).toLowerCase();
      const desc = (entry.description[locale as keyof typeof entry.description] ?? entry.description.en).toLowerCase();
      const pathMatch = entry.path.toLowerCase().includes(q);
      return title.includes(q) || desc.includes(q) || pathMatch;
    });
    return matches.slice(0, MAX_RESULTS);
  }, [query, locale]);

  const totalSelectable = animalMatches.length + results.length + aiResults.length;

  useEffect(() => {
    setFocusedIndex(0);
  }, [query, results.length, aiResults.length, animalMatches.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMobileOverlayOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSearchResults = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setAiResults([]);
        setAnimalMatches([]);
        return;
      }
      setAiLoading(true);
      try {
        const siteResPromise = fetch("/api/site-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            locale,
            turnstileToken: turnstileToken?.trim() || "",
          }),
        });
        const animalResPromise = fetch("/api/animal-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            animals: allAnimals.slice(0, 80).map((a) => ({
              id: `${a.type}-${a.id}`,
              name: a.name ?? "",
              story: a.story ?? "",
            })),
            query: q,
            locale,
            turnstileToken: turnstileToken?.trim() || "",
          }),
        });
        const [siteRes, animalRes] = await Promise.all([siteResPromise, animalResPromise]);
        const siteData = await siteRes.json().catch(() => ({}));
        const animalData = await animalRes.json().catch(() => ({}));
        const list: unknown[] = Array.isArray(siteData.results) ? siteData.results : [];
        setAiResults(
          list.filter((r: unknown): r is AiResult => !!r && typeof (r as AiResult).path === "string" && typeof (r as AiResult).reason === "string")
        );
        const matches = Array.isArray(animalData.matches) ? animalData.matches.slice(0, MAX_ANIMAL_MATCHES) : [];
        setAnimalMatches(
          matches.filter((m: unknown): m is AnimalMatch => !!m && typeof (m as AnimalMatch).id === "string")
        );
      } catch {
        setAiResults([]);
        setAnimalMatches([]);
      } finally {
        setAiLoading(false);
      }
    },
    [locale, turnstileToken, allAnimals]
  );

  useEffect(() => {
    if (aiDebounceRef.current) {
      clearTimeout(aiDebounceRef.current);
      aiDebounceRef.current = null;
    }
    if (!query.trim() || query.trim().length < 2) {
      setAiResults([]);
      setAnimalMatches([]);
      setAiLoading(false);
      return;
    }
    const q = query.trim();
    aiDebounceRef.current = setTimeout(() => {
      aiDebounceRef.current = null;
      if (mobileOverlayOpen || desktopIconOnly) {
        fetchSearchResults(q);
      }
    }, AI_DEBOUNCE_MS);
    return () => {
      if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    };
  }, [query, mobileOverlayOpen, desktopIconOnly, fetchSearchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setMobileOverlayOpen(false);
      return;
    }
    const count = totalSelectable;
    if (!isOpen || count === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex < animalMatches.length) {
        const match = animalMatches[focusedIndex];
        const animal = allAnimals.find((a) => `${a.type}-${a.id}` === match.id);
        if (animal) {
          window.location.href = `/${locale}/adopt/${animal.type}/${animal.id}`;
        }
      } else {
        const pageIndex = focusedIndex - animalMatches.length;
        const path =
          pageIndex < results.length
            ? results[pageIndex].path
            : aiResults[pageIndex - results.length]?.path;
        if (path) window.location.href = `/${locale}${path}`;
      }
    }
  };

  const getTitleForPath = (path: string) => {
    const page = SEARCH_INDEX.find((p) => p.path === path);
    return page ? getPageTitle(page, locale) : path;
  };

  const getAnimalByMatchId = (matchId: string) =>
    allAnimals.find((a) => `${a.type}-${a.id}` === matchId);

  const closeOverlay = () => setMobileOverlayOpen(false);

  const pillButtonClass = "flex items-center justify-center gap-1.5 rounded-full border text-sm transition-all duration-150 cursor-pointer select-none shrink-0";
  const pillOverlayStyle = {
    borderColor: "rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.8)",
  };
  const pillLightStyle = {
    borderColor: "var(--color-border-secondary, #e5e7eb)",
    background: "var(--color-background-secondary, #f9fafb)",
    color: "var(--color-text-secondary, #4b5563)",
  };

  const renderModalContent = () => (
    <>
      <div className="flex items-center gap-[10px] px-4 py-3.5 border-b border-stone-200 dark:border-stone-700">
        <span className="text-[16px] text-[#2aa348]" aria-hidden>✦</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={locale === "nl" ? "Zoek dieren, pagina's, gidsen..." : "Search animals, pages, guides..."}
          aria-label={t("siteSearchPlaceholder")}
          autoFocus
          className="flex-1 min-w-0 text-[14px] bg-transparent border-none outline-none text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
        />
        <span className="text-[11px] text-stone-400 dark:text-stone-500">ESC</span>
      </div>
      <div className="overflow-y-auto max-h-[60vh]">
        <div
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <TurnstileWidget size="compact" onVerify={(token) => setTurnstileToken(token)} />
        </div>
        {!query.trim() ? (
          <div className="px-4 py-4 flex flex-wrap gap-2">
            {QUICK_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  setIsOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="text-[12px] border border-stone-200 dark:border-stone-600 rounded-[20px] px-3 py-1.5 text-stone-600 dark:text-stone-400 hover:border-[#2aa348] hover:text-[#2aa348] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        ) : (
          <div role="listbox" className="py-2">
            {animalMatches.length > 0 && (
              <>
                <p className="text-[11px] uppercase tracking-[0.06em] text-stone-500 dark:text-stone-400 px-4 pt-2.5 pb-1.5">
                  {locale === "nl" ? "Dieren" : "Animals"}
                </p>
                {animalMatches.map((match, i) => {
                  const animal = getAnimalByMatchId(match.id);
                  if (!animal) return null;
                  const href = `/adopt/${animal.type}/${animal.id}`;
                  const baseIndex = i;
                  const isSelected = baseIndex === focusedIndex;
                  return (
                    <Link
                      key={match.id}
                      href={href}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setFocusedIndex(baseIndex)}
                      onClick={closeOverlay}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isSelected ? "bg-[#f7faf8]" : "hover:bg-[#f7faf8]"}`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                        style={{ background: "#E1F5EE", color: "#085041" }}
                      >
                        {animal.type === "dog" ? "🐕" : "🐈"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-stone-800 dark:text-stone-200 block">
                          {animal.name ?? match.id}
                        </span>
                        {match.reason && (
                          <span className="text-[12px] text-stone-500 dark:text-stone-400 mt-0.5 block">
                            {match.reason}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-[#2aa348]" : "text-stone-400"}`}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
                <div className="my-1 border-t border-stone-200 dark:border-stone-700" />
              </>
            )}
            {(results.length > 0 || aiLoading || aiResults.length > 0) && (
              <>
                <p className="text-[11px] uppercase tracking-[0.06em] text-stone-500 dark:text-stone-400 px-4 pt-2.5 pb-1.5">
                  {locale === "nl" ? "Pagina's" : "Pages"}
                </p>
                {results.length > 0 &&
                  results.map((entry, i) => {
                    const baseIndex = animalMatches.length + i;
                    const isSelected = baseIndex === focusedIndex;
                    return (
                      <Link
                        key={entry.path}
                        href={entry.path}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setFocusedIndex(baseIndex)}
                        onClick={closeOverlay}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isSelected ? "bg-[#f7faf8]" : "hover:bg-[#f7faf8]"}`}
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
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-[#2aa348]" : "text-stone-400"}`}
                          aria-hidden
                        />
                      </Link>
                    );
                  })}
                {aiLoading && aiResults.length === 0 && (
                  <p className="px-4 py-2 text-[12px] text-stone-500 dark:text-stone-400">…</p>
                )}
                {aiResults.map((r, i) => {
                  const baseIndex = animalMatches.length + results.length + i;
                  const isSelected = baseIndex === focusedIndex;
                  return (
                    <Link
                      key={r.path + i}
                      href={r.path}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setFocusedIndex(baseIndex)}
                      onClick={closeOverlay}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isSelected ? "bg-[#f7faf8]" : "hover:bg-[#f7faf8]"}`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                        style={{ background: "#EAF3DE", color: "#27500A" }}
                      >
                        ✦
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-stone-800 dark:text-stone-200 block">
                          {getTitleForPath(r.path)}
                        </span>
                        <span className="text-[12px] text-stone-500 dark:text-stone-400 mt-0.5 block">
                          {r.reason}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-[#2aa348]" : "text-stone-400"}`}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </>
            )}
            {query.trim() && results.length === 0 && !aiLoading && aiResults.length === 0 && animalMatches.length === 0 && (
              <p className="px-4 py-4 text-stone-500 dark:text-stone-400">{t("siteSearchNoResults")}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-200 dark:border-stone-700">
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          ↑↓ navigeren · Enter openen · ESC sluiten
        </span>
        <span
          className="text-[11px] text-[#2aa348] px-2 py-0.5 rounded-[10px]"
          style={{ background: "#EAF3DE" }}
        >
          ✦ AI-zoek
        </span>
      </div>
    </>
  );

  const renderPillButton = (mobile: boolean) => {
    const isOverlayStyle = overlay;
    const style = isOverlayStyle ? pillOverlayStyle : pillLightStyle;
    const sparkleColor = isOverlayStyle ? "#7ccd8a" : "#2aa348";
    return (
      <button
        type="button"
        onClick={(e?: React.MouseEvent) => {
          e?.preventDefault();
          e?.stopPropagation();
          setMobileOverlayOpen(true);
        }}
        onMouseOver={(e) => {
          if (overlay) e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          else e.currentTarget.style.background = "var(--color-background-hover, #f3f4f6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = style.background as string;
        }}
        className={pillButtonClass + (mobile ? " px-2 py-1.5 min-w-[44px]" : " px-3 py-1.5")}
        style={style}
        aria-label={t("siteSearchPlaceholder")}
      >
        <span style={{ color: sparkleColor, fontSize: "14px" }}>✦</span>
        {!mobile && (
          <span>{locale === "nl" ? "Zoek..." : "Search..."}</span>
        )}
      </button>
    );
  };

  if (mobileIcon) {
    return (
      <>
        <div className="relative shrink-0 flex items-center" style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
          {renderPillButton(true)}
        </div>
        {mobileOverlayOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={closeOverlay}
          >
            <div
              ref={containerRef}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden w-[calc(100%-32px)] max-w-[560px]"
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
            </div>
          </div>
        )}
      </>
    );
  }

  if (desktopIconOnly) {
    return (
      <div className="relative shrink-0 flex items-center">
        {renderPillButton(false)}
        {mobileOverlayOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={closeOverlay}
          >
            <div
              ref={containerRef}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden w-[calc(100%-32px)] max-w-[560px]"
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2aa348] text-sm pointer-events-none">✦</span>
      </div>
      {isOpen && query.trim() && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 shadow-xl z-[120] max-h-[320px] overflow-y-auto"
        >
          {results.length === 0 ? (
            <p className="px-4 py-2 text-sm text-stone-500 dark:text-stone-400">{t("siteSearchNoResults")}</p>
          ) : (
            results.map((entry, i) => (
              <Link
                key={entry.path}
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
                {getPageTitle(entry, locale)}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
