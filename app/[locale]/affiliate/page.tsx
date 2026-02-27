"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ParallaxPage, { useScrollProgress } from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

const DOG_PRODUCTS = [
  "dogFood",
  "dogCarrier",
  "dogFlea",
  "dogCollarLeash",
  "dogBed",
  "dogToys",
] as const;

const CAT_PRODUCTS = [
  "catFood",
  "catCarrier",
  "catFlea",
  "catCollarLeash",
  "catBed",
  "catToys",
] as const;

type ProductKey = (typeof DOG_PRODUCTS)[number] | (typeof CAT_PRODUCTS)[number];

/* REPLACE WITH REAL AFFILIATE LINK – placeholder for Shopee/Lazada/AliExpress */
const AFFILIATE_LINK_PLACEHOLDER = "#";

function ProductCard({
  productKey,
  t,
  shops,
}: {
  productKey: ProductKey;
  t: (key: string) => string;
  shops: { name: string; ariaKey: string }[];
}) {
  const name = t(`products.${productKey}.name`);
  const description = t(`products.${productKey}.description`);
  return (
    <article className="rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 overflow-hidden transition-all hover:shadow-lg hover:border-[#2aa348]/40">
      {/* Image placeholder – frost */}
      <div
        className="w-full aspect-[4/3] flex items-center justify-center text-stone-500 dark:text-stone-400 text-sm bg-white/40 dark:bg-stone-800/40 backdrop-blur-md border border-white/20 dark:border-stone-600/30"
        aria-hidden
      >
        [Image]
      </div>
      <div className="p-4">
        <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{name}</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {shops.map((shop) => (
            <span
              key={shop.ariaKey}
              className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-xs text-stone-600 dark:text-stone-400"
              title={t(`shops.${shop.ariaKey}`)}
            >
              {shop.name}
            </span>
          ))}
        </div>
        {/* REPLACE WITH REAL AFFILIATE LINK */}
        <a
          href={AFFILIATE_LINK_PLACEHOLDER}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {t("shopNow")}
        </a>
      </div>
    </article>
  );
}

export default function AffiliatePage() {
  const t = useTranslations("affiliate");
  const { progress } = useScrollProgress();
  const shops = [
    { name: "Shopee", ariaKey: "shopee" },
    { name: "Lazada", ariaKey: "lazada" },
    { name: "AliExpress", ariaKey: "aliexpress" },
  ];

  return (
    <ParallaxPage parallax={false} noOverlay trackScrollProgress>
      {/* Groene zijlijn – oplicht bij scroll */}
      <div
        className="fixed left-0 top-0 bottom-0 z-20 w-1 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: ACCENT_GREEN,
          opacity: 0.35 + progress * 0.65,
        }}
        aria-hidden
      />
      {/* Header foto – volle breedte, maat aangepast voor vierkante bron (aarde + handen) */}
      <div className="affiliate-header-image relative w-full h-[380px] sm:h-[420px] md:h-[460px] overflow-hidden mb-10 md:mb-14">
        <Image
          src="/affiliate-header-hands.png"
          alt={t("headerAlt")}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Intro */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </header>

        {/* Section: Dogs */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
            <span>🐶</span> {t("sectionDogs")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOG_PRODUCTS.map((key) => (
              <ProductCard key={key} productKey={key} t={t} shops={shops} />
            ))}
          </div>
        </section>

        {/* Section: Cats */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
            <span>🐱</span> {t("sectionCats")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAT_PRODUCTS.map((key) => (
              <ProductCard key={key} productKey={key} t={t} shops={shops} />
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-2xl p-6 md:p-8 bg-stone-100 dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
          <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed text-center">
            {t("disclaimer")}
          </p>
        </section>

        <Footer />
      </main>
    </ParallaxPage>
  );
}
