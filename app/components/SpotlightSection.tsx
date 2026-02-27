"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FALLBACK_IMAGE = "/animals/dog-328.jpg";

type SpotlightAnimal = {
  id: string;
  name: string;
  thaiName: string;
  type: "dog" | "cat";
  image: string;
};

type SpotlightData = {
  week: number;
  dog: SpotlightAnimal | null;
  cat: SpotlightAnimal | null;
};

/** Buiten viewport: geen fetch/images. Binnen viewport: pas dan laden – voorkomt concurrentie met LCP. */
export default function SpotlightSection() {
  const t = useTranslations("home");
  const [data, setData] = useState<SpotlightData | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    fetch("/api/spotlight")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ week: 0, dog: null, cat: null }));
  }, [inView]);

  const hasContent = data && (data.dog || data.cat);

  return (
    <section ref={ref} className="max-w-4xl mx-auto px-4 py-8 md:py-10" aria-labelledby={hasContent ? "spotlight-title" : undefined}>
      {!hasContent && <span className="sr-only">{t("spotlightTitle")}</span>}
      {!hasContent ? null : (
        <>
      <div className="spotlight-banner text-center mb-6 rounded-2xl py-6 px-4">
        <p
          className="inline-block text-center text-xl md:text-2xl font-bold mb-2 animate-spotlight-tagline bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-clip-text text-transparent bg-[length:200%_auto]"
        >
          {t("spotlightTagline")}
        </p>
        <h2 id="spotlight-title" className="text-center text-sm font-medium text-amber-700/90 dark:text-amber-300/90 animate-spotlight-subtitle">
          {t("spotlightTitle")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {data.dog && (
          <SpotlightCard animal={data.dog} />
        )}
        {data.cat && (
          <SpotlightCard animal={data.cat} />
        )}
      </div>
        </>
      )}
    </section>
  );
}

function SpotlightCard({ animal }: { animal: SpotlightAnimal }) {
  const t = useTranslations("home");
  const href = animal.type === "dog" ? `/adopt/dog/${animal.id}` : `/adopt/cat/${animal.id}`;
  const imgSrc = animal.image || FALLBACK_IMAGE;

  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-lg hover:shadow-xl hover:border-[#2aa348]/40 transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={imgSrc}
          alt={`${animal.name} – in de spotlight deze week`}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 400px"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              (target as HTMLImageElement).src = FALLBACK_IMAGE;
            }
          }}
        />
        <div className="absolute inset-0 bg-stone-900/60 dark:bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-center px-4">
          <span className="text-white/95 text-xl md:text-2xl font-medium italic drop-shadow-md">
            {t("spotlightGiveMeAChance")}
          </span>
          <span className="text-white font-semibold text-base tracking-wide drop-shadow-md">
            {t("spotlightMeetName", { name: animal.name })}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <span className="font-bold drop-shadow-md">
            {animal.name}
            {animal.thaiName && <span className="font-normal text-white/90"> / {animal.thaiName}</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
