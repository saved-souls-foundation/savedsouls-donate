"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function GeneralHealthPage() {
  const t = useTranslations("generalHealth");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🏥 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📋 {t("pillarsTitle")}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">🩺 {t("checkupTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("checkup")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">🦷 {t("dentalTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("dental")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">⚖️ {t("weightTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("weight")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">🏃 {t("exerciseTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("exercise")}</p>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>👀 {t("signsTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("signsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("sign1")}</li>
            <li>• {t("sign2")}</li>
            <li>• {t("sign3")}</li>
            <li>• {t("sign4")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>✂️ {t("neuteringTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("neutering")}</p>
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
