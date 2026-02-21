"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BTN_ADOPT = "#059669";
const BTN_SPONSOR = "#0891b2";
const BTN_VOLUNTEER = "#ea580c";
const BTN_DONATE = "#dc2626";

type SiteHeaderProps = {
  /** Op homepage: scroll naar sectie. Anders: link naar /#sponsor en /#donate */
  scrollToSection?: (id: string) => void;
};

export default function SiteHeader({ scrollToSection }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("common");
  const tHome = useTranslations("home");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSponsor = () => {
    if (scrollToSection) {
      scrollToSection("sponsor");
      closeMobileMenu();
    }
  };

  const handleDonate = () => {
    if (scrollToSection) {
      scrollToSection("donate");
      closeMobileMenu();
    }
  };

  const isHomePage = !!scrollToSection;

  return (
    <>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
            <video
              src="/savedsouls-foundation-logo.mp4"
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
          <span className="text-xs font-medium" style={{ color: "#E67A4C" }}>{t("home")}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <Link
            href="/about-us"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("aboutUs")}
          </Link>
          <Link
            href="/story"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("ourStory")}
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
            href="/shop"
            className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t("shop")}
          </Link>
          <Link
            href="/adopt"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BTN_ADOPT }}
          >
            {t("adopt")}
          </Link>
          {isHomePage ? (
            <a
              href="#sponsor"
              onClick={(e) => { e.preventDefault(); scrollToSection!("sponsor"); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BTN_SPONSOR }}
            >
              {t("sponsor")}
            </a>
          ) : (
            <Link
              href="/#sponsor"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BTN_SPONSOR }}
            >
              {t("sponsor")}
            </Link>
          )}
          <Link
            href="/volunteer"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BTN_VOLUNTEER }}
          >
            {t("volunteer")}
          </Link>
          {isHomePage ? (
            <a
              href="#donate"
              onClick={(e) => { e.preventDefault(); scrollToSection!("donate"); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BTN_DONATE }}
            >
              {t("donate")}
            </a>
          ) : (
            <Link
              href="/#donate"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BTN_DONATE }}
            >
              {t("donate")}
            </Link>
          )}
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
            aria-label={mobileMenuOpen ? tHome("menuClose") : tHome("menuOpen")}
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

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[57px] z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-200 ease-out overflow-hidden ${
          mobileMenuOpen ? "max-h-[42rem] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          <Link href="/about-us" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("aboutUs")}
          </Link>
          <Link href="/story" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("ourStory")}
          </Link>
          <Link href="/contact" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("contact")}
          </Link>
          <Link href="/get-involved" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("getInvolved")}
          </Link>
          <Link href="/shop" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("shop")}
          </Link>
          <Link href="/street-dogs-thailand" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("streetDogsThailand")}
          </Link>
          <Link href="/thank-you" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
            {t("thankYou")}
          </Link>
          <Link href="/adopt" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_ADOPT }}>
            {t("adopt")}
          </Link>
          {isHomePage ? (
            <button type="button" onClick={handleSponsor} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_SPONSOR }}>
              {t("sponsor")}
            </button>
          ) : (
            <Link href="/#sponsor" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_SPONSOR }}>
              {t("sponsor")}
            </Link>
          )}
          <Link href="/volunteer" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_VOLUNTEER }}>
            {t("volunteer")}
          </Link>
          {isHomePage ? (
            <button type="button" onClick={handleDonate} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
              {t("donate")}
            </button>
          ) : (
            <Link href="/#donate" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-left font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
              {t("donate")}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <button
        type="button"
        onClick={closeMobileMenu}
        className={`md:hidden fixed inset-0 z-[9] bg-black/20 transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />
    </>
  );
}
