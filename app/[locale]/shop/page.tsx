"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import { useCart } from "@/contexts/CartContext";
import type { ShopCurrency, ShopProduct } from "@/types/printify";
import { getLowestPriceCents, getProductImage } from "@/lib/shop";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

function CurrencySelector() {
  const t = useTranslations("shop");
  const { currency, setCurrency, ratesLoading } = useCart();
  const currencies: ShopCurrency[] = ["USD", "EUR", "THB"];

  return (
    <div className="flex items-center justify-end gap-2 mb-6">
      <span className="text-sm text-stone-600 dark:text-stone-400">{t("currency")}:</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as ShopCurrency)}
        disabled={ratesLoading}
        className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-1.5 text-sm font-medium text-stone-800 dark:text-stone-100"
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ShopPage() {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const { formatPrice, itemCount } = useCart();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/printify/products", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20" suppressHydrationWarning>
        <header className="text-center mb-10 md:mb-14">
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

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <CurrencySelector />
          <Link
            href="/shop/cart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            🛒 {t("cart")} {itemCount > 0 ? `(${itemCount})` : ""}
          </Link>
        </div>

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

          {loading && (
            <p className="text-center text-stone-600 dark:text-stone-400 py-12">Loading…</p>
          )}
          {error && !loading && (
            <p className="text-center text-red-600 dark:text-red-400 py-12">{error}</p>
          )}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-stone-600 dark:text-stone-400 py-12">{t("ctaText")}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const image = getProductImage(product);
              const price = getLowestPriceCents(product);
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:border-[#2aa348]/40"
                >
                  <div className="relative aspect-square bg-stone-100 dark:bg-stone-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-semibold text-stone-800 dark:text-stone-100 line-clamp-2 mb-1">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>
                      {price > 0 ? formatPrice(price) : "—"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="text-center rounded-2xl p-10 md:p-14 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-xl min-h-[180px] flex flex-col justify-center" suppressHydrationWarning>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop/cart"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg shrink-0"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("cart")} →
            </Link>
            <Link
              href="/affiliate"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg shrink-0"
              style={{ backgroundColor: "#e62e04" }}
            >
              🐾 {tCommon("helpAndShop")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
