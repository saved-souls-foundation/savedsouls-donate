import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import IdealDonate from "../../components/IdealDonate";

const ACCENT_GREEN = "#2aa348";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return {
    title: `${t("payTitle")} | Saved Souls Foundation`,
    description: t("paySubtitle"),
  };
}

export default async function DonatePage() {
  const t = await getTranslations("donate");

  return (
    <ParallaxPage>
      <main className="max-w-md mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-3">
            {t("payTitle")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            {t("paySubtitle")}
          </p>
        </header>

        <div className="mb-8">
          <IdealDonate />
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/financial-overview"
            className="inline-block text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-2 font-medium"
          >
            {t("linkToFinancialOverview")}
          </Link>
          <Link
            href="/donate/causes"
            className="inline-block text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-2 font-medium"
          >
            {t("linkToCauses")}
          </Link>
          <p className="text-sm text-stone-500 dark:text-stone-500">
            {t("payFooter")}
          </p>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
