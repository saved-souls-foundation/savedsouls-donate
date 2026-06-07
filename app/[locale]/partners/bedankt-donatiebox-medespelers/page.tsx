import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

const PINK = "#ec4899";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bedanktDonatieboxMedespelers" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BedanktDonatieboxMedespelersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bedanktDonatieboxMedespelers");

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
          <p className="text-xl md:text-2xl font-semibold" style={{ color: PINK }}>
            {t("subtitle")}
          </p>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/50 dark:border-rose-900/30 mb-6">
          <img
            src="/partners/layan-vet/hero.png"
            alt={t("heroAlt")}
            className="w-full h-auto max-h-[520px] object-cover object-center"
          />
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 dark:border-stone-700 mb-12">
          <img
            src="/partners/layan-vet/reception.png"
            alt={t("photoAlt1")}
            className="w-full aspect-[16/10] object-cover object-center"
          />
        </div>

        <div className="space-y-8 text-stone-700 dark:text-stone-300 leading-relaxed">
          <p className="text-lg">{t("intro")}</p>

          <section className="rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: PINK }}>
              {t("partnershipTitle")}
            </h2>
            <p>{t("partnershipText")}</p>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: PINK }}>
              {t("storyTitle")}
            </h2>
            <p className="mb-4">{t("storyText")}</p>
            <p className="font-semibold text-stone-800 dark:text-stone-100">{t("firstInPhuket")}</p>
          </section>

          <p className="text-center text-stone-600 dark:text-stone-400">{t("freeNote")}</p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={t("visitClinicUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: PINK }}
            >
              {t("visitClinic")} →
            </a>
            <Link
              href="/partners/flyer-aanvragen"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-rose-300 dark:border-rose-700 text-stone-800 dark:text-stone-100 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              {t("requestFlyer")}
            </Link>
            <Link
              href="/partners/donatiebox-aanvragen"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-rose-300 dark:border-rose-700 text-stone-800 dark:text-stone-100 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              {t("requestBox")}
            </Link>
          </div>

          <p className="text-center pt-4">
            <Link href="/partners" className="underline hover:no-underline" style={{ color: PINK }}>
              ← {t("backToPartners")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
