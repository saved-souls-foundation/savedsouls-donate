import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import { GIDSEN_GROUPS } from "@/lib/gidsen-data";
import GidsenHub from "./GidsenHub";
import AnimalWelfareOrgsSection from "./AnimalWelfareOrgsSection";

export default async function GidsenPage() {
  const t = await getTranslations("gidsen");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" noOverlay speed={0.2}>
      <div className="min-h-screen bg-white dark:bg-stone-900">
        <main className="max-w-5xl mx-auto">
          {/* Hero section */}
          <header
            className="py-12 text-center"
            style={{ backgroundColor: "#f0faf4" }}
          >
            <span className="text-5xl block mb-3" aria-hidden>📖</span>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {t("title")}
            </h1>
            <p className="text-base text-stone-600 dark:text-stone-400 max-w-lg mx-auto px-4">
              {t("subtitle")}
            </p>
          </header>

          {/* Search + Category cards */}
          <section className="py-8">
            <GidsenHub groups={GIDSEN_GROUPS} />
          </section>

          {/* Partner organisations */}
          <section className="max-w-5xl mx-auto px-6 pb-12">
            <AnimalWelfareOrgsSection />
          </section>

          {/* Bottom nav */}
          <div className="flex flex-wrap gap-4 justify-center items-center pb-16">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              ← {t("backToGetInvolved")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              ← {tCommon("backToHome")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </ParallaxPage>
  );
}
