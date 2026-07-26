"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { heroAnimal } from "@/config/heroAnimal";

export interface ThailandSoulSectionProps {
  mediaUrl: string;
  posterUrl: string;
  mediaAlt: string;
}

export default function ThailandSoulSection({
  mediaAlt,
}: ThailandSoulSectionProps) {
  const t = useTranslations("thailandSoul");
  const locale = useLocale();

  return (
    <section className="w-full bg-stone-950 text-white" aria-labelledby="thailand-soul-headline">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/HOZ0_q0QsQI?rel=0&modestbranding=1"
                  title={mediaAlt || "NENEROYAL live Naka Market Phuket Thailand"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-emerald-400/90">
              {t("eyebrow")}
            </p>
            <h2
              id="thailand-soul-headline"
              className="text-2xl md:text-4xl font-bold leading-tight mb-5"
            >
              {t("headline")}
            </h2>
            <p className="text-base md:text-lg text-stone-300 leading-relaxed mb-8">
              {t("body")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/neneroyal-thailand"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#7B1010" }}
              >
                {t("ctaPrimary")}
              </Link>
              <a
                href={`/${locale}/donate`}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-semibold border-2 border-white/40 text-white transition-colors hover:bg-white/10"
              >
                {t("ctaSecondary", { name: heroAnimal.name })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
