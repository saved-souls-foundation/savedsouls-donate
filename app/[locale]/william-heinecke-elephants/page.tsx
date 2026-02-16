"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export default function WilliamHeineckeElephantsPage() {
  const t = useTranslations("williamHeineckeElephants");
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
            🐘 🇹🇭 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <Image src="/heinecke-elephants.png" alt={t("imgAlt")} width={1024} height={512} className="w-full h-auto object-cover" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🐘 {t("foundationTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("foundationText")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("foundationText2")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🌿 {t("workTitle")}</h2>
          <ul className="space-y-3 text-stone-600 dark:text-stone-400">
            <li className="flex gap-2"><span className="text-green-500">✓</span>{t("work1")}</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span>{t("work2")}</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span>{t("work3")}</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span>{t("work4")}</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span>{t("work5")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🌏 {t("impactTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("impactText")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-stone-600 dark:text-stone-400">
            <Link href="/minor-hotels" className="font-medium underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
              → {t("linkMinorHotels")}
            </Link>
          </p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-xl mx-auto">{t("ctaText")}</p>
          <a
            href="https://www.helpingelephants.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("ctaButton")} →
          </a>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
