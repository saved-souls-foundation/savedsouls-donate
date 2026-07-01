"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";
import { HERO_IMAGE } from "./content";
import StampEntrance, { shouldPlayStampEntrance } from "./StampEntrance";

const PARALLAX_FACTOR = 0.22;

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [skippedEntrance, setSkippedEntrance] = useState(false);
  const [heroShaking, setHeroShaking] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setReduceMotion(mq.matches);
    applyMotion();
    mq.addEventListener("change", applyMotion);

    const onScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const shouldPlay = shouldPlayStampEntrance();
    if (shouldPlay) {
      setShowStamp(true);
    } else {
      setSkippedEntrance(true);
    }
    setReady(true);

    return () => {
      mq.removeEventListener("change", applyMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleImpact = useCallback(() => {
    setHeroShaking(true);
    window.setTimeout(() => setHeroShaking(false), 160);
  }, []);

  const handleEntranceComplete = useCallback(() => {
    setShowStamp(false);
  }, []);

  const bgTransform = reduceMotion ? undefined : `translateY(${offsetY * PARALLAX_FACTOR}px) scale(1.08)`;

  const contentClass = [
    "ti-hero-content",
    ready && skippedEntrance ? "ti-hero-content--skip" : "",
    ready && showStamp ? "ti-hero-content--entrance-pending" : "",
    ready && !showStamp && !skippedEntrance ? "ti-hero-content--visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={`text-rice pt-[104px] pb-[88px] relative overflow-hidden min-h-[520px]${heroShaking ? " ti-hero--shake" : ""}`}
    >
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: bgTransform }}
        aria-hidden
      >
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 900px 500px at 82% -10%, rgba(232,163,61,0.10), transparent 60%),
            radial-gradient(ellipse 650px 460px at 96% 32%, rgba(110,74,158,0.12), transparent 62%),
            radial-gradient(ellipse 700px 500px at 8% 110%, rgba(76,122,99,0.10), transparent 60%),
            linear-gradient(to right, rgba(19,36,32,0.58) 0%, rgba(19,36,32,0.34) 48%, rgba(19,36,32,0.08) 100%),
            linear-gradient(to bottom, rgba(19,36,32,0.22) 0%, rgba(19,36,32,0.50) 52%, rgba(19,36,32,0.76) 100%)
          `,
        }}
        aria-hidden
      />

      {ready && showStamp ? (
        <StampEntrance onImpact={handleImpact} onComplete={handleEntranceComplete} />
      ) : null}

      <div className={`ti-wrap relative z-[2] ${contentClass}`}>
        <p className="ti-eyebrow">Verified Impact Report · Khon Kaen, Thailand</p>
        <h1 className="font-semibold text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[1.04] tracking-[-0.01em] m-0 mb-[26px] max-w-[14ch]">
          Every soul here has a <em className="italic font-medium text-saffron">documented</em> story.
        </h1>
        <p className="text-[1.14rem] leading-[1.6] max-w-[52ch] text-[rgba(247,241,227,0.92)] m-0 mb-10">
          Saved Souls Foundation is a registered Thai non-profit rescuing dogs and cats in Khon Kaen since 2010 —
          specializing in the disabled, paralyzed, and abandoned animals other shelters turn away. This page states our
          facts plainly, so you don&apos;t have to take our word for it.
        </p>
        <div className="ti-hero-actions">
          <TrackedDonateLink href="/donate" className="ti-btn ti-btn-primary">
            Support a rescue →
          </TrackedDonateLink>
          <a href="#facts" className="ti-btn ti-btn-ghost">
            See the verified facts
          </a>
        </div>
        <div
          className="mt-16 pt-7 border-t flex gap-10 flex-wrap text-[0.8rem] text-[rgba(247,241,227,0.75)]"
          style={{ borderColor: "var(--ti-line)", fontFamily: "var(--ti-mono)" }}
        >
          <div>
            <strong className="block text-rice text-[1.05rem] font-semibold mb-0.5" style={{ fontFamily: "var(--ti-sans)" }}>
              Est. 2010
            </strong>
            Founded by Gabriela Leonhard
          </div>
          <div>
            <strong className="block text-rice text-[1.05rem] font-semibold mb-0.5" style={{ fontFamily: "var(--ti-sans)" }}>
              Reg. No. 1/2560
            </strong>
            Official Thai non-profit since 2017
          </div>
          <div>
            <strong className="block text-rice text-[1.05rem] font-semibold mb-0.5" style={{ fontFamily: "var(--ti-sans)" }}>
              Isaan, Thailand
            </strong>
            Ban Khok Ngam, Ban Fang, Khon Kaen
          </div>
        </div>
      </div>
    </header>
  );
}
