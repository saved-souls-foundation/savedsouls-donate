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
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");

  const isOverOnsOpen = openMenu === "over-ons";

  const overOnsItems: NavDropdownItem[] = useMemo(() => [
    { href: "/story", label: locale === "nl" ? "Ons verhaal" : locale === "de" ? "Unsere Geschichte" : "Our story", description: tNav("ourStoryDesc"), icon: BookOpen, badgeLabel: tNav("badge1999"), badgeBg: "#e8f5ec", badgeColor: "#1a5c2e" },
    { href: "/about-us", label: locale === "nl" ? "Ons werk" : locale === "de" ? "Unsere Arbeit" : "Our work", description: tNav("ourWorkDesc"), icon: PawPrint, badgeLabel: tNav("badgeYoutube"), badgeBg: "#fff0f0", badgeColor: "#cc0000" },
    { href: "/faq", label: "FAQ", description: locale === "nl" ? "Veelgestelde vragen" : locale === "de" ? "Häufige Fragen" : "Frequently asked questions", icon: HelpCircle },
    { href: "/donate", label: locale === "nl" ? "Doneer nu" : locale === "de" ? "Jetzt spenden" : "Donate now", icon: Heart },
  ], [locale, tNav]);

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
      { href: "/get-involved", label: t("getInvolved"), description: tNav("getInvolvedDesc"), icon: Home },
      { href: "/sponsor", label: t("sponsor"), description: tNav("sponsorDesc"), icon: Heart },
      { href: "/volunteer", label: t("volunteer"), description: tNav("volunteerDesc"), icon: Sun },
      { href: "/influencers", label: t("influencers"), description: tNav("influencerDesc"), icon: Megaphone, highlight: true },
      { href: "/gidsen", label: t("menuGidsenLabel"), description: tNav("guidesDesc"), icon: BookOpen, highlightYellow: true, badgeLabel: t("menuInformativeBadge") },
      { href: "/shop", label: t("shop"), description: tNav("shopDesc"), icon: ShoppingBag },
      { href: "/street-dogs-thailand", label: t("menuStreetDogsShort"), description: tNav("streetDogsDesc"), icon: MapPin },
      { href: "/thank-you", label: t("thankYou"), description: tNav("thankYouDesc"), icon: Star },
    ];
    const withoutKids = all.filter((i) => i.href !== "/kids");
    return showSponsor ? withoutKids : withoutKids.filter((i) => i.href !== "/sponsor");
  }, [showSponsor, t, tNav]);

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
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes ss-pulse-icon{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(0.88)}}.ss-pulse-icon{animation:ss-pulse-icon 2.4s ease-in-out infinite;display:inline-flex}@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.2)}28%{transform:scale(1)}42%{transform:scale(1.15)}70%{transform:scale(1)}}.mobile-donate-btn{background-color:#E87B3A}.mobile-donate-btn:hover{background-color:#d06a2a}`,
        }}
      />
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
        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 min-w-0 overflow-visible">
          <NavDropdown
            label={locale === "nl" ? "Over ons" : locale === "de" ? "Über uns" : "About us"}
            layout="involved"
            items={overOnsItems}
            headerContent={
              <div style={{ display: "flex", gap: "8px", padding: "8px 12px 4px", marginBottom: "4px" }}>
                {[
                  { num: "1999", label: tNav("statFounded") },
                  { num: "2.500+", label: tNav("statRescued") },
                  { num: "350+", label: tNav("statAnimals") },
                ].map((s) => (
                  <div key={s.num} style={{ flex: 1, background: "#f0faf3", borderRadius: "8px", padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#1a5c2e" }}>{s.num}</div>
                    <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            }
            buttonClassName={`text-xs md:text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="left"
            open={isOverOnsOpen}
            onOpenChange={(open) => setOpenMenu(open ? "over-ons" : null)}
            dropdownStyle={{ zIndex: 200 }}
          />
          <NavDropdown
            label={t("adopt")}
            layout="adopt"
            items={[
              { href: "/adopt", label: t("menuAdoptMain"), description: t("menuAdoptDogSubtext"), icon: AdoptDogIcon, iconBg: "#fff7ed", badgeLabel: tNav("badgeDogs"), badgeBg: "#e8f5ec", badgeColor: "#1a5c2e" },
              { href: "/adopt?type=cat", label: t("menuAdoptCat"), description: t("menuAdoptCatSubtext"), icon: AdoptCatIcon, iconBg: "#f0f7ff", badgeLabel: tNav("badgeCats"), badgeBg: "#e8f5ec", badgeColor: "#1a5c2e" },
            ]}
            bottomCta={{ href: "/adopt", label: t("menuAdoptMain"), subtext: tNav("adoptFooter") }}
            buttonClassName={`text-xs md:text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="left"
            dropdownStyle={{ zIndex: 200 }}
          />
          <NavDropdown
            label={t("getInvolved")}
            layout="two-col"
            items={getInvolvedItems}
            buttonClassName={`text-xs md:text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4 flex items-center gap-0.5 ${isOverlay ? textOverlay : textScrolled}`}
            align="right"
            bottomCta={{ href: "/donate", label: t("menuDonateNow"), subtext: t("menuDonateSubtext") }}
            dropdownStyle={{ zIndex: 200 }}
          />
          <Link
            href="/contact"
            className={`text-xs md:text-sm font-medium transition-colors duration-300 hover:underline underline-offset-4 ${isOverlay ? textOverlay : textScrolled}`}
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
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02]"
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
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  {t("menuEmergency") ?? "Noodhulp"}
                </span>
                <span style={{ fontSize: "10px", opacity: 0.75 }}>
                  {t("menuEmergencySub") ?? "350 honden in gevaar"}
                </span>
              </span>
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-opacity hover:opacity-90"
              style={{
                borderColor: isOverlay ? "white" : "#1a5c2e",
                color: isOverlay ? "white" : "#1a5c2e",
                backgroundColor: "transparent"
              }}
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>
                {locale === "nl" ? "Vrijwilliger" : locale === "de" ? "Freiwilliger" : locale === "es" ? "Voluntario" : locale === "fr" ? "Bénévole" : locale === "ru" ? "Волонтёр" : locale === "th" ? "อาสาสมัคร" : "Volunteer"}
              </span>
            </Link>
            <a
              href={`/${locale}/donate`}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90 text-white"
              style={{ backgroundColor: "#7B1010" }}
              title={t("donateTooltip")}
            >
              <span style={{ display: "inline-block", animation: "heartbeat 2.5s ease-in-out infinite" }}>
                <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
              </span>
              {t("donate")}
            </a>
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
          {/* Block 1 — no section label: Noodhulp + Doneer nu */}
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <div className="rounded-2xl border border-red-800/40 shadow-sm overflow-hidden mb-3" style={{ backgroundColor: "#7B1010" }}>
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
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-white block">{t("menuEmergency") ?? "Noodhulp"}</span>
                  <span className="text-xs text-white/65 block">Dieren in directe nood</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md shrink-0" style={{ backgroundColor: "#b34d10", color: "white" }}>
                  Urgent
                </span>
              </Link>
            </div>
            <Link
              href="/donate"
              onClick={closeMobileMenu}
              className="mobile-donate-btn flex items-center gap-3 px-4 py-3.5 rounded-2xl active:opacity-90 transition-colors text-white mb-6"
            >
              <Heart size={18} className="shrink-0 text-white" aria-hidden />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-[15px] text-white block">{t("donate")}</span>
                <span className="text-xs text-white/65 block">350 monden te voeden vandaag</span>
              </div>
              <ChevronRight size={16} className="shrink-0 text-white/60" aria-hidden />
            </Link>
          </div>

          {/* Block 2 — Red een dier */}
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3 pl-3 border-l-2 border-[#2aa348]">
              Red een dier
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/adopt"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                style={{ backgroundColor: "#fdf8f2" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 shrink-0">
                  <Dog size={26} color="#c2410c" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("menuAdoptMain")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuAdoptDogCardSubtext")}</span>
                <span className="mt-1.5 mr-1 flex flex-wrap gap-1 justify-center">
                  <span className="text-[10px] font-medium rounded-[5px] py-0.5 px-1.5 inline-block" style={{ backgroundColor: "#e8f5ec", color: "#1a5c2e" }}>350 honden</span>
                  <span className="text-[10px] font-medium rounded-[5px] py-0.5 px-1.5 inline-block" style={{ backgroundColor: "#fdeaea", color: "#7B1010" }}>50 invalide</span>
                </span>
              </Link>
              <Link
                href="/adopt?type=cat"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                style={{ backgroundColor: "#f4f6fd" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 shrink-0">
                  <Cat size={26} color="#0369a1" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("menuAdoptCat")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuAdoptCatSubtext")}</span>
                <span className="text-[10px] font-medium rounded-[5px] py-0.5 px-1.5 inline-block mt-1.5 mr-1" style={{ backgroundColor: "#e8f5ec", color: "#1a5c2e" }}>98 katten</span>
              </Link>
              {showSponsor && (
                <Link
                  href="/sponsor"
                  onClick={closeMobileMenu}
                  className="relative rounded-2xl border border-[#f3f4f6] p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                  style={{ backgroundColor: "#fdf0f0" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 shrink-0">
                    <Heart size={26} color="#e11d48" aria-hidden />
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{t("sponsor")}</span>
                  <span className="text-xs text-gray-400 mt-1">{t("menuSponsorCardSubtext")}</span>
                  <span className="text-[10px] font-medium rounded-[5px] py-0.5 px-1.5 inline-block mt-1.5 mr-1" style={{ backgroundColor: "#e8f5ec", color: "#1a5c2e" }}>Vanaf €10/mnd</span>
                </Link>
              )}
              <Link
                href="/volunteer"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                style={{ backgroundColor: "#f0faf3" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 shrink-0">
                  <Sun size={26} color="#059669" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("volunteer")}</span>
                <span className="text-xs text-gray-400 mt-1">{t("menuVolunteerSubtext")}</span>
                <span className="text-[10px] font-medium rounded-[5px] py-0.5 px-1.5 inline-block mt-1.5 mr-1" style={{ backgroundColor: "#e8f5ec", color: "#1a5c2e" }}>Plekken beschikbaar</span>
              </Link>
            </div>
          </div>

          {/* Block 3 — Doe mee */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3 pl-3 border-l-2 border-[#2aa348]">
              {t("menuSectionGetInvolved")}
            </p>
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <Link
                href="/get-involved"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors bg-[#f0faf3] hover:bg-[#e8f5ec]"
              >
                <span
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#1a5c2e",
                    background: "#e8f5ec",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  Doe mee!
                </span>
                <Home size={18} color={ICON_GREEN} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("getInvolved")}</span>
                  <span className="text-xs text-gray-500 block">Alle manieren om te helpen</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/street-dogs-thailand"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors bg-[#fff5f5] hover:bg-[#ffebeb]"
              >
                <span
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#7B1010",
                    background: "#fdeaea",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  Alarmerend
                </span>
                <MapPin size={18} color={ICON_GREEN} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("streetDogsThailand")}</span>
                  <span className="text-xs text-gray-500 block">600.000 zwerfhonden — wij pakken het aan</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/story"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors bg-[#f0faf3] hover:bg-[#e8f5ec]"
              >
                <span
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#1a5c2e",
                    background: "#e8f5ec",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  Sinds 1999
                </span>
                <BookOpen size={18} color={ICON_GREEN} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("ourStory")}</span>
                  <span className="text-[11px] text-gray-500 block mt-[1px]">Opgericht in 1999, sindsdien 2.500+ gered</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/about-us"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors bg-[#fff8f8] hover:bg-[#ffefef]"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open("https://www.youtube.com/@savedsoulsfoundation", "_blank", "noopener,noreferrer");
                  }}
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#cc0000",
                    background: "#fff0f0",
                    border: "0.5px solid #ffcccc",
                    borderRadius: "6px",
                    padding: "2px 10px",
                    cursor: "pointer",
                  }}
                >
                  ▶ YouTube
                </button>
                <PawPrint size={18} color={ICON_GREEN} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("aboutUs")}</span>
                  <span className="text-[11px] text-gray-500 block mt-[1px]">Dagelijks voeden, verzorgen en redden</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/gidsen"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3 min-h-[52px] border-amber-200/80 bg-amber-100 hover:bg-amber-200/60 active:bg-amber-200 transition-colors"
              >
                <span className="absolute top-2 right-3 bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t("menuInformativeBadge")}
                </span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 shrink-0">
                  <BookOpen size={16} color="#b45309" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-amber-900 block">{t("menuGidsenLabel")}</span>
                  <span className="text-[11px] text-gray-500 block mt-[1px]">Adoptie, zorg & gedrag</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
            </div>
          </div>

          {/* Block 4 — Vergroot impact */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3 pl-3 border-l-2 border-[#2aa348]">
              Vergroot impact
            </p>
            <div className="grid grid-cols-2 gap-3">
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
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="relative rounded-2xl border border-[#f3f4f6] p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                style={{ backgroundColor: "#fefcf0" }}
              >
                <span
                  className="whitespace-nowrap"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#a0600a",
                    background: "#fef3e2",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  🐾 Draag je liefde
                </span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 shrink-0" style={{ marginTop: "24px" }}>
                  <ShoppingBag size={26} color="#d97706" aria-hidden />
                </div>
                <span className="font-semibold text-sm text-gray-800">{t("shop")}</span>
                <span className="text-xs text-gray-400 mt-1">Draag ons verhaal</span>
              </Link>
            </div>
          </div>

          {/* Block 5 — MEER (no green border) */}
          <div className="mt-6 pb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <p className="text-xs font-semibold tracking-widest text-[#9ca3af] uppercase mb-3">
              {t("menuSectionMore")}
            </p>
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <Link
                href="/contact#contact-form"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 active:bg-gray-50 transition-colors bg-[#f0f4ff] hover:bg-[#e8eeff]"
              >
                <span
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#1a56a0",
                    background: "#e8f0fe",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  Schrijf ons
                </span>
                <span className="ss-pulse-icon">
                  <Mail size={18} color={ICON_GREEN} aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("contact")}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">Stuur ons een bericht</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
              <Link
                href="/thank-you"
                onClick={closeMobileMenu}
                className="relative flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors bg-[#f0faf3] hover:bg-[#e8f5ec]"
              >
                <span
                  className="absolute top-2 right-3 whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#1a5c2e",
                    background: "#e8f5ec",
                    borderRadius: "6px",
                    padding: "2px 10px",
                  }}
                >
                  ❤ Dankbaar
                </span>
                <Star size={18} color={ICON_GREEN} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[15px] text-gray-800 block">{t("thankYou")}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">Jullie maken het verschil</span>
                </div>
                <ChevronRight size={16} color={CHEVRON_GRAY} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
