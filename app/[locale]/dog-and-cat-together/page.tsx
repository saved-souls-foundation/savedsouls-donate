"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import FrostDonateCard from "@/app/components/FrostDonateCard";

const ACCENT_GREEN = "#2aa348";

export default function DogAndCatTogetherPage() {
  const t = useTranslations("dogAndCatTogether");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600">
          <Image src="/guides/dog-and-cat-together-hero.png" alt="" width={1200} height={630} className="w-full h-auto object-cover min-h-[280px] md:min-h-[360px]" priority />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-10 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 max-w-2xl mx-auto">
          <FrostDonateCard src="/guides/dog-and-cat-together-hero.png" alt={t("img1Alt")} namespace="dogAndCatTogether" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📋 {t("stepsTitle")}</h2>
          <ul className="space-y-4 text-stone-600 dark:text-stone-400">
            <li className="flex gap-3"><span className="font-bold text-stone-800 dark:text-stone-200">1.</span> {t("step1")}</li>
            <li className="flex gap-3"><span className="font-bold text-stone-800 dark:text-stone-200">2.</span> {t("step2")}</li>
            <li className="flex gap-3"><span className="font-bold text-stone-800 dark:text-stone-200">3.</span> {t("step3")}</li>
            <li className="flex gap-3"><span className="font-bold text-stone-800 dark:text-stone-200">4.</span> {t("step4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>⏱️ {t("patienceTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("patience")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("donateNow")}
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
