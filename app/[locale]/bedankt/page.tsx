import Footer from "@/app/components/Footer";
import GiftAnimation from "@/app/components/GiftAnimation";
import ParallaxPage from "@/app/components/ParallaxPage";
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
          <GiftAnimation
            title={t("title")}
            subtitle={t("subtitle")}
            body={t("body")}
            backHome={t("backHome")}
            donateAgain={t("donateAgain")}
            locale={locale}
            greenDark="#1a5c2e"
          />
        </div>
      </div>

      <Footer />
    </ParallaxPage>
  );
}
