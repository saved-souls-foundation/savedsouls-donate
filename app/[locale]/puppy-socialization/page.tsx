"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import FrostDonateCard from "@/app/components/FrostDonateCard";

const ACCENT_GREEN = "#2aa348";

export default function PuppySocializationPage() {
  const t = useTranslations("puppySocialization");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600">
          <Image src="/puppy.png" alt="" width={1200} height={630} className="w-full h-auto object-cover min-h-[280px] md:min-h-[360px]" priority />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🐕 🐾 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-10 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 max-w-2xl mx-auto">
          <FrostDonateCard src="/guides/puppy-socialization-hero.png" alt={t("img1Alt")} namespace="puppySocialization" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📅 {t("windowTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("window1")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("window2")}</p>
        </section>

        <div className="mb-16 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600">
          <Image src="/guides/puppy-socialization-inline.png" alt="" width={800} height={450} className="w-full h-auto object-cover min-h-[200px]" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>✅ {t("tipsTitle")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow-lg">
              <Image src="/guides/puppy-sleeping.png" alt="Puppies sleeping together" width={400} height={500} className="w-full h-auto object-cover aspect-[4/5]" />
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow-lg">
              <Image src="/guides/puppy-reading.png" alt="Puppy learning" width={400} height={500} className="w-full h-auto object-cover aspect-[4/5]" />
            </div>
          </div>

          <ul className="space-y-3 text-stone-600 dark:text-stone-400">
            {Array.from({ length: 40 }, (_, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-[#2aa348]/70" aria-hidden />
                <span>{t(`tip${i + 1}`)}</span>
              </li>
            ))}
          </ul>
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
