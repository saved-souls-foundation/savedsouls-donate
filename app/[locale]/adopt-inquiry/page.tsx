"use client";

import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import SiteHeader from "../../components/SiteHeader";
import AdoptInquiryForm from "../../components/AdoptInquiryForm";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";
const ACCENT_AMBER = "#f59e0b";

function AdoptInquiryPageContent() {
  const t = useTranslations("adoptInquiry");
  const searchParams = useSearchParams();
  const animalName = searchParams.get("animal") || "";
  const animalId = searchParams.get("id") || "";

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Gradient achtergrond */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${ACCENT_GREEN}25, transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, ${ACCENT_TEAL}15, transparent),
            radial-gradient(ellipse 60% 40% at 0% 80%, ${ACCENT_AMBER}12, transparent),
            linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)
          `,
        }}
      />

      <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#2aa348]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#0d9488]/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-[#e11d48]/20 dark:text-rose-400/15"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${(i * 7) % 100}%`,
              fontSize: `${14 + (i % 5) * 8}px`,
              animation: `float-heart ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}
          >
            <span className="animate-[pulse-heart_1.5s_ease-in-out_infinite]">♥</span>
            {t("badge")}
            <span className="animate-[pulse-heart_1.5s_ease-in-out_infinite]" style={{ animationDelay: "0.5s" }}>♥</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100 mb-4 tracking-tight">
            {t("titlePart1")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto mb-3">
            {t("subtitle")}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-2">
            {t("tagline")}
          </p>
        </div>

        <AdoptInquiryForm
          animalName={animalName}
          animalId={animalId}
          idPrefix="adopt-inquiry"
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-stone-600 dark:text-stone-400">
          <Link
            href="/adoptieproces"
            className="flex items-center gap-2 hover:opacity-80 hover:underline transition-opacity group"
            style={{ color: "inherit" }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs group-hover:scale-110 transition-transform" style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}>♥</span>
            {t("trustBadge1")}
          </Link>
          <Link
            href="/medische-reisvoorbereiding"
            className="flex items-center gap-2 hover:opacity-80 hover:underline transition-opacity group"
            style={{ color: "inherit" }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs group-hover:scale-110 transition-transform" style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}>♥</span>
            {t("trustBadge2")}
          </Link>
          <Link
            href="/visit-and-adopt"
            className="flex items-center gap-2 hover:opacity-80 hover:underline transition-opacity group"
            style={{ color: "inherit" }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs group-hover:scale-110 transition-transform" style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}>♥</span>
            {t("trustBadge3")}
          </Link>
        </div>
        <p className="mt-6 text-center text-sm text-stone-400 dark:text-stone-500">
          {t("footer")}
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default function AdoptInquiryLandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Loading...</p>
      </div>
    }>
      <AdoptInquiryPageContent />
    </Suspense>
  );
}
