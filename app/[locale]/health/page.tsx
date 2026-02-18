"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

/** Wikipedia slugs - veterinary/pet-specific pages (dogs & cats) */
const DISEASE_WIKI: Record<string, string> = {
  diseaseCommon1: "Veterinary_dentistry",
  diseaseCommon2: "Flea_allergy_dermatitis",
  diseaseCommon3: "Otitis_externa_in_animals",
  diseaseCommon4: "Obesity_in_pets",
  diseaseCommon5: "Diabetes_in_dogs",
  diseaseCommon6: "List_of_dog_diseases",
  diseaseCommon7: "Toxocara_canis",
  diseaseCommon8: "Rabies_in_animals",
  diseaseCommon9: "Microsporum_canis",
  diseaseCommon10: "Cat_flu",
  diseaseDog1: "Canine_parvovirus",
  diseaseDog2: "Kennel_cough",
  diseaseDog3: "Heartworm",
  diseaseDog4: "Hip_dysplasia_(canine)",
  diseaseDog5: "Canine_distemper",
  diseaseDog6: "Cushing%27s_syndrome_(veterinary)",
  diseaseDog7: "Gastric_dilatation_volvulus",
  diseaseCat1: "Chronic_kidney_disease_in_cats",
  diseaseCat2: "Feline_lower_urinary_tract_disease",
  diseaseCat3: "Feline_hyperthyroidism",
  diseaseCat4: "Feline_panleukopenia",
  diseaseCat5: "Feline_leukemia_virus",
  diseaseCat6: "Feline_immunodeficiency_virus",
  diseaseCat7: "Feline_asthma",
};

const SECTIONS = [
  { key: "vaccinations", emoji: "💉", color: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30" },
  { key: "fleasTicks", emoji: "🦟", color: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
  { key: "heartworm", emoji: "❤️‍🩹", color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "deworming", emoji: "🪱", color: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30" },
  { key: "eyes", emoji: "👀", color: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" },
  { key: "ears", emoji: "👂", color: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30" },
  { key: "earMites", emoji: "🦠", color: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30" },
  { key: "sneezing", emoji: "🤧", color: "from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30" },
  { key: "sneezingDisease", emoji: "😿", color: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30" },
  { key: "skinCoat", emoji: "✨", color: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30" },
  { key: "skinProblems", emoji: "🩹", color: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30" },
  { key: "infections", emoji: "🦠", color: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30" },
  { key: "tropics", emoji: "🌴", color: "from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30" },
  { key: "dangers", emoji: "⚠️", color: "from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-900/50" },
  { key: "general", emoji: "🏥", color: "from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30" },
] as const;

export default function HealthPage() {
  const t = useTranslations("health");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const wikiLang = ["nl", "en", "de", "th", "ru"].includes(locale) ? locale : "en";

  const WikiLink = ({ diseaseKey, children }: { diseaseKey: string; children: React.ReactNode }) => {
    const slug = DISEASE_WIKI[diseaseKey];
    if (!slug) return <>{children}</>;
    const wikiUrl = `https://${wikiLang}.wikipedia.org/wiki/${slug}`;
    const goUrl = `/go?url=${encodeURIComponent(wikiUrl)}&return=${encodeURIComponent("/health")}`;
    return (
      <Link
        href={goUrl}
        className="underline hover:no-underline font-semibold"
        style={{ color: ACCENT_GREEN }}
      >
        {children}
      </Link>
    );
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">
          ← {tCommon("backToHome")}
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            🐕 🐈 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Intro met afbeelding */}
        <section className="mb-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              {t("intro")}
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-80 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/dog-care.webp" alt={t("imgCareAlt")} width={400} height={300} className="w-full h-64 object-cover" />
          </div>
        </section>

        {/* Secties */}
        <div className="space-y-6 mb-16">
          {SECTIONS.map(({ key, emoji, color }) => {
            const isFleasTicks = key === "fleasTicks";
            const isVaccinations = key === "vaccinations";
            const isHeartworm = key === "heartworm";
            const isDeworming = key === "deworming";
            const isEyeEarCare = key === "eyes" || key === "ears";
            const isEarMitesSneezing = key === "earMites" || key === "sneezing";
            const isCatFlu = key === "sneezingDisease";
            const isSkinCoat = key === "skinCoat";
            const isSkinProblems = key === "skinProblems";
            const isInfections = key === "infections";
            const isTropics = key === "tropics";
            const isDangers = key === "dangers";
            const isGeneral = key === "general";
            const content = (
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 shadow-sm">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
                    {t(`${key}Title`)}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {t(`${key}Text`)}
                  </p>
                  <p className="mt-3 text-sm font-medium text-stone-700 dark:text-stone-300">
                    💡 {t(`${key}Tip`)}
                  </p>
                  {isFleasTicks && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("fleasTicksReadMore")}
                    </p>
                  )}
                  {isVaccinations && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("vaccinationsReadMore")}
                    </p>
                  )}
                  {isHeartworm && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("heartwormReadMore")}
                    </p>
                  )}
                  {isDeworming && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("dewormingReadMore")}
                    </p>
                  )}
                  {isEyeEarCare && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("eyeEarCareReadMore")}
                    </p>
                  )}
                  {isEarMitesSneezing && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("earMitesSneezingReadMore")}
                    </p>
                  )}
                  {isCatFlu && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("catFluReadMore")}
                    </p>
                  )}
                  {isSkinCoat && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("skinCoatReadMore")}
                    </p>
                  )}
                  {isSkinProblems && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("skinProblemsReadMore")}
                    </p>
                  )}
                  {isInfections && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("infectionsReadMore")}
                    </p>
                  )}
                  {isTropics && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("tropicsReadMore")}
                    </p>
                  )}
                  {isDangers && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("dangersReadMore")}
                    </p>
                  )}
                  {isGeneral && (
                    <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
                      → {t("generalReadMore")}
                    </p>
                  )}
                </div>
              </div>
            );
            return (
              <section
                key={key}
                className={`rounded-2xl p-6 md:p-8 bg-gradient-to-br ${color} border-2 border-stone-200/80 dark:border-stone-600/80 shadow-lg hover:shadow-xl transition-shadow ${(isFleasTicks || isVaccinations || isHeartworm || isDeworming || isEyeEarCare || isEarMitesSneezing || isCatFlu || isSkinCoat || isSkinProblems || isInfections || isTropics || isDangers || isGeneral) ? "cursor-pointer" : ""}`}
              >
                {isFleasTicks ? (
                  <Link href="/flea-tick-parasite-guide" className="block">
                    {content}
                  </Link>
                ) : isVaccinations ? (
                  <Link href="/vaccinations" className="block">
                    {content}
                  </Link>
                ) : isHeartworm ? (
                  <Link href="/heartworm" className="block">
                    {content}
                  </Link>
                ) : isDeworming ? (
                  <Link href="/deworming" className="block">
                    {content}
                  </Link>
                ) : isEyeEarCare ? (
                  <Link href="/eye-ear-care" className="block">
                    {content}
                  </Link>
                ) : isEarMitesSneezing ? (
                  <Link href="/ear-mites-sneezing" className="block">
                    {content}
                  </Link>
                ) : isCatFlu ? (
                  <Link href="/cat-flu" className="block">
                    {content}
                  </Link>
                ) : isSkinCoat ? (
                  <Link href="/skin-coat" className="block">
                    {content}
                  </Link>
                ) : isSkinProblems ? (
                  <Link href="/skin-problems" className="block">
                    {content}
                  </Link>
                ) : isInfections ? (
                  <Link href="/infections" className="block">
                    {content}
                  </Link>
                ) : isTropics ? (
                  <Link href="/tropics" className="block">
                    {content}
                  </Link>
                ) : isDangers ? (
                  <Link href="/dangers" className="block">
                    {content}
                  </Link>
                ) : isGeneral ? (
                  <Link href="/general-health" className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </section>
            );
          })}
        </div>

        {/* Afbeelding break */}
        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/hero-hug.png" alt={t("imgCareAlt")} width={500} height={350} className="w-full h-56 object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/volunteer-hero.png" alt={t("imgCareAlt")} width={500} height={350} className="w-full h-56 object-cover" />
          </div>
        </div>

        {/* Ziektengids */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: ACCENT_GREEN }}>
            📚 {t("diseasesTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8">{t("diseasesIntro")}</p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐕🐈</span> {t("diseasesCommonTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">
                      <WikiLink diseaseKey={`diseaseCommon${i}`}>{t(`diseaseCommon${i}Name`)}</WikiLink>
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`diseaseCommon${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐕</span> {t("diseasesDogTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">
                      <WikiLink diseaseKey={`diseaseDog${i}`}>{t(`diseaseDog${i}Name`)}</WikiLink>
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`diseaseDog${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🐈</span> {t("diseasesCatTitle")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">
                      <WikiLink diseaseKey={`diseaseCat${i}`}>{t(`diseaseCat${i}Name`)}</WikiLink>
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`diseaseCat${i}Info`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-stone-500 dark:text-stone-500 text-sm italic">
              {t("diseasesSource")}
            </p>

            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3">{t("diseasesPreventionTitle")}</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i}>✓ {t(`diseasesPrevention${i}`)}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-3">🚨 {t("diseasesEmergencyTitle")}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">{t("diseasesEmergencyIntro")}</p>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <li key={i}>• {t(`diseasesEmergency${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Dierenarts disclaimer */}
        <div className="mb-16 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-center font-medium">
            🩺 {t("vetDisclaimer")}
          </p>
        </div>

        {/* Donatie CTA */}
        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              {t("donateCtaTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {t("donateCtaText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {t("donateCtaButton")}
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {tCommon("getInvolved")}
              </Link>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl font-semibold border-2" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>
            ← {tCommon("backToHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
