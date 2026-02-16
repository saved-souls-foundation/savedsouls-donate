"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function CatFluPage() {
  const t = useTranslations("catFlu");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">← {tCommon("backToHome")}</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            😿 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🦠 {t("causesTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("causesIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• <strong>{t("cause1")}</strong> – {t("cause1Text")}</li>
            <li>• <strong>{t("cause2")}</strong> – {t("cause2Text")}</li>
            <li>• <strong>{t("cause3")}</strong> – {t("cause3Text")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("transmissionTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("transmission")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>⚠️ {t("symptomsTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("symptomsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• {t("symptom1")}</li>
            <li>• {t("symptom2")}</li>
            <li>• {t("symptom3")}</li>
            <li>• {t("symptom4")}</li>
            <li>• {t("symptom5")}</li>
            <li>• {t("symptom6")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("riskTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("risk")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💊 {t("treatmentTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("treatmentIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• {t("treatment1")}</li>
            <li>• {t("treatment2")}</li>
            <li>• {t("treatment3")}</li>
            <li>• {t("treatment4")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("carrierTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("carrier")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🛡️ {t("preventionTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("preventionIntro")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("preventionSchedule")}</p>
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
