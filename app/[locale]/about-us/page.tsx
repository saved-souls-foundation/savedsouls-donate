"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import DonateButton from "@/app/components/DonateButton";
import Footer from "@/app/components/Footer";
import ScrollReveal from "@/app/components/ScrollReveal";

const ACCENT_GREEN = "#2aa348";
const BTN_VOLUNTEER = "#ea580c";
const BTN_INFLUENCERS = "#8b5cf6";

export default function AboutUsPage() {
  const t = useTranslations("aboutUs");
  const tCommon = useTranslations("common");
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" noOverlay>
      <div className="min-h-screen bg-white">
        {/* Hero – full impact */}
        <section className="relative min-h-[70vh] flex flex-col overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/team-dogs.webp" alt="" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-white/70" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-20">
            <div
              className={`text-center transition-all duration-1000 ease-out ${
                heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-stone-600 text-sm md:text-base uppercase tracking-[0.3em] mb-6 font-medium">
                {t("heroSubtitle")}
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-stone-900 mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
                {t("heroTitle")}
              </h1>
              <p className="text-xl md:text-2xl text-stone-700 max-w-2xl mx-auto leading-relaxed">
                {t("heroIntro")}
              </p>
            </div>
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000 delay-500 ${heroLoaded ? "opacity-60" : "opacity-0"}`}>
              <span className="text-stone-600 text-sm">Scroll</span>
              <div className="w-6 h-10 rounded-full border-2 border-stone-500 flex justify-center pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Intro block */}
        <section className="px-4 py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed text-center">
                {t("intro1")}
              </p>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed text-center mt-6">
                {t("intro2")}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link href="/adopt" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>{tCommon("adopt")}</Link>
                <DonateButton size="sm">{tCommon("donate")}</DonateButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Care – daily meals & swimming therapy */}
        <section className="px-4 py-16 md:py-24 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("careTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("care1")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("care2")}</p>
              <blockquote className="relative pl-6 md:pl-8 border-l-4 border-amber-500 my-8">
                <p className="text-xl md:text-2xl text-stone-800 italic leading-relaxed">{t("careQuote")}</p>
              </blockquote>
              <div className="flex flex-wrap justify-center gap-3">
                <DonateButton size="sm">{tCommon("donate")}</DonateButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Video – sanctuary */}
        <section className="px-4 py-16 md:py-24 bg-white border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("videoTitle")}
              </h2>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-stone-200" style={{ paddingBottom: "56.25%" }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/sanctuary.mp4"
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  title={t("videoAlt")}
                >
                  Your browser does not support video. <a href="/sanctuary.mp4">Download the video</a>.
                </video>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Team photo + text */}
        <section className="px-4 py-16 md:py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal delay={100}>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("teamTitle")}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                  <Image src="/team-dogs.webp" alt={t("photoTeam")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-stone-700 leading-relaxed mb-4">{t("team1")}</p>
                  <p className="text-stone-700 leading-relaxed mb-6">{t("team2")}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/volunteer" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_VOLUNTEER }}>{tCommon("volunteer")}</Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Wheelchair dogs – photo + text */}
        <section id="wheelchair" className="px-4 py-16 md:py-24 bg-white scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6" style={{ color: ACCENT_GREEN }}>
                    {t("wheelchairTitle")}
                  </h2>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("wheelchair1")}</p>
                  <p className="text-stone-700 leading-relaxed mb-6">{t("wheelchair2")}</p>
                  <div className="flex flex-wrap gap-3">
                    <DonateButton size="sm">{tCommon("donate")}</DonateButton>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image src="/woman-dog-wheelchair.webp" alt={t("photoWheelchair")} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image src="/dog-wheelchair-small.webp" alt={t("photoWheelchairSmall")} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Love – every animal deserves */}
        <section className="px-4 py-16 md:py-24 bg-stone-50 border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("loveTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("love1")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("love2")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/adopt" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>{tCommon("adopt")}</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Sterilization & health */}
        <section className="px-4 py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("sterilizationTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("sterilization1")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("sterilization2")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <DonateButton size="sm">{tCommon("donate")}</DonateButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Adoption */}
        <section className="px-4 py-16 md:py-24 bg-stone-50 border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("adoptionTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">{t("adoption1")}</p>
              <p className="text-stone-700 leading-relaxed mb-4">{t("adoption2")}</p>
              <p className="text-stone-700 leading-relaxed mb-4">{t("adoption3")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("adoption4")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/adopt" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>{tCommon("adopt")}</Link>
                <Link href="/influencers" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_INFLUENCERS }}>{tCommon("influencers")}</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Visit us – contact info */}
        <section className="px-4 py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-sm font-medium mb-8">
                📍 {t("visitTitle")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8" style={{ color: ACCENT_GREEN }}>
                {t("visitTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("visit1")}</p>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("visit2")}{" "}
                <a href="mailto:info@savedsouls-foundation.org" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
                  info@savedsouls-foundation.org
                </a>{" "}
                {t("visit3")}
              </p>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("visit4")}{" "}
                <a href="tel:+66623698246" className="font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded">
                  +66 62 369 8246
                </a>{" "}
                {t("visit5")}{" "}
                <a href="tel:+980005406" className="font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded">
                  +98 000 5406
                </a>{" "}
                {t("visit6")}
              </p>
              <p className="text-stone-700 leading-relaxed mb-4">{t("visit7")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("visit8")}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/adopt" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>{tCommon("adopt")}</Link>
                <Link href="/volunteer" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_VOLUNTEER }}>{tCommon("volunteer")}</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
