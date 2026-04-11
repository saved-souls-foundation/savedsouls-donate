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
  const t = await getTranslations({ locale, namespace: "freeHomeVisit" });
  return { title: `${t("pageTitle")} | Saved Souls Foundation` };
}

export default async function AdoptionProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "freeHomeVisit" });

  const steps = [
    { icon: "🔍", num: 1, title: t("step1Title"), content: (
      <>
        {t("step1TextBefore")}{" "}
        <Link href="/adopt" className="underline font-semibold hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          {t("step1Link")}
        </Link>
        {" "}{t("step1TextAfter")}
      </>
    )},
    { icon: "🤝", num: 2, title: t("step2Title"), content: t("step2Text") },
    { icon: "📋", num: 3, title: t("step3Title"), content: t("step3Text") },
    { icon: "✈️", num: 4, title: t("step4Title"), content: null },
  ];

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
          className="rounded-3xl p-8 md:p-12 text-center mb-10 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ACCENT_GREEN}15, ${ACCENT_TEAL}10)`, border: `2px solid ${ACCENT_GREEN}20` }}
        >
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight" style={{ color: ACCENT_GREEN }}>
            {t("pageTitle")}
          </h1>
          <p className="text-lg font-bold text-stone-700 dark:text-stone-300 max-w-xl mx-auto">
            {t("pageSubtitle")}
          </p>
        </div>

        {/* Thailand vs Internationaal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${ACCENT_GREEN}40`, backgroundColor: `${ACCENT_GREEN}08` }}>
            <div className="text-3xl mb-2">🇹🇭</div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100 mb-2">Thailand</h2>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300 leading-relaxed">{t("withinThailandText")}</p>
          </div>
          <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${ACCENT_AMBER}40`, backgroundColor: `${ACCENT_AMBER}08` }}>
            <div className="text-3xl mb-2">🌍</div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100 mb-2">International</h2>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300 leading-relaxed">{t("overseasText")}</p>
          </div>
        </div>

        {/* Stappen */}
        <div className="space-y-4 mb-10">
          {steps.map(({ icon, num, title, content }) => (
            <div
              key={num}
              className="rounded-2xl p-6 md:p-8 border-2 bg-white dark:bg-stone-900 transition-all hover:shadow-lg"
              style={{ borderColor: `${ACCENT_GREEN}20` }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <span className="text-2xl">{icon}</span>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: ACCENT_GREEN }}>
                    {num}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">{title}</h2>
                  {num < 4 && (
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">{content}</p>
                  )}
                  {num === 4 && (
                    <>
                      <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm mb-4">{t("step4Text")}</p>
                      <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">{t("prepTimesTitle")}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        {[
                          { flag: "🌍", country: t("prepEurope").split(":")[0], time: t("prepEurope").split(": ")[1] },
                          { flag: "🇺🇸", country: t("prepUSA").split(":")[0], time: t("prepUSA").split(": ")[1] },
                          { flag: "🇨🇦", country: t("prepCanada").split(":")[0], time: t("prepCanada").split(": ")[1] },
                        ].map(({ flag, country, time }) => (
                          <div
                            key={country}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 border text-center"
                            style={{ borderColor: `${ACCENT_GREEN}30`, backgroundColor: `${ACCENT_GREEN}06` }}
                          >
                            <span className="text-2xl">{flag}</span>
                            <span className="font-semibold text-stone-800 dark:text-stone-100 text-xs">{country}</span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">📅 {time}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-sm">
                        {t("prepOther")}{" "}
                        <a href="mailto:adoption@savedsouls-foundation.org" className="underline font-semibold hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
                          adoption@savedsouls-foundation.org
                        </a>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-400 dark:text-stone-500 text-center mb-10">
          {t("footnote")}
        </p>

        {/* CTA knoppen */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
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
