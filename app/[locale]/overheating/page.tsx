"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";
/** Plaats afbeelding in public/blog/overheating-hero.webp */
const HERO_IMAGE = "/blog/overheating-hero.webp";

export default function OverheatingPage() {
  const t = useTranslations("overheating");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 mb-6 text-sm font-semibold text-orange-700 dark:text-orange-300">
            🌡️ {t("badge")}
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

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">🚨 {t("symptomsTitle")}</h2>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• {t("symptom1")}</li>
            <li>• {t("symptom2")}</li>
            <li>• {t("symptom3")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>✅ {t("preventionTitle")}</h2>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("prevention1")}</li>
            <li>• {t("prevention2")}</li>
            <li>• {t("prevention3")}</li>
            <li>• {t("prevention4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4">🩺 {t("whatToDoTitle")}</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{t("whatToDoText")}</p>
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
