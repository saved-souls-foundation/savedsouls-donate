"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const BARF_WIKI_URL = "https://en.wikipedia.org/wiki/Raw_feeding";

export default function NutritionPage() {
  const t = useTranslations("nutrition");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const wikiLang = ["nl", "en", "de", "es", "th", "ru"].includes(locale) ? locale : "en";
  const barfGoUrl = `/go?url=${encodeURIComponent(BARF_WIKI_URL)}&return=${encodeURIComponent("/nutrition")}`;
  const barfRawRich = {
    barf: (chunks: React.ReactNode) => (
      <Link href={barfGoUrl} className="underline hover:no-underline font-semibold" style={{ color: ACCENT_GREEN }}>{chunks}</Link>
    ),
    raw: (chunks: React.ReactNode) => (
      <Link href={barfGoUrl} className="underline hover:no-underline font-semibold" style={{ color: ACCENT_GREEN }}>{chunks}</Link>
    ),
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <header className="text-center mb-16">
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
            <p className="mt-4 text-stone-600 dark:text-stone-400">
              🏠 {t("firstPetHomePrompt")}<Link href="/first-pet-home" className="font-semibold underline hover:no-underline" style={{ color: ACCENT_GREEN }}>{t("firstPetHomeLink")}</Link>
              {" · "}
              <Link href="/health" className="font-semibold underline hover:no-underline" style={{ color: ACCENT_GREEN }}>{t("healthLink")}</Link>
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-80 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 animate-banner-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/shelter-food.webp" alt={t("imgFoodAlt")} width={400} height={300} className="w-full h-64 object-cover" />
          </div>
        </section>

        {/* Rauw vs Gekookt */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("rawVsCookedTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">🥩 {t("rawTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t("rawPros")}</p>
              <p className="text-amber-700 dark:text-amber-400 text-base mt-2 font-medium">{t("rawCons")}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">🍲 {t("cookedTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t("cookedPros")}</p>
              <p className="text-stone-500 dark:text-stone-500 text-base mt-2">{t("cookedNote")}</p>
            </div>
          </div>
          <p className="text-stone-600 dark:text-stone-400 italic">{t("rawVsCookedConclusion")}</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <Image src="/dog-care.webp" alt={t("imgCareAlt")} width={400} height={280} className="w-full h-48 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <Image src="/shelter-food.webp" alt={t("imgFoodAlt")} width={400} height={280} className="w-full h-48 object-cover" />
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
              ⚠️ {t.rich("bacteriaWarning", {
                salmonella: (chunks) => (
                  <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Salmonella`)}&return=${encodeURIComponent("/nutrition")}`} className="underline hover:no-underline font-semibold">{chunks}</Link>
                ),
                listeria: (chunks) => (
                  <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Listeria`)}&return=${encodeURIComponent("/nutrition")}`} className="underline hover:no-underline font-semibold">{chunks}</Link>
                ),
                ecoli: (chunks) => (
                  <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Escherichia_coli`)}&return=${encodeURIComponent("/nutrition")}`} className="underline hover:no-underline font-semibold">{chunks}</Link>
                ),
              })}
            </p>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-sm mt-2">
              <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org`)}&return=${encodeURIComponent("/nutrition")}`} className="underline hover:no-underline">
                {t("bacteriaWarningSource")}
              </Link>
            </p>
            <div className="mt-4 flex gap-4 justify-center overflow-x-auto pb-2 snap-x snap-mandatory md:flex-wrap md:overflow-visible">
              <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Salmonella`)}&return=${encodeURIComponent("/nutrition")}`} className="flex flex-col items-center group shrink-0 snap-center">
                <Image
                  src="/bacteria-salmonella.png"
                  alt={t("bacteriaImgSalmonella")}
                  width={140}
                  height={120}
                  className="rounded-lg object-cover w-28 h-24 md:w-24 md:h-20"
                />
                <span className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">Salmonella</span>
              </Link>
              <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Listeria`)}&return=${encodeURIComponent("/nutrition")}`} className="flex flex-col items-center group shrink-0 snap-center">
                <Image
                  src="/bacteria-listeria.png"
                  alt={t("bacteriaImgListeria")}
                  width={140}
                  height={120}
                  className="rounded-lg object-cover w-28 h-24 md:w-24 md:h-20"
                />
                <span className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">Listeria</span>
              </Link>
              <Link href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/Escherichia_coli`)}&return=${encodeURIComponent("/nutrition")}`} className="flex flex-col items-center group shrink-0 snap-center">
                <Image
                  src="/bacteria-ecoli.png"
                  alt={t("bacteriaImgEcoli")}
                  width={140}
                  height={120}
                  className="rounded-lg object-cover w-28 h-24 md:w-24 md:h-20"
                />
                <span className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">E. coli</span>
              </Link>
            </div>
          </div>
        </section>

        {/* BARF & Raw feeding */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t.rich("barfRawTitle", barfRawRich)}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t.rich("barfRawIntro", barfRawRich)}
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t.rich("barfRawWhat", barfRawRich)}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t.rich("barfRawWhatText", barfRawRich)}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("barfRawKvv")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t.rich("barfRawKvvText", barfRawRich)}</p>
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">{t.rich("barfRawTips", barfRawRich)}</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-base">
                <li className="flex gap-2">• {t("barfRawTip1")}</li>
                <li className="flex gap-2">• {t("barfRawTip2")}</li>
                <li className="flex gap-2">• {t("barfRawTip3")}</li>
                <li className="flex gap-2">• {t("barfRawTip4")}</li>
                <li className="flex gap-2">• {t("barfRawTip5")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BARF Complete Guide – Waarom kiezen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🌟 {t("barfGuideWhyTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("barfGuideWhyIntro")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">✨ {t(`barfGuideWhy${i}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BARF vs PMR vs Whole Prey */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("barfGuideCompareTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600">
              <div className="text-2xl mb-2">🥩</div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("barfGuideBarf")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t("barfGuideBarfText")}</p>
            </div>
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600">
              <div className="text-2xl mb-2">🦌</div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("barfGuidePmr")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t("barfGuidePmrText")}</p>
            </div>
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600">
              <div className="text-2xl mb-2">🐀</div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("barfGuideWholePrey")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">{t("barfGuideWholePreyText")}</p>
            </div>
          </div>
        </section>

        {/* BARF samenstelling – hond & kat */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            📋 {t("barfGuideCompositionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">🐕 {t("barfGuideDogTitle")}</h3>
              <ul className="space-y-2 text-base text-stone-600 dark:text-stone-400">
                {["barfGuideDog1", "barfGuideDog2", "barfGuideDog3", "barfGuideDog4", "barfGuideDog5", "barfGuideDog6", "barfGuideDog7"].map((key) => (
                  <li key={key}>• {t(key)}</li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">🐈 {t("barfGuideCatTitle")}</h3>
              <ul className="space-y-2 text-base text-stone-600 dark:text-stone-400">
                {["barfGuideCat1", "barfGuideCat2", "barfGuideCat3", "barfGuideCat4", "barfGuideCat5"].map((key) => (
                  <li key={key}>• {t(key)}</li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-amber-100/80 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                <p className="text-amber-900 dark:text-amber-100 text-sm font-bold">⚠️ {t("barfGuideTaurine")}</p>
                <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">{t("barfGuideTaurineText")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Voordelen BARF */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            ✨ {t("barfGuideBenefitsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600 flex items-start gap-2">
                <span className="text-xl shrink-0">✓</span>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`barfGuideBenefit${i}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Aandachtspunten & nadelen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            ⚖️ {t("barfGuideConsiderTitle")}
          </h2>
          <div className="space-y-4">
            {[
              { key: "barfGuideConsider1", emoji: "🧼" },
              { key: "barfGuideConsider2", emoji: "📊" },
              { key: "barfGuideConsider3", emoji: "⏱️" },
              { key: "barfGuideConsider4", emoji: "💰" },
            ].map(({ key, emoji }) => (
              <div key={key} className="flex gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <span className="text-xl shrink-0">{emoji}</span>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t(key)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-stone-500 dark:text-stone-500 text-sm italic">{t("barfGuideConsiderTip")}</p>
        </section>

        {/* Stappenplan starten */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🚀 {t("barfGuideStartTitle")}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: ACCENT_GREEN }}>{i}</span>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t(`barfGuideStep${i}Title`)}</p>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t(`barfGuideStep${i}Text`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-2">{t("barfGuideTransitionTitle")}</p>
            <p className="text-stone-600 dark:text-stone-400 text-sm">{t("barfGuideTransitionText")}</p>
          </div>
        </section>

        {/* Praktische tips */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            📐 {t("barfGuidePracticalTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">{t("barfGuideAmountsTitle")}</h3>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {["barfGuideAmount1", "barfGuideAmount2", "barfGuideAmount3", "barfGuideAmount4", "barfGuideAmount5"].map((key) => (
                  <li key={key}>• {t(key)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">{t("barfGuideEquipmentTitle")}</h3>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {["barfGuideEquip1", "barfGuideEquip2", "barfGuideEquip3", "barfGuideEquip4"].map((key) => (
                  <li key={key}>• {t(key)}</li>
                ))}
              </ul>
              <p className="mt-4 text-stone-600 dark:text-stone-400 text-sm italic">💩 {t("barfGuideStoolTip")}</p>
            </div>
          </div>
        </section>

        {/* Mythes ontkracht */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🎭 {t("barfGuideMythsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="text-stone-500 dark:text-stone-500 text-sm line-through mb-1">{t(`barfGuideMyth${i}`)}</p>
                <p className="text-stone-700 dark:text-stone-300 text-sm font-medium">✓ {t(`barfGuideMyth${i}Truth`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Wanneer niet geschikt + levensfases + supplementen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            📌 {t("barfGuideExtraTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">{t("barfGuideNotSuitableTitle")}</h3>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i}>• {t(`barfGuideNotSuitable${i}`)}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800">
              <h3 className="font-bold text-sky-800 dark:text-sky-200 mb-2">{t("barfGuideLifeStagesTitle")}</h3>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i}>• {t(`barfGuideLifeStage${i}`)}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">{t("barfGuideSupplementsTitle")}</h3>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3].map((i) => (
                  <li key={i}>• {t(`barfGuideSupplement${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            ❓ {t("barfGuideFaqTitle")}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-600">
                <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t(`barfGuideFaqQ${i}`)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t(`barfGuideFaqA${i}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Voedingsstoffen – tabellen */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: ACCENT_GREEN }}>
            {t("nutrientsTitle")}
          </h2>

          <div className="space-y-8">
            {/* Eiwit */}
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: `${ACCENT_GREEN}20` }}>
                    💪
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t("proteinTitle")}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-2">{t("proteinDesc")}</p>
                </div>
                <div className="md:w-2/3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-600">
                          <th className="text-left py-3 px-4 font-bold text-stone-800 dark:text-stone-100">{t("proteinSource")}</th>
                          <th className="text-left py-3 px-4 font-bold text-stone-800 dark:text-stone-100">{t("proteinAmount")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-stone-600 dark:text-stone-400">
                        <tr className="border-b border-stone-100 dark:border-stone-800"><td className="py-2 px-4">{t("protein1")}</td><td className="py-2 px-4">~25g per 100g</td></tr>
                        <tr className="border-b border-stone-100 dark:border-stone-800"><td className="py-2 px-4">{t("protein2")}</td><td className="py-2 px-4">~18g per 100g</td></tr>
                        <tr className="border-b border-stone-100 dark:border-stone-800"><td className="py-2 px-4">{t("protein3")}</td><td className="py-2 px-4">~12g per 100g</td></tr>
                        <tr><td className="py-2 px-4">{t("protein4")}</td><td className="py-2 px-4">~8g per 100g</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Calcium & Fosfor */}
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: `${ACCENT_GREEN}20` }}>
                    🦴
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t("calciumTitle")}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-2">{t("calciumDesc")}</p>
                </div>
                <div className="md:w-2/3">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="font-bold text-amber-800 dark:text-amber-200 mb-2">{t("calciumRatio")}</p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{t("calciumRatioText")}</p>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-4">{t("bonesNote")}</p>
                </div>
              </div>
            </div>

            {/* Voedingsbehoefte */}
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("requirementsTitle")}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <p className="font-bold text-stone-800 dark:text-stone-200">🐕 {t("dogReq")}</p>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("dogReqText")}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <p className="font-bold text-stone-800 dark:text-stone-200">🐈 {t("catReq")}</p>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("catReqText")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brokken */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("kibbleTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("kibbleIntro")}
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("kibbleLookFor")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("kibbleProtein")}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">{t("kibbleWarning")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("kibbleWarningText")}</p>
            </div>
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("kibbleMarketing")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">{t("kibbleMarketingText")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">{t("kibbleAvoidTitle")}</h4>
                <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                    <li key={i}>• {t(`kibbleAvoid${i}`)}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-3">{t("kibbleGoodTitle")}</h4>
                <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <li key={i}>• {t(`kibbleGood${i}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Afbeelding break met animatie */}
        <div className="my-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-transform duration-500 hover:scale-[1.01] hover:shadow-2xl">
          <Image src="/dog-care.webp" alt={t("imgCareAlt")} width={800} height={500} className="w-full h-72 md:h-96 object-cover" />
        </div>

        {/* Recepten */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: ACCENT_GREEN }}>
            {t("recipesTitle")}
          </h2>
          <p className="text-center text-stone-600 dark:text-stone-400 mb-6 max-w-2xl mx-auto">
            {t("recipesIntro")}
          </p>

          <div className="mb-10 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium text-center">
              🩺 {t("vetDisclaimer")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:border-[#2aa348]/50 dark:hover:border-[#2aa348]/50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl shrink-0">{["🥜", "🎃", "🍗", "🫐", "🍎", "🥕", "🍦", "🍦", "🍉", "🥛"][i - 1]}</span>
                  <div>
                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">{t(`recipe${i}Title`)}</h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`recipe${i}Desc`)}</p>
                  </div>
                </div>
                <div className="text-base text-stone-600 dark:text-stone-400 space-y-1">
                  <p className="font-medium text-stone-700 dark:text-stone-300">{t("ingredients")}:</p>
                  <p>{t(`recipe${i}Ingredients`)}</p>
                  <p className="font-medium text-stone-700 dark:text-stone-300 mt-2">{t("instructions")}:</p>
                  <p>{t(`recipe${i}Instructions`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                href="/feed-a-year"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("feedAYear")}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer link */}
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
