import Image from "next/image";
import { Home, Rabbit, Luggage, HeartHandshake, Quote, CalendarClock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "Volunteer | Saved Souls Foundation",
  description:
    "Join the Furry Revolution! Volunteer with Saved Souls Foundation in Khon Kaen, Thailand. Minimum 2 weeks. Help rescued dogs and cats. Apply now.",
};

export default async function VolunteerPage() {
  const t = await getTranslations("volunteer");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
            <video
              src="/savedsouls-fondation-logo.mp4"
              width={70}
              height={70}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          {tCommon("backToHome")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-stone-700 dark:text-stone-300 mb-6" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8 max-w-2xl mx-auto w-full aspect-[4/3] bg-stone-200 dark:bg-stone-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <img
              src="/volunteer-hero.png"
              alt="Volunteer petting a happy dog at Saved Souls Foundation sanctuary"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto font-bold">
            {t("intro")}
          </p>
        </header>

        <section className="space-y-8">
          {/* Volunteer Stories */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center justify-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("storiesTitle")}
              <Quote className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-6">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-1.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story1Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium mt-1">{t("story1Author")}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-2.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story2Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium mt-1">{t("story2Author")}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-3.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story3Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-sm font-medium mt-1">{t("story3Author")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ready to Make a Difference */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("readyTitle")}
              <HeartHandshake className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <span>📍</span> {t("location")}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("locationText")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
                  <span>✓</span> {t("whatWeNeed")}
                </h3>
                <ul className="space-y-2 text-stone-600 dark:text-stone-400 font-bold">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need1")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need2")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need3")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need4")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <strong>{t("need5")}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Day at Saved Souls */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("yourDay")}
              <CalendarClock className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{t("morning")}</p>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("morningText")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{t("afternoon")}</p>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("afternoonText")}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-700 max-w-md mx-auto relative">
              <Image
                src="/volunteer-swim-therapy.png"
                alt={t("imgSwimTherapyAlt")}
                width={448}
                height={336}
                className="w-full h-auto object-contain object-top"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>

          {/* Foto vrijwilligers met honden - midden van de pagina */}
          <div className="flex justify-center my-10">
            <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 max-w-2xl w-full aspect-[4/3] relative animate-volunteer-connection">
              <Image
                src="/volunteers-with-dogs.png"
                alt={t("imgVolunteersAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          </div>

          {/* What to Pack */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("whatToPack")}
              <Luggage className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 font-bold">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack3")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack4")}
              </li>
            </ul>
          </div>

          {/* Your Home Away From Home */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("homeTitle")}
              <Home className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4 font-bold">
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("sharedHouse")}</strong> {t("sharedHouseText")}</p>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("bungalows")}</strong> {t("bungalowsText")}</p>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("commonAreas")}</strong> {t("commonAreasText")}</p>
              <div className="pt-2">
                <p className="font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("meals")}</p>
                <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                  <li>• {t("meals1")}</li>
                  <li>• {t("meals2")}</li>
                </ul>
              </div>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("perks")}</strong> {t("perksText")}</p>
            </div>
          </div>

          {/* Ready to Jump In - CTA */}
          <div className="rounded-2xl p-8 md:p-10 bg-stone-100 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center justify-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("readyJump")}
              <Rabbit className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4 mb-8 font-bold">
              <p>
                <a
                  href="mailto:volunteer@savedsouls-foundation.org"
                  className="font-semibold text-stone-800 dark:text-stone-100 hover:underline"
                  style={{ color: ACCENT_GREEN }}
                >
                  {t("emailUs")}
                </a>
              </p>
              <p className="text-stone-600 dark:text-stone-400">
                <a
                  href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: ACCENT_GREEN }}
                >
                  {t("downloadBrochure")}
                </a>
                {" "}{t("brochureSuffix")}
              </p>
            </div>
            <p className="text-lg italic text-stone-600 dark:text-stone-400 mb-6 font-bold">
              {t("quote")}
            </p>
            <p className="text-stone-500 dark:text-stone-500 text-sm font-bold">
              <strong>{t("footer")}</strong><br />
              {t("footerTagline")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link
                href="/#donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tCommon("donate")}
              </Link>
              <a
                href="mailto:volunteer@savedsouls-foundation.org"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("emailButton")}
              </a>
              <a
                href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("downloadButton")}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("contactButton")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
