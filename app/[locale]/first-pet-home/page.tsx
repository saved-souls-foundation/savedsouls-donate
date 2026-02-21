"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function FirstPetHomePage() {
  const t = useTranslations("firstPetHome");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🏠 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Foto bovenaan – ronde hoeken op de foto zelf */}
        <div className="mb-16">
          <Image
            src="/first-pet-home.png"
            alt={t("imgAlt")}
            width={900}
            height={600}
            className="w-full h-auto rounded-3xl shadow-xl border-2 border-stone-200 dark:border-stone-600 object-cover"
          />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📋 {t("beforeTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("beforeIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("before1")}</li>
            <li>• {t("before2")}</li>
            <li>• {t("before3")}</li>
            <li>• {t("before4")}</li>
            <li>• {t("before5")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📦 {t("firstDaysTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("firstDaysIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("firstDays1")}</li>
            <li>• {t("firstDays2")}</li>
            <li>• {t("firstDays3")}</li>
            <li>• {t("firstDays4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💚 {t("patienceTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("patience")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-lime-50 to-emerald-50 dark:from-lime-950/30 dark:to-emerald-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>🥩 {t("nutritionTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("nutritionText")}</p>
          <Link href="/nutrition" className="inline-flex items-center font-semibold hover:underline" style={{ color: ACCENT_GREEN }}>
            {t("nutritionLink")} →
          </Link>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>🏥 {t("healthTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("healthText")}</p>
          <Link href="/health" className="inline-flex items-center font-semibold hover:underline" style={{ color: ACCENT_GREEN }}>
            {t("healthLink")} →
          </Link>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/adopt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("ctaAdopt")}
            </Link>
            <Link
              href="/health"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 transition-all hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("ctaHealth")}
            </Link>
            <Link
              href="/nutrition"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 transition-all hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("ctaNutrition")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
