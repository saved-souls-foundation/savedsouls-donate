"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import ScrollReveal from "@/app/components/ScrollReveal";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export default function StoryPage() {
  const t = useTranslations("story");
  const tCommon = useTranslations("common");
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp" noOverlay>
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 backdrop-blur-md border-b border-stone-200">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
            Saved Souls
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher compact />
            <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
              ← {tCommon("backToHome")}
            </Link>
          </div>
        </nav>

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
            </ScrollReveal>
          </div>
        </section>

        {/* Photo + The Woman Who Couldn't Stop */}
        <section className="px-4 py-16 md:py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/founder-hug.webp" alt={t("photoGabriela")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6" style={{ color: ACCENT_GREEN }}>
                    {t("womanTitle")}
                  </h2>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("woman1")}</p>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("woman2")}</p>
                  <p className="text-stone-700 leading-relaxed">{t("woman3")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The Sound – emotional */}
        <section className="px-4 py-16 md:py-24 bg-white border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("soundTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("sound1")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("sound2")}</p>
              <blockquote className="relative pl-6 md:pl-8 border-l-4 border-amber-500 my-8">
                <p className="text-xl md:text-2xl text-stone-800 italic leading-relaxed">{t("soundQuote")}</p>
                <cite className="block mt-4 text-stone-600 text-sm not-italic">— Gabriela</cite>
              </blockquote>
              <p className="text-stone-700 leading-relaxed mb-4">{t("sound3")}</p>
              <p className="text-stone-700 leading-relaxed">{t("sound4")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Photo grid – rescue / sanctuary */}
        <section className="px-4 py-16 md:py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/shelter-care.webp" alt={t("photoRescue")} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/team-dogs.webp" alt={t("photoSanctuary")} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* When Trust Has Been Broken */}
        <section className="px-4 py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6" style={{ color: ACCENT_GREEN }}>
                    {t("trustTitle")}
                  </h2>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("trust1")}</p>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("trust2")}</p>
                  <p className="text-stone-700 leading-relaxed mb-4">{t("trust3")}</p>
                  <p className="text-stone-700 leading-relaxed">{t("trust4")}</p>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/woman-dog-wheelchair.webp" alt={t("photoTherapy")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The Bigger Picture */}
        <section className="px-4 py-16 md:py-24 bg-stone-50 border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center" style={{ color: ACCENT_GREEN }}>
                {t("biggerTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("bigger1")}</p>
              <p className="text-stone-700 leading-relaxed">{t("bigger2")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Official Foundation – milestone */}
        <section className="px-4 py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-sm font-medium mb-8">
                📅 {t("officialDate")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6" style={{ color: ACCENT_GREEN }}>
                {t("officialTitle")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-6">{t("official1")}</p>
              <p className="text-stone-700 leading-relaxed">{t("official2")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Why It Matters – closing quote */}
        <section className="px-4 py-20 md:py-32 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="relative aspect-[4/3] w-1/2 max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl mb-12">
                <Image src="/dog-sand-happy.webp" alt="Rescued dog at Saved Souls" fill className="object-cover object-top" sizes="(max-width: 768px) 50vw, 448px" />
              </div>
            </ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <blockquote className="mb-8">
                  <p className="text-2xl md:text-4xl font-bold text-stone-900 leading-relaxed mb-6">
                    &ldquo;{t("whyQuote")}&rdquo;
                  </p>
                  <cite className="text-stone-600">— Gabriela</cite>
                </blockquote>
                <p className="text-lg text-stone-700 leading-relaxed mb-8">{t("why1")}</p>
                <p className="text-xl font-semibold text-stone-900 mb-12">{t("why2")}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* A New Chapter — The Torch is Passed */}
        <section className="px-4 py-20 md:py-28 bg-white border-y border-stone-200">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-sm font-medium mb-8">
                {t("chapterBadge")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8" style={{ color: ACCENT_GREEN }}>
                {t("chapterTitle")}
              </h2>
              <div className="relative aspect-square max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-10">
                <Image src="/gabriela-melanie-saved-souls.png" alt={t("photoGabrielaMelanie")} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 512px" />
              </div>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter1")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter2")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter3")}</p>
              <blockquote className="relative pl-6 md:pl-8 border-l-4 border-amber-500 my-8">
                <p className="text-xl text-stone-800 italic leading-relaxed">{t("chapterQuote")}</p>
                <cite className="block mt-4 text-stone-600 text-sm not-italic">— Gabriela</cite>
              </blockquote>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter4")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter5")}</p>
              <p className="text-stone-700 leading-relaxed mb-6">{t("chapter6")}</p>
              <p className="text-xl font-semibold text-stone-900 mt-10">{t("chapterClosing")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 md:py-24 bg-stone-50 border-t border-stone-200">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-stone-600 text-sm mb-4">{t("ctaEmail")}</p>
              <p className="text-stone-500 text-xs mb-8">© 2026 Saved Souls Foundation — มูลนิธิเซฟต์ โซลส์</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/#donate"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: BUTTON_ORANGE }}
                >
                  {tCommon("donate")}
                </Link>
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
                  style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
                >
                  {tCommon("aboutUs")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
