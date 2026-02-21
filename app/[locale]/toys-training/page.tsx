"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";
const ACCENT_AMBER = "#d97706";
const ACCENT_INDIGO = "#4f46e5";

const SECTIONS = [
  { key: "toys", color: ACCENT_TEAL, icon: "🧸", img: "/woman-hug-dog.webp" },
  { key: "obedience", color: ACCENT_INDIGO, icon: "🎯", img: "/dog-care.webp" },
  { key: "puppy", color: ACCENT_AMBER, icon: "🐕", img: "/hero-hug.png" },
  { key: "kitten", color: ACCENT_AMBER, icon: "🐈", img: "/cat-feed.png" },
  { key: "housebreaking", color: ACCENT_GREEN, icon: "🏠", img: "/dog-tan-sand.webp" },
] as const;

export default function ToysTrainingPage() {
  const t = useTranslations("toysTraining");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <header className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 mb-6 text-sm font-semibold" style={{ color: ACCENT_TEAL }}>
            🧸 {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_TEAL }}>
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Intro met afbeelding */}
        <section className="mb-20 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 order-2 md:order-1">
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              {t("intro")}
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-96 order-1 md:order-2 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl [&_img]:rounded-2xl">
            <Image
              src="/dog-toys-training.png"
              alt={t("imgIntroAlt")}
              width={500}
              height={375}
              className="w-full aspect-[4/3] min-h-[260px] object-contain object-top"
            />
          </div>
        </section>

        {/* Sectie cards - dynamisch */}
        {SECTIONS.map((section, index) => (
          <section
            key={section.key}
            className={`mb-16 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow-xl transition-all duration-300 hover:shadow-2xl ${
              index % 2 === 0 ? "bg-white dark:bg-stone-900" : "bg-stone-50 dark:bg-stone-900/80"
            }`}
          >
            <div className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}>
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white mb-4 w-fit"
                  style={{ backgroundColor: section.color }}
                >
                  {section.icon} {t(`${section.key}Title`)}
                </div>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                  {t(`${section.key}Heading`)}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  {t(`${section.key}Intro`)}
                </p>
                <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                  <li className="flex items-start gap-2">
                    <span style={{ color: section.color }}>•</span>
                    {t(`${section.key}Tip1`)}
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: section.color }}>•</span>
                    {t(`${section.key}Tip2`)}
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: section.color }}>•</span>
                    {t(`${section.key}Tip3`)}
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                <div className="relative w-full min-h-[280px] md:min-h-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl [&_img]:rounded-2xl">
                  <Image
                    src={section.img}
                    alt={t(`${section.key}ImgAlt`)}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Extra tips blok */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-2 border-teal-200 dark:border-teal-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: ACCENT_TEAL }}>
            💡 {t("extraTipsTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-teal-100 dark:border-teal-800">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("patienceTitle")}</h3>
              <p className="text-base text-stone-600 dark:text-stone-400">{t("patienceText")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-teal-100 dark:border-teal-800">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("consistencyTitle")}</h3>
              <p className="text-base text-stone-600 dark:text-stone-400">{t("consistencyText")}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/behavior"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT_TEAL }}
          >
            {t("ctaBehavior")}
          </Link>
          <Link
            href="/get-involved"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {tCommon("getInvolved")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
