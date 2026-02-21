import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";

export default async function FundraisingPage() {
  const t = await getTranslations("schoolProject.materials.fundraising");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
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
                {t("ideasTitle")}
              </h2>
              <ul className="space-y-3 text-stone-600 dark:text-stone-400">
                <li className="flex gap-2"><strong className="text-stone-800 dark:text-stone-200">1.</strong> {t("idea1")}</li>
                <li className="flex gap-2"><strong className="text-stone-800 dark:text-stone-200">2.</strong> {t("idea2")}</li>
                <li className="flex gap-2"><strong className="text-stone-800 dark:text-stone-200">3.</strong> {t("idea3")}</li>
                <li className="flex gap-2"><strong className="text-stone-800 dark:text-stone-200">4.</strong> {t("idea4")}</li>
                <li className="flex gap-2"><strong className="text-stone-800 dark:text-stone-200">5.</strong> {t("idea5")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
                {t("transferTitle")}
              </h2>
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-600">
                <p className="font-bold text-stone-800 dark:text-stone-200">Kasikorn Bank</p>
                <p className="font-mono text-lg text-stone-700 dark:text-stone-300 mt-1">033-8-13623-4</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">Saved Souls Foundation</p>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 font-medium">{t("transferNote")}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t("worksheetTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">{t("worksheetIntro")}</p>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-stone-700 dark:text-stone-300">{t("worksheetQ1")}</p>
                <p className="text-stone-500 italic">{t("worksheetA1")}</p>
                <p className="font-medium text-stone-700 dark:text-stone-300 mt-3">{t("worksheetQ2")}</p>
                <p className="text-stone-500 italic">{t("worksheetA2")}</p>
                <p className="font-medium text-stone-700 dark:text-stone-300 mt-3">{t("worksheetQ3")}</p>
                <p className="text-stone-500 italic">{t("worksheetA3")}</p>
              </div>
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
