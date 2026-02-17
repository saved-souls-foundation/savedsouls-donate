"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const FROST_IMAGES = [
  { src: "/team-dogs.webp", alt: "Team and dogs" },
  { src: "/woman-dog-wheelchair.webp", alt: "Volunteer with dog in wheelchair" },
  { src: "/dog-wheelchair-small.webp", alt: "Dog with wheelchair" },
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
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border-b border-stone-200 dark:border-stone-700 last:border-0"
    >
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
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 pr-12 text-stone-600 dark:text-stone-400 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCount = 30;
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    q: t(`q${i + 1}`),
    a: t(`a${i + 1}`),
  }));

  return (
    <ParallaxPage>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: ACCENT_GREEN }}
        >
          Saved Souls
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← Back to home
        </Link>
      </nav>

      <main className="min-h-screen">
        {/* Hero: title first, then frost photos - clear on hover & when in view */}
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

        {/* FAQ content */}
        <section className="relative bg-white/95 dark:bg-stone-900/95 mx-4 md:mx-8 mt-8 md:mt-12 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="p-6 md:p-10 lg:p-14">
            <div className="max-w-2xl mx-auto">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {t("stillQuestions")}
          </p>
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
