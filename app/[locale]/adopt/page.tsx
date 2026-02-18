"use client";

import { Link } from "@/i18n/navigation";
import { useState, useMemo, useEffect } from "react";
import Footer from "../../components/Footer";

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
}

const SIZE_LABELS: Record<Size, string> = { small: "Small", medium: "Medium", large: "Large" };

const FALLBACK_IMAGE = "/animals/dog-328.jpg";

function AnimalCard({ animal, imageSrc }: { animal: Animal; imageSrc: string }) {
  const href = animal.type === "dog" ? `/adopt/dog/${animal.id}` : `/adopt/cat/${animal.id}`;

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 shadow-lg border border-stone-200 dark:border-stone-700 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-[#2aa348]/40">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageSrc}
            alt={`${animal.name} – rescued ${animal.type} at Saved Souls Foundation`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
            className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-30"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2aa348]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden
          />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#2aa348] shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View More →
          </span>
        </div>
        <div className="p-4 md:p-5">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1" style={{ color: ACCENT_GREEN }}>
            {animal.name} {animal.thaiName && <span className="text-stone-500 dark:text-stone-400 font-normal text-base">/ {animal.thaiName}</span>}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {animal.gender === "male" ? "Male" : "Female"} · {animal.age || animal.size}
          </p>
          {animal.age && <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">{SIZE_LABELS[animal.size]}</p>}
        </div>
      </article>
    </Link>
  );
}

const PER_PAGE = 24;

export default function AdoptPage() {
  const [gender, setGender] = useState("all");
  const [size, setSize] = useState("all");
  const [type, setType] = useState<"all" | AnimalType>("all");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          Saved Souls
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
            ← Home
          </Link>
          <Link
            href="https://paypal.me/savedsoulsfoundation"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            Donate
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            Adopt a Dog or Cat
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            Every soul deserves a loving home
          </p>
        </header>

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
      </main>
      <Footer />
    </div>
  );
}
