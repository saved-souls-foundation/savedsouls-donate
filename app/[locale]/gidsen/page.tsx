import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import { GIDSEN_GROUPS } from "@/lib/gidsen-data";
import GidsenAccordion from "./GidsenAccordion";
import AnimalWelfareOrgsSection from "./AnimalWelfareOrgsSection";

const ACCENT_GREEN = "#2aa348";

export default async function GidsenPage() {
  const t = await getTranslations("gidsen");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" noOverlay speed={0.2}>
      <div className="min-h-screen bg-gradient-to-b from-white/95 via-stone-50/90 to-white/95 dark:from-stone-900/95 dark:via-stone-900/90 dark:to-stone-900/95">
        <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
          <header className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2aa348]/10 dark:bg-[#2aa348]/20 mb-6">
              <span className="text-xl">📖</span>
              <span className="text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                {tCommon("gidsen")}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-3 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </header>

          {/* Apple-style accordion met kleuraccenten */}
          <section className="rounded-2xl border border-stone-200/80 dark:border-stone-700 overflow-hidden bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50">
            <GidsenAccordion groups={GIDSEN_GROUPS} accentGreen={ACCENT_GREEN} />
          </section>

          {/* Grote dierenwelzijn instellingen */}
          <section className="mt-8">
            <AnimalWelfareOrgsSection />
          </section>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              style={{ color: ACCENT_GREEN }}
            >
              ← {t("backToGetInvolved")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            >
              {tCommon("backToHome")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </ParallaxPage>
  );
}
