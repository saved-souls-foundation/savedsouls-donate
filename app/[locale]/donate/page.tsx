import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("subtitle"),
  };
}

export default async function DonatePage() {
  const t = await getTranslations("donate");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
            <video
              src="/savedsouls-fondation-logo.mp4"
              width={70}
              height={70}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block flex-shrink-0">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden flex-shrink-0">
            <LanguageSwitcher compact />
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("navBack")}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </p>
        </header>

        <section className="space-y-12">
          {/* Monthly Dog Food */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("dogFood.title")}
            </h2>
            <p className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-6">
              {t("dogFood.sponsorTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("dogFood.intro1")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("dogFood.intro2")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("dogFood.intro3")}
            </p>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600 mb-6">
              <p className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                {t("dogFood.totalCost")}
              </p>
              <p className="text-base text-stone-500 dark:text-stone-400 mb-4">{t("dogFood.costBreakdown")}</p>
              <ul className="space-y-2 text-base text-stone-600 dark:text-stone-400">
                <li>{t("dogFood.cost1")}</li>
                <li>{t("dogFood.cost2")}</li>
                <li>{t("dogFood.cost3")}</li>
                <li className="pt-2 font-medium">{t("dogFood.cost4")}</li>
                <li className="font-medium">{t("dogFood.cost5")}</li>
              </ul>
            </div>

            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("dogFood.cta")}
            </a>
          </div>

          {/* Monthly Cat Food */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("catFood.title")}
            </h2>
            <p className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-6">
              {t("catFood.sponsorTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("catFood.intro1")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("catFood.intro2")}
            </p>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600 mb-6">
              <p className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
                {t("catFood.totalCost")}
              </p>
              <p className="text-base text-stone-500 dark:text-stone-400 mb-4">{t("catFood.costBreakdown")}</p>
              <ul className="space-y-2 text-base text-stone-600 dark:text-stone-400">
                <li>{t("catFood.cost1")}</li>
                <li>{t("catFood.cost2")}</li>
                <li className="pt-2 font-medium">{t("catFood.cost3")}</li>
                <li className="font-medium">{t("catFood.cost4")}</li>
                <li className="font-medium">{t("catFood.cost5")}</li>
              </ul>
            </div>

            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("catFood.cta")}
            </a>
          </div>

          {/* Monthly Medical Donation */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("medical.title")}
            </h2>
            <p className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-6">
              {t("medical.sponsorTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t.rich("medical.intro1", { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("medical.intro2")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("medical.intro3")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("medical.intro4")}
            </p>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600 mb-6">
              <p className="text-xl font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
                {t("medical.totalCost")}
              </p>
            </div>

            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("medical.cta")}
            </a>
          </div>

          {/* Monthly Repair & Maintenance Donation */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("maintenance.title")}
            </h2>
            <p className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-6">
              {t("maintenance.sponsorTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("maintenance.intro1")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              {t("maintenance.intro2")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("maintenance.intro3")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("maintenance.intro4")}
            </p>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600 mb-6">
              <p className="text-xl font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
                {t("maintenance.totalCost")}
              </p>
            </div>

            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("maintenance.cta")}
            </a>
          </div>

          {/* Monthly Staff Salary */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("staff.title")}
            </h2>
            <p className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-6">
              {t("staff.sponsorTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              {t("staff.intro")}
            </p>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600 mb-6">
              <p className="text-xl font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
                {t("staff.totalCost")}
              </p>
            </div>

            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("staff.cta")}
            </a>
          </div>

          <p className="text-center text-stone-500 dark:text-stone-400 text-base">
            {t("comingSoon")}
          </p>
        </section>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("btnBack")}
          </Link>
          <Link
            href="/#donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {t("btnDonateHomepage")}
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
