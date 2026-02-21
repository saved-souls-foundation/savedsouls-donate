"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";

export default function FeedAYearPage() {
  const t = useTranslations("feedAYear");
  const tCommon = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleDonate = () => {
    window.open("https://paypal.me/savedsoulsfoundation/169", "_blank");
  };

  if (!mounted) return null;

  const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp" speed={0.3} noOverlay>
      {/* Witte achtergrond */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-white dark:bg-stone-50" />

      <div className="relative z-10 min-h-screen bg-white dark:bg-stone-50">
        <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-stone-800 dark:text-stone-900" style={{ color: ACCENT_GREEN }}>
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-stone-600 dark:text-stone-600">
              {t("subtitle")}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Feed a Dog */}
            <div className="group relative rounded-3xl overflow-hidden p-8 md:p-10 bg-white dark:bg-stone-100 border-2 border-stone-200 dark:border-stone-300 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-[#2aa348]/50">
              {/* Groene hartjes bij hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="animate-heart-fly-right" style={{ color: ACCENT_GREEN, animationDelay: `${i * 80}ms` }}>
                    <HeartIcon />
                  </span>
                ))}
              </div>
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-400 relative">
                <Image src="/dog-care.webp" alt="" fill className="object-cover" sizes="80px" />
              </div>
              <div className="relative aspect-square max-w-[220px] mx-auto mb-6 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-300 shadow-md">
                <Image src="/dog-care.webp" alt="Hond bij Saved Souls" fill className="object-cover" sizes="220px" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-center mb-2 text-stone-800 dark:text-stone-900" style={{ color: ACCENT_GREEN }}>
                {t("feedDog")}
              </h2>
              <p className="text-center text-stone-600 dark:text-stone-600 mb-4">{t("nutritiousFood")}</p>
              <p className="text-center text-4xl font-black mb-6" style={{ color: ACCENT_GREEN }}>
                €169
              </p>
              <button
                onClick={handleDonate}
                className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("viewGift")}
              </button>
            </div>

            {/* Feed a Cat */}
            <div className="group relative rounded-3xl overflow-hidden p-8 md:p-10 bg-white dark:bg-stone-100 border-2 border-stone-200 dark:border-stone-300 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-[#2aa348]/50">
              {/* Groene hartjes bij hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="animate-heart-fly-right" style={{ color: ACCENT_GREEN, animationDelay: `${i * 80}ms` }}>
                    <HeartIcon />
                  </span>
                ))}
              </div>
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-400 relative">
                <Image src="/cat-feed.png" alt="" fill className="object-cover" sizes="80px" />
              </div>
              <div className="relative aspect-square max-w-[220px] mx-auto mb-6 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-300 shadow-md">
                <Image src="/cat-feed.png" alt="Kat bij Saved Souls" fill className="object-cover" sizes="220px" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-center mb-2 text-stone-800 dark:text-stone-900" style={{ color: ACCENT_GREEN }}>
                {t("feedCat")}
              </h2>
              <p className="text-center text-stone-600 dark:text-stone-600 mb-4">{t("nutritiousFood")}</p>
              <p className="text-center text-4xl font-black mb-6" style={{ color: ACCENT_GREEN }}>
                €169
              </p>
              <button
                onClick={handleDonate}
                className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("viewGift")}
              </button>
            </div>
          </div>

          <p className="text-center mt-12 text-stone-600 dark:text-stone-600 text-sm max-w-xl mx-auto">
            {t("disclaimer")}
          </p>

          {/* Bedankt-sectie met teamfoto */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-300 shadow-lg">
              <Image src="/team-thankyou.png" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 448px" />
            </div>
            <p className="text-3xl md:text-4xl font-black" style={{ color: ACCENT_GREEN }}>
              {t("thankYou")}
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/get-involved"
              className="px-8 py-3 rounded-xl font-bold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("backToGetInvolved")}
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
