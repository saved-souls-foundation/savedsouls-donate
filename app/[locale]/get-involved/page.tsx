import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";
const WARM_CORAL = "#f97316";
const SOFT_TEAL = "#0d9488";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getInvolved" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default async function GetInvolvedPage() {
  const t = await getTranslations("getInvolved");
  const tCommon = await getTranslations("common");

  const mainActions = [
    {
      href: "/donate",
      img: "/hero-hug.webp",
      label: t("donate"),
      tagline: t("donateTagline"),
      color: ACCENT_GREEN,
      icon: "❤️",
    },
    {
      href: "/sponsor",
      img: "/dog-care.webp",
      label: t("sponsor"),
      tagline: t("sponsorTagline"),
      color: WARM_CORAL,
      icon: "🐾",
    },
    {
      href: "/volunteer",
      img: "/volunteer-hero.png",
      label: t("volunteer"),
      tagline: t("volunteerTagline"),
      color: SOFT_TEAL,
      icon: "✨",
    },
    {
      href: "/adopt",
      img: "/woman-hug-dog.webp",
      label: t("adoptTitle"),
      tagline: t("adoptTagline"),
      color: ACCENT_GREEN,
      icon: "🏠",
    },
  ];

  const moreWays = [
    { href: "/feed-a-year", label: t("feedAYear") },
    { href: "/clinic-renovation", label: t("clinicRenovation") },
    { href: "/car-action", label: t("carAction") },
    { href: "/donate/thai", label: t("donateBankTransfer") },
    { href: "/contact", label: t("visitSanctuary") },
    { href: "/sponsor", label: t("sponsor") },
    { href: "/adopt", label: t("adoptTitle") },
    { href: "/luchtbrug", label: t("luchtbrug") },
    { href: "/shop", label: tCommon("shop") },
    { href: "/thank-you", label: tCommon("thankYou") },
  ];

  const orgLinks = [
    { href: "/gallery", label: tCommon("gallery") },
    { href: "/press", label: tCommon("press") },
    { href: "/partners", label: tCommon("partners") },
    { href: "/shelters", label: tCommon("shelters") },
    { href: "/admin", label: tCommon("cms") },
  ];

  const infoPagesByPlaceholder: { placeholderKey: string; links: { href: string; label: string }[] }[] = [
    {
      placeholderKey: "infoPlaceholderGeneral",
      links: [
        { href: "/faq", label: tCommon("faq") },
        { href: "/blog", label: tCommon("blog") },
        { href: "/donate/causes", label: tCommon("donateCauses") },
        { href: "/financial-overview", label: tCommon("financialOverview") },
        { href: "/school-project", label: tCommon("schoolProject") },
        { href: "/fireworks-pets", label: tCommon("fireworksPets") },
      ],
    },
    {
      placeholderKey: "infoPlaceholderHealth",
      links: [
        { href: "/nutrition", label: tCommon("nutrition") },
        { href: "/health", label: tCommon("health") },
        { href: "/flea-tick-parasite-guide", label: tCommon("fleaTickParasiteGuide") },
        { href: "/toxic-plants", label: tCommon("toxicPlants") },
        { href: "/pet-loss", label: tCommon("petLoss") },
        { href: "/pet-insurance", label: tCommon("petInsurance") },
        { href: "/senior-pet", label: tCommon("seniorPet") },
      ],
    },
    {
      placeholderKey: "infoPlaceholderPractical",
      links: [
        { href: "/microchipping", label: tCommon("microchipping") },
        { href: "/sterilization", label: tCommon("sterilization") },
        { href: "/pet-proof-house", label: tCommon("petProofHouse") },
        { href: "/pet-sitter", label: tCommon("petSitter") },
        { href: "/pet-passport", label: tCommon("petPassport") },
        { href: "/pet-and-children", label: tCommon("petAndChildren") },
        { href: "/overheating", label: tCommon("overheating") },
        { href: "/foster", label: tCommon("foster") },
      ],
    },
    {
      placeholderKey: "infoPlaceholderBehavior",
      links: [
        { href: "/behavior", label: tCommon("behavior") },
        { href: "/toys-training", label: tCommon("toysTraining") },
        { href: "/raw-hide", label: tCommon("rawHide") },
      ],
    },
    {
      placeholderKey: "infoPlaceholderFirstPet",
      links: [
        { href: "/dog-home-alone", label: tCommon("dogHomeAlone") },
        { href: "/travel-with-pet", label: tCommon("travelWithPet") },
        { href: "/house-training", label: tCommon("houseTraining") },
        { href: "/moving-with-pet", label: tCommon("movingWithPet") },
        { href: "/puppy-socialization", label: tCommon("puppySocialization") },
        { href: "/dog-barking", label: tCommon("dogBarking") },
        { href: "/dog-and-cat-together", label: tCommon("dogAndCatTogether") },
      ],
    },
    {
      placeholderKey: "infoPlaceholderGuides",
      links: [
        { href: "/microchipping", label: tCommon("microchipping") },
        { href: "/sterilization", label: tCommon("sterilization") },
        { href: "/pet-and-children", label: tCommon("petAndChildren") },
        { href: "/overheating", label: tCommon("overheating") },
        { href: "/foster", label: tCommon("foster") },
        { href: "/pet-proof-house", label: tCommon("petProofHouse") },
        { href: "/pet-sitter", label: tCommon("petSitter") },
        { href: "/pet-passport", label: tCommon("petPassport") },
        { href: "/toxic-plants", label: tCommon("toxicPlants") },
        { href: "/pet-loss", label: tCommon("petLoss") },
        { href: "/pet-insurance", label: tCommon("petInsurance") },
        { href: "/senior-pet", label: tCommon("seniorPet") },
        { href: "/cat-hairball", label: tCommon("catHairball") },
        { href: "/cat-indoor-outdoor", label: tCommon("catIndoorOutdoor") },
        { href: "/dog-vomiting-diarrhea", label: tCommon("dogVomitingDiarrhea") },
        { href: "/disabled-dog-guide", label: tCommon("disabledDogGuide") },
        { href: "/dog-meat-survivors", label: tCommon("dogMeatSurvivors") },
        { href: "/paralyzed-dogs-guide", label: tCommon("paralyzedDogsGuide") },
        { href: "/william-heinecke-elephants", label: tCommon("williamHeineckeElephants") },
        { href: "/minor-hotels", label: tCommon("minorHotels") },
      ],
    },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp" noOverlay>
      <div className="min-h-screen bg-gradient-to-b from-white via-stone-50/95 to-white dark:from-stone-900 dark:via-stone-900/98 dark:to-stone-900">
        <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          {/* Hero */}
          <header className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2aa348]/10 dark:bg-[#2aa348]/20 mb-6">
              <span className="text-2xl">🐕</span>
              <span className="text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                {t("heroBadge")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-800 dark:text-stone-100 mb-4">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </header>

          {/* 4 main action cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
            {mainActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative block rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-600 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-[#2aa348]/40 transition-all duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={action.img}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity"
                    style={{ background: `linear-gradient(to top, ${action.color}99 0%, transparent 50%)` }}
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/90 dark:bg-stone-900/90 flex items-center justify-center text-2xl shadow-lg">
                    {action.icon}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg mb-1">{action.label}</h2>
                    <p className="text-sm text-white/90 drop-shadow">{action.tagline}</p>
                    <span
                      className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-white"
                      style={{ color: "white" }}
                    >
                      {t("learnMore")} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* More ways to help */}
          <section className="rounded-2xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600 shadow-xl p-8 md:p-10 mb-6">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              <span>📚</span> {t("moreWaysTitle")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {moreWays.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`inline-flex items-center px-4 py-2.5 rounded-xl font-medium border-2 border-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 ${
                    link.href === "/thank-you"
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 hover:bg-pink-200 hover:text-pink-800 hover:border-pink-300 dark:hover:bg-pink-900/50 dark:hover:text-pink-200 dark:hover:border-pink-600"
                      : "bg-stone-100 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-[#2aa348]/15 hover:text-[#2aa348] hover:border-[#2aa348]/40 dark:hover:bg-[#2aa348]/20 dark:hover:text-[#2aa348]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Pers, Partners, CMS */}
          <section className="rounded-2xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600 shadow-xl p-8 md:p-10 mb-6">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              <span>🔗</span> {t("orgLinksTitle")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {orgLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="inline-flex items-center px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300 font-medium border-2 border-transparent hover:bg-[#2aa348]/15 hover:text-[#2aa348] hover:border-[#2aa348]/40 hover:scale-105 hover:shadow-lg dark:hover:bg-[#2aa348]/20 dark:hover:text-[#2aa348] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Information & guides – met placeholder categorieën */}
          <section id="info" className="rounded-2xl bg-white dark:bg-stone-800/80 border-2 border-stone-200 dark:border-stone-600 shadow-xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              <span>📖</span> {t("infoTitle")}
            </h2>
            {infoPagesByPlaceholder.map((group) => (
              <div key={group.placeholderKey} className="mb-8 last:mb-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 pb-1 border-b border-stone-200 dark:border-stone-600">
                  {t(group.placeholderKey)}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={`inline-flex items-center px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300 font-medium border-2 border-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 ${
                        link.href === "/raw-hide"
                          ? "hover:bg-red-100 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-700"
                          : "hover:bg-[#2aa348]/15 hover:text-[#2aa348] hover:border-[#2aa348]/40 dark:hover:bg-[#2aa348]/20 dark:hover:text-[#2aa348]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("donateNow")} ❤️
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:opacity-90"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              ← {tCommon("backToHome")}
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
