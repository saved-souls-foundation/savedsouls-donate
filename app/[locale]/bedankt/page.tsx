import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

const GREEN_DARK = "#1a5c2e";
const BEIGE = "#f5f0e8";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BedanktPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bedankt");

  return (
    <ParallaxPage overlayClassName="bg-white/[0.99] dark:bg-stone-950/[0.99]">
      <div className="relative w-full overflow-hidden" style={{ height: "38vh", minHeight: 280, maxHeight: 420 }}>
        <img
          src="/woman-dog-wheelchair.webp"
          alt={t("title")}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
        <div className="absolute inset-0 flex items-end px-6 md:px-12 pb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-white italic">{t("title")}</h1>
        </div>
      </div>

      <div style={{ background: BEIGE }} className="min-h-screen">
        <div className="max-w-lg mx-auto px-5 py-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: GREEN_DARK }}>
              {t("subtitle")}
            </h2>
            <p className="text-stone-700 leading-relaxed">{t("body")}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-stone-300 text-stone-800 hover:bg-stone-100"
              >
                {t("backHome")}
              </Link>
              <Link
                href={`/${locale}/donate`}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: GREEN_DARK }}
              >
                {t("donateAgain")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </ParallaxPage>
  );
}
