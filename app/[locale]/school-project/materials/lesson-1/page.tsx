import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default async function Lesson1Page() {
  const t = await getTranslations("schoolProject.materials.lesson1");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 px-4 py-4 bg-white/98 dark:bg-stone-900/98 border-b border-stone-200 print:hidden">
        <Link href="/school-project/materials" className="text-sm font-medium" style={{ color: ACCENT_GREEN }}>
          ← {t("backToMaterials")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-10 shadow-lg border border-stone-200 dark:border-stone-700 print:shadow-none print:border">
          <header className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-600">
            <p className="text-sm font-semibold mb-2" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation • {t("lesson")} 1</p>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
              {t("title")}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-2">{t("subtitle")}</p>
          </header>

          <section className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("section1Title")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("section1Text")}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("section2Title")}
              </h2>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li className="flex gap-2">• {t("section2Item1")}</li>
                <li className="flex gap-2">• {t("section2Item2")}</li>
                <li className="flex gap-2">• {t("section2Item3")}</li>
                <li className="flex gap-2">• {t("section2Item4")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("section3Title")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("section3Intro")}</p>
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="font-medium text-stone-800 dark:text-stone-200 mb-2">{t("section3Task")}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t("section3Instructions")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("section4Title")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("section4Text")}</p>
            </div>
          </section>

          <footer className="pt-6 border-t border-stone-200 dark:border-stone-600 text-center text-sm text-stone-500">
            Saved Souls Foundation • Khon Kaen, Thailand • savedsouls-foundation.org
          </footer>
        </div>

        <div className="mt-6 flex justify-center print:hidden">
          <Link href="/school-project/materials" className="px-6 py-3 rounded-xl font-semibold border-2" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>
            ← {t("backToMaterials")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
