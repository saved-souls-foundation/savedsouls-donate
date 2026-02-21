"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_BLUE = "#2563eb";
const BUTTON_BLUE = "#2563eb";

export default function CarActionPage() {
  const t = useTranslations("carAction");

  const handleDonate = () => {
    window.open("https://paypal.me/savedsoulsfoundation", "_blank");
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Afbeelding 1 */}
        <section className="mb-14 md:mb-16">
          <Link href="/#donate" className="block relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] max-h-[400px] w-full max-w-3xl mx-auto group cursor-pointer">
            <Image
              src="/volunteers-with-dogs.png"
              alt={t("img1Alt")}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
          </Link>
        </section>

        {/* Hero */}
        <header className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-600 mb-6 text-sm font-semibold text-blue-800 dark:text-blue-200">
            🚗 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </header>

        {/* Doel box */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-600 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_BLUE }}>
                {t("goalTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400">{t("goalSubtitle")}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-black" style={{ color: ACCENT_BLUE }}>€5.500</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">{t("euros")}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black" style={{ color: ACCENT_BLUE }}>฿220.000</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">{t("baht")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Waarom */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: ACCENT_BLUE }}>
            {t("whyTitle")}
          </h2>
          <div className="space-y-6 text-stone-600 dark:text-stone-400 text-lg leading-relaxed">
            <p>{t("why1")}</p>
            <p>{t("why2")}</p>
            <p className="text-stone-700 dark:text-stone-300 font-medium">{t("why3")}</p>
          </div>
        </section>

        {/* Afbeelding 2 */}
        <section className="mb-16">
          <Link href="/#donate" className="block relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] max-h-[400px] w-full max-w-3xl mx-auto group cursor-pointer">
            <Image
              src="/team-dogs.webp"
              alt={t("img2Alt")}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
          </Link>
        </section>

        {/* Droom */}
        <section className="mb-16 rounded-2xl p-8 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_BLUE }}>
            {t("dreamTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed mb-6">
            {t("dreamText")}
          </p>
          <p className="text-xl font-semibold text-stone-800 dark:text-stone-200">
            {t("dreamCta")}
          </p>
        </section>

        {/* Afbeelding 3 */}
        <section className="mb-16">
          <Link href="/#donate" className="block relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] w-full max-w-2xl mx-auto group cursor-pointer">
            <Image
              src="/team-thankyou.png"
              alt={t("img3Alt")}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </Link>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10 md:p-14 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleDonate}
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: BUTTON_BLUE }}
            >
              {t("ctaDonate")}
            </button>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_BLUE, color: ACCENT_BLUE }}
            >
              {t("ctaMoreWays")}
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </ParallaxPage>
  );
}
