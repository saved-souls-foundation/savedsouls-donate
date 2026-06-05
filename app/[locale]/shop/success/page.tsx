"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";
import { useCart } from "@/contexts/CartContext";

const ACCENT_GREEN = "#2aa348";

export default function ShopSuccessPage() {
  const t = useTranslations("shop");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#2aa348]/15 text-4xl mb-6">
          ✓
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-stone-100 mb-4">
          {t("orderSuccess")}
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 max-w-lg mx-auto">
          {t("ctaText")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("title")} →
          </Link>
          <Link
            href="/"
            className="inline-flex px-8 py-3 rounded-xl font-bold border-2 border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-100"
          >
            Home
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
