"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const FROST_IMAGES = [
  { src: "/team-dogs.webp", alt: "Team and dogs" },
  { src: "/woman-dog-wheelchair.webp", alt: "Volunteer with dog in wheelchair" },
  { src: "/dog-wheelchair-small.webp", alt: "Dog with wheelchair" },
];

const CHAPTERS = [
  { key: "dogsCats", href: "/adopt", emoji: "🐕", emoji2: "🐈", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" },
  { key: "nutrition", href: "/nutrition", emoji: "🥩", emoji2: "🍽️", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30", wiki: "Raw_feeding" },
  { key: "health", href: "/health", emoji: "🏥", emoji2: "🛡️", gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30", wiki: "Veterinary_medicine" },
  { key: "firstAid", href: "/first-aid", emoji: "🚑", emoji2: "🏠", gradient: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30" },
  { key: "firstPetHome", href: "/first-pet-home", emoji: "🏠", emoji2: "🐕", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "behavior", href: "/behavior", emoji: "🧠", emoji2: "💚", gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30", wiki: "Dog_behavior" },
  { key: "training", href: "/toys-training", emoji: "🧸", emoji2: "🎯", gradient: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30", wiki: "Dog_training" },
  { key: "snacks", href: "/raw-hide", emoji: "🦴", emoji2: "⚠️", gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30", wiki: "Rawhide_(material)" },
  { key: "vaccinations", href: "/vaccinations", emoji: "💉", emoji2: "📅", gradient: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30", wiki: "Vaccination_of_dogs" },
  { key: "dogHomeAlone", href: "/dog-home-alone", emoji: "🚪", emoji2: "🐕", gradient: "from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30" },
  { key: "travelWithPet", href: "/travel-with-pet", emoji: "✈️", emoji2: "🐾", gradient: "from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30" },
  { key: "houseTraining", href: "/house-training", emoji: "🎯", emoji2: "🐕", gradient: "from-lime-50 to-emerald-50 dark:from-lime-950/30 dark:to-emerald-950/30" },
  { key: "movingWithPet", href: "/moving-with-pet", emoji: "🏠", emoji2: "📦", gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "catHairball", href: "/cat-hairball", emoji: "🐈", emoji2: "✨", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "puppySocialization", href: "/puppy-socialization", emoji: "🐕", emoji2: "🐾", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "dogBarking", href: "/dog-barking", emoji: "🔊", emoji2: "🐕", gradient: "from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30" },
  { key: "catIndoorOutdoor", href: "/cat-indoor-outdoor", emoji: "🐈", emoji2: "🪟", gradient: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30" },
  { key: "dogVomitingDiarrhea", href: "/dog-vomiting-diarrhea", emoji: "🩺", emoji2: "🐕", gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "dogAndCatTogether", href: "/dog-and-cat-together", emoji: "🐕", emoji2: "🐈", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" },
  { key: "toxicPlants", href: "/toxic-plants", emoji: "🌿", emoji2: "⚠️", gradient: "from-lime-50 to-emerald-50 dark:from-lime-950/30 dark:to-emerald-950/30" },
  { key: "petLoss", href: "/pet-loss", emoji: "💔", emoji2: "🕯️", gradient: "from-slate-50 to-stone-50 dark:from-slate-950/30 dark:to-stone-950/30" },
  { key: "petInsurance", href: "/pet-insurance", emoji: "📋", emoji2: "🛡️", gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" },
  { key: "seniorPet", href: "/senior-pet", emoji: "🐕", emoji2: "❤️", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "petProofHouse", href: "/pet-proof-house", emoji: "🏠", emoji2: "🛡️", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" },
  { key: "petSitter", href: "/pet-sitter", emoji: "🐾", emoji2: "✈️", gradient: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30" },
  { key: "petPassport", href: "/pet-passport", emoji: "📄", emoji2: "✈️", gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" },
  { key: "microchipping", href: "/microchipping", emoji: "📍", emoji2: "🐕", gradient: "from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30" },
  { key: "sterilization", href: "/sterilization", emoji: "🏥", emoji2: "❤️", gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "petAndChildren", href: "/pet-and-children", emoji: "👶", emoji2: "🐕", gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "overheating", href: "/overheating", emoji: "🌡️", emoji2: "⚠️", gradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" },
  { key: "foster", href: "/foster", emoji: "🏠", emoji2: "💜", gradient: "from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30" },
] as const;

const FAQ_SECTIONS: { titleKey: string; indices: number[] }[] = [
  { titleKey: "sectionAbout", indices: [0, 1, 2, 3, 4] },
  { titleKey: "sectionAdoption", indices: [5, 6, 7, 8, 9, 10] },
  { titleKey: "sectionDonate", indices: [11, 12, 13, 14, 15, 19, 20, 21] },
  { titleKey: "sectionVolunteer", indices: [16, 17, 18] },
  { titleKey: "sectionAnimals", indices: [22, 23, 24, 25, 26] },
  { titleKey: "sectionContact", indices: [27, 28, 29] },
];

function FrostPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClear, setIsClear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsClear(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "50px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] md:aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-lg group"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div
        className={`absolute inset-0 bg-white/55 dark:bg-stone-900/65 backdrop-blur-md transition-all duration-500 ease-out ${
          isClear ? "!opacity-0 !backdrop-blur-none" : ""
        } group-hover:!opacity-0 group-hover:!backdrop-blur-none`}
        aria-hidden
      />
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  donateLabel,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  donateLabel: string;
}) {
  return (
    <div className="border-b border-stone-200 dark:border-stone-700 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between gap-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-stone-800 dark:text-stone-100 group-hover:text-[#2aa348] transition-colors pr-4">
          {question}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 transition-all group-hover:bg-[#2aa348] group-hover:text-white"
          style={{ color: isOpen ? ACCENT_GREEN : undefined }}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 pr-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          {answer}
          <div className="mt-4">
            <Link
              href="/#donate"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {donateLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const t = useTranslations("faq");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const wikiLang = ["nl", "en", "de", "es", "th", "ru"].includes(locale) ? locale : "en";

  const faqCount = 30;
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    q: t(`q${i + 1}`),
    a: t(`a${i + 1}`),
  }));

  return (
    <ParallaxPage>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-12 md:pt-16 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center mb-10 md:mb-14">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
              {FROST_IMAGES.map((img, i) => (
                <FrostPhoto key={i} src={img.src} alt={img.alt} />
              ))}
            </div>
          </div>
        </section>

        {/* About Saved Souls – direct onder de foto's */}
        <section className="relative bg-white/95 dark:bg-stone-900/95 mx-4 md:mx-8 mt-8 md:mt-12 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="p-6 md:p-10 lg:p-14">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 pb-2 border-b-2" style={{ borderColor: ACCENT_GREEN }}>
                {t("sectionAbout")}
              </h3>
              {[0, 1, 2, 3, 4].map((i) => (
                <FaqItem
                  key={i}
                  question={faqs[i].q}
                  answer={faqs[i].a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  donateLabel={tCommon("donate")}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ tabs: Adoption, Donate, Volunteer, Animals, Contact – boven de placeholders */}
        <section className="relative bg-white/95 dark:bg-stone-900/95 mx-4 md:mx-8 mt-8 md:mt-12 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="p-6 md:p-10 lg:p-14">
            <div className="max-w-2xl mx-auto">
              {FAQ_SECTIONS.filter((s) => s.titleKey !== "sectionAbout").map(({ titleKey, indices }) => (
                <div key={titleKey} className="mb-10 last:mb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: ACCENT_GREEN }}>
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                      {t(titleKey)}
                    </h3>
                    {titleKey === "sectionAdoption" && (
                      <Link
                        href="/adopt-inquiry"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: ACCENT_GREEN }}
                      >
                        {tCommon("adopt")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {titleKey === "sectionDonate" && (
                      <Link
                        href="/#donate"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BUTTON_ORANGE }}
                      >
                        {tCommon("donate")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {titleKey === "sectionAnimals" && (
                      <Link
                        href="/sponsor"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BUTTON_ORANGE }}
                      >
                        {tCommon("sponsor")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {titleKey === "sectionVolunteer" && (
                      <Link
                        href="/volunteer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BUTTON_ORANGE }}
                      >
                        {t("volunteerSignUp")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {titleKey === "sectionContact" && (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: ACCENT_GREEN }}
                      >
                        {tCommon("contact")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                  {indices.map((i) => (
                    <FaqItem
                      key={i}
                      question={faqs[i].q}
                      answer={faqs[i].a}
                      isOpen={openIndex === i}
                      onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                      donateLabel={tCommon("donate")}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct naar – links met placeholders */}
        <section className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200 dark:border-stone-700 shadow-xl p-6 md:p-10">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
              {t("linksTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{t("linksPlaceholderGetInvolved")}</p>
                <Link href="/get-involved" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {t("getInvolved")} →
                </Link>
              </div>
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{t("linksPlaceholderDonate")}</p>
                <Link href="/#donate" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {tCommon("donate")} →
                </Link>
              </div>
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{t("linksPlaceholderAdopt")}</p>
                <Link href="/adopt" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {tCommon("adopt")} →
                </Link>
              </div>
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{t("linksPlaceholderGuides")}</p>
                <Link href="/get-involved#info" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {t("linksPlaceholderGuides")} →
                </Link>
              </div>
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{t("linksPlaceholderFinancial")}</p>
                <Link href="/financial-overview" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {tCommon("financialOverview")} →
                </Link>
              </div>
              <div className="rounded-xl p-4 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{tCommon("shop")}</p>
                <Link href="/shop" className="font-medium text-stone-800 dark:text-stone-200 hover:underline" style={{ color: ACCENT_GREEN }}>
                  {tCommon("shop")} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Souls + placeholders (chapter cards) */}
        <section id="chapters" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Saved Souls
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: ACCENT_GREEN }}>
            {t("chapters.intro")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {CHAPTERS.map((chapter) => {
              const { key, href, emoji, emoji2, gradient } = chapter;
              const wiki = "wiki" in chapter ? chapter.wiki : undefined;
              return (
              <div
                key={key}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} border-2 border-stone-200/80 dark:border-stone-600/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group`}
              >
                {/* Placeholder: symbolen bovenaan */}
                <div className="p-5 pb-2 flex items-center justify-center gap-2 bg-white/40 dark:bg-black/10">
                  <span className="text-4xl md:text-5xl transition-transform group-hover:scale-110">{emoji}</span>
                  <span className="text-2xl md:text-3xl opacity-80">{emoji2}</span>
                </div>
                <div className="p-5 pt-3">
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">
                    {t(`chapters.${key}.title`)}
                  </h3>
                  <p className="text-base text-stone-600 dark:text-stone-400 mb-4 leading-relaxed line-clamp-4">
                    {t(`chapters.${key}.teaser`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                  <Link
                    href="/#donate"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BUTTON_ORANGE }}
                  >
                    {tCommon("donate")}
                  </Link>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: ACCENT_GREEN }}
                  >
                    {t("readMore")}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {wiki && (
                    <Link
                      href={`/go?url=${encodeURIComponent(`https://${wikiLang}.wikipedia.org/wiki/${wiki}`)}&return=${encodeURIComponent("/faq")}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border-2 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-stone-500 dark:hover:border-stone-500 transition-colors"
                    >
                      {t("onWikipedia")}
                    </Link>
                  )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
          <p className="mt-10 text-center text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {t("chapters.introText")}
          </p>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("stillQuestions")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("contactUs")}
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("getInvolved")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
