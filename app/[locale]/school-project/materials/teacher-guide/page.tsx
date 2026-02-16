import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default async function TeacherGuidePage() {
  const t = await getTranslations("schoolProject.materials.teacherGuide");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 px-4 py-4 bg-white/98 dark:bg-stone-900/98 border-b border-stone-200 print:hidden">
        <Link href="/school-project/materials" className="text-sm font-medium" style={{ color: ACCENT_GREEN }}>
          ← {t("backToMaterials")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-10 shadow-lg border border-stone-200 dark:border-stone-700 print:shadow-none print:border">
          <header className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-600">
            <p className="text-sm font-semibold mb-2" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</p>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
              {t("title")}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-2">{t("subtitle")}</p>
          </header>

          <section className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("overviewTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("overviewText")}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("materialsTitle")}
              </h2>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li>• {t("material1")}</li>
                <li>• {t("material2")}</li>
                <li>• {t("material3")}</li>
                <li>• {t("material4")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("suggestedTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-3">{t("suggestedIntro")}</p>
              <ol className="list-decimal list-inside space-y-2 text-stone-600 dark:text-stone-400">
                <li>{t("step1")}</li>
                <li>{t("step2")}</li>
                <li>{t("step3")}</li>
                <li>{t("step4")}</li>
                <li>{t("step5")}</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("contactTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("contactText")}</p>
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
