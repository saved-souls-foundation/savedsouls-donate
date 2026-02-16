"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const SS_BEHAVIORS = [
  { key: "fearShy", emoji: "🫣", color: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30" },
  { key: "reactive", emoji: "🐕‍🦺", color: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "resourceGuarding", emoji: "🦴", color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "separationAnxiety", emoji: "😰", color: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30" },
] as const;

export default function BehaviorPage() {
  const t = useTranslations("behavior");
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
            <Image src="/dog-care.webp" alt={t("imgAlt")} width={400} height={300} className="w-full h-64 object-cover" />
          </div>
        </section>

        {/* Saved Souls gedragstypes */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: ACCENT_GREEN }}>
            {t("ssBehaviorsTitle")}
          </h2>
          <div className="space-y-6">
            {SS_BEHAVIORS.map(({ key, emoji, color }) => (
              <div
                key={key}
                className={`rounded-2xl p-6 md:p-8 bg-gradient-to-br ${color} border-2 border-stone-200/80 dark:border-stone-600/80 shadow-lg`}
              >
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
                  {emoji} {t(`${key}Title`)}
                </h3>
                <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">{t(`${key}What`)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">{t(`${key}Why`)}</p>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">{t(`${key}Recovery`)}</p>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">{t(`${key}WhatWeDo`)}</p>
                  <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                    {[1, 2, 3].map((i) => (
                      <li key={i}>• {t(`${key}Do${i}`)}</li>
                    ))}
                  </ul>
                </div>
                {key === "fearShy" && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-xl">
                    ✓ {t("fearShyAdoptionPrep")}
                  </p>
                )}
                {key === "separationAnxiety" && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-xl">
                    ✓ {t("separationAdoptionPrep")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Onze Aanpak */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("approachTitle")}
          </h2>
          <div className="space-y-6 mb-6">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">🏊 {t("approachSwimTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("approachSwimText")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">👥 {t("approachVolunteersTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("approachVolunteersText")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">🎓 {t("approachPatienceTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("approachPatienceText")}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
            <p className="font-bold text-stone-800 dark:text-stone-100 mb-2">📊 {t("approachResultsTitle")}</p>
            <p className="text-stone-600 dark:text-stone-400 text-sm">{t("approachResultsText")}</p>
          </div>
        </section>

        {/* Voor Adopters */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("forAdoptersTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 italic">"{t("forAdoptersReady")}"</p>
          <div className="mb-6">
            <p className="font-semibold text-stone-800 dark:text-stone-100 mb-3">✅ {t("forAdoptersChecklistTitle")}</p>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>☑️ {t(`forAdoptersCheck${i}`)}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6 p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
            <p className="font-semibold text-green-700 dark:text-green-400 mb-2">💚 {t("forAdoptersWorthTitle")}</p>
            <p className="text-stone-600 dark:text-stone-400 text-sm italic">"{t("forAdoptersWorthQuote")}"</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-stone-800 dark:text-stone-100 mb-2">📞 {t("forAdoptersProcessTitle")}</p>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
              <li>• {t("forAdoptersProcess1")}</li>
              <li>• {t("forAdoptersProcess2")}</li>
              <li>• {t("forAdoptersProcess3")}</li>
              <li>• {t("forAdoptersProcess4")}</li>
            </ul>
          </div>
          <Link
            href="/adopt-inquiry"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("forAdoptersCta")} →
          </Link>
        </section>

        {/* Impact Donatie */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
            {t("impactTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">{t("impactIntro")}</p>
          <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm font-medium">{t("impactStats")}</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
              <p className="font-bold text-stone-800 dark:text-stone-100">💙 €10 = {t("impact10")}</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
              <p className="font-bold text-stone-800 dark:text-stone-100">💙 €25 = {t("impact25")}</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
              <p className="font-bold text-stone-800 dark:text-stone-100">💙 €50 = {t("impact50")}</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
              <p className="font-bold text-stone-800 dark:text-stone-100">💙 €100 = {t("impact100")}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600 mb-6">
            <p className="font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("impactSpecificTitle")}</p>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
              <li>• €10 = {t("impactVacc")}</li>
              <li>• €29 = {t("impactSteril")}</li>
              <li>• €100 = {t("impactWheelchair")}</li>
            </ul>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-sm italic mb-6">{t("impactFooter")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("donateCtaButton")}
            </Link>
            <Link
              href="/adopt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("adoptCtaButton")}
            </Link>
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
