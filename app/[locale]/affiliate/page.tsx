"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ParallaxPage, { useScrollProgress } from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

type AffiliateProduct = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  link: string;
  image: string;
};

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e7e5e4' width='400' height='300'/%3E%3Ctext fill='%23787572' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16'%3EAfbeelding%3C/text%3E%3C/svg%3E";

function ProductCard({
  p,
  t,
}: {
  p: AffiliateProduct;
  t: (key: string) => string;
}) {
  return (
    <article className="rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 overflow-hidden transition-all hover:shadow-lg hover:border-[#2aa348]/40">
      <div className="w-full aspect-[4/3] relative bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== FALLBACK_IMAGE) el.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-2 line-clamp-2">{p.name}</h4>
        <p className="text-stone-600 dark:text-stone-400 font-semibold mb-1">{p.price}</p>
        <p className="text-stone-500 dark:text-stone-500 text-sm mb-3">
          {p.originalPrice} · {p.discount} off
        </p>
        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {t("clickAndBuy")}
        </a>
      </div>
    </article>
  );
}

export default function AffiliatePage() {
  const t = useTranslations("affiliate");
  const { progress } = useScrollProgress();
  const [mounted, setMounted] = useState(false);
  type TabId = "dogs" | "cats" | "dogs-wheelchairs" | "holiday";
  const [activeTab, setActiveTab] = useState<TabId>("dogs");
  const [dogProducts, setDogProducts] = useState<AffiliateProduct[]>([]);
  const [catProducts, setCatProducts] = useState<AffiliateProduct[]>([]);
  const [wheelchairProducts, setWheelchairProducts] = useState<AffiliateProduct[]>([]);
  const [holidayProducts, setHolidayProducts] = useState<AffiliateProduct[]>([]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const opts = { cache: "no-store" as RequestCache };
    fetch("/api/affiliate/products/dogs", opts)
      .then((res) => res.json())
      .then((data) => setDogProducts(Array.isArray(data) ? data : []))
      .catch(() => setDogProducts([]));
    fetch("/api/affiliate/products/cats", opts)
      .then((res) => res.json())
      .then((data) => setCatProducts(Array.isArray(data) ? data : []))
      .catch(() => setCatProducts([]));
    fetch("/api/affiliate/products/dogs-wheelchairs", opts)
      .then((res) => res.json())
      .then((data) => setWheelchairProducts(Array.isArray(data) ? data : []))
      .catch(() => setWheelchairProducts([]));
    fetch("/api/affiliate/products/holiday", opts)
      .then((res) => res.json())
      .then((data) => setHolidayProducts(Array.isArray(data) ? data : []))
      .catch(() => setHolidayProducts([]));
  }, []);

  const productsByTab: Record<TabId, AffiliateProduct[]> = {
    dogs: dogProducts,
    cats: catProducts,
    "dogs-wheelchairs": wheelchairProducts,
    holiday: holidayProducts,
  };
  const currentProducts = productsByTab[activeTab];

  return (
    <ParallaxPage parallax={false} noOverlay trackScrollProgress>
      {/* Groene zijlijn – oplicht bij scroll */}
      <div
        className="fixed left-0 top-0 z-20 w-1 bottom-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: "#2aa348",
          opacity: mounted ? 0.35 + progress * 0.65 : 0.35,
        }}
        aria-hidden
      />
      {/* Header foto */}
      <div className="affiliate-header-image relative w-full h-[380px] sm:h-[420px] md:h-[460px] overflow-hidden mb-10 md:mb-14">
        <Image
          src="/affiliate-header-hands.png"
          alt={mounted ? t("headerAlt") : "Affiliate"}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {!mounted ? (
          /* Placeholder: zelfde op server en client, voorkomt hydration mismatch */
          <div className="text-center mb-10 min-h-[120px]" />
        ) : (
          <>
            <header className="text-center mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                {t("title")}
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
                {t("intro")}
              </p>
            </header>

            <nav className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14" aria-label="Productcategorieën">
            <button
              type="button"
              onClick={() => setActiveTab("dogs")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                activeTab === "dogs" ? "text-white" : "bg-transparent border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200"
              }`}
              style={activeTab === "dogs" ? { backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN } : undefined}
            >
              🐶 {t("categoryDogProducts")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cats")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                activeTab === "cats" ? "text-white" : "bg-transparent border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200"
              }`}
              style={activeTab === "cats" ? { backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN } : undefined}
            >
              🐱 {t("categoryCatProducts")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dogs-wheelchairs")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                activeTab === "dogs-wheelchairs" ? "text-white" : "bg-transparent border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200"
              }`}
              style={activeTab === "dogs-wheelchairs" ? { backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN } : undefined}
            >
              🦽 {t("categoryDogWheelchairs")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("holiday")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                activeTab === "holiday" ? "text-white" : "bg-transparent border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200"
              }`}
              style={activeTab === "holiday" ? { backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN } : undefined}
            >
              🎄 {t("categoryHoliday")}
            </button>
          </nav>

            {/* Productgrid voor actieve categorie */}
            <section className="mb-14 md:mb-20">
              {currentProducts.length === 0 ? (
                <p className="text-stone-500 dark:text-stone-400 text-sm py-4">{t("comingSoonProducts")}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((p) => (
                    <ProductCard key={p.id} p={p} t={t} />
                  ))}
                </div>
              )}
            </section>

            {/* Disclaimer */}
            <section className="rounded-2xl p-6 md:p-8 bg-stone-100 dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
              <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed text-center">
                {t("disclaimer")}
              </p>
            </section>
          </>
        )}
      </main>
      <Footer />
    </ParallaxPage>
  );
}
