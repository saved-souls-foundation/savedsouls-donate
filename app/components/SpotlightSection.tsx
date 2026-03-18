"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FALLBACK_IMAGE = "/animals/dog-328.jpg";

type SpotlightAnimal = {
  id: string;
  name: string;
  thaiName: string;
  type: "dog" | "cat";
  image: string;
  description?: string;
  url?: string;
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
    let cancelled = false;
    fetch("/api/spotlight")
      .then((r) => (cancelled ? undefined : r.json()))
      .then((d) => {
        if (!cancelled && d) setData(d);
        else if (!cancelled) setData({ week: 0, dog: null, cat: null });
      })
      .catch(() => {
        if (!cancelled) setData({ week: 0, dog: null, cat: null });
      });
    return () => { cancelled = true; };
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
  const imgSrc = animal.image || FALLBACK_IMAGE;
  const href = animal.url ?? (animal.type === "dog" ? `/adopt/dog/${animal.id}` : `/adopt/cat/${animal.id}`);

  return (
    <div
      className="spotlight-card"
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        aspectRatio: "3/4",
        cursor: "pointer",
      }}
    >
      {/* Foto */}
      <img
        src={imgSrc}
        alt={animal.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        className="spotlight-photo"
      />

      {/* Gradient overlay van onderaf — donkergroen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(15, 35, 15, 0.95) 0%, rgba(20, 45, 20, 0.7) 45%, transparent 75%)",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Tekst overlay — schuift in van onderaf bij load */}
      <div
        className="spotlight-content"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "28px 24px",
        }}
      >
        {/* Naam */}
        <div
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 8,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {animal.name}
        </div>

        {/* Emotionele zin */}
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          {animal.description || "Op zoek naar een thuis vol liefde."}
        </div>

        {/* CTA pill knop */}
        <Link
          href={href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(42, 163, 72, 0.25)",
            border: "1.5px solid rgba(42, 163, 72, 0.6)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            padding: "8px 18px",
            borderRadius: 999,
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
          className="spotlight-btn"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#2aa348",
              display: "inline-block",
              animation: "spotlight-pulse 1.8s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          Ontmoet {animal.name} →
        </Link>
      </div>

      {/* CSS animaties */}
      <style>{`
        .spotlight-card:hover .spotlight-photo {
          transform: scale(1.06);
        }
        .spotlight-card:hover .spotlight-btn {
          background-color: rgba(42, 163, 72, 0.45);
          border-color: rgba(42, 163, 72, 0.9);
          transform: translateY(-1px);
        }
        .spotlight-content {
          animation: slideUpFade 0.7s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spotlight-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
