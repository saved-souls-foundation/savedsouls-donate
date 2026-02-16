"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export default function MinorHotelsPage() {
  const t = useTranslations("minorHotels");
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
            🏨 🇹🇭 {t("badge")}
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

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <Image src="/hero-hug.png" alt={t("imgAlt")} width={800} height={450} className="w-full h-64 object-cover" />
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🌴 {t("storyTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("story1")}</p>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("story2")}</p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("story3")}</p>
          <p className="mt-4">
            <Link href="/william-heinecke-elephants" className="text-sm font-medium underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
              → {t("linkElephants")}
            </Link>
          </p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💚 {t("connectTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">{t("connectText")}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.minorhotels.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("ctaMinor")} →
            </a>
            <Link
              href="/#donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 border-2"
              style={{ backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN }}
            >
              {t("ctaDonate")} →
            </Link>
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-xl mx-auto">{t("ctaText")}</p>
          <Link
            href="/#donate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 text-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaButton")} →
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
