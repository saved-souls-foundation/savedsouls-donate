"use client";

import { useEffect, useRef, useState } from "react";

type HeroFadeInProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wrapper that triggers fade-in animations when the hero enters the viewport.
 * Start with inView=true so above-the-fold content is visible immediately (betere LCP).
 */
export default function HeroFadeIn({ children, className = "" }: HeroFadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-hero-visible={inView || undefined}>
      {children}
    </div>
  );
}
