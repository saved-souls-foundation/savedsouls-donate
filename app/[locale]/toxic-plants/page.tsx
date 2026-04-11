"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

/** Hero-afbeelding: plaats je afbeelding in public/toxic-plants-hero.webp */
const HERO_IMAGE = "/toxic-plants-hero.webp";
/** Tweede afbeelding (overzicht/infographic): plaats in public/toxic-plants-overview.webp */
const OVERVIEW_IMAGE = "/toxic-plants-overview.webp";

export default function ToxicPlantsPage() {
  const t = useTranslations("toxicPlants");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Hero afbeelding - voeg toxic-plants-hero.webp toe aan public/ */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 min-h-[16rem] md:min-h-[28rem]">
          <Image
            src={HERO_IMAGE}
            alt={t("heroAlt")}
            width={1200}
            height={675}
            className="w-full h-64 md:h-[28rem] object-cover"
            priority
          />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 mb-6 text-sm font-semibold text-red-700 dark:text-red-300">
            🌿 ⚠️ {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Intro */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        {/* Zeer giftig - katten */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            🚨 {t("veryToxicCatsTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">{t("veryToxicCatsIntro")}</p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• <strong>{t("lily")}</strong> – {t("lilyText")}</li>
            <li>• <strong>{t("autumnCrocus")}</strong> – {t("autumnCrocusText")}</li>
            <li>• <strong>{t("azalea")}</strong> – {t("azaleaText")}</li>
          </ul>
        </section>

        {/* Zeer giftig - honden en katten */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
            ☠️ {t("veryToxicBothTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">{t("veryToxicBothIntro")}</p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• <strong>{t("oleander")}</strong> – {t("oleanderText")}</li>
            <li>• <strong>{t("foxglove")}</strong> – {t("foxgloveText")}</li>
            <li>• <strong>{t("yew")}</strong> – {t("yewText")}</li>
            <li>• <strong>{t("rhododendron")}</strong> – {t("rhododendronText")}</li>
            <li>• <strong>{t("sagoPalm")}</strong> – {t("sagoPalmText")}</li>
          </ul>
        </section>

        {/* Giftige kamerplanten */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🪴 {t("houseplantsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("houseplantsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• <strong>{t("dieffenbachia")}</strong> – {t("dieffenbachiaText")}</li>
            <li>• <strong>{t("philodendron")}</strong> – {t("philodendronText")}</li>
            <li>• <strong>{t("pothos")}</strong> – {t("pothosText")}</li>
            <li>• <strong>{t("monstera")}</strong> – {t("monsteraText")}</li>
            <li>• <strong>{t("poinsettia")}</strong> – {t("poinsettiaText")}</li>
            <li>• <strong>{t("aloe")}</strong> – {t("aloeText")}</li>
          </ul>
          <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800">
            <Image
              src={OVERVIEW_IMAGE}
              alt={t("overviewAlt")}
              width={800}
              height={500}
              className="w-full h-auto object-cover min-h-[12rem]"
            />
          </div>
        </section>

        {/* Symptomen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-stone-100 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-600 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🩺 {t("symptomsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">{t("symptomsIntro")}</p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("symptom1")}</li>
            <li>• {t("symptom2")}</li>
            <li>• {t("symptom3")}</li>
            <li>• {t("symptom4")}</li>
            <li>• {t("symptom5")}</li>
          </ul>
        </section>

        {/* Wat te doen */}
        <div className="mb-16 p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800">
          <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">🚨 {t("whatToDoTitle")}</h3>
          <p className="text-red-800 dark:text-red-200 mb-2">{t("whatToDo")}</p>
          <p className="text-red-800 dark:text-red-200 text-sm">{t("whatToDoNote")}</p>
        </div>

        {/* Veilige planten */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
            ✅ {t("safePlantsTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">{t("safePlantsIntro")}</p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• {t("safe1")}</li>
            <li>• {t("safe2")}</li>
            <li>• {t("safe3")}</li>
            <li>• {t("safe4")}</li>
            <li>• {t("safe5")}</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <div className="mb-16 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-center font-medium">
            🩺 {t("vetDisclaimer")}
          </p>
        </div>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dangers"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("ctaDangers")}
          </Link>
          <TrackedDonateLink
            href="/donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {tCommon("donate")}
          </TrackedDonateLink>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
