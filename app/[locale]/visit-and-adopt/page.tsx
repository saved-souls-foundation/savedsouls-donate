import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lifelongSupport" });
  return { title: `${t("pageTitle")} | Saved Souls Foundation` };
}

export default async function VisitAdoptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "lifelongSupport" });

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

        <div className="rounded-2xl mb-10 overflow-hidden border-2" style={{ borderColor: `${ACCENT_GREEN}30` }}>
          <img
            src="/dogs-companions.webp"
            alt="Visit our shelter"
            className="w-full object-cover object-top"
            style={{ maxHeight: "400px", objectPosition: "center top" }}
          />
        </div>

        {/* Kaartjes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div
            className="rounded-2xl p-6 border-2"
            style={{ borderColor: `${ACCENT_GREEN}40`, backgroundColor: `${ACCENT_GREEN}08` }}
          >
            <div className="text-3xl mb-3">🎪</div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("meetTitle")}</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-3">{t("meetText")}</p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/SavedSoulsFoundation/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: "#1877f2" }}
              >
                📘 Facebook
              </a>
              <a
                href="https://www.instagram.com/savedsoulsfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: "#e1306c" }}
              >
                📷 Instagram
              </a>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 border-2"
            style={{ borderColor: `${ACCENT_TEAL}40`, backgroundColor: `${ACCENT_TEAL}08` }}
          >
            <div className="text-3xl mb-3">📅</div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("visitTitle")}</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-3">{t("visitText")}</p>
            <a
              href="mailto:adoption@savedsouls-foundation.org"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              ✉️ adoption@savedsouls-foundation.org
            </a>
          </div>
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
