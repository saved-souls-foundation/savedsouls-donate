"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function VaccinationsPage() {
  const t = useTranslations("vaccinations");
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
            💉 🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🐕 {t("dogTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("dogCoreTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("dogCoreText")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
            <li>• <strong>DHPP/DA2PP</strong> – {t("dogDhpp")}</li>
            <li>• <strong>Rabies</strong> – {t("dogRabies")}</li>
            <li>• <strong>Leptospirosis</strong> – {t("dogLepto")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("dogNonCoreTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("dogNonCoreText")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("dogNonCore1")}</li>
            <li>• {t("dogNonCore2")}</li>
            <li>• {t("dogNonCore3")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🐈 {t("catTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("catCoreTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("catCoreText")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
            <li>• <strong>FVRCP</strong> – {t("catFvrcp")}</li>
            <li>• <strong>Rabies</strong> – {t("catRabies")}</li>
            <li>• <strong>FeLV</strong> – {t("catFelv")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("catNonCoreTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("catNonCoreText")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📅 {t("scheduleTitle")}</h2>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("schedulePuppyTitle")}</h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
            <li>• <strong>6–8 weken:</strong> {t("schedulePuppy1")}</li>
            <li>• <strong>10–12 weken:</strong> {t("schedulePuppy2")}</li>
            <li>• <strong>14–16 weken:</strong> {t("schedulePuppy3")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("scheduleKittenTitle")}</h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
            <li>• <strong>6–8 weken:</strong> {t("scheduleKitten1")}</li>
            <li>• <strong>10–12 weken:</strong> {t("scheduleKitten2")}</li>
            <li>• <strong>14–16 weken:</strong> {t("scheduleKitten3")}</li>
          </ul>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">{t("scheduleAdultTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("scheduleAdultText")}</p>
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
