"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown from "./NavDropdown";
import SiteSearch from "./SiteSearch";

const ACCENT_GREEN = "#2aa348";
const BTN_ADOPT = "#059669";
const BTN_SPONSOR = "#0891b2";
const BTN_VOLUNTEER = "#ea580c";
const BTN_DONATE = "#dc2626";
const BTN_INFLUENCERS = "#8b5cf6";

type SiteHeaderProps = {
  /** Op homepage: scroll naar sectie. Anders: link naar /#sponsor en /#donate */
  scrollToSection?: (id: string) => void;
};

export default function SiteHeader({ scrollToSection }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAdoptOpen, setMobileAdoptOpen] = useState(false);
  const [mobileGetInvolvedOpen, setMobileGetInvolvedOpen] = useState(false);
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
      <nav className="sticky top-0 z-[110] flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-700/80">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity min-w-0"
        >
          <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: 48, height: 48 }}>
            <video
              src="/savedsouls-foundation-logo.mp4"
              width={48}
              height={48}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="hidden sm:block text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">Saved Souls</span>
        </Link>

        {/* Desktop nav – strakker: links + 2 primaire knoppen */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <SiteSearch />
          <Link href="/about-us" className="px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            {t("aboutUs")}
          </Link>
          <Link href="/story" className="px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            {t("ourStory")}
          </Link>
          <Link href="/contact" className="px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            {t("contact")}
          </Link>
          <NavDropdown
            label={t("getInvolved")}
            items={[
              { href: "/get-involved", label: t("getInvolved") },
              { href: "/gidsen", label: t("gidsen") },
              { href: "/volunteer", label: t("volunteer") },
              { href: "/influencers", label: t("influencers") },
              { href: "/shop", label: t("shop") },
              { href: "/kids", label: t("kids") },
            ]}
            buttonClassName="px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          />
          <NavDropdown
            label={t("adopt")}
            items={[
              { href: "/adopt", label: t("adoptOverview") },
              { href: "/adopt?type=dog", label: t("adoptDogs") },
              { href: "/adopt?type=cat", label: t("adoptCats") },
              { href: "/adopt-inquiry", label: t("adoptInquiryNav") },
            ]}
            buttonClassName="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            buttonStyle={{ backgroundColor: BTN_ADOPT }}
          />
          {isHomePage ? (
            <a href="#sponsor" onClick={(e) => { e.preventDefault(); scrollToSection!("sponsor"); }} className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              {t("sponsor")}
            </a>
          ) : (
            <Link href="/#sponsor" className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              {t("sponsor")}
            </Link>
          )}
          <Link href="/volunteer" className="px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            {t("volunteer")}
          </Link>
          {isHomePage ? (
            <a href="#donate" onClick={(e) => { e.preventDefault(); scrollToSection!("donate"); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
              {t("donate")}
            </a>
          ) : (
            <Link href="/#donate" className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
              {t("donate")}
            </Link>
          )}
          <div className="flex-shrink-0 ml-1">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile: zoek + taal + hamburger (zoals Apple) */}
        <div className="flex md:hidden items-center gap-2">
          <SiteSearch mobileIcon />
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

      {/* Mobile menu backdrop – onder nav, boven pagina-inhoud */}
      <button
        type="button"
        onClick={closeMobileMenu}
        className={`md:hidden fixed inset-0 top-[57px] z-[105] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* Mobile dropdown menu – boven backdrop, leesbaar */}
      <div
        className={`md:hidden fixed inset-x-0 top-[57px] z-[106] max-h-[calc(100vh-57px)] overflow-y-auto bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-xl transition-all duration-200 ease-out ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none max-h-0"
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-2">
          {/* Zoek staat nu altijd in header als icoon */}
          {/* Navigatielinks */}
          <div className="flex flex-col gap-1">
            <Link href="/about-us" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("aboutUs")}
            </Link>
            <Link href="/story" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("ourStory")}
            </Link>
            <Link href="/contact" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("contact")}
            </Link>
            {/* Doe mee + uitklapper */}
            <div>
              <button
                type="button"
                onClick={() => setMobileGetInvolvedOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
              >
                {t("getInvolved")}
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileGetInvolvedOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileGetInvolvedOpen && (
                <div className="pl-4 pb-2 flex flex-col gap-1">
                  <Link href="/get-involved" onClick={closeMobileMenu} className="px-4 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("getInvolved")}
                  </Link>
                  <Link href="/gidsen" onClick={closeMobileMenu} className="px-4 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("gidsen")}
                  </Link>
                  <Link href="/volunteer" onClick={closeMobileMenu} className="px-4 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("volunteer")}
                  </Link>
                  <Link href="/influencers" onClick={closeMobileMenu} className="px-4 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("influencers")}
                  </Link>
                  <Link href="/kids" onClick={closeMobileMenu} className="px-4 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("kids")}
                  </Link>
                </div>
              )}
            </div>
            <Link href="/shop" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("shop")}
            </Link>
            <Link href="/street-dogs-thailand" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("streetDogsThailand")}
            </Link>
            <Link href="/thank-you" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">
              {t("thankYou")}
            </Link>
          </div>

          {/* Actieknoppen – gegroepeerd onderaan */}
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 flex flex-col gap-2">
            {/* Adopt + uitklapper */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAdoptOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: BTN_ADOPT }}
              >
                {t("adopt")}
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAdoptOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileAdoptOpen && (
                <div className="mt-2 flex flex-col gap-1 pl-2">
                  <Link href="/adopt" onClick={closeMobileMenu} className="px-4 py-2.5 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("adoptOverview")}
                  </Link>
                  <Link href="/adopt?type=dog" onClick={closeMobileMenu} className="px-4 py-2.5 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("adoptDogs")}
                  </Link>
                  <Link href="/adopt?type=cat" onClick={closeMobileMenu} className="px-4 py-2.5 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("adoptCats")}
                  </Link>
                  <Link href="/adopt-inquiry" onClick={closeMobileMenu} className="px-4 py-2.5 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800">
                    {t("adoptInquiryNav")}
                  </Link>
                </div>
              )}
            </div>
            {isHomePage ? (
              <button type="button" onClick={handleSponsor} className="px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90 w-full" style={{ backgroundColor: BTN_SPONSOR }}>
                {t("sponsor")}
              </button>
            ) : (
              <Link href="/#sponsor" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_SPONSOR }}>
                {t("sponsor")}
              </Link>
            )}
            <Link href="/volunteer" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_VOLUNTEER }}>
              {t("volunteer")}
            </Link>
            {isHomePage ? (
              <button type="button" onClick={handleDonate} className="px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90 w-full" style={{ backgroundColor: BTN_DONATE }}>
                {t("donate")}
              </button>
            ) : (
              <Link href="/#donate" onClick={closeMobileMenu} className="px-4 py-3 rounded-lg text-center font-semibold text-white hover:opacity-90" style={{ backgroundColor: BTN_DONATE }}>
                {t("donate")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
