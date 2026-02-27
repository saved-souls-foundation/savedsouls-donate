"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Footer from "../../components/Footer";
import ParallaxPage from "../../components/ParallaxPage";
import DashboardLoginBanner from "../../components/DashboardLoginBanner";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

type SponsorAnimal = {
  id: string;
  name: string;
  thaiName: string;
  type: "dog" | "cat";
  gender: "male" | "female";
  age: string;
  size: string;
  image: string;
  images: string[];
  location: string;
  story: string;
  character: string;
};

function SponsorCard({
  animal,
  imageSrc,
  onSponsor,
}: {
  animal: SponsorAnimal;
  imageSrc: string;
  onSponsor: string;
}) {
  const href = animal.type === "dog" ? `/sponsor/dog/${animal.id}` : `/sponsor/cat/${animal.id}`;

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 shadow-lg border border-stone-200 dark:border-stone-700 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-[#2aa348]/40">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imageSrc}
            alt={`${animal.name} – sponsor ${animal.type} at Saved Souls Foundation`}
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
              {onSponsor} →
            </span>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1" style={{ color: ACCENT_GREEN }}>
            {animal.name} {animal.thaiName && <span className="text-stone-500 dark:text-stone-400 font-normal text-base">/ {animal.thaiName}</span>}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {animal.gender === "male" ? "Male" : "Female"}
            {animal.age && ` · ${animal.age}`}
          </p>
          {animal.character && (
            <p className="text-sm text-stone-500 dark:text-stone-500 mt-1 line-clamp-2">{animal.character}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

const PER_PAGE = 24;

export default function SponsorPage() {
  const t = useTranslations("sponsorPage");
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType = typeParam === "dog" || typeParam === "cat" ? typeParam : "all";
  const [type, setType] = useState<"all" | "dog" | "cat">(initialType);
  const [animals, setAnimals] = useState<SponsorAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeParam === "dog" || typeParam === "cat") {
      setType(typeParam);
      setPage(1);
    }
  }, [typeParam]);

  useEffect(() => {
    fetch("/api/sponsor-animals")
      .then((r) => r.json())
      .then((data) => {
        const dogs: SponsorAnimal[] = (data.dogs || []).map((d: Record<string, unknown>) => ({
          id: String(d.id),
          name: String(d.name),
          thaiName: String(d.thaiName || ""),
          type: "dog" as const,
          gender: (d.gender as "male" | "female") || "male",
          age: d.age ? String(d.age) : "",
          size: String(d.size || "medium"),
          image: String(d.image || ""),
          images: Array.isArray(d.images) ? (d.images as string[]) : [],
          location: String(d.location || ""),
          story: String(d.story || ""),
          character: String(d.character || ""),
        }));
        const cats: SponsorAnimal[] = (data.cats || []).map((c: Record<string, unknown>) => ({
          id: String(c.id),
          name: String(c.name),
          thaiName: String(c.thaiName || ""),
          type: "cat" as const,
          gender: (c.gender as "male" | "female") || "male",
          age: c.age ? String(c.age) : "",
          size: String(c.size || "medium"),
          image: String(c.image || ""),
          images: Array.isArray(c.images) ? (c.images as string[]) : [],
          location: String(c.location || ""),
          story: String(c.story || ""),
          character: String(c.character || ""),
        }));
        setAnimals([...dogs, ...cats]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAnimals = useMemo(() => {
    if (type === "all") return animals;
    return animals.filter((a) => a.type === type);
  }, [animals, type]);

  const totalPages = Math.ceil(filteredAnimals.length / PER_PAGE) || 1;
  const paginatedAnimals = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredAnimals.slice(start, start + PER_PAGE);
  }, [filteredAnimals, page]);

  return (
    <ParallaxPage>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-10 md:mb-14 scroll-mt-24" id="sponsor-heading">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
              {t("title")}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
              {t("subtitle")}
            </p>
            <div className="mt-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("donateCta")}
              </Link>
            </div>
          </header>

          <div className="mb-6 max-w-2xl mx-auto">
            <DashboardLoginBanner />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 p-4 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 shadow-sm">
            {(["all", "dog", "cat"] as const).map((filterType) => (
              <button
                key={filterType}
                type="button"
                onClick={() => { setType(filterType); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${type === filterType ? "text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"}`}
                style={type === filterType ? { backgroundColor: ACCENT_GREEN } : {}}
              >
                {filterType === "all" ? t("all") : filterType === "dog" ? t("dogs") : t("cats")}
              </button>
            ))}
          </div>

          <div id="animals" className="scroll-mt-8">
            {loading ? (
              <div className="text-center py-12">{t("loading")}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {paginatedAnimals.map((animal) => (
                    <SponsorCard
                      key={`${animal.type}-${animal.id}`}
                      animal={animal}
                      imageSrc={animal.image || FALLBACK_IMAGE}
                      onSponsor={t("sponsorCta")}
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
              <p className="text-center text-stone-500 py-12">{t("noAnimals")}</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ParallaxPage>
  );
}
