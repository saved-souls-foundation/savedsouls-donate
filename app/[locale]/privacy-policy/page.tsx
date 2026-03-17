import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export async function generateMetadata() {
  const t = await getTranslations("privacyPolicy");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPolicy");

  return (
    <ParallaxPage>
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-10 text-sm leading-relaxed">
          {t("intro")}
        </p>

        <section className="space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("dataTitle")}
            </h2>
            <p>{t("dataText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("purposeTitle")}
            </h2>
            <p>{t("purposeText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("retentionTitle")}
            </h2>
            <p>{t("retentionText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("toolsTitle")}
            </h2>
            <p>{t("toolsText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("rightsTitle")}
            </h2>
            <p>{t("rightsText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("contactTitle")}
            </h2>
            <p>{t("contactText")}</p>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {t("backToHome")}
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
