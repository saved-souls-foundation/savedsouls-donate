"use client";

/**
 * Preview pagina: Hero banner met foto's.
 * Bekijk op /nl/preview-hero of /en/preview-hero
 */
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

const HERO_IMAGES = [
  { src: "/team-dogs.webp", alt: "Saved Souls team at the sanctuary" },
  { src: "/team-thankyou.png", alt: "Team at the entrance of Saved Souls Foundation" },
  { src: "/volunteers-with-dogs.png", alt: "Volunteers with rescued dogs" },
  { src: "/woman-dog-wheelchair.webp", alt: "Dog with wheelchair at Saved Souls" },
];

export default function PreviewHeroPage() {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tHome = useTranslations("home");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen text-stone-800 dark:text-stone-200 relative overflow-hidden">
      {/* Parallax achtergrond */}
      <div
        className="fixed inset-0 z-0 bg-stone-200 dark:bg-stone-900"
        aria-hidden
        style={{
          backgroundImage: "url('/savedsoul-logo.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.35}px)`,
        }}
      />
      <div className="fixed inset-0 z-[1] bg-white/70 dark:bg-stone-950/80 pointer-events-none" />

      <div ref={scrollRef} className="relative z-10 h-full overflow-y-auto overscroll-contain">
        <nav className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700">
          <Link href="/" className="text-lg font-bold" style={{ color: ACCENT_GREEN }}>
            Saved Souls
          </Link>
          <Link href="/" className="text-sm text-stone-600 dark:text-stone-400">
            ← Terug naar home
          </Link>
        </nav>

        {/* Hero banner – compact, met foto-strip */}
        <header className="px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Compacte banner met foto's – lager dan voorheen */}
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 dark:border-stone-700/80 mb-8">
              {/* Foto-strip: 2x2 op mobiel, 4 naast elkaar op desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-stone-900">
                {HERO_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 280px"
                      priority={i < 2}
                      style={{ filter: "brightness(1.15) contrast(1.04) saturate(1.03)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
              {/* Tekst overlay onderop de banner */}
              <div
                className="relative px-6 py-5 md:py-6 text-center"
                style={{
                  background: "linear-gradient(180deg, rgba(42,163,72,0.08) 0%, rgba(255,255,255,0.95) 40%)",
                }}
              >
                <p className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-100 mb-0.5">
                  {tHome("foundation")}
                </p>
                <p className="text-sm md:text-base font-bold mb-4" style={{ color: ACCENT_GREEN }}>
                  {tHome("location")}
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-stone-800 dark:text-stone-100">
                  {tHome("headline")}
                </h1>
                <a
                  href="https://paypal.me/savedsoulsfoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white text-base transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: BUTTON_ORANGE }}
                >
                  {tHome("cta")}
                </a>
              </div>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg mb-2 max-w-2xl mx-auto text-center font-bold">
              {tHome("intro1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-base md:text-lg font-bold max-w-2xl mx-auto text-center">
              {tHome("intro2")}
            </p>
          </div>
        </header>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-amber-500/95 text-amber-950 text-sm font-semibold shadow-lg">
          Preview: Hero banner met foto&apos;s
        </div>
      </div>

    </div>
  );
}
