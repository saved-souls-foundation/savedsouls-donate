"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const WARM_ORANGE = "#f97316";
const SKY_BLUE = "#0ea5e9";

export default function LuchtbrugPage() {
  const t = useTranslations("luchtbrug");

  const steps = [
    { num: 1, key: "step1" },
    { num: 2, key: "step2" },
    { num: 3, key: "step3" },
    { num: 4, key: "step4" },
    { num: 5, key: "step5" },
    { num: 6, key: "step6" },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero met slogan */}
        <header className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/40 border-2 border-sky-300 dark:border-sky-600 mb-6 text-sm font-semibold text-sky-800 dark:text-sky-200">
            ✈️ {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-4" style={{ color: ACCENT_GREEN }}>
            {t("slogan")}
          </p>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Hond klaar voor reis — volledig zichtbaar */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-3xl mx-auto bg-stone-100 dark:bg-stone-800/50">
            <div className="relative w-full aspect-[1/1] md:aspect-[4/3]">
              <Image
                src="/luchtbrug-dog-ready.webp"
                alt={t("img1Alt")}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Landen: NL, DE, CH */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-sky-50 via-white to-emerald-50/50 dark:from-sky-950/30 dark:via-stone-900 dark:to-emerald-950/20 border-2 border-sky-200 dark:border-sky-700 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: SKY_BLUE }}>
            {t("countriesTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8 text-lg leading-relaxed">
            {t("countriesIntro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/80 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600 text-center">
              <span className="text-4xl mb-2 block">🇪🇺</span>
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">{t("regionEurope")}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">{t("regionEuropeDesc")}</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600 text-center">
              <span className="text-4xl mb-2 block">🇺🇸</span>
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">{t("regionUSA")}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">{t("regionUSADesc")}</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600 text-center">
              <span className="text-4xl mb-2 block">🌍</span>
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">{t("regionMore")}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">{t("regionMoreDesc")}</p>
            </div>
          </div>
        </section>

        {/* Ze zijn klaar voor een thuis — placeholder midden */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-amber-50 via-white to-emerald-50/50 dark:from-amber-950/20 dark:via-stone-900 dark:to-emerald-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-xl">
          <p className="text-stone-600 dark:text-stone-400 mb-6 text-lg leading-relaxed">
            {t("readyBlock1")}
          </p>
          <p className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4 italic">
            {t("readyBlock2")}
          </p>
          <p className="text-stone-600 dark:text-stone-400 mb-2 text-lg leading-relaxed">
            {t("readyBlock3")}
          </p>
          <p className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
            {t("readyBlock4")}
          </p>
          <ul className="space-y-2 mb-6 text-stone-700 dark:text-stone-300">
            <li>✨ {t("readyBlockBullet1")}</li>
            <li>✨ {t("readyBlockBullet2")}</li>
            <li>✨ {t("readyBlockBullet3")}</li>
            <li>✨ {t("readyBlockBullet4")}</li>
          </ul>
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
            {t("readyBlockCta")}
          </p>
        </section>

        {/* Hond in vliegtuig & met koffer */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] min-h-[200px]">
              <Image
                src="/luchtbrug-dog-plane.webp"
                alt={t("img2Alt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] min-h-[200px]">
              <Image
                src="/luchtbrug-dog-suitcase.webp"
                alt={t("img3Alt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Adoptieproces - uitvoerig */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
            {t("processTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-10 text-lg">
            {t("processIntro")}
          </p>
          <div className="space-y-8">
            {steps.map(({ num, key }) => (
              <div
                key={key}
                className="relative pl-4 md:pl-6 border-l-4 rounded-r-xl py-4 pr-6 bg-white/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-600"
                style={{ borderLeftColor: ACCENT_GREEN }}
              >
                <span className="absolute -left-4 md:-left-5 top-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: ACCENT_GREEN }}>
                  {num}
                </span>
                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-2 mt-1">
                  {t(`${key}Title`)}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t(`${key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hond arriveert in nieuw thuis */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9] max-h-[240px] w-full max-w-3xl mx-auto">
            <Image
              src="/luchtbrug-dog-arrival.webp"
              alt={t("img4Alt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </section>

        {/* Kosten & praktisch */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-lg">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: WARM_ORANGE }}>
            {t("costsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("costsText")}
          </p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              {t("costsItem1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              {t("costsItem2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              {t("costsItem3")}
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10 md:p-14 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50/50 dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-amber-950/20 border-2 border-emerald-200 dark:border-emerald-700 shadow-xl">
          <p className="text-2xl md:text-3xl font-black text-stone-800 dark:text-stone-100 mb-4">
            {t("ctaSlogan")}
          </p>
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/adopt"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("ctaButton")} →
            </Link>
            <Link
              href="/adopt-inquiry"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("ctaInquiry")}
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </ParallaxPage>
  );
}
