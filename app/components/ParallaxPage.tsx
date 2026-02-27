"use client";

import { useState, useEffect, useRef } from "react";
import SiteHeader from "./SiteHeader";

type ParallaxPageProps = {
  children: React.ReactNode;
  /** Optional background image URL; uses default gradient if not set */
  backgroundImage?: string;
  /** Parallax speed factor (e.g. 0.2 = slower than scroll) */
  speed?: number;
  /** Set to true to hide default overlay (for custom styling) */
  noOverlay?: boolean;
  /** Optional custom overlay class (e.g. dark red for raw-hide page) */
  overlayClassName?: string;
};

export default function ParallaxPage({
  children,
  backgroundImage = "/savedsoul-logo-bg.webp",
  speed = 0.25,
  noOverlay = false,
  overlayClassName,
}: ParallaxPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen text-stone-800 dark:text-stone-200 relative overflow-hidden">
      {/* Parallax background */}
      <div
        className="fixed inset-0 z-0 bg-stone-200 dark:bg-stone-900"
        aria-hidden
        style={{
          backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * speed}px)`,
        }}
      />
      {!noOverlay && (
        <div
          className={`fixed inset-0 z-[1] pointer-events-none ${overlayClassName ?? "bg-white/75 dark:bg-stone-950/85"}`}
        />
      )}
      <div ref={scrollRef} className="relative z-10 h-full overflow-y-auto overscroll-contain">
        <SiteHeader />
        <div className="pt-16 md:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}
