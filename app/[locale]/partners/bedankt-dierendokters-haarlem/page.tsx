import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

const ACCENT = "#0054a6";
const CLINIC_URL = "https://www.dierendokters.com/dierenarts-dierenkliniek/haarlem";
const PHONE = "0238700303";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bedanktDierenDoktersHaarlem" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BedanktDierenDoktersHaarlemPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bedanktDierenDoktersHaarlem");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" speed={0.2}>
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">❤️</span>
            <span className="text-4xl">🤝</span>
            <span className="text-4xl">🐾</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-3">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: ACCENT }}>
            {t("subtitle")}
          </p>
          <p className="text-stone-600 dark:text-stone-400">{t("location")}</p>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-200/50 dark:border-blue-900/30 mb-6">
          <img
            src="/partners/dierendokters-haarlem/team.png"
            alt={t("teamAlt")}
            className="w-full h-auto max-h-[480px] object-cover object-center"
          />
        </div>

        <div className="max-w-md mx-auto mb-12 rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 dark:border-stone-700">
          <img
            src="/partners/dierendokters-haarlem/flyer.png"
            alt={t("flyerAlt")}
            className="w-full h-auto object-cover object-center"
          />
          <p className="text-center text-sm text-stone-600 dark:text-stone-400 py-3 px-4 bg-white dark:bg-stone-900">
            {t("flyerCaption")}
          </p>
        </div>

        <div className="space-y-8 text-stone-700 dark:text-stone-300 leading-relaxed">
          <p className="text-lg">{t("intro")}</p>

          <section className="rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-blue-200/50 dark:border-blue-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: ACCENT }}>
              {t("partnershipTitle")}
            </h2>
            <p>{t("partnershipText")}</p>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-2 border-blue-200/50 dark:border-blue-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: ACCENT }}>
              {t("flyerTitle")}
            </h2>
            <p>{t("flyerText")}</p>
          </section>

          <p className="text-center text-stone-600 dark:text-stone-400">{t("freeNote")}</p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={CLINIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: ACCENT }}
            >
              {t("visitClinic")} →
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-blue-300 dark:border-blue-700 text-stone-800 dark:text-stone-100 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              {t("callClinic")}
            </a>
            <Link
              href="/partners/flyer-aanvragen"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-blue-300 dark:border-blue-700 text-stone-800 dark:text-stone-100 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              {t("requestFlyer")}
            </Link>
          </div>

          <p className="text-center pt-4">
            <Link href="/partners" className="underline hover:no-underline text-stone-600 dark:text-stone-400">
              ← {t("backToPartners")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
