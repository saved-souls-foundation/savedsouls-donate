"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { STAMPS } from "./content";
import Reveal from "./Reveal";
import StampBadge from "./StampBadge";

/** Lichtere rotatie op mobiel — één stamp tegelijk in beeld */
const MOBILE_ROTATIONS = [-3, 2, -2.5, 3] as const;

function getClosestSlideIndex(container: HTMLDivElement, slides: (HTMLDivElement | null)[]) {
  const center = container.scrollLeft + container.clientWidth / 2;
  let closest = 0;
  let minDist = Infinity;

  slides.forEach((slide, index) => {
    if (!slide) return;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const dist = Math.abs(center - slideCenter);
    if (dist < minDist) {
      minDist = dist;
      closest = index;
    }
  });

  return closest;
}

export default function StampStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nudgedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(getClosestSlideIndex(container, slideRefs.current));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isMobile) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveIndex);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    updateActiveIndex();

    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, updateActiveIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isMobile || nudgedRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const runNudge = () => {
      nudgedRef.current = true;
      const start = container.scrollLeft;
      const duration = 380;

      const animate = (from: number, to: number, onComplete?: () => void) => {
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - (1 - p) ** 3;
          container.scrollLeft = from + (to - from) * eased;
          if (p < 1) requestAnimationFrame(step);
          else onComplete?.();
        };
        requestAnimationFrame(step);
      };

      animate(start, start + 12, () => animate(start + 12, start));
    };

    const timer = window.setTimeout(runNudge, 600);
    return () => window.clearTimeout(timer);
  }, [isMobile]);

  const scrollToIndex = useCallback((index: number) => {
    const slide = slideRefs.current[index];
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(index);
  }, []);

  const onCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(Math.min(activeIndex + 1, STAMPS.length - 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(Math.max(activeIndex - 1, 0));
    }
  };

  const onSlideFocus = (index: number) => {
    scrollToIndex(index);
  };

  return (
    <div className="bg-rice pb-[90px] relative" id="facts">
      <div className="ti-wrap -mt-14">
        <Reveal>
          <p
            className="text-[0.75rem] tracking-[0.12em] uppercase text-bamboodim text-center m-0 mb-[34px]"
            style={{ fontFamily: "var(--ti-mono)" }}
          >
            — Facts you can cite, quote, or double-check —
          </p>
        </Reveal>

        <div
          ref={scrollRef}
          className="ti-stamp-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Impact facts"
          tabIndex={0}
          onKeyDown={onCarouselKeyDown}
        >
          {STAMPS.map((stamp, index) => (
            <div
              key={stamp.label}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="ti-stamp-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${STAMPS.length}: ${stamp.value}, ${stamp.label}`}
              tabIndex={0}
              onFocus={() => onSlideFocus(index)}
            >
              <StampBadge
                value={stamp.value}
                label={stamp.label}
                color={stamp.color}
                rotation={MOBILE_ROTATIONS[index]}
              />
            </div>
          ))}
        </div>

        <div className="ti-stamp-dots" role="tablist" aria-label="Choose impact fact">
          {STAMPS.map((stamp, index) => (
            <button
              key={stamp.label}
              type="button"
              role="tab"
              className={`ti-stamp-dots__dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`${stamp.value} ${stamp.label}`}
              aria-selected={index === activeIndex}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <div className="ti-stamp-grid">
          {STAMPS.map((stamp) => (
            <Reveal key={stamp.label}>
              <StampBadge
                value={stamp.value}
                label={stamp.label}
                color={stamp.color}
                rotation={stamp.rotation}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
