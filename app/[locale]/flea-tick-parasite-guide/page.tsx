"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const REMEDY_WIKI: Record<string, string> = {
  remedy1: "Apple_cider_vinegar",
  remedy2: "Coconut_oil",
  remedy3: "Diatomaceous_earth",
  remedy4: "Chamomile",
  remedy5: "Flea_treatments",
};

export default function FleaTickParasiteGuidePage() {
  const t = useTranslations("fleaTickParasiteGuide");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const wikiLang = ["nl", "en", "de", "es", "th", "ru"].includes(locale) ? locale : "en";

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🦟 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 mx-auto max-w-md rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <Image src="/nexgard-spectra.png" alt={t("imgNexgardAlt")} width={400} height={267} className="w-full h-auto object-cover" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💊 {t("nexgardTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("nexgardText")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("nexgardText2")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🛒 {t("otcTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("otcText")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("otc1")}</li>
            <li>• {t("otc2")}</li>
            <li>• {t("otc3")}</li>
            <li>• {t("otc4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>⚠️ {t("dangersTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("dangersChemicals")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("dangersHome")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🌿 {t("safeRemediesTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">{t("safeRemediesIntro")}</p>
          <div className="space-y-4">
            {([1, 2, 3, 4, 5] as const).map((i) => {
              const wikiUrl = `https://${wikiLang}.wikipedia.org/wiki/${REMEDY_WIKI[`remedy${i}`]}`;
              const goUrl = `/go?url=${encodeURIComponent(wikiUrl)}&return=${encodeURIComponent("/flea-tick-parasite-guide")}`;
              return (
                <Link
                  key={i}
                  href={goUrl}
                  className="block p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-500"
                >
                  <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 underline decoration-dotted hover:decoration-solid" style={{ color: ACCENT_GREEN }}>
                    {t(`remedy${i}Title`)} →
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`remedy${i}Text`)}</p>
                </Link>
              );
            })}
          </div>
        </section>

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
