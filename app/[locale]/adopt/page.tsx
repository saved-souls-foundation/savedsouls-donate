"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Footer from "../../components/Footer";
import SiteHeader from "../../components/SiteHeader";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

type AnimalType = "dog" | "cat";
type Gender = "male" | "female";
type Size = "small" | "medium" | "large";

interface Animal {
  id: string;
  name: string;
  thaiName: string;
  type: AnimalType;
  gender: Gender;
  age?: string;
  size: Size;
  image: string;
  images?: string[];
}

const SIZE_LABELS: Record<Size, string> = { small: "Small", medium: "Medium", large: "Large" };

const FALLBACK_IMAGE = "/animals/dog-328.jpg";

function AnimalCard({ animal, imageSrc }: { animal: Animal; imageSrc: string }) {
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
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType = typeParam === "dog" || typeParam === "cat" ? typeParam : "all";
  const [gender, setGender] = useState("all");
  const [size, setSize] = useState("all");
  const [type, setType] = useState<"all" | AnimalType>(initialType);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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
          age: d.age ? String(d.age) : undefined,
          size: (d.size as Size) || "medium",
          image: String(d.image || ""),
          images: Array.isArray(d.images) ? (d.images as string[]) : (d.image ? [String(d.image)] : []),
        }));
        const cats: Animal[] = (data.cats || []).map((c: Record<string, unknown>) => ({
          id: String(c.id),
          name: String(c.name),
          thaiName: String(c.thaiName || ""),
          type: "cat" as const,
          gender: (c.gender as Gender) || "male",
          age: undefined,
          size: (c.size as Size) || "medium",
          image: String(c.image || ""),
          images: Array.isArray(c.images) ? (c.images as string[]) : (c.image ? [String(c.image)] : []),
        }));
        setAnimals([...dogs, ...cats]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      if (type !== "all" && a.type !== type) return false;
      if (gender !== "all" && a.gender !== gender) return false;
      if (size !== "all" && a.size !== size) return false;
      return true;
    });
  }, [animals, type, gender, size]);

  const totalPages = Math.ceil(filteredAnimals.length / PER_PAGE) || 1;
  const paginatedAnimals = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredAnimals.slice(start, start + PER_PAGE);
  }, [filteredAnimals, page]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
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

        <section className="mb-12 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/30 dark:from-stone-900 dark:via-stone-800 dark:to-emerald-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
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
            <Link href="/sponsor" className="px-5 py-2.5 rounded-xl font-semibold border-2 hover:opacity-90" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>
              {t("happyFacesSponsor")}
            </Link>
            <Link href="/donate" className="px-5 py-2.5 rounded-xl font-semibold text-white hover:opacity-90" style={{ backgroundColor: BUTTON_ORANGE }}>
              {t("happyFacesDonate")}
            </Link>
            <Link href="/volunteer" className="px-5 py-2.5 rounded-xl font-semibold border-2 border-stone-400 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
              {t("happyFacesVolunteer")}
            </Link>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 p-4 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 shadow-sm">
          {(["all", "dog", "cat"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${type === t ? "text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"}`}
              style={type === t ? { backgroundColor: ACCENT_GREEN } : {}}
            >
              {t === "all" ? "All" : t === "dog" ? "Dogs" : "Cats"}
            </button>
          ))}
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={size}
            onChange={(e) => { setSize(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
          >
            <option value="all">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <button
            type="button"
            onClick={() => { setGender("all"); setSize("all"); setType("all"); setPage(1); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Clear
          </button>
        </div>

        <div id="animals" className="scroll-mt-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedAnimals.map((animal) => (
                <AnimalCard
                  key={`${animal.type}-${animal.id}`}
                  animal={animal}
                  imageSrc={animal.image || FALLBACK_IMAGE}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  ← Previous
                </button>
                <span className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {!loading && filteredAnimals.length === 0 && (
          <p className="text-center text-stone-500 py-12">No animals match your filters.</p>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
