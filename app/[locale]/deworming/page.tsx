"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function DewormingPage() {
  const t = useTranslations("deworming");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">← {tCommon("backToHome")}</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🪱 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>⚠️ {t("problemsTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("problemsTypesTitle")}</h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
            <li>• <strong>{t("problemsRoundworm")}</strong> – {t("problemsRoundwormText")}</li>
            <li>• <strong>{t("problemsTapeworm")}</strong> – {t("problemsTapewormText")}</li>
            <li>• <strong>{t("problemsHookworm")}</strong> – {t("problemsHookwormText")}</li>
            <li>• <strong>{t("problemsWhipworm")}</strong> – {t("problemsWhipwormText")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("problemsTransmissionTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("problemsTransmission")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("problemsZoonoticTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("problemsZoonotic")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💊 {t("treatmentTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("treatmentIntro")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("treatmentProductsTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("treatmentProducts")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🛡️ {t("preventionTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">{t("preventionIntro")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("preventionPuppyTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("preventionPuppy")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("preventionAdultTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("preventionAdult")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("preventionTapewormTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("preventionTapeworm")}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("preventionLifestyleTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("preventionLifestyle")}</p>
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
