"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function EyeEarCarePage() {
  const t = useTranslations("eyeEarCare");
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
            👀 👂 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>👀 {t("eyeTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("eyeDailyTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("eyeDaily")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("eyeProblemsTitle")}</h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• <strong>{t("eyeTearStains")}</strong> – {t("eyeTearStainsText")}</li>
            <li>• <strong>{t("eyeConjunctivitis")}</strong> – {t("eyeConjunctivitisText")}</li>
            <li>• <strong>{t("eyeCornealUlcer")}</strong> – {t("eyeCornealUlcerText")}</li>
            <li>• <strong>{t("eyeDryEye")}</strong> – {t("eyeDryEyeText")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("eyeWarningTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("eyeWarning")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>👂 {t("earTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("earWhyTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("earWhy")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("earCleaningTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("earCleaning")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-4">
            <li>• {t("earStep1")}</li>
            <li>• {t("earStep2")}</li>
            <li>• {t("earStep3")}</li>
            <li>• {t("earStep4")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("earProblemsTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("earProblems")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("earPreventionTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("earPrevention")}</p>
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
