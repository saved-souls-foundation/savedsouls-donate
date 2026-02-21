"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function DangersPage() {
  const t = useTranslations("dangers");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            ⚠️ 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>🐶 {t("puppiesTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("puppies")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🍫 {t("toxicFoodsTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("toxicFoodsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• <strong>{t("food1")}</strong> – {t("food1Text")}</li>
            <li>• <strong>{t("food2")}</strong> – {t("food2Text")}</li>
            <li>• <strong>{t("food3")}</strong> – {t("food3Text")}</li>
            <li>• <strong>{t("food4")}</strong> – {t("food4Text")}</li>
          </ul>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("toxicFoodsTip")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🌿 {t("toxicPlantsTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("toxicPlantsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• {t("plant1")}</li>
            <li>• {t("plant2")}</li>
            <li>• {t("plant3")}</li>
          </ul>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("toxicPlantsTip")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🔧 {t("otherDangersTitle")}</h2>
          <div className="space-y-4 text-stone-600 dark:text-stone-400">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("foreignObjectsTitle")}</h3>
              <p className="leading-relaxed">{t("foreignObjects")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">☀️ {t("overheatingTitle")}</h3>
              <p className="leading-relaxed">{t("overheating")}</p>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-stone-100 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-600 shadow-lg">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>👀 {t("vigilanceTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("vigilance")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("vigilance1")}</li>
            <li>• {t("vigilance2")}</li>
            <li>• {t("vigilance3")}</li>
          </ul>
        </section>

        <div className="mb-16 p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800">
          <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">🚨 {t("poisoningTitle")}</h3>
          <p className="text-red-800 dark:text-red-200">{t("poisoning")}</p>
        </div>

        <div className="mb-16 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-center font-medium">
            🩺 {t("vetDisclaimer")}
          </p>
        </div>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <Link
            href="/health"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaButton")}
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
