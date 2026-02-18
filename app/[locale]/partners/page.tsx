"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Footer from "../../components/Footer";
import ParallaxPage from "../../components/ParallaxPage";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";
const PINK = "#ec4899";
const ROSE = "#f472b6";
const SOFT_PINK = "#fce7f3";

const PARTNERS = [
  { name: "TVAV", key: "tvav", url: "https://tvav.ch", logo: "/partners/tvav.png" },
  { name: "K9Aid", key: "k9aid", url: "https://k9aid.org", logo: "/partners/k9aid.png" },
  { name: "Project Street Dogs Thailand", key: "streetdogsthailand", url: "https://streetdogsthailand.com", logo: "/partners/streetdogsthailand.png" },
  { name: "GiftHoney", key: "gifthoney", url: "https://gifthoney.co", logo: "/partners/gifthoney.png" },
];

function PartnerCard({
  partner,
  index,
  fullName,
  description,
  visitWebsite,
}: {
  partner: (typeof PARTNERS)[0];
  index: number;
  fullName: string;
  description: string;
  visitWebsite: string;
}) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block partner-card"
      style={{ ["--card-i" as string]: index }}
    >
      <article className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-rose-200/50 dark:border-rose-900/30 shadow-xl hover:shadow-2xl hover:border-rose-300 dark:hover:border-rose-800/50 transition-all duration-500 p-8 md:p-10">
        <div className="relative flex flex-col items-center text-center">
          <div className="relative w-48 h-48 mb-6">
            <div className="partner-logo-hearts absolute inset-0 flex items-center justify-center">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-40 h-40 object-contain z-10 transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden text-4xl font-bold text-stone-600 dark:text-stone-400">
                {partner.name}
              </span>
            </div>
            <div className="hearts-burst absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden>
              {[
                { x: 0, y: -1 }, { x: 0.5, y: -0.87 }, { x: 0.87, y: -0.5 }, { x: 1, y: 0 },
                { x: 0.87, y: 0.5 }, { x: 0.5, y: 0.87 }, { x: 0, y: 1 }, { x: -0.5, y: 0.87 },
                { x: -0.87, y: 0.5 }, { x: -1, y: 0 }, { x: -0.87, y: -0.5 }, { x: -0.5, y: -0.87 },
              ].map((pos, i) => (
                <span
                  key={i}
                  className="heart-dot absolute text-xl md:text-2xl"
                  style={{
                    ["--hx" as string]: pos.x,
                    ["--hy" as string]: pos.y,
                    ["--hi" as string]: i,
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1" style={{ color: PINK }}>
            {fullName}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-md">
            {description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 group-hover:gap-3 transition-all">
            {visitWebsite}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </article>
    </a>
  );
}

export default function PartnersPage() {
  const t = useTranslations("partners");
  const tCommon = useTranslations("common");
  const ctaRef = useRef<HTMLElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setCtaVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp" speed={0.2}>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
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

      <main className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl animate-pulse">❤️</span>
            <span className="text-4xl animate-pulse" style={{ animationDelay: "0.2s" }}>🤝</span>
            <span className="text-4xl animate-pulse" style={{ animationDelay: "0.4s" }}>❤️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: PINK }}>
            {t("joinUs")}
          </p>
          <p className="text-lg text-stone-500 dark:text-stone-400 font-medium">
            {t("tagline")}
          </p>
        </header>

        {/* Partners */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center" style={{ color: PINK }}>
            {t("ourPartnersTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {PARTNERS.map((partner, index) => (
              <PartnerCard
                key={partner.name}
                partner={partner}
                index={index}
                fullName={t(`${partner.key}.fullName`)}
                description={t(`${partner.key}.description`)}
                visitWebsite={t("visitWebsite")}
              />
            ))}
          </div>
        </section>

        {/* Tekst in placeholders met symbolen */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center" style={{ color: PINK }}>
            {t("whatWeOffer")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { emoji: "📢", emoji2: "✨", key: "subtitle", gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30", isIntro: true, span: "sm:col-span-2 lg:col-span-3" },
              { emoji: "🏆", emoji2: "📍", key: "benefit1", teaserKey: "benefit1Teaser", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30", span: "" },
              { emoji: "🌳", emoji2: "🛣️", key: "benefit2", teaserKey: "benefit2Teaser", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30", span: "" },
              { emoji: "📱", emoji2: "🚀", key: "benefit3", teaserKey: "benefit3Teaser", gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30", span: "" },
              { emoji: "🎬", emoji2: "📹", key: "benefit4", teaserKey: "benefit4Teaser", gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30", span: "" },
              { emoji: "🚪", emoji2: "✨", key: "benefit5", teaserKey: "benefit5Teaser", gradient: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30", span: "" },
            ].map((item, i) => (
              <div
                key={item.key}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} border-2 border-stone-200/80 dark:border-stone-600/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group benefit-card ${item.span || ""}`}
                style={{ ["--card-i" as string]: i }}
              >
                <div className="p-4 pb-2 flex items-center justify-center gap-2 bg-white/40 dark:bg-black/10">
                  <span className="text-3xl md:text-4xl transition-transform group-hover:scale-110">{item.emoji}</span>
                  <span className="text-xl md:text-2xl opacity-80">{item.emoji2}</span>
                </div>
                <div className="p-4 pt-2">
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-1">
                    {item.isIntro ? t("tagline") : t(item.key)}
                  </h3>
                  <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                    {item.isIntro ? t("subtitle") : t(item.teaserKey!)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-stone-600 dark:text-stone-400 font-semibold">
            {t("contactPrompt")}{" "}
            <Link href="/contact" className="underline hover:no-underline" style={{ color: PINK }}>
              {t("contactLink")}
            </Link>
          </p>
        </section>

        <section
          ref={ctaRef}
          className={`mt-20 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-rose-100/80 to-pink-100/60 dark:from-rose-950/40 dark:to-pink-950/30 border-2 border-rose-300/60 dark:border-rose-800/50 shadow-xl partner-cta ${ctaVisible ? "partner-cta-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🐾</span>
            <span className="text-3xl">❤️</span>
            <span className="text-3xl">🤝</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: PINK }}>
            {t("becomePartnerTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto mb-8 text-lg font-medium">
            {t("becomePartnerText")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            style={{ backgroundColor: PINK }}
          >
            {t("becomePartnerButton")}
          </Link>
        </section>
      </main>

      <style jsx>{`
        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .partner-card {
          animation: card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
          animation-delay: calc(var(--card-i) * 0.2s);
        }

        .benefit-card {
          animation: card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
          animation-delay: calc(0.4s + var(--card-i) * 0.1s);
        }

        @keyframes cta-enter {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .partner-cta {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1),
            transform 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .partner-cta.partner-cta-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        @keyframes hearts-explode {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.2);
          }
          20% {
            opacity: 1;
            transform: translate(calc(var(--hx) * 50px), calc(var(--hy) * 50px)) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(calc(var(--hx) * 70px), calc(var(--hy) * 70px)) scale(1.1);
          }
          80% {
            opacity: 0.8;
            transform: translate(calc(var(--hx) * 20px), calc(var(--hy) * 20px)) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) scale(0.2);
          }
        }

        .hearts-burst .heart-dot {
          animation: hearts-explode 5s ease-in-out infinite;
          animation-delay: calc(var(--hi) * 0.12s);
          left: 50%;
          top: 50%;
          margin-left: -12px;
          margin-top: -12px;
        }

        .partner-logo-hearts {
          animation: logo-breathe 5s ease-in-out infinite;
        }

        @keyframes logo-breathe {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          25% {
            opacity: 0.6;
            transform: scale(0.88);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.82);
          }
          75% {
            opacity: 0.7;
            transform: scale(0.92);
          }
        }
      `}</style>

      <Footer />
    </ParallaxPage>
  );
}
