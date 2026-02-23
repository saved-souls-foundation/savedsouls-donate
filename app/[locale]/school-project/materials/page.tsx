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
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
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
