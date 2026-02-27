"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import SiteHeader from "./SiteHeader";

export type ScrollProgressContextValue = { progress: number };
const ScrollProgressContext = createContext<ScrollProgressContextValue>({ progress: 0 });
export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}

type ParallaxPageProps = {
  children: React.ReactNode;
  /** Optional background image URL; uses default gradient if not set */
  backgroundImage?: string;
  /** Parallax speed factor (e.g. 0.2 = slower than scroll). Set to false for static modern layout. */
  parallax?: boolean | number;
  /** @deprecated Use parallax={number} instead. Kept for backwards compatibility. */
  speed?: number;
  /** Set to true to hide default overlay (for custom styling) */
  noOverlay?: boolean;
  /** Optional custom overlay class (e.g. dark red for raw-hide page) */
  overlayClassName?: string;
  /** When true, provide scroll progress 0..1 to children via useScrollProgress() */
  trackScrollProgress?: boolean;
};

export default function ParallaxPage({
  children,
  backgroundImage = "/savedsoul-logo-bg.webp",
  parallax: parallaxProp = true,
  speed,
  noOverlay = false,
  overlayClassName,
  trackScrollProgress = false,
}: ParallaxPageProps) {
  const parallax = speed !== undefined ? speed : parallaxProp;
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speedFactor = typeof parallax === "number" ? parallax : parallax ? 0.25 : 0;

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollY(el.scrollTop);
    const total = el.scrollHeight - el.clientHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, el.scrollTop / total)) : 0;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setScrollY(el.scrollTop);
      if (trackScrollProgress) {
        const total = el.scrollHeight - el.clientHeight;
        setScrollProgress(total > 0 ? Math.min(1, Math.max(0, el.scrollTop / total)) : 0);
      }
    };
    const ro = new ResizeObserver(updateProgress);
    ro.observe(el);
    el.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", handleScroll);
    };
  }, [trackScrollProgress, updateProgress]);

  return (
    <ScrollProgressContext.Provider value={{ progress: scrollProgress }}>
      <div className="h-screen text-stone-800 dark:text-stone-200 relative overflow-hidden">
        {/* Background: static when parallax=false, else parallax */}
        <div
          className="fixed inset-0 z-0 bg-stone-200 dark:bg-stone-900"
          aria-hidden
          style={{
            backgroundImage: parallax && backgroundImage ? `url('${backgroundImage}')` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: speedFactor > 0 ? `translateY(${scrollY * speedFactor}px)` : undefined,
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
    </ScrollProgressContext.Provider>
  );
}
