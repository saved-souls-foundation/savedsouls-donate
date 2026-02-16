import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export default async function MaterialsPage() {
  const t = await getTranslations("schoolProject.materials");
  const tCommon = await getTranslations("common");

  const materials = [
    { href: "/school-project/materials/lesson-1", title: t("lesson1Title"), desc: t("lesson1Desc"), icon: "📚" },
    { href: "/school-project/materials/lesson-2", title: t("lesson2Title"), desc: t("lesson2Desc"), icon: "🐕" },
    { href: "/school-project/materials/fundraising", title: t("fundraisingTitle"), desc: t("fundraisingDesc"), icon: "💰" },
    { href: "/school-project/materials/teacher-guide", title: t("teacherGuideTitle"), desc: t("teacherGuideDesc"), icon: "👩‍🏫" },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm print:hidden">
        <Link href="/school-project" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/school-project" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">
          ← {t("backToProject")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("pageTitle")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            {t("pageIntro")}
          </p>
        </header>

        <div className="grid gap-6">
          {materials.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="block p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 hover:border-[#2aa348]/50 dark:hover:border-[#2aa348]/50 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="text-3xl mb-3 block">{m.icon}</span>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{m.title}</h2>
              <p className="text-stone-600 dark:text-stone-400">{m.desc}</p>
              <span className="inline-block mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                {t("viewMaterial")} →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            {t("printTip")}
          </p>
        </div>

        <div className="mt-8 flex justify-center print:hidden">
          <Link
            href="/school-project"
            className="px-6 py-3 rounded-xl font-semibold border-2"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            ← {t("backToProject")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
