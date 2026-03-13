"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Heart,
  ShoppingBag,
  Mail,
  Home,
  MapPin,
  Star,
  Sun,
  Dog,
  Cat,
  Megaphone,
  Smile,
  HelpCircle,
  Globe,
  PawPrint,
} from "lucide-react";
import NavDropdown from "./NavDropdown";
import type { NavDropdownItem } from "./NavDropdown";
import SiteSearch from "./SiteSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import { showSponsor } from "@/lib/features";

// Zorg dat LanguageSwitcher in de bundle blijft (voorkomt ReferenceError in client chunk)
const _languageSwitcherInBundle = LanguageSwitcher;
void _languageSwitcherInBundle;

/** Adopt dropdown icons: expliciet van lucide-react om verwarring met andere componenten te voorkomen */
const AdoptDogIcon = Home;
const AdoptCatIcon = Cat;

type SiteHeaderProps = {
  scrollToSection?: (id: string) => void;
  scrollY?: number;
};

const ICON_GREEN = "#2d7a3a";
const CHEVRON_GRAY = "#d1d5db";

/** Vaste classNames voor header-rechterkant om hydration mismatch te voorkomen (server/client moeten identiek zijn) */
const HEADER_RIGHT_WRAPPER = "flex items-center gap-3 md:gap-6 shrink-0";
const HEADER_DESKTOP_ACTIONS = "hidden md:flex items-center gap-6 lg:gap-8";

const LOCALE_LABELS: Record<string, string> = {
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
  es: "Español",
  th: "ภาษาไทย",
  ru: "Русский",
  fr: "Français",
};
const LOCALE_FLAGS: Record<string, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  th: "🇹🇭",
  ru: "🇷🇺",
  fr: "🇫🇷",
};

export default function SiteHeader({ scrollToSection, scrollY = 999 }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRefDesktop = useRef<HTMLDivElement>(null);
  const langRefMobile = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");
  const tHome = useTranslations("home");

  const isOverOnsOpen = openMenu === "over-ons";

  const overOnsItems: NavDropdownItem[] = useMemo(() => [
    { href: "/story", label: locale === "nl" ? "Ons verhaal" : locale === "de" ? "Unsere Geschichte" : "Our story", icon: BookOpen },
    { href: "/about-us", label: locale === "nl" ? "Ons werk" : locale === "de" ? "Unsere Arbeit" : "Our work", icon: PawPrint },
    { href: "/faq", label: "FAQ", description: locale === "nl" ? "Veelgestelde vragen" : locale === "de" ? "Häufige Fragen" : "Frequently asked questions", icon: HelpCircle },
    { href: "/donate", label: locale === "nl" ? "Doneer nu" : locale === "de" ? "Jetzt spenden" : "Donate now", icon: Heart },
  ], [locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!langRefDesktop.current?.contains(target) && !langRefMobile.current?.contains(target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInvolvedItems: NavDropdownItem[] = useMemo(() => {
    const all: NavDropdownItem[] = [
      { href: "/get-involved", label: t("getInvolved"), description: t("menuGetInvolvedOverview"), icon: Home },
      { href: "/#sponsor", label: t("sponsor"), description: t("menuSponsorSubtext"), icon: Heart },
      { href: "/volunteer", label: t("volunteer"), description: t("menuVolunteerSubtext"), icon: Sun },
      { href: "/influencers", label: t("influencers"), description: t("menuInfluencersSubtext"), icon: Megaphone, highlight: true },
      { href: "/kids", label: t("kids"), description: t("menuKidsSubtext"), icon: Smile },
      { href: "/gidsen", label: t("menuGidsenLabel"), description: t("menuGidsenSubtext"), icon: BookOpen, highlightYellow: true, badgeLabel: t("menuInformativeBadge") },
      { href: "/shop", label: t("shop"), description: t("menuShopSubtext"), icon: ShoppingBag },
      { href: "/street-dogs-thailand", label: t("menuStreetDogsShort"), description: t("menuStreetDogsSubtextShort"), icon: MapPin },
      { href: "/thank-you", label: t("thankYou"), description: "", icon: Star },
    ];
    return showSponsor ? all : all.filter((i) => i.href !== "/#sponsor");
  }, [showSponsor, t]);

  const navLinkClass = (path: string, mobile = false) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    const pad = mobile ? "px-4 py-3" : "px-3 py-2 text-sm";
    const inactive = mobile ? "text-stone-700 dark:text-stone-300" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100";
    return `${pad} rounded-lg transition-colors ${
      isActive
        ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
        : `${inactive} hover:bg-stone-100 dark:hover:bg-stone-800`
    }`;
  };

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isHomePage = !!scrollToSection;
  const isOverlay = mounted && isHomePage && scrollY < 80;

  const textOverlay = "text-white hover:text-white/90";
  const textScrolled = "text-[#1a1a1a] dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300";

  const navBg = isOverlay
    ? "bg-transparent border-transparent shadow-none"
    : "bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 md:px-6 h-14 md:h-16 border-b backdrop-blur-md transition-all duration-300 ease-out overflow-visible ${navBg}`}
      >
        {/* Left: Logo + Saved Souls */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded-full overflow-hidden w-11 h-11">
            <video
              src="/savedsouls-foundation-logo.mp4"
              width={44}
              height={44}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className={`text-xl font-semibold whitespace-nowrap ${isOverlay ? "text-white" : "text-[#1a1a1a] dark:text-stone-100"}`}>
            Saved Souls
          </span>
        </Link>

        {/* Center: Nav links (desktop only) – overflow-visible zodat dropdowns niet worden afgeknipt */}
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 flex-1 min-w-0 overflow-visible">
          <NavDropdown
            label={locale === "nl" ? "Over ons" : locale === "de" ? "Über uns" : "About us"}
            layout="involved"
            items={overOnsItems}
            buttonClassName={`text-sm lg:text-base font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="left"
            open={isOverOnsOpen}
            onOpenChange={(open) => setOpenMenu(open ? "over-ons" : null)}
            dropdownStyle={{ zIndex: 200 }}
          />
          <NavDropdown
            label={t("adopt")}
            layout="adopt"
            items={[
              { href: "/adopt", label: t("menuAdoptMain"), description: t("menuAdoptDogSubtext"), icon: AdoptDogIcon, iconBg: "#fff7ed" },
              { href: "/adopt?type=cat", label: t("menuAdoptCat"), description: t("menuAdoptCatSubtext"), icon: AdoptCatIcon, iconBg: "#f0f7ff" },
            ]}
            buttonClassName={`text-sm lg:text-base font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="left"
            dropdownStyle={{ zIndex: 200 }}
          />
          <NavDropdown
            label={t("getInvolved")}
            layout="involved"
            items={getInvolvedItems}
            buttonClassName={`text-sm lg:text-base font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="right"
            bottomCta={
              isHomePage
                ? { href: "#donate", label: t("menuDonateNow"), subtext: t("menuDonateSubtext"), onClick: handleDonate }
                : { href: "/#donate", label: t("menuDonateNow"), subtext: t("menuDonateSubtext") }
            }
            dropdownStyle={{ zIndex: 200 }}
          />
          <Link
            href="/contact"
            className={`text-sm lg:text-base font-medium transition-colors duration-300 hover:underline underline-offset-4 ${isOverlay ? textOverlay : textScrolled}`}
          >
            {t("contact")}
          </Link>
        </div>

        {/* Right: Search, Language, Soul saver, Donate (desktop) | Search, Language, Hamburger (mobile) */}
        <div className={HEADER_RIGHT_WRAPPER} suppressHydrationWarning>
          {/* Desktop: search, language, soul saver, donate */}
          <div className={HEADER_DESKTOP_ACTIONS} suppressHydrationWarning>
            <SiteSearch desktopIconOnly overlay={mounted ? isOverlay : false} />
            {/* Inline language switcher – globe + flag + dropdown */}
            <div ref={langRefDesktop} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-sm font-medium ${
                  isOverlay
                    ? "backdrop-blur-sm bg-white/10 border-white/20 text-white"
                    : "bg-white/80 border-stone-200 text-stone-700"
                }`}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-4 h-4 shrink-0" aria-hidden />
                <span>{LOCALE_FLAGS[locale] ?? "🌐"}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${langOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 min-w-[180px] z-[200]"
                  role="listbox"
                >
                  {(["nl", "en", "de", "es", "th", "ru", "fr"] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        router.replace(pathname, { locale: loc });
                        setLangOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-50 text-sm w-full text-left transition-colors"
                      role="option"
                    >
                      <span>{LOCALE_FLAGS[loc]}</span>
                      <span className="text-stone-800">{LOCALE_LABELS[loc]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/emergency"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-[1.02] ![bg-[#C0392B]]"
              style={{ backgroundColor: "#C0392B" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" aria-hidden />
              <svg width="36" height="14" viewBox="0 0 36 14" className="shrink-0" aria-hidden style={{ overflow: "visible" }}>
                <polyline
                  points="0,7 4,7 6,2 8,12 10,2 12,7 16,7 20,7 22,2 24,12 26,2 28,7 36,7"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="0"
                  style={{ animation: "ecg-scroll 1.8s linear infinite" }}
                />
              </svg>
              {t("menuEmergency") ?? "Noodhulp"}
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-opacity hover:opacity-90"
              style={{ borderColor: "#1a5c2e", color: "#1a5c2e", backgroundColor: "transparent" }}
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>
                {locale === "nl" ? "Vrijwilliger" : locale === "de" ? "Freiwilliger" : locale === "es" ? "Voluntario" : locale === "fr" ? "Bénévole" : locale === "ru" ? "Волонтёр" : locale === "th" ? "อาสาสมัคร" : "Volunteer"}
              </span>
            </Link>
            {isHomePage ? (
              <a
                href="#donate"
                onClick={(e) => { e.preventDefault(); scrollToSection!("donate"); }}
                className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90 ${
                  isOverlay ? "backdrop-blur-sm bg-red-500/80 border border-red-400/50 text-white" : "bg-red-500 text-white"
                }`}
                title={t("donateTooltip")}
              >
                <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
                {t("donate")}
              </a>
            ) : (
              <Link
                href="/#donate"
                className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90 ${
                  isOverlay ? "backdrop-blur-sm bg-red-500/80 border border-red-400/50 text-white" : "bg-red-500 text-white"
                }`}
                title={t("donateTooltip")}
              >
                <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
                {t("donate")}
              </Link>
            )}
          </div>
          {/* Mobile: search, language, hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <SiteSearch mobileIcon overlay={isOverlay} />
            {/* Mobile language switcher – same globe dropdown */}
            <div ref={langRefMobile} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-sm font-medium ${
                  isOverlay ? "backdrop-blur-sm bg-white/10 border-white/20 text-white" : "bg-white/80 border-stone-200 text-stone-700"
                }`}
                aria-expanded={langOpen}
              >
                <Globe className="w-4 h-4 shrink-0" aria-hidden />
                <span>{LOCALE_FLAGS[locale] ?? "🌐"}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${langOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 min-w-[180px] z-[200]" role="listbox">
                  {(["nl", "en", "de", "es", "th", "ru", "fr"] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => { router.replace(pathname, { locale: loc }); setLangOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-50 text-sm w-full text-left"
                      role="option"
                    >
                      <span>{LOCALE_FLAGS[loc]}</span>
                      <span className="text-stone-800">{LOCALE_LABELS[loc]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className={`p-2 rounded-lg border transition-colors duration-300 ${
                isOverlay
                  ? "border-white/60 bg-white/10 text-white"
                  : "border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
              }`}
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
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <button
        type="button"
        onClick={closeMobileMenu}
        className={`md:hidden fixed inset-0 top-14 z-[45] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* Mobile dropdown menu – category cards */}
      <div
        className={`md:hidden fixed inset-x-0 top-14 z-[46] max-h-[calc(100vh-56px)] overflow-y-auto bg-white transition-opacity duration-300 ease-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {mobileMenuOpen && (
        <div className="px-5 py-6 flex flex-col">
          {/* Section 1 – ONTDEK */}
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3">
              {t("menuSectionDiscover")}
            </p>
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <Link
                href="/story"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <BookOpen size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("ourStory")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/about-us"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <Heart size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("aboutUs")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors"
              >
                <Mail size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("contact")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
            </div>
            <div className="rounded-2xl border border-red-800/40 shadow-sm overflow-hidden mb-3 ![bg-[#C0392B]]" style={{ backgroundColor: "#C0392B" }}>
              <Link
                href="/emergency"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 active:opacity-90 transition-opacity text-white"
              >
                <Heart size={18} className="shrink-0 text-white" aria-hidden />
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" aria-hidden />
                <svg width="36" height="14" viewBox="0 0 36 14" className="shrink-0" aria-hidden style={{ overflow: "visible" }}>
                  <polyline
                    points="0,7 4,7 6,2 8,12 10,2 12,7 16,7 20,7 22,2 24,12 26,2 28,7 36,7"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    style={{ animation: "ecg-scroll 1.8s linear infinite" }}
                  />
                </svg>
                <span className="font-medium text-[15px] text-white flex-1">
                  {t("menuEmergency") ?? "Noodhulp"}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md shrink-0" style={{ backgroundColor: "#b34d10", color: "white" }}>
                  Urgent
                </span>
              </Link>
            </div>
          </div>

          {/* Section 2 – DOE MEE */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3">
              {t("menuSectionGetInvolved")}
            </p>
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden mb-3">
              <Link
                href="/get-involved"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors"
              >
                <Home size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("getInvolved")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1 – Adopteer een hond */}
              <Link
                href="/adopt"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 text-base" aria-hidden>🐕</span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 shrink-0">
                  <Dog size={26} color="#c2410c" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("menuAdoptMain")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuAdoptDogCardSubtext")}</span>
              </Link>
              {/* Card 2 – Adopteer een kat */}
              <Link
                href="/adopt?type=cat"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 text-base" aria-hidden>🐱</span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 shrink-0">
                  <Cat size={26} color="#0369a1" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("menuAdoptCat")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuAdoptCatSubtext")}</span>
              </Link>
              {/* Card 3 – Sponsor (verborgen zolang geen betaalplatform) */}
              {showSponsor && (isHomePage ? (
                <button
                  type="button"
                  onClick={handleSponsor}
                  className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                >
                  <span className="absolute top-2 right-2 text-base" aria-hidden>❤️</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 shrink-0">
                    <Heart size={26} color="#e11d48" aria-hidden />
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{t("sponsor")}</span>
                  <span className="text-xs text-gray-400 mt-1">{t("menuSponsorCardSubtext")}</span>
                </button>
              ) : (
                <Link
                  href="/#sponsor"
                  onClick={closeMobileMenu}
                  className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                >
                  <span className="absolute top-2 right-2 text-base" aria-hidden>❤️</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 shrink-0">
                    <Heart size={26} color="#e11d48" aria-hidden />
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{t("sponsor")}</span>
                  <span className="text-xs text-gray-400 mt-1">{t("menuSponsorCardSubtext")}</span>
                </Link>
              ))}
              {/* Card 4 – Vrijwilliger */}
              <Link
                href="/volunteer"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 text-base" aria-hidden>🌟</span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 shrink-0">
                  <Sun size={26} color="#059669" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("volunteer")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuVolunteerSubtext")}</span>
              </Link>
              {/* Card 5 – Influencers */}
              <Link
                href="/influencers"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#e9d5ff] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:shadow-[0_4px_14px_rgba(147,51,234,0.2)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {t("menuExclusiefBadge")}
                </span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-violet-200 shrink-0">
                  <Megaphone size={26} color="#7c3aed" aria-hidden />
                </div>
                <span className="font-bold text-sm text-[#6d28d9]">{t("influencers")}</span>
                <span className="text-xs text-purple-400 mt-1">{t("menuInfluencersSubtext")}</span>
              </Link>
              {/* Card 6 – Shop */}
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] bg-white p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                <span className="absolute top-2 right-2 text-base" aria-hidden>🛍️</span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 shrink-0">
                  <ShoppingBag size={26} color="#d97706" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("shop")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuShopSubtext")}</span>
              </Link>
            </div>
          </div>

          {/* Section 3 – MEER */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3">
              {t("menuSectionMore")}
            </p>
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <ShoppingBag size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("shop")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/street-dogs-thailand"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <MapPin size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("streetDogsThailand")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/gidsen"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-amber-200/80 bg-amber-100 hover:bg-amber-200/60 active:bg-amber-200 transition-colors"
              >
                <span className="absolute top-2 right-3 bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t("menuInformativeBadge")}
                </span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 shrink-0">
                  <BookOpen size={16} color="#b45309" aria-hidden />
                </div>
                <span className="font-medium text-[15px] text-amber-900 flex-1">{t("menuGidsenLabel")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/influencers"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <Megaphone size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("influencers")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/kids"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors"
              >
                <Smile size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("kids")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/thank-you"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors"
              >
                <Star size={18} color={ICON_GREEN} aria-hidden />
                <span className="font-medium text-[15px] text-gray-800 flex-1">{t("thankYou")}</span>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
            </div>
          </div>

          {/* Bottom CTA – Doneren */}
          <div className="mt-8 pb-20 animate-fade-in" style={{ animationDelay: "150ms" }}>
            {isHomePage ? (
              <button
                type="button"
                onClick={handleDonate}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white shadow-lg shadow-red-200 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "#E53E3E" }}
                title={t("donateTooltip")}
              >
                <Heart size={18} fill="white" color="white" aria-hidden />
                {t("donate")}
              </button>
            ) : (
              <Link
                href="/#donate"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white shadow-lg shadow-red-200 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "#E53E3E" }}
                title={t("donateTooltip")}
              >
                <Heart size={18} fill="white" color="white" aria-hidden />
                {t("donate")}
              </Link>
            )}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
