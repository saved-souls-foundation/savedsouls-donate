"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";
const HERO_IMAGE = "/guides/sterilization-hero.webp";

export default function SterilizationPage() {
  const t = useTranslations("sterilization");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 min-h-[28rem] md:min-h-[36rem] flex items-center">
          <Image
            src={HERO_IMAGE}
            alt={t("heroAlt")}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 mb-6 text-sm font-semibold text-rose-700 dark:text-rose-300">
            🏥 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>❤️ {t("benefitsTitle")}</h2>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("benefit1")}</li>
            <li>• {t("benefit2")}</li>
            <li>• {t("benefit3")}</li>
            <li>• {t("benefit4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4">⏱️ {t("whenTitle")}</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{t("whenText")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">🌏 {t("savedSoulsTitle")}</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{t("savedSoulsText")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {tCommon("donate")}
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
