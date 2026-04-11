"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

export default function DogMeatSurvivorsPage() {
  const t = useTranslations("dogMeatSurvivors");
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
            📊 600+ {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/shelter-care.webp" alt="Dog rehabilitation at Saved Souls" width={500} height={350} className="w-full h-56 object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/team-dogs.webp" alt="Rescue dog at Saved Souls" width={500} height={350} className="w-full h-56 object-cover" />
          </div>
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>🧠 {t("patternsTitle")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                <p className="font-bold text-stone-800 dark:text-stone-100">{t(`pattern${i}Title`)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t(`pattern${i}Text`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>⏱️ {t("timelinesTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t(`timeline${i}Title`)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t(`timeline${i}Text`)}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <Image src="/founder-hug.webp" alt="Recovery success story" width={800} height={450} className="w-full h-64 object-cover" />
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: ACCENT_GREEN }}>💔→💚 {t("casesTitle")}</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t(`case${i}Title`)}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`case${i}Text`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <TrackedDonateLink href="/#donate" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg" style={{ backgroundColor: BUTTON_ORANGE }}>
            {t("ctaButton")}
          </TrackedDonateLink>
        </section>

        <div className="flex justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl font-semibold border-2" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>← {tCommon("backToHome")}</Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
