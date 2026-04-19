import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

type DisclaimerParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: DisclaimerParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclaimer" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    ...(locale === "en" && {
      other: {
        "tiktok-developers-site-verification": "caRCaRY0cUxxdkLQDg8H6vs3eoYxgAqo",
      },
    }),
  };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimer");

  return (
    <ParallaxPage>
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-6 text-sm">
          {t("subtitle")}
        </p>

        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200 dark:border-amber-700">
            <Image
              src="/dog-wetboek.png"
              alt={t("dogImageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        </div>

        <section className="space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("generalTitle")}
            </h2>
            <p>{t("generalText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("reservationTitle")}
            </h2>
            <p>{t("reservationText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("accuracyTitle")}
            </h2>
            <p>{t("accuracyText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("liabilityTitle")}
            </h2>
            <p>{t("liabilityText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("donationsTitle")}
            </h2>
            <p>{t("donationsText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("externalLinksTitle")}
            </h2>
            <p>{t("externalLinksText")}</p>
          </div>

          <div id="cookies">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("cookiesTitle")}
            </h2>
            <p>{t("cookiesText")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("contactTitle")}
            </h2>
            <p>
              {t("contactText")}
              <a href="mailto:info@savedsouls-foundation.org" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
                {t("contactEmail")}
              </a>
              .
            </p>
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
