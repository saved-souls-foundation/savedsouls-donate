"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

function ShareButtons() {
  const t = useTranslations("thankYou");
  const tGetInvolved = useTranslations("getInvolved");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || typeof window === "undefined") return null;

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    `${tGetInvolved("shareTitle")} – ${tGetInvolved("shareText")}`
  );
  const shareLinks = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      label: "Facebook",
      icon: "📘",
      color: "#1877f2",
    },
    {
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      label: "X",
      icon: "𝕏",
      color: "#000",
    },
    {
      href: `https://wa.me/?text=${text}%20${url}`,
      label: "WhatsApp",
      icon: "💬",
      color: "#25d366",
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      label: "LinkedIn",
      icon: "💼",
      color: "#0a66c2",
    },
  ];

  return (
    <div className="text-center mb-16">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
        {t("shareTitle")}
      </h2>
      <p className="text-stone-600 dark:text-stone-400 mb-6">{t("shareSubtitle")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {shareLinks.map(({ href, label, icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: color }}
          >
            <span aria-hidden>{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function RunningHeart({ delay, top, size, duration }: { delay: number; top: string; size: number; duration: number }) {
  return (
    <span
      className="absolute left-0 animate-heart-run-across drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
      style={{
        top,
        fontSize: size,
        opacity: 0.8,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      💚
    </span>
  );
}

export default function ThankYouPage() {
  const t = useTranslations("thankYou");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      {/* Hearts running across the screen - on top with pointer-events-none so they're visible */}
      <div className="pointer-events-none fixed inset-0 z-[15] overflow-visible" aria-hidden>
        <RunningHeart delay={0} top="10%" size={32} duration={10} />
        <RunningHeart delay={1.5} top="28%" size={28} duration={9} />
        <RunningHeart delay={3} top="48%" size={36} duration={11} />
        <RunningHeart delay={0.8} top="68%" size={30} duration={10} />
        <RunningHeart delay={2.2} top="85%" size={34} duration={9} />
        <RunningHeart delay={4} top="18%" size={26} duration={8} />
        <RunningHeart delay={5.5} top="58%" size={32} duration={10} />
        <RunningHeart delay={2.8} top="92%" size={28} duration={9} />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20 overflow-hidden">
        {/* Hero */}
        <header className={`text-center mb-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-6xl md:text-8xl block mb-4 animate-pulse-heart">💚</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ animationDelay: "0.2s" }}>
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Donation celebration illustration */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600">
          <img
            src="/donate-thank-you.png"
            alt="Community support for animal shelter – donations make a difference"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Social share – direct na bedankt */}
        <ShareButtons />

        {/* Thank you cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {["sponsors", "donors", "adopters", "volunteers"].map((key, i) => (
            key === "volunteers" ? (
              <a
                key={key}
                href="https://ideali.st/MWGYTs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50/80 to-emerald-50 dark:from-amber-900/20 dark:via-sky-900/10 dark:to-emerald-900/20 border-2 border-amber-200 dark:border-amber-700/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-600/50 flex flex-col"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <span className="text-4xl block mb-3">{t(`${key}Emoji`)}</span>
                <h2 className="text-xl font-bold mb-2" style={{ color: ACCENT_GREEN }}>{t(key)}</h2>
                <p className="text-stone-600 dark:text-stone-400 mb-4 flex-1">{t(`${key}Text`)}</p>
                <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-stone-700 dark:text-stone-200 bg-white/80 dark:bg-stone-800/80 border border-amber-200 dark:border-amber-700/50">
                  <Image src="/logos/idealist.svg" alt="" width={24} height={24} className="shrink-0" />
                  {t("idealistCta")} →
                </span>
              </a>
            ) : (
              <div
                key={key}
                className="p-6 rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 hover:border-green-300 dark:hover:border-green-800/50"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <span className="text-4xl block mb-3">{t(`${key}Emoji`)}</span>
                <h2 className="text-xl font-bold mb-2" style={{ color: ACCENT_GREEN }}>{t(key)}</h2>
                <p className="text-stone-600 dark:text-stone-400">{t(`${key}Text`)}</p>
              </div>
            )
          ))}
        </div>

        {/* Photo gallery */}
        <section className="mb-16">
          <p className="text-center text-lg font-medium text-stone-600 dark:text-stone-400 mb-6">
            {t("photosCaption")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-stone-600/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex justify-center bg-stone-100 dark:bg-stone-800">
              <img
                src="/thank-you-team.png"
                alt="Saved Souls Foundation team and volunteers with a rescued dog"
                className="w-full max-w-4xl object-contain"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-stone-600/50 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
              <img
                src="/woman-hug-dog.webp"
                alt="Volunteer hugging a rescued dog"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-stone-600/50 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
              <img
                src="/founder-hug.webp"
                alt="Founder Gabriela with a rescued dog"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-stone-600/50 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
              <img
                src="/shelter-care.webp"
                alt="Care at Saved Souls sanctuary"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Founder message */}
        <section className="mb-16">
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-stone-800 dark:to-stone-900 border-2 border-green-200 dark:border-green-900/50 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">🌿</span>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: ACCENT_GREEN }}>{t("founderTitle")}</h2>
                <p className="text-stone-600 dark:text-stone-400 font-medium">{t("founderName")}</p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{t("founderDate")}</p>
              </div>
            </div>
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4 whitespace-pre-line">
                {t("founderMessage")}
              </p>
              <p className="text-stone-600 dark:text-stone-400 italic">— {t("founderName")} 💚</p>
            </div>
          </div>
        </section>

        {/* Donatie Cat Code */}
        <p className="text-center text-sm text-stone-500 dark:text-stone-400 mb-8">
          <a
            href="https://catcode.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
            style={{ color: ACCENT_GREEN }}
          >
            {t("catCodeDonation")}
          </a>
        </p>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("backToHome")} →
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
