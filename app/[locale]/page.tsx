"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, ChevronDown } from "lucide-react";
import { AnimatedStat } from "../components/AnimatedStat";
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";
import HeroFadeIn from "../components/HeroFadeIn";
import SiteHeader from "../components/SiteHeader";
import TrustStatsBar from "../components/TrustStatsBar";
import IdealDonate from "../components/IdealDonate";
import BankTransferSection from "../components/BankTransferSection";
import RecentDonations from "../components/RecentDonationsFooter";

const ACCENT_GREEN = "#2aa348";
const BTN_DONATE = "#dc2626";
const BUTTON_ORANGE = "#E67A4C";
const BTN_VOLUNTEER = "#ea580c";

/** YouTube video IDs */
const YOUTUBE_VIDEO_ID = "2vNi6Aa3_Gg";
const YOUTUBE_VIDEO_ID_2 = "l7qYY1c_n3M";

function ContactForm() {
  const tHome = useTranslations("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || tHome("contactError"));
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError(tHome("contactError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 pb-24 md:pb-20 bg-white/95 dark:bg-stone-900/95">
      <div className="max-w-xl mx-auto w-full px-4">
        <h2 className="text-xl font-bold mb-6 text-center dark:text-[#2aa348]" style={{ color: ACCENT_GREEN }}>
          {tHome("contactTitle")}
        </h2>
        {sent ? (
          <div className="text-center py-8 px-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {tHome("contactThanksTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-base">
              {tHome("contactThanksMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {tHome("contactName")}
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={tHome("contactNamePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {tHome("contactEmail")}
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={tHome("contactEmailPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {tHome("contactSubject")}
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={tHome("contactSubjectPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {tHome("contactMessage")}
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348] resize-y"
                placeholder={tHome("contactMessagePlaceholder")}
              />
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {sending ? tHome("contactSending") : tHome("contactSend")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const THEME_KEY = "savedsouls-theme";

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

      {/* Kliniek actie – opvallende geanimeerde button */}
      <Link
        href="/clinic-renovation"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse hover:scale-105 transition-transform"
        style={{ backgroundColor: BUTTON_ORANGE }}
        aria-label={tHome("clinicActionCta")}
      >
        <span className="text-2xl" aria-hidden>⭐</span>
        <span className="text-base md:text-lg">{tHome("clinicActionCta")}</span>
      </Link>

      {/* Hero – static fullscreen, desktop AND mobile, scroll-triggered fade-in */}
      <header>
        <HeroFadeIn className="relative flex min-h-[100svh] md:min-h-[100vh] flex-col items-center justify-center text-center px-6">
          {/* Static background image – no parallax, no fixed attachment */}
          <div className="absolute inset-0">
            <Image
              src="/woman-dog-wheelchair.webp"
              alt="Volunteer with wheelchair dog at Saved Souls Foundation sanctuary in Khon Kaen, Thailand"
              fill
              className="object-cover object-[60%_center] md:object-center"
              sizes="100vw"
              priority
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/65"
            aria-hidden
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="hero-animate-location text-sm font-semibold text-white/90 mb-4">
              {tHome("location")}
            </p>
            <h1 className="hero-animate-headline font-bold text-white leading-tight mb-6" style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
              {tHome("headline")}
            </h1>
            <p className="hero-animate-subtitle text-base md:text-lg lg:text-xl text-white/90 font-medium max-w-[600px] mx-auto text-center mb-8 leading-relaxed">
              {tHome("heroSubtitle")}
            </p>
            <div className="hero-animate-ctas flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base shadow-lg hover:scale-105 transition-all w-full sm:w-auto"
                style={{ backgroundColor: "#E53E3E" }}
              >
                <Heart className="w-5 h-5 shrink-0 fill-white stroke-white" aria-hidden />
                {t("donate")}
              </button>
              <Link
                href="/soul-saver"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-stone-900 transition-all text-center w-full sm:w-auto"
              >
                {tHome("cta")}
              </Link>
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
        <div id="hero-photos" className="grid grid-cols-4 h-[200px] w-full">
          {[
            { src: "/team-dogs.webp", alt: "Saved Souls team at the sanctuary" },
            { src: "/team-thankyou.webp", alt: "Team at the entrance of Saved Souls Foundation" },
            { src: "/volunteers-with-dogs.png", alt: "Volunteers with rescued dogs" },
            { src: "/woman-dog-wheelchair.webp", alt: "Dog with wheelchair at Saved Souls" },
          ].map((img, i) => (
            <div key={i} className="relative overflow-hidden">
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
        </div>
      </header>

      {/* Trust / stats bar – below hero */}
      <TrustStatsBar />

      {/* Intro + 4 action buttons – below hero (both mobile and desktop) */}
      <div className="max-w-2xl mx-auto px-4 pb-10 md:pt-4">
        <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg text-center leading-relaxed mb-6">
          {tHome("intro1")}
        </p>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 text-center mb-4">{tHome("quickLinksTitle")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/adopt" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ACCENT_GREEN }}>
            {t("adopt")}
          </Link>
          <button type="button" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
            <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
            {t("donate")}
          </button>
          <button type="button" onClick={() => document.getElementById("sponsor")?.scrollIntoView({ behavior: "smooth" })} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: "#0891b2" }}>
            {t("sponsor")}
          </button>
          <Link href="/volunteer" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_VOLUNTEER }}>
            {t("volunteer")}
          </Link>
        </div>
        <Link href="/adopt" className="block mt-6 text-center text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
          {tHome("adoptDiversityText")} →
        </Link>
      </div>

      {/* Content sections – headline + text + one CTA per section */}
      <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full md:w-80 lg:w-96 relative aspect-square">
              <Image
                src="/dog-grass-walking.webp"
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
                className="inline-block px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {tHome("findOutMoreCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full max-w-sm mx-auto md:mx-0 md:w-72 lg:w-80 h-[260px] md:h-[280px] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-lg relative">
              <Image
                src="/two-dogs-platform.webp"
                alt="Two rescued dogs at Saved Souls Foundation, bonded by affection"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                loading="lazy"
                style={{ filter: "brightness(1.1) contrast(1.03)" }}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                {tHome("adoptTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                {tHome("adoptText")}
              </p>
              <Link
                href="/adopt-inquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tHome("adoptCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
            <div className="flex-shrink-0 w-full md:w-72 lg:w-80 mx-auto relative aspect-square">
              <Image
                src="/dog-reaching.webp"
                alt="A rescued dog at Saved Souls Foundation waiting for a loving home"
                fill
                className="rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 320px"
                loading="lazy"
                style={{ filter: "brightness(1.1) contrast(1.03)" }}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                {tHome("soulWaitingTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-6">
                {tHome("soulWaitingText")}
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BTN_DONATE }}
              >
                <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
                {tHome("donateNowCta")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do – animated cards met scroll-vervaging */}
      <section
        ref={miraclesRef}
        id="about"
        className="py-16 md:py-20 relative overflow-hidden"
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
                  className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-stone-900/90 dark:via-stone-900/40 dark:to-transparent"
                />
                <div className="relative z-10 p-6 flex flex-col justify-end min-h-[280px] bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-stone-900/90 dark:via-stone-900/40 dark:to-transparent">
                  <h3 className="text-lg font-bold mb-2 drop-shadow-sm" style={{ color: ACCENT_GREEN }}>{item.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-base leading-relaxed drop-shadow-sm">{item.desc}</p>
                  <p className="mt-2 text-sm font-medium" style={{ color: ACCENT_GREEN }}>{item.cta}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tHome("miraclesSponsorCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Support Our Mission */}
      <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {tHome("everyEuroTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
            {tHome("everyEuroText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {tHome("oneTimeDonation")}
            </a>
            <button
              type="button"
              onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tHome("monthlySoulSaver")}
            </button>
          </div>
        </div>
      </section>

      {/* Stats – geanimeerde tellers */}
      <section className="py-12 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-700">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <AnimatedStat prefix={tHome("statsPrefixMoreThan")} target={2500} duration={2200} startOnView />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsRescued")}</p>
          </div>
          <div>
            <AnimatedStat prefix={tHome("statsPrefixMoreThan")} target={39} duration={1800} startOnView />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsWheelchairs")}</p>
          </div>
          <div>
            <AnimatedStat prefix={tHome("statsPrefixSince")} target={2010} from={1999} duration={2500} startOnView />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsTimeline")}</p>
          </div>
        </div>
      </section>

      {/* Adoption Hub */}
      <section id="adopt" className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 mb-8">
            <div className="flex-shrink-0 w-full md:w-72 mx-auto relative aspect-square">
              <Image
                src="/dog-wheelchair-small.webp"
                alt="A rescued dog with a wheelchair at Saved Souls Foundation, ready for adoption"
                fill
                className="rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 768px) 100vw, 288px"
                loading="lazy"
                style={{ filter: "brightness(1.1) contrast(1.03)" }}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                {tHome("adoptTitle")}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                {tHome("adoptHubText")}
              </p>
              <Link
                href="/adopt-inquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tHome("adoptCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Hero */}
      <section id="sponsor" className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
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
            <button
              type="button"
              onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tHome("donateMonthly")}
            </button>
          </div>
        </div>
      </section>

      {/* Volunteer Hero – grote gele geanimeerde knop */}
      <section id="volunteer" className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {tHome("volunteerTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
            {tHome("volunteerText")}
          </p>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse-orange hover:scale-105 transition-transform text-lg"
            style={{ backgroundColor: BTN_VOLUNTEER }}
          >
            <span className="text-xl" aria-hidden>🌟</span>
            {tHome("volunteerCta")}
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-stone-700 dark:text-stone-300">
            &ldquo;{tHome("quote")}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Video 1 – YouTube */}
      {YOUTUBE_VIDEO_ID && (
        <section className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
          <div className="max-w-4xl mx-auto px-4">
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
          </div>
        </section>
      )}

      {/* Video 2 – A Sanctuary in the Heart of Isaan */}
      {YOUTUBE_VIDEO_ID_2 && (
        <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
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

      {/* Donate section – Apple/Bol/Amazon stijl: minimaal, één focus */}
      <section id="donate" className="py-16 md:py-24 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-700">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden border-4 shadow-lg" style={{ borderColor: ACCENT_GREEN }}>
              <img src="/donatie-thanks.webp" alt={tHome("donateThanksImageAlt")} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center justify-center gap-2">
              <img src="/icons/paw.svg" alt="" className="w-6 h-6" aria-hidden />
              {tHome("donateTitle")}
              <img src="/icons/heart.svg" alt="" className="w-6 h-6" aria-hidden />
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm" style={{ color: ACCENT_GREEN }}>
              {tHome("donateSubtitle")}
            </p>
          </div>

          <div className="mb-6 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl" style={{ borderLeft: `4px solid ${ACCENT_GREEN}` }}>
            <IdealDonate />
          </div>

          <RecentDonations />

          <p className="text-center text-stone-500 dark:text-stone-500 text-xs mb-8">
            {tHome("donateBreakdown")}
          </p>

          <div className="text-center mb-8">
            <Link href="/sponsor" className="text-sm font-medium" style={{ color: ACCENT_GREEN }}>
              {tHome("becomeMonthly")} →
            </Link>
          </div>

          {/* Bankoverschrijving – uitklapbaar */}
          <div id="bank-transfer">
            <BankTransferSection />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 bg-white/95 dark:bg-stone-900/95 border-t border-stone-200 dark:border-stone-700">
        <div className="max-w-3xl mx-auto px-4">
          <blockquote className="pl-4 border-l-4 border-[#2aa348] py-2 text-stone-600 dark:text-stone-400 italic">
            {tHome("testimonialQuote")}
          </blockquote>
          <p className="mt-2 text-stone-500 dark:text-stone-500 text-base">
            {tHome("testimonialAuthor")}
          </p>
        </div>
      </section>

      {/* Contact form – stays at bottom of homepage */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-8 md:pb-2 text-center">
        <p className="text-base text-stone-500 dark:text-stone-400">
          {tHome("contactFooterText")}
          <Link href="/contact" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
            {tHome("contactFooterLink")}
          </Link>
        </p>
      </div>
      <ContactForm />

      <div className="pb-[env(safe-area-inset-bottom,0)]">
        <Footer />
      </div>
      <CookieConsent />
      </div>
    </div>
  );
}
