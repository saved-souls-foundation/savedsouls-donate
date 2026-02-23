import Image from "next/image";
import { Home, Rabbit, Luggage, HeartHandshake, Quote, CalendarClock, Users, Heart, AlertTriangle, PawPrint, Camera, ClipboardList, Dog, Cat } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import ClinicActionButton from "../../components/ClinicActionButton";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "Volunteer | Saved Souls Foundation",
  description:
    "Join the Furry Revolution! Volunteer with Saved Souls Foundation in Khon Kaen, Thailand. Minimum 2 weeks. Help rescued dogs and cats. Apply now.",
};

export default async function VolunteerPage() {
  const t = await getTranslations("volunteer");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-stone-700 dark:text-stone-300 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </h2>
          <div className="flex justify-center gap-4 mb-6">
            <span className="animate-icon-float inline-block" style={{ color: ACCENT_GREEN }}>
              <Dog className="h-10 w-10 md:h-12 md:w-12" strokeWidth={2} />
            </span>
            <span className="animate-icon-float animate-icon-float-delay-1 inline-block" style={{ color: ACCENT_GREEN }}>
              <Cat className="h-10 w-10 md:h-12 md:w-12" strokeWidth={2} />
            </span>
            <span className="animate-icon-float animate-icon-float-delay-2 inline-block" style={{ color: ACCENT_GREEN }}>
              <Heart className="h-10 w-10 md:h-12 md:w-12 fill-current" strokeWidth={2} />
            </span>
            <span className="animate-icon-float animate-icon-float-delay-3 inline-block text-3xl md:text-4xl">🐾</span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg mb-6 max-w-2xl mx-auto w-full aspect-[4/3] bg-stone-200 dark:bg-stone-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <img
              src="/volunteer-hero.png"
              alt="Volunteer petting a happy dog at Saved Souls Foundation sanctuary"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto font-bold mb-8">
            {t("intro")}
          </p>
          <Link
            href="/volunteer-signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {tCommon("volunteerSignUp")}
          </Link>
        </header>

        <section className="space-y-8">
          {/* Volunteer Stories */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center justify-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("storiesTitle")}
              <Quote className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
              <span className="animate-icon-float animate-icon-float-delay-1 text-2xl">❤️</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-1.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story1Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-base font-medium mt-1">{t("story1Author")}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-2.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story2Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-base font-medium mt-1">{t("story2Author")}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 shadow">
                  <Image src="/volunteer-story-3.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <blockquote className="pl-4 border-l-4 py-2 text-stone-700 dark:text-stone-300 italic" style={{ borderColor: ACCENT_GREEN }}>
                    {t("story3Quote")}
                  </blockquote>
                  <p className="text-stone-600 dark:text-stone-400 text-base font-medium mt-1">{t("story3Author")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF: Intro & Thank you */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <div className="flex gap-2 mb-4">
              <span className="animate-icon-float text-2xl">🐕</span>
              <span className="animate-icon-float animate-icon-float-delay-1 text-2xl">🐈</span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfIntro")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfIntro2")}</p>
          </div>

          {/* Grote foto: 2 mensen + 2 honden – na 2 secties */}
          <div className="flex justify-center my-10">
            <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 max-w-2xl w-full aspect-[4/3] relative animate-volunteer-connection">
              <Image
                src="/volunteers-with-dogs.png"
                alt={t("imgVolunteersAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          </div>

          {/* Allow Us To Introduce Ourselves */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleIntroduce")}
              <Users className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfAboutUs")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfAboutUs2")}</p>
          </div>

          {/* What We Believe In */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleBelieve")}
              <Heart className="h-7 w-7 shrink-0 animate-icon-float fill-current" stroke="currentColor" />
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfBelieve")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfBelieve2")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfBelieve3")}</p>
          </div>

          {/* Our Reality */}
          <div className="rounded-2xl p-6 md:p-8 bg-stone-100 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleReality")}
              <AlertTriangle className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfReality")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfReality2")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfReality3")}</p>
          </div>

          {/* Our Special Needs Dogs */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleSpecialNeeds")}
              <PawPrint className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfSpecialNeeds")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfSpecialNeeds2")}</p>
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-700 max-w-md mx-auto">
              <Image
                src="/volunteer-holding-dog.png"
                alt={t("imgVolunteerHoldingDogAlt")}
                width={672}
                height={504}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>

          {/* Every Soul Is Valuable - We Need You! */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 border-2 border-[#2aa348]/50 shadow-lg text-center">
            <div className="flex justify-center gap-3 mb-4">
              <span className="animate-icon-float inline-block text-3xl">🐕</span>
              <span className="animate-icon-float animate-icon-float-delay-1 inline-block text-3xl">🐈</span>
              <span className="animate-icon-float animate-icon-float-delay-2 inline-block text-3xl">❤️</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
              {t("pdfNeedYou")}
            </p>
          </div>

          {/* Working as a volunteer - Ask Yourself */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleWorking")}
              <span className="animate-icon-float inline-block">🐾</span>
            </h2>
            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">{t("pdfAskYourself")}</h3>
            <ul className="space-y-3 text-stone-600 dark:text-stone-400 mb-6">
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk1")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk2")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk3")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk4")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk5")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk6")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfAsk7")}</li>
            </ul>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4 italic">{t("pdfWorkNote")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfWorkNote2")}</p>
          </div>

          {/* How You Can Help During Your Stay */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("sectionTitleHowHelp")}
              <div className="flex gap-1">
                <Dog className="h-6 w-6 animate-icon-float" stroke="currentColor" />
                <Cat className="h-6 w-6 animate-icon-float animate-icon-float-delay-1" stroke="currentColor" />
              </div>
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("pdfHelp1Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfHelp1")}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("pdfHelp2Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfHelp2")}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("pdfHelp3Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfHelp3")}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
                  {t("pdfHelp4Title")}
                  <Camera className="h-5 w-5 shrink-0" stroke="currentColor" />
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("pdfHelp4")}</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/SavedSoulsFoundation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: "#1877F2" }}
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.youtube.com/@savedsoulsfoundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: "#ff0000" }}
                  >
                    YouTube
                  </a>
                  <a
                    href="https://www.instagram.com/savedsoulsfoundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
                    style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.reddit.com/user/SoulsaversSSF/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: "#ff4500" }}
                  >
                    Reddit
                  </a>
                  <a
                    href="https://www.tiktok.com/@savedsoulsfoundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: "#000000" }}
                  >
                    TikTok
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("pdfHelp5Title")}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("pdfHelp5")}</p>
              </div>
            </div>
          </div>

          {/* Ground rules */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("pdfGroundRules")}
              <ClipboardList className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
            </h2>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround1")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround2")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround3")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround4")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround5")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround6")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround7")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround8")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround9")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfGround10")}</li>
            </ul>
          </div>

          {/* Before coming */}
          <div className="rounded-2xl p-6 md:p-8 bg-stone-100 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("pdfBefore")}
              <Luggage className="h-7 w-7 shrink-0 animate-icon-float" stroke="currentColor" />
            </h2>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfBefore1")}</li>
              <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">•</span>{t("pdfBefore2")}</li>
            </ul>
          </div>

          {/* Ready to Make a Difference */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("readyTitle")}
              <HeartHandshake className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <span>📍</span> {t("location")}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("locationText")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
                  <span>✓</span> {t("whatWeNeed")}
                </h3>
                <ul className="space-y-2 text-stone-600 dark:text-stone-400 font-bold">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need1")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need2")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need3")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    {t("need4")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <strong>{t("need5")}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Day at Saved Souls */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("yourDay")}
              <CalendarClock className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{t("morning")}</p>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("morningText")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{t("afternoon")}</p>
                <p className="text-stone-600 dark:text-stone-400 font-bold">
                  {t("afternoonText")}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg border-2 border-stone-200 dark:border-stone-700 max-w-md mx-auto relative">
              <Image
                src="/volunteer-swim-therapy.png"
                alt={t("imgSwimTherapyAlt")}
                width={448}
                height={336}
                className="w-full h-auto object-contain object-top"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>

          {/* What to Pack */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("whatToPack")}
              <Luggage className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400 font-bold">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack3")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                {t("pack4")}
              </li>
            </ul>
          </div>

          {/* Your Home Away From Home */}
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("homeTitle")}
              <Home className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4 font-bold">
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("sharedHouse")}</strong> {t("sharedHouseText")}</p>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("bungalows")}</strong> {t("bungalowsText")}</p>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("commonAreas")}</strong> {t("commonAreasText")}</p>
              <div className="pt-2">
                <p className="font-semibold text-stone-800 dark:text-stone-100 mb-2">{t("meals")}</p>
                <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                  <li>• {t("meals1")}</li>
                  <li>• {t("meals2")}</li>
                </ul>
              </div>
              <p className="text-stone-600 dark:text-stone-400"><strong className="text-stone-800 dark:text-stone-100">{t("perks")}</strong> {t("perksText")}</p>
            </div>
          </div>

          {/* Ready to Jump In - CTA */}
          <div className="rounded-2xl p-8 md:p-10 bg-stone-100 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-800/50">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center justify-center gap-2" style={{ color: ACCENT_GREEN }}>
              {t("readyJump")}
              <Rabbit className="h-7 w-7 shrink-0" stroke="currentColor" />
            </h2>
            <div className="space-y-4 mb-8 font-bold">
              <p>
                <a
                  href="mailto:volunteer@savedsouls-foundation.org"
                  className="font-semibold text-stone-800 dark:text-stone-100 hover:underline"
                  style={{ color: ACCENT_GREEN }}
                >
                  {t("emailUs")}
                </a>
              </p>
              <p className="text-stone-600 dark:text-stone-400">
                <a
                  href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: ACCENT_GREEN }}
                >
                  {t("downloadBrochure")}
                </a>
                {" "}{t("brochureSuffix")}
              </p>
            </div>
            <p className="text-xl font-semibold text-stone-700 dark:text-stone-300 mb-4" style={{ color: ACCENT_GREEN }}>
              {t("pdfLookingForward")}
            </p>
            <p className="text-lg italic text-stone-600 dark:text-stone-400 mb-6 font-bold">
              {t("quote")}
            </p>
            <p className="text-stone-500 dark:text-stone-500 text-sm font-bold">
              <strong>{t("footer")}</strong><br />
              {t("footerTagline")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link
                href="/#donate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tCommon("donate")}
              </Link>
              <Link
                href="/volunteer-signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {tCommon("volunteerSignUp")}
              </Link>
              <a
                href="mailto:volunteer@savedsouls-foundation.org"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("emailButton")}
              </a>
              <a
                href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("downloadButton")}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("contactButton")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ClinicActionButton />

      <Footer />
    </ParallaxPage>
  );
}
