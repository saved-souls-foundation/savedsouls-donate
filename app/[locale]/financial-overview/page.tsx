"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";

export default function FinancialOverviewPage() {
  const t = useTranslations("financialOverview");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <header className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-300 dark:border-emerald-600 mb-6 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            📊 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </header>

        {/* Grote cijfers – 500.000 baht */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/30 border-2 border-emerald-200 dark:border-emerald-600 shadow-xl">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("monthlyNeedTitle")}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-4xl md:text-5xl font-black" style={{ color: ACCENT_GREEN }}>฿500.000</p>
              <p className="text-lg text-stone-600 dark:text-stone-400 mt-1">{t("perMonth")}</p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-stone-600 dark:text-stone-400">{t("approxEuro")}</p>
            </div>
          </div>
          <p className="mt-6 text-stone-600 dark:text-stone-400 leading-relaxed">
            {t("gapText")}
          </p>
        </section>

        {/* Waar gaat het naartoe */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: ACCENT_GREEN }}>
            {t("breakdownTitle")}
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-100">🍖 {t("cost1Title")}</p>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("cost1Detail")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-100">🏥 {t("cost2Title")}</p>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("cost2Detail")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-100">👷 {t("cost3Title")}</p>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("cost3Detail")}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-100">🔧 {t("cost4Title")}</p>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t("cost4Detail")}</p>
            </div>
          </div>
        </section>

        {/* Sponsorcijfers */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-700">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("sponsorStatsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {t("sponsorStatsText")}
          </p>
          <p className="text-stone-700 dark:text-stone-300 font-medium">
            {t("sponsorStatsConclusion")}
          </p>
        </section>

        {/* Doel: onafhankelijk */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("goalTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
            {t("goalText")}
          </p>
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-xl">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-xl mx-auto">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DonateButton size="lg" className="hover:scale-105 hover:shadow-lg">
              {tCommon("donate")}
            </DonateButton>
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tCommon("sponsor")}
            </Link>
            <TrackedDonateLink
              href="/donate/causes"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            >
              {tCommon("donateCauses")}
            </TrackedDonateLink>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
