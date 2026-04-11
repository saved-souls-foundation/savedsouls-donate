import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";
const ACCENT_AMBER = "#f59e0b";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fullMedicalCheck" });
  return { title: `${t("pageTitle")} | Saved Souls Foundation` };
}

export default async function MedicalTravelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fullMedicalCheck" });

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          Saved Souls
        </Link>
        <Link href="/adopt" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
          {t("backToAdopt")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Hero */}
        <div
          className="rounded-3xl p-8 md:p-12 text-center mb-10"
          style={{ background: `linear-gradient(135deg, ${ACCENT_TEAL}15, ${ACCENT_GREEN}10)`, border: `2px solid ${ACCENT_TEAL}20` }}
        >
          <div className="text-5xl mb-4">✈️</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight" style={{ color: ACCENT_TEAL }}>
            {t("pageTitle")}
          </h1>
          <p className="text-lg font-bold text-stone-700 dark:text-stone-300 max-w-xl mx-auto">
            {t("pageSubtitle")}
          </p>
        </div>

        <div
          className="rounded-2xl mb-10 overflow-hidden border-2"
          style={{ borderColor: `${ACCENT_TEAL}30`, height: "220px" }}
        >
          <img
            src="/woman-dog-leash.webp"
            alt="Vrouw met hond aan de lijn bij Saved Souls Foundation"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Prep times */}
        <div
          className="rounded-2xl p-6 md:p-8 border-2 mb-6"
          style={{ borderColor: `${ACCENT_GREEN}30`, backgroundColor: `${ACCENT_GREEN}06` }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📅</span>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t("prepTimesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { flag: "🌍", country: t("prepEurope").split(":")[0], time: t("prepEurope").split(": ")[1] },
              { flag: "🇺🇸", country: t("prepUSA").split(":")[0], time: t("prepUSA").split(": ")[1] },
              { flag: "🇨🇦", country: t("prepCanada").split(":")[0], time: t("prepCanada").split(": ")[1] },
            ].map(({ flag, country, time }) => (
              <div
                key={country}
                className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 border-2 text-center bg-white dark:bg-stone-900 transition-all hover:shadow-md hover:scale-[1.02]"
                style={{ borderColor: `${ACCENT_GREEN}25` }}
              >
                <span className="text-3xl">{flag}</span>
                <span className="font-bold text-stone-800 dark:text-stone-100 text-sm">{country}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400">⏱️ {time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ander land */}
        <div
          className="rounded-2xl p-6 md:p-8 border-2 mb-10"
          style={{ borderColor: `${ACCENT_AMBER}40`, backgroundColor: `${ACCENT_AMBER}08` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🌐</span>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t("otherCountriesTitle")}</h2>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {t("otherCountriesText")}
          </p>
          <a
            href="mailto:adoption@savedsouls-foundation.org"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            ✉️ adoption@savedsouls-foundation.org
          </a>
        </div>

        {/* CTA knoppen */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/adopt-inquiry"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaButton")}
          </Link>
          <TrackedDonateLink
            href="/donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg border-2"
            style={{ borderColor: "#e11d48", color: "#e11d48", backgroundColor: "#fff1f2" }}
          >
            ♥ Help ons meer zielen te redden
          </TrackedDonateLink>
        </div>

      </main>
      <Footer />
    </ParallaxPage>
  );
}
