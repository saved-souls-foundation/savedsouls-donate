"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const SECTIONS = [
  { key: "vaccinations", emoji: "💉", color: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" },
  { key: "fleasTicks", emoji: "🦟", color: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "heartworm", emoji: "❤️‍🩹", color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "deworming", emoji: "🪱", color: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30" },
  { key: "eyes", emoji: "👀", color: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" },
  { key: "ears", emoji: "👂", color: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30" },
  { key: "earMites", emoji: "🦠", color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "sneezing", emoji: "🤧", color: "from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30" },
  { key: "sneezingDisease", emoji: "😿", color: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30" },
  { key: "skinCoat", emoji: "✨", color: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30" },
  { key: "skinProblems", emoji: "🩹", color: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30" },
  { key: "infections", emoji: "🦠", color: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30" },
  { key: "tropics", emoji: "🌴", color: "from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30" },
  { key: "dangers", emoji: "⚠️", color: "from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-900/50" },
  { key: "general", emoji: "🏥", color: "from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30" },
] as const;

export default function HealthPage() {
  const t = useTranslations("health");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">
          ← {tCommon("backToHome")}
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Intro met afbeelding */}
        <section className="mb-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              {t("intro")}
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-80 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600">
            <Image src="/dog-care.webp" alt={t("imgCareAlt")} width={400} height={300} className="w-full h-64 object-cover" />
          </div>
        </section>

        {/* Secties */}
        <div className="space-y-6 mb-16">
          {SECTIONS.map(({ key, emoji, color }) => (
            <section
              key={key}
              className={`rounded-2xl p-6 md:p-8 bg-gradient-to-br ${color} border-2 border-stone-200/80 dark:border-stone-600/80 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 shadow-sm">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
                    {t(`${key}Title`)}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {t(`${key}Text`)}
                  </p>
                  <p className="mt-3 text-sm font-medium text-stone-700 dark:text-stone-300">
                    💡 {t(`${key}Tip`)}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Ziektengids */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: ACCENT_GREEN }}>
            📚 {t("diseasesTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8">{t("diseasesIntro")}</p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐕🐈</span> {t("diseasesCommonTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">{t(`diseaseCommon${i}Name`)}</p>
                    <p className="text-stone-600 dark:text-stone-400 text-xs">{t(`diseaseCommon${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐕</span> {t("diseasesDogTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">{t(`diseaseDog${i}Name`)}</p>
                    <p className="text-stone-600 dark:text-stone-400 text-xs">{t(`diseaseDog${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐈</span> {t("diseasesCatTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">{t(`diseaseCat${i}Name`)}</p>
                    <p className="text-stone-600 dark:text-stone-400 text-xs">{t(`diseaseCat${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3">{t("diseasesPreventionTitle")}</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i}>✓ {t(`diseasesPrevention${i}`)}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-3">🚨 {t("diseasesEmergencyTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">{t("diseasesEmergencyIntro")}</p>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <li key={i}>• {t(`diseasesEmergency${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Dierenarts disclaimer */}
        <div className="mb-16 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-center font-medium">
            🩺 {t("vetDisclaimer")}
          </p>
        </div>

        {/* Donatie CTA */}
        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              {t("donateCtaTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {t("donateCtaText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {t("donateCtaButton")}
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {tCommon("getInvolved")}
              </Link>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl font-semibold border-2" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>
            ← {tCommon("backToHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
