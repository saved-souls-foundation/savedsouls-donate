"use client";

import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Footer from "../../../../components/Footer";
import SiteHeader from "../../../../components/SiteHeader";
import SponsorForm from "../../../../components/SponsorForm";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

type SponsorDog = {
  id: string;
  name: string;
  thaiName: string;
  gender: string;
  age: string;
  image: string;
  images?: string[];
  location: string;
  story: string;
  character: string;
};

export default function SponsorDogDetailPage() {
  const params = useParams();
  const t = useTranslations("sponsorPage");
  const id = typeof params.id === "string" ? params.id : "";
  const [dog, setDog] = useState<SponsorDog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [id]);

  useEffect(() => {
    async function fetchDog() {
      try {
        const res = await fetch("/api/sponsor-animals", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const found = data.dogs?.find((d: SponsorDog) => String(d.id) === String(id));
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
        <p className="text-stone-500">{t("loading")}</p>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-600 dark:text-stone-400">
          {error || t("dogNotFound")}
        </p>
        <Link
          href="/sponsor"
          className="text-sm font-medium hover:underline"
          style={{ color: ACCENT_GREEN }}
        >
          {t("backToSponsor")}
        </Link>
      </div>
    );
  }

  const genderLabel = dog.gender?.toLowerCase() === "female" ? t("female") : t("male");
  const photos = (dog.images && dog.images.length > 0 ? dog.images : [dog.image]).filter(Boolean);
  const mainImage = photos[selectedIndex] || dog.image;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-3 group">
              <img
                src={mainImage}
                alt={`${dog.name} – sponsor dog at Saved Souls Foundation`}
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
              {dog.name} {dog.thaiName && `/ ${dog.thaiName}`}
            </h1>
            <dl className="grid grid-cols-2 gap-2 mb-6 text-stone-600 dark:text-stone-400">
              <dt className="font-medium">{t("gender")}</dt>
              <dd>{genderLabel}</dd>
              {dog.age && (
                <>
                  <dt className="font-medium">{t("age")}</dt>
                  <dd>{dog.age}</dd>
                </>
              )}
              {dog.location && (
                <>
                  <dt className="font-medium">{t("location")}</dt>
                  <dd>{dog.location}</dd>
                </>
              )}
              {dog.character && (
                <>
                  <dt className="font-medium">{t("character")}</dt>
                  <dd>{dog.character}</dd>
                </>
              )}
            </dl>

            {dog.story && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                  {t("story")}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line">{dog.story}</p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                {t("sponsorThis", { name: dog.name })}
              </h2>
              <p className="text-base text-stone-500 dark:text-stone-500 mb-4">
                {t("sponsorDescription", { name: dog.name })}
              </p>
              <SponsorForm
                animalId={String(dog.id)}
                animalName={dog.name}
                animalType="dog"
              />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
