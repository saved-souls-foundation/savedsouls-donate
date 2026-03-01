"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const SHOP_URL = "https://shop.savedsouls-foundation.org/shop/";

const PRODUCTS = [
  { emoji: "👕", key: "hoodie", price: "€45–50", href: "https://shop.savedsouls-foundation.org/product-category/clothing/" },
  { emoji: "👜", key: "tote", price: "€24.90", href: "https://shop.savedsouls-foundation.org/product/cotton-canvas-tote-bag/" },
  { emoji: "☕", key: "cup", price: "€14.90", href: "https://shop.savedsouls-foundation.org/product/ceramic-cup/" },
  { emoji: "📅", key: "calendar", price: "€25", href: "https://shop.savedsouls-foundation.org/product/desk-calendar-2026/" },
  { emoji: "🖼️", key: "poster", price: "€24.90", href: "https://shop.savedsouls-foundation.org/product/canvas-gallery-wrap/" },
  { emoji: "🧢", key: "cap", price: "€24.90", href: "https://shop.savedsouls-foundation.org/product/cap-with-round-patch/" },
];

export default function ShopPage() {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20" suppressHydrationWarning>
        <header className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-300 dark:border-amber-600 mb-6 text-sm font-semibold text-amber-800 dark:text-amber-200">
            🛒 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 relative aspect-[21/9]" suppressHydrationWarning>
          <Image
            src="/team-dogs.webp"
            alt={t("heroAlt")}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6" suppressHydrationWarning>
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
              {t("heroText")}
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
            {t("productsTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <a
                key={p.key}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 text-center transition-all hover:scale-105 hover:shadow-lg hover:border-[#2aa348]/40"
              >
                <span className="text-3xl mb-2 block">{p.emoji}</span>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{t(`products.${p.key}`)}</p>
                <p className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>{p.price}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="text-center rounded-2xl p-10 md:p-14 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-xl min-h-[220px] flex flex-col justify-center" suppressHydrationWarning>
          <div suppressHydrationWarning>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl mx-auto">
              {t("ctaText")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg shrink-0"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              <span suppressHydrationWarning>{t("ctaButton")} →</span>
            </a>
            <a
              href={`/${locale}/affiliate`}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg shrink-0"
              style={{ backgroundColor: "#e62e04" }}
            >
              <span suppressHydrationWarning>🐾 {tCommon("helpAndShop")}</span>
            </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
