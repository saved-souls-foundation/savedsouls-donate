import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

const PINK = "#ec4899";
const MAPS_URL = "https://www.google.com/maps/search/Thalang+Animal+Hospital+Phuket";
const PHONE = "+66866822557";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bedanktThalangAnimalHospital" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BedanktThalangAnimalHospitalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bedanktThalangAnimalHospital");

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
          <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: PINK }}>
            {t("subtitle")}
          </p>
          <p className="text-stone-600 dark:text-stone-400">{t("location")}</p>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/50 dark:border-rose-900/30 mb-6">
          <img
            src="/partners/thalang-animal/exterior.png"
            alt={t("heroAlt")}
            className="w-full h-auto max-h-[480px] object-cover object-center"
          />
        </div>

        <div className="max-w-xs mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 dark:border-stone-700 bg-black">
          <video
            src="/partners/thalang-animal/donation-box.mp4"
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-64 object-contain"
            aria-label={t("videoAlt")}
          />
          <p className="text-center text-xs text-stone-500 dark:text-stone-400 py-2 px-3 bg-white dark:bg-stone-900">
            {t("videoCaption")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 dark:border-stone-700">
            <img
              src="/partners/thalang-animal/counter.png"
              alt={t("photoAlt1")}
              className="w-full aspect-[4/5] object-cover object-center"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 dark:border-stone-700">
            <img
              src="/partners/thalang-animal/reception.png"
              alt={t("photoAlt2")}
              className="w-full aspect-[4/5] object-cover object-center"
            />
          </div>
        </div>

        <div className="space-y-8 text-stone-700 dark:text-stone-300 leading-relaxed">
          <p className="text-lg">{t("intro")}</p>

          <section className="rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: PINK }}>
              {t("partnershipTitle")}
            </h2>
            <p>{t("partnershipText")}</p>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-900/30 p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-3" style={{ color: PINK }}>
              {t("secondPartnerTitle")}
            </h2>
            <p>{t("secondPartnerText")}</p>
          </section>

          <p className="text-center text-stone-600 dark:text-stone-400">{t("freeNote")}</p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: PINK }}
            >
              {t("visitClinic")} →
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold border-2 border-rose-300 dark:border-rose-700 text-stone-800 dark:text-stone-100 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              {t("callClinic")}
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

          <p className="text-center pt-4 space-y-2">
            <Link
              href="/partners/bedankt-donatiebox-medespelers"
              className="block underline hover:no-underline"
              style={{ color: PINK }}
            >
              ← {t("backToLayan")}
            </Link>
            <Link href="/partners" className="block underline hover:no-underline text-stone-600 dark:text-stone-400">
              {t("backToPartners")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
