"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type DogPhotoCardProps = {
  src: string;
  alt: string;
  className?: string;
  /** Frost verdwijnt ook bij scroll-into-view (mobiel) */
  frostOnScroll?: boolean;
};

export default function DogPhotoCard({ src, alt, className = "", frostOnScroll = false }: DogPhotoCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frostOnScroll || !cardRef.current) return;
    const el = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [frostOnScroll]);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl aspect-[4/3] bg-stone-200 dark:bg-stone-700 ${className}`}
    >
      {/* Placeholder zichtbaar tot beeld geladen of bij fout */}
      {(!loaded || error) && (
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 dark:from-stone-700 dark:via-stone-600 dark:to-stone-800" />
          <div className="absolute inset-0 animate-shimmer-frost opacity-60" />
          <span className="relative text-5xl opacity-40 drop-shadow-sm">🐕</span>
        </div>
      )}
      {!error && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 33vw, 300px"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          unoptimized
        />
      )}
      {/* Frost overlay – grijs, verdwijnt bij hover (desktop) of scroll-into-view (mobiel) */}
      <div
        className={`absolute inset-0 bg-stone-400/30 dark:bg-stone-500/25 backdrop-blur-sm pointer-events-none transition-opacity duration-500 ${
          frostOnScroll ? (inView ? "opacity-0" : "opacity-100") : "opacity-100"
        } md:opacity-100 md:group-hover:opacity-0`}
        aria-hidden
      />
    </div>
  );
}
