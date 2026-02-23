import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import IdealDonate from "../../components/IdealDonate";
import BankTransferSection from "../../components/BankTransferSection";

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
    <ParallaxPage overlayClassName="bg-white/70 dark:bg-stone-950/80">
      <main className="max-w-md mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-8">
          <div className="w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden border-4 shadow-lg" style={{ borderColor: ACCENT_GREEN }}>
            <img src="/donatie-thanks.webp" alt={t("donateThanksImageAlt")} className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/icons/paw.svg" alt="" className="w-8 h-8" aria-hidden />
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
              {t("payTitle")}
            </h1>
            <img src="/icons/heart.svg" alt="" className="w-8 h-8" aria-hidden />
          </div>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            {t("paySubtitle")}
          </p>
        </header>

        <div className="mb-8 p-6 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border border-stone-200/80 dark:border-stone-700/80 shadow-xl shadow-stone-200/50 dark:shadow-stone-900/50" style={{ borderLeft: `4px solid ${ACCENT_GREEN}` }}>
          <IdealDonate />
        </div>

        <div id="bank-transfer" className="scroll-mt-24 mb-8">
          <BankTransferSection />
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/support"
            className="inline-block text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-2 font-medium"
          >
            {t("linkToSupport")}
          </Link>
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
