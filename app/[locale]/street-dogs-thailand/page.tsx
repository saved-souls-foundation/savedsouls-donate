import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ShareStoryButton from "../../components/ShareStoryButton";
import DonationImpactSpinner from "../../components/DonationImpactSpinner";
import DogPhotoCard from "../../components/DogPhotoCard";

const ACCENT_GREEN = "#2aa348";

const DOG_PHOTOS = [
  "/woman-hug-dog.webp",
  "/dog-care.webp",
  "/dog-wheelchair-small.webp",
];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "streetDogsThailand" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
  };
}

export default async function StreetDogsThailandPage() {
  const t = await getTranslations("streetDogsThailand");
  const tCommon = await getTranslations("common");
  const tThankYou = await getTranslations("thankYou");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          Saved Souls
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher compact />
          <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
            ← {tCommon("backToHome")}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <article className="prose prose-stone dark:prose-invert max-w-none">
          <header className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
              {t("intro")}
            </p>
          </header>

          {/* Drie foto's met frost – tekst erboven */}
          <section className="mb-12">
            <p className="text-center text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-200 mb-6" style={{ color: ACCENT_GREEN }}>
              {t("photosQuestion")}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {DOG_PHOTOS.map((src) => (
                <Link
                  key={src}
                  href="/donate"
                  className="block hover:opacity-95 transition-opacity"
                >
                  <DogPhotoCard
                    src={src}
                    alt={t("photosAlt")}
                    frostOnScroll
                    className="shadow-lg border-2 border-white/50 dark:border-stone-600/50 cursor-pointer"
                  />
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("realityTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("reality1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("reality2")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("reality3")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("reality4")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("whyThailandTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("whyThailand1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("whyThailand2")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("whyThailand3")}</p>
          </section>

          <section className="mb-12 p-6 md:p-8 rounded-2xl bg-green-50 dark:bg-stone-800/80 border-2 border-green-200 dark:border-green-900/50">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("everySoulTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("everySoul1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("everySoul2")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("loveHomeTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("loveHome1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("loveHome2")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("provideCareTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("provideCare1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("provideCare2")}</p>
          </section>

          <section className="mb-12 p-6 md:p-8 rounded-2xl bg-green-50 dark:bg-stone-800/80 border-2 border-green-200 dark:border-green-900/50">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("adoptionTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("adoption1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("adoption2")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("adoptionLuchtbrug")}<Link href="/luchtbrug" className="underline font-semibold hover:no-underline" style={{ color: ACCENT_GREEN }}>{t("adoptionLuchtbrugLink")}</Link>.</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("adoption3")}<Link href="/contact" className="underline font-semibold hover:no-underline" style={{ color: ACCENT_GREEN }}>{t("adoptionContactLink")}</Link>.</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("adoption4")}</p>
          </section>

          <section className="mb-12">
            <DonationImpactSpinner />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("volunteerTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("volunteer1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("volunteer2")}</p>
            <ul className="list-disc pl-6 space-y-2 text-stone-800 dark:text-stone-200 font-medium mb-6">
              <li>{t("volunteerTask1")}</li>
              <li>{t("volunteerTask2")}</li>
              <li>{t("volunteerTask3")}</li>
              <li>{t("volunteerTask4")}</li>
              <li>{t("volunteerTask5")}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("giveGenerouslyTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-4">{t("giveGenerously1")}</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">{t("giveGenerously2")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_GREEN }}>
              {t("ctaTitle")}
            </h2>
            <p className="text-stone-800 dark:text-stone-200 font-medium mb-6">{t("ctaText")}</p>
            <div className="flex justify-center mb-8">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold text-lg text-white transition-opacity hover:opacity-95"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("btnDonate")}
              </Link>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-12">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-opacity hover:opacity-95"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("btnDonate")}
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("btnVolunteer")}
            </Link>
            <Link
              href="/adopt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("btnAdopt")}
            </Link>
            <ShareStoryButton
              label={t("btnShare")}
              shareTitle={t("shareTitle")}
              shareText={t("shareText")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 transition-all hover:scale-105"
            />
          </div>

          {/* Message from founder */}
          <section className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-stone-800 dark:to-stone-900 border-2 border-green-200/80 dark:border-green-900/50 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: ACCENT_GREEN }}>
              {tThankYou("founderTitle")}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm text-center mb-8">{tThankYou("founderDate")}</p>
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4 whitespace-pre-line text-center">
                {tThankYou("founderMessage")}
              </p>
              <p className="text-stone-600 dark:text-stone-400 italic text-center">— {tThankYou("founderName")} 💚</p>
            </div>
          </section>

          {/* Onze Missie & Toekomst – pakkende afsluiting onderaan */}
          <section className="mt-12 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-stone-800 dark:to-stone-900 border-2 border-green-200/80 dark:border-green-900/50 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: ACCENT_GREEN }}>
              {t("purposeTitle")}
            </h2>
            <div className="space-y-5 text-stone-800 dark:text-stone-200 font-medium text-base md:text-lg leading-relaxed">
              <p>{t("purpose1")}</p>
              <p>{t("purpose2")}</p>
              <p>{t("purpose3")}</p>
              <p className="font-semibold text-center">{t("purpose4")}</p>
              <p className="text-stone-800 dark:text-stone-200 font-medium">{t("purpose5")}</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
