"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatedStat } from "../components/AnimatedStat";
import CookieConsent from "../components/CookieConsent";
import DonateButton from "../components/DonateButton";
import Footer from "../components/Footer";
import SiteHeader from "../components/SiteHeader";
import IdealDonate from "../components/IdealDonate";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";
const BTN_VOLUNTEER = "#ea580c";

/** YouTube video IDs */
const YOUTUBE_VIDEO_ID = "2vNi6Aa3_Gg";
const YOUTUBE_VIDEO_ID_2 = "l7qYY1c_n3M";

function CopyButton({
  text,
  label,
  copiedLabel = "Copied!",
}: {
  text: string;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#2aa348] text-[#2aa348] hover:bg-[#2aa348] hover:text-white dark:border-[#2aa348] dark:text-[#2aa348] dark:hover:bg-[#2aa348] dark:hover:text-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

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
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [useAutoTheme, setUseAutoTheme] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const miraclesRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const t = useTranslations("common");
  const tHome = useTranslations("home");

  return (
    <div className={`h-screen text-stone-800 dark:text-stone-200 relative overflow-hidden ${theme}`}>
      {/* Parallax achtergrond */}
      <div
        className="fixed inset-0 z-0 bg-stone-200 dark:bg-stone-900"
        aria-hidden
        style={{
          backgroundImage: "url('/savedsoul-logo.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.35}px)`,
        }}
      />
      <div className="fixed inset-0 z-[1] bg-white/70 dark:bg-stone-950/80 pointer-events-none" />

      <div
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto overscroll-contain"
      >
      <SiteHeader
        scrollToSection={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
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

      {/* Hero – banner met foto-strip */}
      <header className="px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 dark:border-stone-700/80 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-stone-900">
              {[
                { src: "/team-dogs.webp", alt: "Saved Souls team at the sanctuary" },
                { src: "/team-thankyou.png", alt: "Team at the entrance of Saved Souls Foundation" },
                { src: "/volunteers-with-dogs.png", alt: "Volunteers with rescued dogs" },
                { src: "/woman-dog-wheelchair.webp", alt: "Dog with wheelchair at Saved Souls" },
              ].map((img, i) => (
                <div key={i} className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 280px"
                    priority={i < 2}
                    style={{ filter: "brightness(1.15) contrast(1.04) saturate(1.03)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent" />
                </div>
              ))}
            </div>
            <div
              className="relative px-6 py-5 md:py-6 text-center"
              style={{
                background: "linear-gradient(180deg, rgba(42,163,72,0.08) 0%, rgba(255,255,255,0.95) 40%)",
              }}
            >
              <p className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-100 mb-0.5">
                {tHome("foundation")}
              </p>
              <p className="text-sm md:text-base font-bold mb-4" style={{ color: ACCENT_GREEN }}>
                {tHome("location")}
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-stone-800 dark:text-stone-100">
                {tHome("headline")}
              </h1>
              <Link
                href="/soul-saver"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tHome("cta")}
              </Link>
            </div>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg mb-2 max-w-2xl mx-auto text-center font-bold">
            {tHome("intro1")}
          </p>
          <p className="text-stone-700 dark:text-stone-300 text-base md:text-lg font-bold max-w-2xl mx-auto text-center">
            {tHome("intro2")}
          </p>
        </div>
      </header>

      {/* Content sections – headline + text + one CTA per section */}
      <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
              <img
                src="/dog-grass-walking.webp"
                alt="Saved Souls Foundation caring for a rescued dog at our shelter in Khon Kaen"
                className="rounded-2xl w-full aspect-square object-cover shadow-lg"
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
            <div className="flex-shrink-0 w-full max-w-sm mx-auto md:mx-0 md:w-72 lg:w-80 h-[260px] md:h-[280px] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-lg">
              <img
                src="/two-dogs-platform.webp"
                alt="Two rescued dogs at Saved Souls Foundation, bonded by affection"
                className="w-full h-full object-cover"
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
            <div className="flex-shrink-0 w-full md:w-72 lg:w-80 mx-auto">
              <img
                src="/dog-reaching.webp"
                alt="A rescued dog at Saved Souls Foundation waiting for a loving home"
                className="rounded-2xl w-full aspect-square object-cover shadow-lg"
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
                className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
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
              { title: tHome("miraclesCard1Title"), desc: tHome("miraclesCard1Desc"), img: "/woman-dog-wheelchair.webp" },
              { title: tHome("miraclesCard2Title"), desc: tHome("miraclesCard2Desc"), img: "/dog-sand-happy.webp" },
              { title: tHome("miraclesCard3Title"), desc: tHome("miraclesCard3Desc"), img: "/dog-white-brown-resting.webp" },
            ].map((item, i) => (
              <Link
                key={i}
                href="/donate"
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
                  <p className="mt-2 text-sm font-medium" style={{ color: ACCENT_GREEN }}>{tHome("miraclesCardCta")}</p>
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
            <AnimatedStat prefix={tHome("statsPrefixMoreThan")} target={2500} duration={2200} startOnView={false} />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsRescued")}</p>
          </div>
          <div>
            <AnimatedStat prefix={tHome("statsPrefixMoreThan")} target={39} duration={1800} startOnView={false} />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsWheelchairs")}</p>
          </div>
          <div>
            <AnimatedStat prefix={tHome("statsPrefixSince")} target={2010} from={1999} duration={2500} startOnView={false} />
            <p className="text-stone-600 dark:text-stone-400">{tHome("statsSince")}</p>
          </div>
        </div>
      </section>

      {/* Adoption Hub */}
      <section id="adopt" className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 mb-8">
            <div className="flex-shrink-0 w-full md:w-72 mx-auto">
              <img
                src="/dog-wheelchair-small.webp"
                alt="A rescued dog with a wheelchair at Saved Souls Foundation, ready for adoption"
                className="rounded-2xl w-full aspect-square object-cover shadow-lg"
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

      {/* Donate section */}
      <section id="donate" className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-stone-800 dark:text-stone-100">
            {tHome("donateTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-6">
            {tHome("donateSubtitle")}
          </p>
          <ul className="text-stone-600 dark:text-stone-400 text-center mb-2 space-y-1 text-base">
            <li><strong className="text-stone-800 dark:text-stone-200">€25</strong> {tHome("donate25")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€50</strong> {tHome("donate50")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€100</strong> {tHome("donate100")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€25</strong> {tHome("donate250")}</li>
          </ul>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-8 text-base">
            {tHome("donateBreakdown")}
          </p>

          <div className="max-w-md mx-auto mb-10">
            <IdealDonate />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col items-center">
              <a
                href="https://paypal.me/savedsoulsfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 flex items-center justify-center p-2 hover:border-[#2aa348]/50 transition-colors"
              >
                <Image src="/logos/paypal-qr.png" alt={tHome("paypalQr")} width={160} height={160} className="w-full h-full object-contain" />
              </a>
              <p className="mt-2 text-base text-stone-600 dark:text-stone-400">{tHome("paypal")}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-stone-300 dark:bg-stone-700 rounded-2xl flex items-center justify-center text-stone-500 text-sm">
                {tHome("promptpayQr")}
              </div>
              <p className="mt-2 text-base text-stone-600 dark:text-stone-400">{tHome("promptpay")}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: ACCENT_GREEN }}>
            {tHome("bankTransfer")}
          </h3>
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-200">Kasikorn Bank</p>
              <p className="text-stone-700 dark:text-stone-300 font-mono text-sm md:text-base break-all">
                033-8-13623-4
              </p>
              <p className="text-stone-600 dark:text-stone-400 text-base">SWIFT: KASITHBK</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CopyButton text="033-8-13623-4" label={tHome("copyAccount")} copiedLabel={t("copied")} />
                <CopyButton text="KASITHBK" label={tHome("copySwift")} copiedLabel={t("copied")} />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-200">PostFinance (Switzerland)</p>
              <p className="text-stone-700 dark:text-stone-300 font-mono text-sm md:text-base break-all">
                CH17 0900 0000 8027 1722 9
              </p>
              <p className="text-stone-600 dark:text-stone-400 text-base">SWIFT: POFICHBEXXX</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CopyButton
                  text="CH17 0900 0000 8027 1722 9"
                  label={tHome("copyIban")}
                  copiedLabel={t("copied")}
                />
                <CopyButton text="POFICHBEXXX" label={tHome("copySwift")} copiedLabel={t("copied")} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DonateButton href="https://paypal.me/savedsoulsfoundation">
              {tHome("donateNow")}
            </DonateButton>
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-colors hover:opacity-90 text-center"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {tHome("becomeMonthly")}
            </Link>
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
