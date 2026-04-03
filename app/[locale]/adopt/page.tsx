"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import Footer from "../../components/Footer";
import SiteHeader from "../../components/SiteHeader";
import DashboardLoginBanner from "../../components/DashboardLoginBanner";
import TurnstileWidget from "../../components/TurnstileWidget";
import { getISOWeekNumber, getSpotlightDogIndex, getSpotlightCatIndex } from "@/lib/spotlight";
import { showSponsor } from "@/lib/features";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

type AnimalType = "dog" | "cat";
type Gender = "male" | "female";
type Size = "small" | "medium" | "large";

function parseAgeYears(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

interface Animal {
  id: string;
  name: string;
  thaiName: string;
  type: AnimalType;
  gender: Gender;
  age?: number;
  size: Size;
  image: string;
  images?: string[];
  story?: string;
}

const SIZE_LABELS: Record<Size, string> = { small: "Small", medium: "Medium", large: "Large" };

const FALLBACK_IMAGE = "/animals/dog-328.jpg";

function AnimalCard({ animal, imageSrc, reason }: { animal: Animal; imageSrc: string; reason?: string }) {
  const href = animal.type === "dog" ? `/adopt/dog/${animal.id}` : `/adopt/cat/${animal.id}`;

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 shadow-lg border border-stone-200 dark:border-stone-700 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-[#2aa348]/40">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imageSrc}
            alt={`${animal.name} – rescued ${animal.type} at Saved Souls Foundation`}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1";
                t.src = FALLBACK_IMAGE;
              }
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-transparent to-stone-900/20 transition-opacity duration-500 group-hover:opacity-70"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4">
            <h2 className="text-lg font-bold text-white drop-shadow-md min-w-0">
              {animal.name} {animal.thaiName && <span className="text-white/90 font-normal text-base">/ {animal.thaiName}</span>}
            </h2>
            <span className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#2aa348] shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              View More →
            </span>
          </div>
          {reason && (
            <div className="absolute bottom-0 left-0 max-w-[85%] bg-emerald-900/80 text-white text-xs px-3 py-1.5 rounded-br-xl rounded-tl-none line-clamp-2 overflow-hidden">
              {reason}
            </div>
          )}
        </div>
        <div className="p-4 md:p-5">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1" style={{ color: ACCENT_GREEN }}>
            {animal.name} {animal.thaiName && <span className="text-stone-500 dark:text-stone-400 font-normal text-base">/ {animal.thaiName}</span>}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {animal.gender === "male" ? "Male" : "Female"} · {animal.age || animal.size}
          </p>
          {animal.age && <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">{SIZE_LABELS[animal.size]}</p>}
        </div>
      </article>
    </Link>
  );
}

const PER_PAGE = 24;

export default function AdoptPage() {
  const t = useTranslations("adoptPage");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType = typeParam === "dog" || typeParam === "cat" ? typeParam : "all";
  const [nameQuery, setNameQuery] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [gender, setGender] = useState("all");
  const [size, setSize] = useState("all");
  const [type, setType] = useState<"all" | AnimalType>(initialType);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMatches, setAiMatches] = useState<{ id: string; reason: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const allAnimalsRef = useRef<Animal[]>([]);

  useEffect(() => {
    if (typeParam === "dog" || typeParam === "cat") {
      setType(typeParam);
      setPage(1);
    }
  }, [typeParam]);

  useEffect(() => {
    fetch("/api/animals")
      .then((r) => r.json())
      .then((data) => {
        const dogs: Animal[] = (data.dogs || []).map((d: Record<string, unknown>) => ({
          id: String(d.id),
          name: String(d.name),
          thaiName: String(d.thaiName || ""),
          type: "dog" as const,
          gender: (d.gender as Gender) || "male",
          age: parseAgeYears(d.age),
          size: (d.size as Size) || "medium",
          image: String(d.image || ""),
          images: Array.isArray(d.images) ? (d.images as string[]) : (d.image ? [String(d.image)] : []),
          story: d.story ? String(d.story) : undefined,
        }));
        const cats: Animal[] = (data.cats || []).map((c: Record<string, unknown>) => ({
          id: String(c.id),
          name: String(c.name),
          thaiName: String(c.thaiName || ""),
          type: "cat" as const,
          gender: (c.gender as Gender) || "male",
          age: parseAgeYears(c.age),
          size: (c.size as Size) || "medium",
          image: String(c.image || ""),
          images: Array.isArray(c.images) ? (c.images as string[]) : (c.image ? [String(c.image)] : []),
          story: c.story ? String(c.story) : undefined,
        }));
        const list = [...dogs, ...cats];
        setAnimals(list);
        allAnimalsRef.current = list;
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dogs = useMemo(() => animals.filter((a) => a.type === "dog"), [animals]);
  const cats = useMemo(() => animals.filter((a) => a.type === "cat"), [animals]);
  const week = getISOWeekNumber();
  const spotlightDog = dogs.length > 0 ? dogs[getSpotlightDogIndex(week, dogs.length)] : null;
  const spotlightCat = cats.length > 0 ? cats[getSpotlightCatIndex(week, cats.length)] : null;

  const filteredAnimalsBasics = useMemo(() => {
    return animals.filter((a) => {
      if (type !== "all" && a.type !== type) return false;
      if (gender !== "all" && a.gender !== gender) return false;
      if (size !== "all" && a.size !== size) return false;
      return true;
    });
  }, [animals, type, gender, size]);

  const filteredAnimals = useMemo(() => {
    return filteredAnimalsBasics.filter((a) => {
      if (nameQuery.trim() && !a.name?.toLowerCase().includes(nameQuery.trim().toLowerCase())) return false;
      if (ageGroup === "puppy" && (a.age === undefined || a.age > 1)) return false;
      if (ageGroup === "young" && (a.age === undefined || a.age <= 1 || a.age > 3)) return false;
      if (ageGroup === "adult" && (a.age === undefined || a.age <= 3 || a.age > 8)) return false;
      if (ageGroup === "senior" && (a.age === undefined || a.age <= 8)) return false;
      return true;
    });
  }, [filteredAnimalsBasics, nameQuery, ageGroup]);

  /** Zelfde basis als vóór naam/leeftijd-filters: nodig zodat AI-matches niet uit de grid vallen. */
  const animalsForGrid = aiMatches.length > 0 ? filteredAnimalsBasics : filteredAnimals;

  async function aiSearch() {
    const q = aiQuery.trim();
    if (!q) {
      setAiMatches([]);
      return;
    }
    setAiLoading(true);
    try {
      const payload = allAnimalsRef.current
        .slice(0, 150)
        .map((a) => ({
          id: `${a.type}-${a.id}`,
          name: a.name ?? "",
          story: a.story ?? "",
        }));
      const res = await fetch("/api/animal-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animals: payload,
          query: q,
          locale,
          turnstileToken: "",
        }),
      });
      const data = await res.json();
      setAiMatches(data.matches ?? []);
    } catch {
      setAiMatches([]);
    } finally {
      setAiLoading(false);
    }
  }

  const totalPages = Math.ceil(animalsForGrid.length / PER_PAGE) || 1;

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedAnimals = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return animalsForGrid.slice(start, start + PER_PAGE);
  }, [animalsForGrid, page]);

  const matchReasonByKey = useMemo(() => {
    const m: Record<string, string> = {};
    for (const { id, reason } of aiMatches) m[id] = reason;
    return m;
  }, [aiMatches]);

  const displayedAnimals = useMemo(() => {
    if (aiMatches.length === 0) return paginatedAnimals;
    const order = new Map(aiMatches.map((x, i) => [x.id, i]));
    const key = (a: Animal) => `${a.type}-${a.id}`;
    return [...paginatedAnimals].sort((a, b) => {
      const ia = order.get(key(a)) ?? 1e9;
      const ib = order.get(key(b)) ?? 1e9;
      return ia - ib;
    });
  }, [paginatedAnimals, aiMatches]);

  const matchIdsOnPage = useMemo(
    () => new Set(paginatedAnimals.map((a) => `${a.type}-${a.id}`)),
    [paginatedAnimals]
  );
  const hasAnyMatchOnPage =
    aiMatches.length > 0 && aiMatches.some((m) => matchIdsOnPage.has(m.id));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            Adopt a Dog or Cat
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            Every soul deserves a loving home
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/luchtbrug"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("luchtbrugLink")}
            </Link>
            <Link
              href="/first-pet-home"
              className="inline-block px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("firstPetLink")}
            </Link>
          </div>
        </header>

        <section className="mb-12 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/30 dark:from-stone-900 dark:via-stone-800 dark:to-emerald-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:items-start">
          {/* Links: tekst boven + tekst onder */}
          <div className="md:col-start-1 md:row-start-1">
            <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {t("happyFaces1Before")}
              <a href="https://www.facebook.com/SavedSoulsFoundation/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:opacity-80" style={{ color: ACCENT_GREEN }}>
                {t("happyFaces1Link")}
              </a>
              {t("happyFaces1After")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("happyFaces2")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("happyFaces3")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("happyFaces4")}
            </p>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
              {t("happyFaces5")}
            </p>
            <a href="#animals" className="inline-block px-5 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 mb-2" style={{ backgroundColor: ACCENT_GREEN }}>
              {t("happyFacesAdopt")}
            </a>
          </div>
          {/* Rechts (desktop) / midden (mobiel): video */}
          <div className="w-[85%] max-w-[85%] mx-auto min-h-[200px] rounded-xl overflow-hidden border-2 border-amber-200 dark:border-amber-800 shadow-md bg-stone-200 dark:bg-stone-700 md:col-start-2 md:row-start-1 md:row-span-2 md:sticky md:top-4">
            <video
              src="/videos/adopt-hero.mp4"
              className="w-full h-auto aspect-video object-cover"
              controls
              playsInline
              muted
              loop
              autoPlay
              aria-label={t("happyFaces1Link")}
            >
              <track kind="captions" />
            </video>
          </div>
          {/* Links: rest van de tekst */}
          <div className="md:col-start-1 md:row-start-2">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("happyFaces6")}
            </p>
            <ul className="space-y-2 mb-6 text-stone-700 dark:text-stone-300">
              <li>✨ {t("happyFaces7")}</li>
              <li>✨ {t("happyFaces8")}</li>
              <li>✨ {t("happyFaces9")}</li>
              <li>✨ {t("happyFaces10")}</li>
            </ul>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("happyFaces11")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("happyFaces12")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("happyFaces12Share")}{" "}
              <a href="https://www.facebook.com/SavedSoulsFoundation/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:opacity-80" style={{ color: ACCENT_GREEN }}>
                Facebook
              </a>
              {" · "}
              <a href="https://www.youtube.com/@savedsoulsfoundation" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:opacity-80" style={{ color: ACCENT_GREEN }}>
                YouTube
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#animals" className="px-5 py-2.5 rounded-xl font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>
                {t("happyFacesAdopt")}
              </a>
              {showSponsor && (
                <Link href="/sponsor" className="px-5 py-2.5 rounded-xl font-semibold border-2 hover:opacity-90" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>
                  {t("happyFacesSponsor")}
                </Link>
              )}
              <Link href="/donate" className="px-5 py-2.5 rounded-xl font-semibold text-white hover:opacity-90" style={{ backgroundColor: BUTTON_ORANGE }}>
                {t("happyFacesDonate")}
              </Link>
              <Link href="/volunteer" className="px-5 py-2.5 rounded-xl font-semibold border-2 border-stone-400 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                {t("happyFacesVolunteer")}
              </Link>
            </div>
          </div>
        </section>

        <div className="mb-6">
          <DashboardLoginBanner />
        </div>

        {/* Spotlight deze week – hond links, kat rechts; op mobiel onder elkaar */}
        {(spotlightDog || spotlightCat) && (
          <section className="mb-10" aria-labelledby="adopt-spotlight-title">
            <div className="spotlight-banner text-center mb-6 rounded-2xl py-6 px-4">
              <p className="inline-block text-center text-xl md:text-2xl font-bold mb-2 animate-spotlight-tagline bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-clip-text text-transparent bg-[length:200%_auto]">
                {tHome("spotlightTagline")}
              </p>
              <h2 id="adopt-spotlight-title" className="text-center text-sm font-medium text-amber-700/90 dark:text-amber-300/90 animate-spotlight-subtitle">
                {t("spotlightTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {spotlightDog && (
                <div className="w-full">
                  <AnimalCard animal={spotlightDog} imageSrc={spotlightDog.image || FALLBACK_IMAGE} />
                </div>
              )}
              {spotlightCat && (
                <div className="w-full">
                  <AnimalCard animal={spotlightCat} imageSrc={spotlightCat.image || FALLBACK_IMAGE} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Sectie 1: zoek op naam */}
        <section className="rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 shadow-sm p-4 mb-4">
          <label htmlFor="adopt-name-search" className="block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
            {t("nameSearch.label")}
          </label>
          <div className="relative w-full">
            <input
              id="adopt-name-search"
              type="search"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder={t("nameSearch.placeholder")}
              className="w-full min-w-0 pl-4 pr-10 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 dark:text-stone-500"
              aria-hidden
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
          </div>
        </section>

        {/* Sectie 2: filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 shadow-sm p-4 mb-4">
          {(["all", "dog", "cat"] as const).map((animalType) => (
            <button
              key={animalType}
              type="button"
              onClick={() => { setType(animalType); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${type === animalType ? "text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"}`}
              style={type === animalType ? { backgroundColor: ACCENT_GREEN } : {}}
            >
              {animalType === "all" ? t("typeAll") : animalType === "dog" ? t("typeDog") : t("typeCat")}
            </button>
          ))}
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
          >
            <option value="all">{t("gender.all")}</option>
            <option value="male">{t("gender.male")}</option>
            <option value="female">{t("gender.female")}</option>
          </select>
          <select
            value={size}
            onChange={(e) => { setSize(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
          >
            <option value="all">{t("size.all")}</option>
            <option value="small">{t("size.small")}</option>
            <option value="medium">{t("size.medium")}</option>
            <option value="large">{t("size.large")}</option>
          </select>
          <select
            value={ageGroup}
            onChange={(e) => { setAgeGroup(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
          >
            <option value="">{t("ageGroup.all")}</option>
            <option value="puppy">{t("ageGroup.puppy")}</option>
            <option value="young">{t("ageGroup.young")}</option>
            <option value="adult">{t("ageGroup.adult")}</option>
            <option value="senior">{t("ageGroup.senior")}</option>
          </select>
          <button
            type="button"
            onClick={() => { setNameQuery(""); setAgeGroup(""); setGender("all"); setSize("all"); setType("all"); setPage(1); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {t("clear")}
          </button>
        </div>

        {/* Sectie 3: AI-zoekfunctie */}
        <section className="rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 shadow-sm p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              {t("aiSearch.label")}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500">
              ✦ {t("aiSearch.badge")}
            </span>
          </div>
          <div className="flex flex-wrap items-end gap-3 mb-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder={t("aiSearch.placeholder")}
              className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
              aria-label={t("aiSearch.ariaLabel")}
            />
            <button
              type="button"
              onClick={aiSearch}
              disabled={aiLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("aiSearch.button")}
            </button>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{t("aiSearch.hint")}</p>
          <div className="flex flex-wrap items-center gap-3">
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
            {aiLoading && <span className="text-sm text-stone-500 dark:text-stone-400">{t("aiSearch.loading")}</span>}
          </div>
        </section>

        <div id="animals" className="scroll-mt-8">
        {loading ? (
          <div className="text-center py-12">{t("results.loading")}</div>
        ) : (
          <>
            {hasAnyMatchOnPage && (
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-4" style={{ color: ACCENT_GREEN }}>
                {t("results.aiMatches")}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedAnimals.map((animal) => {
                const key = `${animal.type}-${animal.id}`;
                const reason = matchReasonByKey[key];
                const isMatch = reason !== undefined;
                return (
                  <div key={key} className={hasAnyMatchOnPage && !isMatch ? "opacity-40" : ""}>
                    <AnimalCard
                      animal={animal}
                      imageSrc={animal.image || FALLBACK_IMAGE}
                      reason={reason}
                    />
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  {t("results.previous")}
                </button>
                <span className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400">
                  {t("results.page", { current: page, total: totalPages })}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  {t("results.next")}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && animalsForGrid.length === 0 && (
          <p className="text-center text-stone-500 py-12">{t("results.noResults")}</p>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
