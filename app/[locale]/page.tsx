"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, ChevronDown } from "lucide-react";
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";
import HeroFadeIn from "../components/HeroFadeIn";
import SiteHeader from "../components/SiteHeader";
import TrustStatsBar from "../components/TrustStatsBar";
import NewsletterSignup from "@/components/NewsletterSignup";
import OurWorkSection from "@/app/components/OurWorkSection";
import NewsletterHero from "@/app/components/NewsletterHero";
import NewsletterFormDark from "@/app/components/NewsletterFormDark";
import dynamic from "next/dynamic";
import { showSponsor } from "@/lib/features";
import TurnstileWidget from "../components/TurnstileWidget";

const SpotlightSection = dynamic(() => import("../components/SpotlightSection"), {
  ssr: false,
  loading: () => <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 min-h-[120px]" aria-hidden />,
});

const ACCENT_GREEN = "#2aa348";
const BTN_DONATE = "#7B1010";
const BUTTON_ORANGE = "#2aa348";
const BTN_VOLUNTEER = "#1a5c2e";

/** YouTube video IDs */
const YOUTUBE_VIDEO_ID = "2vNi6Aa3_Gg";
const YOUTUBE_VIDEO_ID_2 = "l7qYY1c_n3M";

const THEME_KEY = "savedsouls-theme";

const HOME_AI_TITLE: Record<string, string> = {
  nl: "Welk dier past bij jou?",
  en: "Which animal is right for you?",
  de: "Welches Tier passt zu dir?",
  ru: "Какое животное подходит вам?",
  es: "¿Qué animal es el adecuado para ti?",
  th: "สัตว์เลี้ยงตัวไหนเหมาะกับคุณ?",
  fr: "Quel animal vous correspond?",
};
const HOME_AI_PLACEHOLDER: Record<string, string> = {
  nl: "bijv. rustige kat, of energieke hond voor gezin...",
  en: "e.g. calm cat, or energetic dog for a family...",
  de: "z.B. ruhige Katze oder energischer Hund...",
  ru: "напр. спокойная кошка или активная собака...",
  es: "p.ej. gato tranquilo o perro enérgico...",
  th: "เช่น แมวเงียบ หรือสุนัขซนสำหรับครอบครัว...",
  fr: "ex. chat calme ou chien énergique...",
};
const HOME_AI_VIEW_ALL: Record<string, string> = {
  nl: "Bekijk alle dieren →",
  en: "View all animals →",
  de: "Alle Tiere ansehen →",
  ru: "Смотреть всех животных →",
  es: "Ver todos los animales →",
  th: "ดูสัตว์ทั้งหมด →",
  fr: "Voir tous les animaux →",
};
const FALLBACK_ANIMAL_IMAGE = "/animals/dog-328.jpg";

/** Light between 6:00 and 20:00, dark otherwise */
function getThemeFromTime(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const hour = new Date().getHours();
  return hour >= 6 && hour < 20 ? "light" : "dark";
}

export default function DonatePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [useAutoTheme, setUseAutoTheme] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const miraclesRef = useRef<HTMLElement>(null);
  const [showOwnVideo, setShowOwnVideo] = useState(false);

  const [aiQuery, setAiQuery] = useState("");
  const [aiMatches, setAiMatches] = useState<{ id: string; reason: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [allAnimals, setAllAnimals] = useState<{ id: string; type: string; name?: string; story?: string; image?: string }[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    fetch("/api/animals")
      .then((r) => r.json())
      .then((data) => {
        const list = data?.all ?? [];
        const withType = Array.isArray(list)
          ? list.map((a: { id: string; type?: string; name?: string; story?: string; image?: string }) => ({
              ...a,
              type: a.type ?? "dog",
            }))
          : [];
        if (withType.length === 0 && (data?.dogs || data?.cats)) {
          const dogs = (data.dogs || []).map((d: { id: string; name?: string; story?: string; image?: string }) => ({ ...d, type: "dog" }));
          const cats = (data.cats || []).map((c: { id: string; name?: string; story?: string; image?: string }) => ({ ...c, type: "cat" }));
          setAllAnimals([...dogs, ...cats]);
        } else {
          setAllAnimals(withType);
        }
      })
      .catch(() => {});
  }, []);

  function aiSearch() {
    const q = aiQuery.trim();
    if (!q) {
      setAiMatches([]);
      return;
    }
    setAiLoading(true);
    const animalsPayload = allAnimals.slice(0, 80).map((a) => ({
      id: `${a.type}-${a.id}`,
      name: a.name ?? "",
      story: a.story ?? "",
    }));
    fetch("/api/animal-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animals: animalsPayload,
        query: q,
        locale,
        turnstileToken,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setAiMatches((data.matches ?? []).slice(0, 4));
      })
      .catch(() => setAiMatches([]))
      .finally(() => setAiLoading(false));
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      setUseAutoTheme(false);
    } else {
      setTheme(getThemeFromTime());
      setUseAutoTheme(true);
    }
  }, []);

  useEffect(() => {
    if (!useAutoTheme) return;
    const interval = setInterval(() => setTheme(getThemeFromTime()), 60_000);
    return () => clearInterval(interval);
  }, [useAutoTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (!useAutoTheme) localStorage.setItem(THEME_KEY, theme);
  }, [theme, useAutoTheme]);

  const t = useTranslations("common");
  const tHome = useTranslations("home");
  const locale = useLocale();

  return (
    <div className={`h-screen text-stone-800 dark:text-stone-200 relative overflow-hidden ${theme}`}>
      {/* Statische achtergrond – geen parallax (fixes iOS Safari, betere performance) */}
      <div
        className="fixed inset-0 z-0 bg-stone-200 dark:bg-stone-900 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: "url('/savedsoul-logo-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-[1] bg-white/85 dark:bg-stone-950/90 pointer-events-none" />

      <div
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto overscroll-contain"
      >
      <SiteHeader
        scrollToSection={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
        scrollY={scrollY}
      />

      {/* Hero – static fullscreen, desktop AND mobile, scroll-triggered fade-in */}
      <header>
        <HeroFadeIn className="relative flex min-h-[100svh] md:min-h-[100vh] flex-col items-center justify-end pb-24 text-center px-6">
          {/* Hero: <picture> zodat browser alleen 1 afbeelding laadt (mobiel 57KB, desktop 170KB) – geen dubbele request */}
          <div className="absolute inset-0">
            <picture>
              <source media="(max-width: 767px)" srcSet="/woman-dog-wheelchair-mobile.webp" />
              <source media="(min-width: 768px)" srcSet="/woman-dog-wheelchair.webp" />
              <img
                src="/woman-dog-wheelchair-mobile.webp"
                alt="Volunteer with wheelchair dog at Saved Souls Foundation sanctuary in Khon Kaen, Thailand"
                className="absolute inset-0 w-full h-full object-cover object-[60%_center] md:object-center"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/65"
            aria-hidden
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="hero-animate-location text-sm font-semibold text-white/90 mb-4">
              {tHome("location")}
            </p>
            <h1 className="hero-animate-headline font-bold italic text-white leading-tight mb-6 max-w-2xl mx-auto" style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
              {tHome("headline")}
            </h1>
            <p className="hero-animate-subtitle text-base md:text-lg lg:text-xl text-white/90 font-medium max-w-[600px] mx-auto text-center mb-8 leading-relaxed">
              {tHome("heroSubtitle")}
            </p>
            <div className="hero-animate-ctas flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`/${locale}/donate`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-[1.02] text-white shadow-lg hover:opacity-95"
                style={{ backgroundColor: "#7B1010" }}
              >
                <Heart className="w-5 h-5 shrink-0 fill-white stroke-white" aria-hidden />
                {t("donate")}
              </a>
            </div>
          </div>
          <a
            href="#hero-photos"
            className="hero-animate-scroll absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors md:bottom-8"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />
          </a>
        </HeroFadeIn>

        {/* Photo strip – below hero */}
        <div id="hero-photos" className="relative grid grid-cols-4 gap-1 h-[160px] md:h-[200px] w-full">
          {[
            { src: "/team-dogs.webp", alt: "Saved Souls team at the sanctuary" },
            { src: "/team-thankyou.webp", alt: "Team at the entrance of Saved Souls Foundation" },
            { src: "/volunteers-with-dogs.png", alt: "Volunteers with rescued dogs" },
            { src: "/woman-dog-wheelchair.webp", alt: "Dog with wheelchair at Saved Souls" },
          ].map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="25vw"
                loading="lazy"
              />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" aria-hidden />
        </div>
      </header>

      {/* AI-dieren-zoeksectie */}
      <section className="py-10 md:py-14 bg-amber-50/80 dark:bg-stone-900/50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4 text-center">
            {HOME_AI_TITLE[locale] ?? HOME_AI_TITLE.en}
          </h2>
          <div className="flex flex-wrap items-end gap-3 mb-3">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder={HOME_AI_PLACEHOLDER[locale] ?? HOME_AI_PLACEHOLDER.en}
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm placeholder:text-stone-400"
              aria-label="Search animals"
            />
            <button
              type="button"
              onClick={aiSearch}
              disabled={aiLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              Search
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <TurnstileWidget size="compact" onVerify={(token) => setTurnstileToken(token)} />
          </div>
          {aiLoading && (
            <p className="text-center text-sm text-stone-500 dark:text-stone-400 mb-4">Loading...</p>
          )}
          {aiMatches.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {aiMatches.map((match) => {
                const animal = allAnimals.find((a) => `${a.type}-${a.id}` === match.id);
                if (!animal) return null;
                const href = animal.type === "dog" ? `/adopt/dog/${animal.id}` : `/adopt/cat/${animal.id}`;
                const imgSrc = animal.image || FALLBACK_ANIMAL_IMAGE;
                return (
                  <Link
                    key={match.id}
                    href={href}
                    className="group block rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={animal.name ? `${animal.name} – Saved Souls` : "Animal"}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 240px"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          if (!t.dataset.fallback) {
                            t.dataset.fallback = "1";
                            t.src = FALLBACK_ANIMAL_IMAGE;
                          }
                        }}
                      />
                      {match.reason && (
                        <div className="absolute bottom-0 left-0 max-w-[85%] bg-emerald-900/80 text-white text-xs px-3 py-1.5 rounded-br-xl rounded-tl-none line-clamp-2 overflow-hidden">
                          {match.reason}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm truncate">
                        {animal.name ?? ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <div className="text-right">
            <Link
              href="/adopt"
              className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            >
              {HOME_AI_VIEW_ALL[locale] ?? HOME_AI_VIEW_ALL.en}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / stats bar – below hero */}
      <TrustStatsBar />

      {/* Spotlight deze week – boven eerste alinea */}
      <SpotlightSection />

      <OurWorkSection />

      {/* Intro – below hero (both mobile and desktop) */}
      <div className="max-w-2xl mx-auto px-4 pb-10 md:pt-4">
        <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg text-center leading-relaxed">
          {tHome("intro1")}
        </p>
      </div>

      {/* Content sections – headline + text + one CTA per section */}
      <section className="py-10 md:py-16 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full md:w-80 lg:w-96 relative aspect-square">
              <Image
                src="/woman-dog-wheelchair.webp"
                alt="Saved Souls Foundation caring for a rescued dog at our shelter in Khon Kaen"
                fill
                className="rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 384px"
                loading="lazy"
                style={{ filter: "brightness(1.1) contrast(1.03)" }}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                {tHome("findOutMoreTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                {tHome("findOutMoreText")}
              </p>
              <Link
                href="/find-out-more"
                className="inline-block text-green-700 dark:text-green-500 font-semibold hover:underline"
              >
                {tHome("findOutMoreCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do – animated cards met scroll-vervaging */}
      <section
        ref={miraclesRef}
        id="about"
        className="py-10 md:py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-stone-50/95 dark:bg-stone-800/95" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-4">
            {tHome("miraclesTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-12 max-w-2xl mx-auto">
            {tHome("miraclesText")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { title: tHome("miraclesCard1Title"), desc: tHome("miraclesCard1Desc"), img: "/woman-dog-wheelchair.webp", href: "/about-us#wheelchair", cta: tHome("miraclesCard1Cta") },
              { title: tHome("miraclesCard2Title"), desc: tHome("miraclesCard2Desc"), img: "/dog-sand-happy.webp", href: "/dog-meat-survivors", cta: tHome("miraclesCard2Cta") },
              { title: tHome("miraclesCard3Title"), desc: tHome("miraclesCard3Desc"), img: "/dog-white-brown-resting.webp", href: "/adopt", cta: tHome("miraclesCard3Cta") },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group relative block rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-600/80 shadow-xl min-h-[280px] transition-shadow duration-300 hover:shadow-2xl hover:border-stone-300 dark:hover:border-stone-500 cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.img})`,
                    filter: "brightness(1.1) contrast(1.03)",
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                />
                <div className="relative z-10 p-6 flex flex-col justify-end min-h-[280px]">
                  <h3 className="text-lg font-bold mb-2 drop-shadow-sm" style={{ color: "#7ed99a" }}>{item.title}</h3>
                  <p className="text-white/85 text-base leading-relaxed drop-shadow-sm">{item.desc}</p>
                  <p className="mt-2 text-sm font-medium" style={{ color: "#7ed99a" }}>{item.cta}</p>
                </div>
              </Link>
            ))}
          </div>
          {showSponsor && (
            <div className="text-center mt-8">
              <Link
                href="/sponsor"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {tHome("miraclesSponsorCta")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sponsor Hero – verborgen zolang geen betaalplatform */}
      {showSponsor && (
        <section id="sponsor" className="py-10 md:py-16 bg-white/95 dark:bg-stone-900/95">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              {tHome("sponsorTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
              {tHome("sponsorText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sponsor"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tHome("sponsorDog")}
              </Link>
              <Link
                href="/donate"
                className="px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {tHome("donateMonthly")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Volunteer Hero – grote gele geanimeerde knop */}
      <section id="volunteer" className="py-10 md:py-16 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {tHome("volunteerTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
            {tHome("volunteerText")}
          </p>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse-green hover:scale-105 transition-transform text-lg"
            style={{ backgroundColor: BTN_VOLUNTEER }}
          >
            <span className="text-xl" aria-hidden>🌟</span>
            {tHome("volunteerCta")}
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section style={{ background: "#0f2614" }} className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div style={{ color: "#7ed99a", fontSize: "48px", lineHeight: 1, marginBottom: "1rem", fontFamily: "serif" }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl font-serif italic" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
            {tHome("quote")}
          </blockquote>
          <div style={{ width: "40px", height: "2px", background: "#2aa348", margin: "1.5rem auto 0" }} />
        </div>
      </section>

      {/* Video 2 – A Sanctuary in the Heart of Isaan */}
      {YOUTUBE_VIDEO_ID_2 && (
        <section className="py-10 md:py-16 bg-white/95 dark:bg-stone-900/95">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-4">
              {tHome("video2Title")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
              {tHome("video2Text")}
            </p>
            <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 shadow-lg" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID_2}?rel=0`}
                title="Saved Souls Foundation – A Sanctuary in the Heart of Isaan"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Video 1 – YouTube (own video, show more) */}
      {YOUTUBE_VIDEO_ID && (
        <section className="py-10 md:py-16 bg-stone-50/90 dark:bg-stone-800/90">
          <div className="max-w-4xl mx-auto px-4">
            {!showOwnVideo ? (
              <div className="text-center">
                <button
                  onClick={() => setShowOwnVideo(true)}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                      <polygon points="5,2 14,8 5,14" />
                    </svg>
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-stone-800 dark:text-stone-100">
                      {tHome("showOwnVideoLabel")}
                    </span>
                    <span className="block text-xs text-stone-500 dark:text-stone-400">
                      YouTube · Saved Souls Foundation
                    </span>
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2 text-stone-400">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-8">
                  {tHome("video1Title")}
                </h2>
                <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 shadow-lg" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
                    title="Saved Souls Foundation – YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section style={{ background: "#0f2614" }}>
        <NewsletterHero />
        <NewsletterFormDark />
      </section>

      <div className="pb-[env(safe-area-inset-bottom,0)]">
        <Footer />
      </div>
      <CookieConsent />
      </div>
    </div>
  );
}
