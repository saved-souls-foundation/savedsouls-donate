"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import IdealDonate from "../../components/IdealDonate";
import HeroPolaroidCarousel from "../../components/HeroPolaroidCarousel";

const ACCENT_GREEN = "#2aa348";
const HERO_GREEN = "#2aa348";
const DARK_GREEN = "#1a6b2e";
const CORAL = "#E67A4C";
const AMBER = "#f59e0b";
const TEAL = "#0d9488";

const IMPACT_CARDS_EUR = [
  { amount: "€25", paypalAmount: 25, color: TEAL, emoji: "🍽️" },
  { amount: "€50", paypalAmount: 50, color: ACCENT_GREEN, emoji: "🐾" },
  { amount: "€100", paypalAmount: 100, color: CORAL, emoji: "🦽" },
  { amount: "€250", paypalAmount: 250, color: AMBER, emoji: "🏥" },
];
const IMPACT_CARDS_THB = [
  { amount: "฿1,000", paypalAmount: 1000, color: TEAL, emoji: "🍽️" },
  { amount: "฿2,000", paypalAmount: 2000, color: ACCENT_GREEN, emoji: "🐾" },
  { amount: "฿4,000", paypalAmount: 4000, color: CORAL, emoji: "🦽" },
  { amount: "฿10,000", paypalAmount: 10000, color: AMBER, emoji: "🏥" },
];

export default function SoulSaverPage() {
  const t = useTranslations("soulSaver");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const isThai = locale === "th";
  const impactCards = isThai ? IMPACT_CARDS_THB : IMPACT_CARDS_EUR;

  return (
    <ParallaxPage
      backgroundImage="/savedsoul-logo-bg.webp"
      overlayClassName="bg-gradient-to-b from-amber-50/85 via-orange-50/70 to-stone-50/90 dark:from-amber-950/50 dark:via-stone-900/80 dark:to-stone-950/90"
    >
      {/* Hero banner – groen met tekst en polaroid foto */}
      <section
        className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 px-6 md:px-12 lg:px-16 py-12 md:py-16"
        style={{ backgroundColor: HERO_GREEN }}
      >
        <div className="flex-1 text-white text-center md:text-left order-2 md:order-1">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic mb-2 md:mb-3">
            {tHome("findOutMoreHeroTagline")}
          </p>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide opacity-90 mb-4 md:mb-6" style={{ color: "rgba(255,255,255,0.95)" }}>
            SAVED SOULS FOUNDATION
          </h1>
          <p className="font-serif text-lg md:text-xl lg:text-2xl italic mb-6 md:mb-8">
            {tHome("findOutMoreHeroCta")}
          </p>
          <div
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: DARK_GREEN }}
          >
            {tHome("findOutMoreHeroLocation")}
          </div>
        </div>
        <HeroPolaroidCarousel />
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero – vrolijk en pakkend */}
        <header className="text-center mb-14 md:mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
              color: "white",
            }}
          >
            <span className="text-xl">♥</span>
            {t("badge")}
            <span className="text-xl">♥</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-stone-800 dark:text-stone-100 mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* Impact cards – kleurrijk en concreet */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-10">
            {t("impactTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {impactCards.map((card, i) => {
              const textKey = ["impact25", "impact50", "impact100", "impact250"][i];
              return (
                <a
                  key={i}
                  href={`https://paypal.me/savedsoulsfoundation/${card.paypalAmount}${isThai ? "?currencyCode=THB" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl p-6 border-2 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  style={{
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}40`,
                  }}
                >
                  <span className="text-3xl mb-2 block">{card.emoji}</span>
                  <p className="text-2xl font-black mb-1" style={{ color: card.color }}>
                    {card.amount}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400 font-medium">{t(textKey)}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Emotionele tekst */}
        <section
          className="mb-16 rounded-2xl p-8 md:p-12 text-center"
          style={{
            background: `linear-gradient(135deg, ${ACCENT_GREEN}12, ${TEAL}10)`,
            border: `2px solid ${ACCENT_GREEN}30`,
          }}
        >
          <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
            {t("story")}
          </p>
          <p className="text-xl font-bold" style={{ color: ACCENT_GREEN }}>
            {t("ctaLine")}
          </p>
        </section>

        {/* Donatie sectie */}
        <section className="mb-16">
          <div className="rounded-3xl p-8 md:p-12 shadow-2xl border-2 overflow-hidden" style={{ borderColor: CORAL, backgroundColor: "rgba(255,255,255,0.98)" }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-2">
              {t("donateTitle")}
            </h2>
            <p className="text-center text-stone-600 dark:text-stone-400 mb-8">
              {t("donateSubtitle")}
            </p>
            <div className="max-w-md mx-auto mb-8">
              <IdealDonate />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${CORAL}, #d96a3d)`,
                  boxShadow: `0 4px 20px ${CORAL}50`,
                }}
              >
                {t("moreWays")}
              </Link>
              <a
                href="https://paypal.me/savedsoulsfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("paypalDirect")}
              </a>
            </div>
          </div>
        </section>

        {/* Afbeelding + laatste CTA */}
        <section className="text-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] max-h-[320px] w-full max-w-2xl mx-auto mb-8">
            <Image
              src="/dog-grass-walking.webp"
              alt={t("imgAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-lg font-bold drop-shadow-lg">{t("imgCaption")}</p>
            </div>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_GREEN}, #1e7a38)`,
              boxShadow: `0 8px 30px ${ACCENT_GREEN}50`,
            }}
          >
            <span>♥</span>
            {t("finalCta")}
            <span>♥</span>
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
