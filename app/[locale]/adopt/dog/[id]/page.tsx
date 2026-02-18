"use client";

import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/animals/dog-328.jpg";

type Dog = {
  id: string;
  name: string;
  thaiName: string;
  gender: string;
  age: string;
  size: string;
  image: string;
  story?: string;
};

export default function DogDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDog() {
      try {
        const res = await fetch("/api/animals");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const found = data.dogs?.find((d: Dog) => String(d.id) === String(id));
        setDog(found ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <p className="text-stone-500">Loading…</p>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-600 dark:text-stone-400">
          {error || "Dog not found."}
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

  const genderLabel = dog.gender.charAt(0).toUpperCase() + dog.gender.slice(1);
  const sizeLabel = dog.size.charAt(0).toUpperCase() + dog.size.slice(1);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          Saved Souls
        </Link>
        <Link href="/adopt" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
          ← Back to adopt
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6 group">
              <img
                src={dog.image}
                alt={`${dog.name} – rescued dog at Saved Souls Foundation`}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (!t.dataset.fallback) {
                    t.dataset.fallback = "1";
                    t.src = FALLBACK_IMAGE;
                  }
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-50 transition-opacity duration-500"
                aria-hidden
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {dog.name} / {dog.thaiName}
            </h1>
            <dl className="grid grid-cols-2 gap-2 mb-6 text-stone-600 dark:text-stone-400">
              <dt className="font-medium">Gender</dt>
              <dd>{genderLabel}</dd>
              <dt className="font-medium">Age</dt>
              <dd>{dog.age}</dd>
              <dt className="font-medium">Size</dt>
              <dd>{sizeLabel}</dd>
            </dl>

            {dog.story && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                  Adoption Story
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{dog.story}</p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                Adoption Inquiry
              </h2>
              <p className="text-base text-stone-500 dark:text-stone-500 mb-4">
                Interested in adopting {dog.name}? Fill out our adoption inquiry form and we&apos;ll get back to you within 48 hours.
              </p>
              <Link
                href={`/adopt-inquiry?animal=${encodeURIComponent(dog.name)}&id=${encodeURIComponent(dog.id)}`}
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
