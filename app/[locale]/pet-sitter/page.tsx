"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";
const HERO_IMAGE = "/blog/pet-sitter-hero.webp";

export default function PetSitterPage() {
  const t = useTranslations("petSitter");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800">
          <Image
            src={HERO_IMAGE}
            alt={t("heroAlt")}
            width={1200}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 mb-6 text-sm font-semibold text-teal-700 dark:text-teal-300">
            🐾 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>✅ {t("chooseTitle")}</h2>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li>• {t("choose1")}</li>
            <li>• {t("choose2")}</li>
            <li>• {t("choose3")}</li>
            <li>• {t("choose4")}</li>
            <li>• {t("choose5")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4">📋 {t("handoverTitle")}</h2>
          <p className="text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">{t("handoverIntro")}</p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• {t("handover1")}</li>
            <li>• {t("handover2")}</li>
            <li>• {t("handover3")}</li>
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/adopt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tCommon("adopt")}
            </Link>
            <TrackedDonateLink
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {tCommon("donate")}
            </TrackedDonateLink>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
