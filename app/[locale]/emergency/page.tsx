import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const GOAL_EUR = 100_000;
const RAISED_EUR = 2_163;
const GOFUNDME_URL = "https://gofund.me/6df90b013";
const BASE_URL = "https://www.savedsouls-foundation.com";

type Props = { params: Promise<{ locale: string }> };

export default async function EmergencyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("emergency");

  const progressPercent = Math.min(100, (RAISED_EUR / GOAL_EUR) * 100);
  const shareUrl = `${BASE_URL}/${locale}/emergency`;
  const shareText = t("shareText");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappShare = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

  return (
    <ParallaxPage overlayClassName="bg-transparent" noOverlay>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        {/* Hero — dog-350.jpg, CSS background, overlay + tekst */}
        <div
          style={{
            backgroundImage: "url('/dog-red-leash.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "60vh",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 px-4 py-16 md:py-24 text-white text-center w-full">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <section className="bg-white dark:bg-stone-800 shadow-sm py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
              <span>€{RAISED_EUR.toLocaleString("nl-NL")} {t("progressOf")} €{GOAL_EUR.toLocaleString("nl-NL")}</span>
              <span>{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="h-4 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: ACCENT_GREEN }}
              />
            </div>
          </div>
        </section>

        {/* Two goals */}
        <section className="max-w-3xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
              <span className="text-2xl" aria-hidden>🏠</span>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mt-2">{t("goalLandTitle")}</h2>
              <p className="text-stone-600 dark:text-stone-400 mt-2">{t("goalLandDesc")}</p>
            </div>
            <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
              <span className="text-2xl" aria-hidden>🍖</span>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mt-2">{t("goalFundTitle")}</h2>
              <p className="text-stone-600 dark:text-stone-400 mt-2">{t("goalFundDesc")}</p>
            </div>
          </div>
        </section>

        {/* Impact amounts */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 text-center mb-6">{t("impactTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-2xl font-bold" style={{ color: ACCENT_GREEN }}>€12</span>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t("impactFood")}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-2xl font-bold" style={{ color: ACCENT_GREEN }}>€23</span>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t("impactMeds")}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-2xl font-bold" style={{ color: ACCENT_GREEN }}>€32</span>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t("impactSterilization")}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-2xl font-bold" style={{ color: ACCENT_GREEN }}>€46</span>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t("impactEmergency")}</p>
            </div>
          </div>
        </section>

        {/* GoFundMe CTA */}
        <section className="max-w-2xl mx-auto px-4 py-10">
          <a
            href={GOFUNDME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl text-white text-lg font-bold shadow-lg hover:opacity-95 transition-opacity"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaGoFundMe")}
          </a>
        </section>

        {/* Share buttons */}
        <section className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-center text-stone-600 dark:text-stone-400 font-medium mb-4">{t("shareTitle")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={facebookShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white text-sm font-medium hover:opacity-90"
            >
              {t("shareFacebook")}
            </a>
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:opacity-90"
            >
              {t("shareWhatsApp")}
            </a>
            <a
              href={twitterShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-stone-700 text-white text-sm font-medium hover:opacity-90"
            >
              {t("shareTwitter")}
            </a>
          </div>
        </section>

        {/* Photo grid — dog-350, dog-342 */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/dog-wheelchair-small.webp"
                alt={t("photoGridAlt1")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/dog-wheelchair.webp"
                alt={t("photoGridAlt2")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
