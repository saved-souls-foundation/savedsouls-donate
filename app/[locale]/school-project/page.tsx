import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

export const dynamic = "force-dynamic";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

export default async function SchoolProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schoolProject");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-stone-700 dark:text-stone-300 mb-6" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </p>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            {t("intro")}
          </p>
        </header>

        <section className="space-y-8">
          {/* Waarom dit project */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("whyTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("why1")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {t("why2")}
            </p>
          </div>

          {/* Verantwoordelijkheid & liefde */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("responsibilityTitle")}
            </h2>
            <ul className="space-y-3 text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility3")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility4")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility5")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                {t("responsibility6")}
              </li>
            </ul>
          </div>

          {/* Cursusmateriaal */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("materialsTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("materialsIntro")}
            </p>
            <Link
              href="/school-project/materials"
              className="block p-6 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600 hover:border-[#2aa348]/50 transition-colors"
            >
              <p className="text-stone-600 dark:text-stone-400 font-medium">
                {t("materialsComingSoon")}
              </p>
              <p className="text-stone-500 dark:text-stone-500 text-sm mt-2">
                {t("materialsContact")}
              </p>
              <span className="inline-block mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                {t("materialsView")} →
              </span>
            </Link>
          </div>

          {/* Geld inzamelen */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("fundraisingTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("fundraisingIntro")}
            </p>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                {t("fundraising1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                {t("fundraising2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                {t("fundraising3")}
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3">
              {t("transferTitle")}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("transferIntro")}
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="font-semibold text-stone-800 dark:text-stone-200">Kasikorn Bank</p>
                <p className="font-mono text-stone-700 dark:text-stone-300">033-8-13623-4</p>
                <p className="text-sm text-stone-600 dark:text-stone-400">Saved Souls Foundation</p>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t("transferNote")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-6 md:p-8 text-center bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("ctaTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {t("ctaText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {t("ctaContact")}
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("ctaDonate")}
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/get-involved"
            className="px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            ← {tCommon("getInvolved")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
