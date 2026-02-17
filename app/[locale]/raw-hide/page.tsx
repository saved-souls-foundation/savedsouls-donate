"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const EMBRACE_URL = "https://www.embracepetinsurance.com/waterbowl/article/dangers-of-rawhide";
const AKC_URL = "https://akc.org/expert-advice/health/are-rawhide-chews-dangerous-for-dog";
const FDA_RECALL_URL = "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts";
const PLATSNUIT_URL = "https://www.adopteereenplatsnuit.be/blog/gezondheid/het-gevaar-van-rawhides-of-buffelhuid-hondensnacks/";

export default function RawHidePage() {
  const t = useTranslations("rawHide");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const wikiLang = ["nl", "en", "de", "th", "ru"].includes(locale) ? locale : "en";
  const goEmbrace = `/go?url=${encodeURIComponent(EMBRACE_URL)}&return=${encodeURIComponent("/raw-hide")}`;
  const goAkc = `/go?url=${encodeURIComponent(AKC_URL)}&return=${encodeURIComponent("/raw-hide")}`;
  const goFda = `/go?url=${encodeURIComponent(FDA_RECALL_URL)}&return=${encodeURIComponent("/raw-hide")}`;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 mb-6 text-sm font-semibold text-red-700 dark:text-red-300">
            ⚠️ {t("warningBadge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Main warning */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            🚫 {t("dontGiveTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
            {t("dontGiveIntro")}
          </p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              {t("dontGive1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              {t("dontGive2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              {t("dontGive3")}
            </li>
          </ul>
        </section>

        {/* What is rawhide + infographic */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("whatIsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
            {t("whatIsIntro")}
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-600 mb-4">
            <Image
              src="/rawhide-deadliest-chew-toy.png"
              alt={t("infographicAlt")}
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 italic mb-2">
            © Pet Nutrition Blogger Rodney Habib
          </p>
          <a
            href={PLATSNUIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline"
            style={{ color: ACCENT_GREEN }}
          >
            {t("platsnuitLink")} ↗
          </a>

          {/* Production flowchart - with translated text */}
          <h3 className="text-lg font-bold mt-12 mb-4 text-stone-800 dark:text-stone-100">
            {t("flowchartTitle")}
          </h3>
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-600 mb-4">
            <Image
              src="/rawhide-flowchart.png"
              alt={t("flowchartTitle")}
              width={800}
              height={400}
              className="w-full h-auto object-contain bg-white dark:bg-stone-800"
            />
          </div>
          <div className="rounded-xl overflow-hidden p-6 bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600">
            <div className="flex flex-col gap-4">
              {/* Top row: left to right */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep1")}
                </div>
                <span className="text-stone-400">→</span>
                <div className="px-4 py-3 rounded-lg bg-stone-500 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep2")}
                </div>
                <span className="text-stone-400">→</span>
                <div className="px-4 py-3 rounded-lg bg-amber-500 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep3")}
                </div>
              </div>
              <div className="flex justify-center">
                <span className="text-stone-400">↓</span>
              </div>
              {/* Bottom row: right to left (visually) */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep6")}
                </div>
                <span className="text-stone-400">←</span>
                <div className="px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep5")}
                </div>
                <span className="text-stone-400">←</span>
                <div className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm text-center min-w-[140px]">
                  {t("flowchartStep4")}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic">
            {t("flowchartSource")}
          </p>
        </section>

        {/* Chemicals */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
            ☠️ {t("chemicalsTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
            {t("chemicalsIntro")}
          </p>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300 mb-6">
            <li>• {t("chemical1")}</li>
            <li>• {t("chemical2")}</li>
            <li>• {t("chemical3")}</li>
            <li>• {t("chemical4")}</li>
            <li>• {t("chemical5")}</li>
          </ul>
          <p className="text-sm text-stone-600 dark:text-stone-400 italic">
            {t("chemicalsNote")}
          </p>
        </section>

        {/* Choking & blockages */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("chokingTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {t("chokingIntro")}
          </p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            {t("chokingBlockage")}
          </p>
        </section>

        {/* Alternatives */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
            ✅ {t("alternativesTitle")}
          </h2>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300">
            <li>• {t("alt1")}</li>
            <li>• {t("alt2")}</li>
            <li>• {t("alt3")}</li>
            <li>• {t("alt4")}</li>
            <li>• {t("alt5")}</li>
          </ul>
        </section>

        {/* Sources */}
        <section className="mb-12 rounded-xl p-6 bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
          <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">{t("sourcesTitle")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={PLATSNUIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: ACCENT_GREEN }}
              >
                Adopteer een platsnuit – Het gevaar van rawhides of buffelhuid hondensnacks ↗
              </a>
            </li>
            <li>
              <Link href={goEmbrace} className="underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
                Embrace Pet Insurance – Dangers of Rawhide
              </Link>
            </li>
            <li>
              <Link href={goAkc} className="underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
                AKC – Are Rawhide Chews Dangerous for Dogs?
              </Link>
            </li>
            <li>
              <Link href={goFda} className="underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
                FDA – Pet Food Recalls (Salmonella in rawhide)
              </Link>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/nutrition"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("ctaNutrition")}
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
