import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const SOFT_CORAL = "#f97316";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kids" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
  };
}

export default async function KidsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kids");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-2xl overflow-hidden border-4 shadow-lg" style={{ borderColor: ACCENT_GREEN }}>
            <img src="/donatie-thanks.webp" alt={t("heroImageAlt")} className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2aa348]/15 dark:bg-[#2aa348]/25 mb-6">
            <span className="text-2xl">🐕</span>
            <span className="text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
              {t("badge")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* Ouders: vraag om hulp */}
        <section className="rounded-2xl p-6 md:p-8 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800/50 mb-10">
          <p className="text-center text-stone-700 dark:text-stone-300 font-medium">
            👋 {t("parentNote")}
          </p>
        </section>

        {/* Waarom dieren hulp nodig hebben */}
        <section className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
            <span>💚</span> {t("whyTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {t("why1")}
          </p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            {t("why2")}
          </p>
        </section>

        {/* Jij kunt helpen! */}
        <section className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
            <span>🌟</span> {t("helpTitle")}
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
              <span className="text-2xl">🐷</span>
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200">{t("help1Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t("help1Text")}</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
              <span className="text-2xl">🎂</span>
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200">{t("help2Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t("help2Text")}</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
              <span className="text-2xl">✏️</span>
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200">{t("help3Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t("help3Text")}</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50">
              <span className="text-2xl">🏫</span>
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200">{t("help4Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t("help4Text")}</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Wat wij doen */}
        <section className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
            <span>🏠</span> {t("whatWeDoTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {t("whatWeDo1")}
          </p>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            {t("whatWeDo2")}
          </p>
        </section>

        {/* CTA buttons */}
        <section className="rounded-2xl p-6 md:p-8 text-center bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 mb-10">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("ctaTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {t("ctaText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white text-lg transition-opacity hover:opacity-95"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("ctaDonate")}
            </Link>
            <Link
              href="/school-project"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-opacity hover:opacity-95"
              style={{ borderColor: SOFT_CORAL, color: SOFT_CORAL }}
            >
              {t("ctaSchoolProject")}
            </Link>
          </div>
        </section>

        <div className="flex justify-center">
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
