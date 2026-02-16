"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CookieConsent from "../components/CookieConsent";
import DonateButton from "../components/DonateButton";
import Footer from "../components/Footer";
import IdealDonate from "../components/IdealDonate";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

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
        setError((data as { error?: string }).error || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 pb-24 md:pb-20 bg-white/95 dark:bg-stone-900/95">
      <div className="max-w-xl mx-auto w-full px-4">
        <h2 className="text-xl font-bold mb-6 text-center dark:text-[#2aa348]" style={{ color: ACCENT_GREEN }}>
          Contact
        </h2>
        {sent ? (
          <div className="text-center py-8 px-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Thanks for contacting us!
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Your message has been sent to info@savedsouls-foundation.org. We&apos;ll get back to you as soon as we can.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder="What is your message about?"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348] resize-y"
                placeholder="Write your message..."
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
              {sending ? "Sending…" : "Send message"}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [miraclesInView, setMiraclesInView] = useState(false);
  const [miraclesProgress, setMiraclesProgress] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const miraclesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    setIsTouchDevice(mq.matches);
    const handler = () => setIsTouchDevice(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    closeMobileMenu();
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
    const section = miraclesRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = el.scrollTop;
      setScrollY(y);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const viewportH = el.clientHeight;
        const inViewStart = sectionTop - viewportH * 0.5;
        const inViewEnd = sectionTop + sectionHeight * 0.3;
        const progress = Math.max(0, Math.min(1, (y - inViewStart) / (inViewEnd - inViewStart)));
        setMiraclesProgress(progress);
      }
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const section = miraclesRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMiraclesInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
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
      {/* Nav – logo left, Adopt / Sponsor / Donate right */}
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <button
          type="button"
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
            <video
              src="/savedsouls-fondation-logo.mp4"
              width={70}
              height={70}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <Link
            href="/about-us"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("contact")}
          </Link>
          <Link
            href="/get-involved"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("getInvolved")}
          </Link>
          <Link
            href="/gallery"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("gallery")}
          </Link>
          <Link
            href="/press"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("press")}
          </Link>
          <Link
            href="/partners"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("partners")}
          </Link>
          <Link
            href="/volunteer"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("volunteer")}
          </Link>
          <Link
            href="/adopt"
            className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {t("adopt")}
          </Link>
          <a
            href="#sponsor"
            onClick={(e) => { e.preventDefault(); document.getElementById("sponsor")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {t("sponsor")}
          </a>
          <a
            href="#donate"
            onClick={(e) => { e.preventDefault(); document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" }); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("donate")}
          </a>
          <div className="flex-shrink-0 ml-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile: taal + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex-shrink-0">
            <LanguageSwitcher compact />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
            aria-label={mobileMenuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <button
        type="button"
        onClick={closeMobileMenu}
        className={`md:hidden fixed inset-0 z-[9] bg-black/20 transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[57px] z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-200 ease-out overflow-hidden ${
          mobileMenuOpen ? "max-h-[42rem] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          <Link
            href="/about-us"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("contact")}
          </Link>
          <Link
            href="/get-involved"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("getInvolved")}
          </Link>
          <Link
            href="/gallery"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("gallery")}
          </Link>
          <Link
            href="/press"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("press")}
          </Link>
          <Link
            href="/partners"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("partners")}
          </Link>
          <Link
            href="/street-dogs-thailand"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("streetDogsThailand")}
          </Link>
          <Link
            href="/volunteer"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("volunteer")}
          </Link>
          <Link
            href="/thank-you"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
          >
            {t("thankYou")}
          </Link>
          <Link
            href="/adopt"
            onClick={closeMobileMenu}
            className="px-4 py-3 rounded-lg text-left font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
            style={{ color: ACCENT_GREEN }}
          >
            {t("adopt")}
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection("sponsor")}
            className="px-4 py-3 rounded-lg text-left font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
            style={{ color: ACCENT_GREEN }}
          >
            {t("sponsor")}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("donate")}
            className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {t("donate")}
          </button>
        </div>
      </div>

      {/* Hero – large headline + one CTA */}
      <header className="min-h-[85vh] flex flex-col justify-center px-4 py-16 md:py-24 max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-1">
          {tHome("foundation")}
        </p>
        <p className="text-base md:text-lg font-bold text-stone-600 dark:text-stone-400 mb-8">
          {tHome("location")}
        </p>
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8 max-w-2xl mx-auto w-full aspect-[4/3] bg-stone-200 dark:bg-stone-800 relative">
          <Image
            src="/woman-hug-dog.webp"
            alt="Saved Souls Foundation volunteer hugging a rescued dog in Khon Kaen, Thailand"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-stone-800 dark:text-stone-100">
          {tHome("headline")}
        </h1>
        <a
          href="https://paypal.me/savedsoulsfoundation"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white text-lg transition-opacity hover:opacity-90 w-fit mx-auto mb-10"
          style={{ backgroundColor: BUTTON_ORANGE }}
        >
          {tHome("cta")}
        </a>
        <p className="text-stone-600 dark:text-stone-400 text-lg md:text-xl mb-6 max-w-2xl mx-auto font-bold">
          {tHome("intro1")}
        </p>
        <p className="text-stone-700 dark:text-stone-300 text-lg md:text-xl font-bold max-w-2xl mx-auto">
          {tHome("intro2")}
        </p>
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
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Love Doesn&apos;t Give Up—Neither Do We
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                Through years of patient love, swimming therapy for our paralyzed dogs and disabled dogs, and a promise that every soul matters, we&apos;re rewriting their stories. When others see &quot;too damaged,&quot; we see deserving. When others say &quot;impossible,&quot; we say &quot;not yet.&quot; Read how we rescue dogs and care for wheelchair dogs in Thailand.
              </p>
              <Link
                href="/find-out-more"
                className="inline-block px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                FIND OUT MORE
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
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Your Next Best Friend is Waiting—Wheelchair and All
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                Our rescued dogs have survived the unthinkable. They&apos;ve learned to trust again. Now they&apos;re ready for the greatest adventure: coming home to you. Our dog adoption process isn&apos;t fast—because these souls deserve perfection, not speed. Because this isn&apos;t just adoption. This is redemption.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("adopt")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                START YOUR ADOPTION JOURNEY →
              </button>
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
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Right Now, a Soul is Waiting for You
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-6">
            At this very moment, a paralyzed dog is lying in our clinic—waiting for the wheelchair that will give them freedom again. A meat trade survivor is taking their first tentative steps toward trusting a human hand.             Your donation to our dog rescue shelter in Thailand is the difference between survival and surrender.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                DONATE NOW — SAVE A SOUL →
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
            We Specialize in Miracles
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-12 max-w-2xl mx-auto">
            Where other shelters see &quot;hopeless,&quot; we see hope. Our mission? Saving stray dogs, rescued dogs, and disabled animals no one else will fight for—in Khon Kaen, Thailand.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Disabled dogs & wheelchair dogs", desc: "Paralyzed dogs who deserve wheelchairs, not euthanasia. Rescued dogs who need swimming therapy, not sympathy.", img: "/woman-dog-wheelchair.webp" },
              { title: "Meat trade & stray dog survivors", desc: "Rescued dogs learning that hands can heal, not harm. Stray dogs who never knew they mattered—until now.", img: "/dog-sand-happy.webp" },
              { title: "Every day we", desc: "Cook fresh meals. Train. Rehabilitate. Love fiercely. Our rescued dogs didn't survive hell just to be forgotten. They survived because they were meant to thrive.", img: "/dog-white-brown-resting.webp" },
            ].map((item, i) => (
              <Link
                key={item.title}
                href="/donate"
                className="group relative block rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-600/80 shadow-xl min-h-[280px] transition-all duration-700 ease-out hover:shadow-2xl hover:border-stone-300 dark:hover:border-stone-500 cursor-pointer"
                style={{
                  opacity: miraclesInView ? 1 : 0.6,
                  transform: miraclesInView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out group-hover:blur-none ${isTouchDevice && miraclesInView ? "blur-none" : "blur-[1px]"}`}
                  style={{
                    backgroundImage: `url(${item.img})`,
                    transform: `scale(${1 + (1 - miraclesProgress) * 0.03})`,
                  }}
                />
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-out group-hover:opacity-0 ${isTouchDevice && miraclesInView ? "opacity-0" : "opacity-50"}`}
                  style={{
                    backgroundColor: theme === "dark" ? "rgb(28,25,23)" : "rgb(255,255,255)",
                    backdropFilter: isTouchDevice && miraclesInView ? "none" : `blur(${8 - miraclesProgress * 4}px)`,
                    WebkitBackdropFilter: isTouchDevice && miraclesInView ? "none" : `blur(${8 - miraclesProgress * 4}px)`,
                  }}
                />
                <div className={`relative z-10 p-6 flex flex-col justify-end min-h-[280px] transition-all duration-500 ${isTouchDevice && miraclesInView ? "bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-stone-900/90 dark:via-stone-900/40 dark:to-transparent" : "bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-stone-900/95 dark:via-stone-900/60 dark:to-transparent group-hover:from-white/90 group-hover:via-white/40 group-hover:to-transparent dark:group-hover:from-stone-900/90 dark:group-hover:via-stone-900/40"}`}>
                  <h3 className="text-lg font-bold mb-2 drop-shadow-sm" style={{ color: ACCENT_GREEN }}>{item.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed drop-shadow-sm">{item.desc}</p>
                  <p className="mt-2 text-xs font-medium" style={{ color: ACCENT_GREEN }}>Click to see where donations go →</p>
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
              SPONSOR A SURVIVOR&apos;S JOURNEY →
            </Link>
          </div>
        </div>
      </section>

      {/* Support Our Mission */}
      <section className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Every Euro. Every Soul. Every Heartbeat Counts.
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
            No corporate salaries. No fancy offices. Just you, us, and the animals who need us. Your money becomes their life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://paypal.me/savedsoulsfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              One-time donation
            </a>
            <button
              type="button"
              onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              Monthly Soul Saver
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-700">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: ACCENT_GREEN }}>More than 600</p>
            <p className="text-stone-600 dark:text-stone-400">Rescued dogs & cats helped</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: ACCENT_GREEN }}>12</p>
            <p className="text-stone-600 dark:text-stone-400">Wheelchairs in use</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: ACCENT_GREEN }}>Since 2010</p>
            <p className="text-stone-600 dark:text-stone-400">From 2 rescued dogs in Khon Kaen → 600+ souls today</p>
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
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Your Next Best Friend is Waiting—Wheelchair and All
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
                Every rescued dog is leash-trained, socialized, and prepared. Every adopter is carefully matched, supported, and welcomed into our family. Adopt a dog from Thailand&apos;s only shelter for disabled and special needs animals. Because this isn&apos;t just adoption. This is redemption.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                START YOUR ADOPTION JOURNEY →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Hero */}
      <section id="sponsor" className="py-16 md:py-20 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Sponsor a Survivor&apos;s Journey
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
            Your monthly support funds wheelchairs for paralyzed dogs, swimming therapy for rescued dogs, fresh meals for stray dogs, and the patient love that turns &quot;hopeless&quot; into hope. Sponsor a dog and be the reason a soul thrives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              Sponsor a dog
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              Donate monthly
            </button>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-stone-700 dark:text-stone-300">
            &ldquo;We can&apos;t save them all. But for each one we save, we change their entire world.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Video 1 – YouTube */}
      {YOUTUBE_VIDEO_ID && (
        <section className="py-16 md:py-20 bg-stone-50/90 dark:bg-stone-800/90">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-8">
              Meet our rescued dogs at Saved Souls Foundation
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
              A Sanctuary in the Heart of Isaan
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
              Deep in Khon Kaen, in the lush northeast of Thailand, a small team with enormous hearts runs a shelter that never turns away a soul. Hundreds of rescued dogs and cats call this place home—and every day, our dedicated staff and volunteers prove that love can heal what the world has broken.
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
          <ul className="text-stone-600 dark:text-stone-400 text-center mb-2 space-y-1 text-sm">
            <li><strong className="text-stone-800 dark:text-stone-200">€25</strong> {tHome("donate25")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€50</strong> {tHome("donate50")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€100</strong> {tHome("donate100")}</li>
            <li><strong className="text-stone-800 dark:text-stone-200">€25</strong> {tHome("donate250")}</li>
          </ul>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-8 text-sm">
            {tHome("donateBreakdown")}
          </p>

          <div className="max-w-md mx-auto mb-10">
            <IdealDonate />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-stone-300 dark:bg-stone-700 rounded-lg flex items-center justify-center text-stone-500 text-sm">
                {tHome("paypalQr")}
              </div>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{tHome("paypal")}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-stone-300 dark:bg-stone-700 rounded-lg flex items-center justify-center text-stone-500 text-sm">
                {tHome("promptpayQr")}
              </div>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{tHome("promptpay")}</p>
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
              <p className="text-stone-600 dark:text-stone-400 text-sm">SWIFT: KASITHBK</p>
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
              <p className="text-stone-600 dark:text-stone-400 text-sm">SWIFT: POFICHBEXXX</p>
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
            I visited Saved Souls in 2024. The love and patience they give to each
            disabled dog is unforgettable. I now sponsor two wheelchairs.
          </blockquote>
          <p className="mt-2 text-stone-500 dark:text-stone-500 text-sm">
            — Anne, volunteer from the Netherlands
          </p>
        </div>
      </section>

      {/* Contact form – stays at bottom of homepage */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-8 md:pb-2 text-center">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Address, map and bank details?{" "}
          <Link href="/contact" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
            See our contact page →
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
