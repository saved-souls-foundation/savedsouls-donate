"use client";

import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/animals/cat-1.jpg";

type Cat = {
  id: string;
  name: string;
  thaiName: string;
  gender: string;
  size: string;
  image: string;
  images?: string[];
  story?: string;
};

export default function CatDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [id]);

  useEffect(() => {
    async function fetchCat() {
      try {
        const res = await fetch("/api/animals", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const found = data.cats?.find((c: Cat) => String(c.id) === String(id));
        setCat(found ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCat();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <p className="text-stone-500">Loading…</p>
      </div>
    );
  }

  if (error || !cat) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-600 dark:text-stone-400">
          {error || "Cat not found."}
        </p>
        <Link
          href="/adopt"
          className="text-sm font-medium hover:underline"
          style={{ color: ACCENT_GREEN }}
        >
          ← Back to adopt
        </Link>
      </div>
    );
  }

  const genderLabel = cat.gender.charAt(0).toUpperCase() + cat.gender.slice(1);
  const sizeLabel = cat.size.charAt(0).toUpperCase() + cat.size.slice(1);
  const photos = (cat.images && cat.images.length > 0 ? cat.images : [cat.image]).filter(Boolean);
  const mainImage = photos[selectedIndex] || cat.image;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-3 group">
              <img
                src={mainImage}
                alt={`${cat.name} – rescued cat at Saved Souls Foundation`}
                className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (!t.dataset.fallback) {
                    t.dataset.fallback = "1";
                    t.src = FALLBACK_IMAGE;
                  }
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-transparent to-stone-900/20 pointer-events-none"
                aria-hidden
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {photos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      i === selectedIndex
                        ? "border-[#2aa348] ring-2 ring-[#2aa348]/30"
                        : "border-stone-200 dark:border-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.dataset.fallback) {
                          t.dataset.fallback = "1";
                          t.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {cat.name}{cat.thaiName ? ` / ${cat.thaiName}` : ""}
            </h1>
            <dl className="grid grid-cols-2 gap-2 mb-6 text-stone-600 dark:text-stone-400">
              <dt className="font-medium">Gender</dt>
              <dd>{genderLabel}</dd>
              <dt className="font-medium">Size</dt>
              <dd>{sizeLabel}</dd>
            </dl>

            {cat.story && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                  Adoption Story
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{cat.story}</p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                Adoption Inquiry
              </h2>
              <p className="text-base text-stone-500 dark:text-stone-500 mb-4">
                Interested in adopting {cat.name}? Fill out our adoption inquiry form and we&apos;ll get back to you within 48 hours.
              </p>
              <Link
                href={`/adopt-inquiry?animal=${encodeURIComponent(cat.name)}&id=${encodeURIComponent(cat.id)}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                Submit Adoption Inquiry →
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
