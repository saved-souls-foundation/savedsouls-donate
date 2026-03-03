import { Link } from "@/i18n/navigation";
import InfluencerImage from "../../components/InfluencerImage";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const INFLUENCER_VIOLET = "#8b5cf6";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "influencers" });
  return {
    title: `${t("metaTitle")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default async function InfluencersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("influencers");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: INFLUENCER_VIOLET }}
          >
            🐾 {t("badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: INFLUENCER_VIOLET }}>
            {t("subtitle")}
          </p>
        </header>

        {/* Afbeelding 1 – bovenaan */}
        <div className="mb-12">
          <InfluencerImage
            src="/influencer-hero-2.webp"
            alt={t("img2Alt")}
            placeholder={t("img2Placeholder")}
            filename="influencer-hero-2.webp"
            large
          />
        </div>

        <section className="space-y-8">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              {t("intro1")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {t("intro2")}
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: INFLUENCER_VIOLET }}>
              {t("whatCanYouDoTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
              {t("whatCanYouDoIntro")}
            </p>
            <ul className="space-y-4 text-stone-600 dark:text-stone-400">
              <li className="flex gap-3">
                <span className="shrink-0 font-bold" style={{ color: INFLUENCER_VIOLET }}>•</span>
                <span><strong>{t("makeStatementTitle")}</strong> {t("makeStatementText")}</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-bold" style={{ color: INFLUENCER_VIOLET }}>•</span>
                <span><strong>{t("shareStoriesTitle")}</strong> {t("shareStoriesText")}</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-bold" style={{ color: INFLUENCER_VIOLET }}>•</span>
                <span><strong>{t("visitUsTitle")}</strong> {t("visitUsText")}</span>
              </li>
            </ul>
          </div>

          {/* Afbeelding 2 – midden */}
          <div>
            <InfluencerImage
              src="/influencer-hero-3.webp"
              alt={t("img3Alt")}
              placeholder={t("img3Placeholder")}
              filename="influencer-hero-3.webp"
              large
            />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: INFLUENCER_VIOLET }}>
              {t("materialTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              {t("materialText")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              {t("materialPress")}{" "}
              <Link href="/press" className="font-semibold underline hover:no-underline" style={{ color: ACCENT_GREEN }}>
                {t("pressPageLink")}
              </Link>
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: INFLUENCER_VIOLET }}>
              {t("platformsTitle")}
            </h2>
            <div className="grid gap-4 text-stone-600 dark:text-stone-400 text-sm">
              <div><strong>TikTok</strong> — {t("platformTiktok")}</div>
              <div><strong>YouTube</strong> — {t("platformYoutube")}</div>
              <div><strong>Instagram</strong> — {t("platformInstagram")}</div>
              <div><strong>Facebook</strong> — {t("platformFacebook")}</div>
              <div><strong>Snapchat</strong> — {t("platformSnapchat")}</div>
              <div><strong>Pinterest</strong> — {t("platformPinterest")}</div>
              <div><strong>Reddit</strong> — {t("platformReddit")}</div>
              <div><strong>Telegram</strong> — {t("platformTelegram")}</div>
              <div><strong>Twitch</strong> — {t("platformTwitch")}</div>
              <div><strong>Threads & X (Twitter)</strong> — {t("platformThreads")}</div>
              <div><strong>LinkedIn</strong> — {t("platformLinkedin")}</div>
              <div><strong>BeReal</strong> — {t("platformBereal")}</div>
            </div>
          </div>

          {/* Afbeelding 3 – onderaan */}
          <div>
            <InfluencerImage
              src="/influencer-hero-1.webp"
              alt={t("img1Alt")}
              placeholder={t("img1Placeholder")}
              filename="influencer-hero-1.webp"
              large
            />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: INFLUENCER_VIOLET }}>
              {t("togetherTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              {t("togetherText")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed italic">
              {t("tagline")}
            </p>
          </div>

          <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl p-6 md:p-8 border border-stone-200 dark:border-stone-600">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">{t("contactTitle")}</h3>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
              <li>📩 {t("contactEmail")}: <a href="mailto:info@savedsouls-foundation.org" className="underline hover:no-underline">info@savedsouls-foundation.org</a></li>
              <li>📰 {t("contactPress")}: <Link href="/press" className="underline hover:no-underline">{t("pressPageLink")}</Link></li>
              <li>📦 {t("contactMaterial")}</li>
              <li>📱 {t("contactFollow")}: @savedsoulfoundation</li>
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: INFLUENCER_VIOLET }}
            >
              {t("ctaContact")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
