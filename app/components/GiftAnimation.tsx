"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type GiftAnimationProps = {
  title: string;
  subtitle: string;
  body: string;
  backHome: string;
  donateAgain: string;
  locale: string;
  greenDark: string;
};

const PARTICLE_COLORS = ["#CC0000", "#FFD700", "#1a5c2e", "#FF6B35", "#FF69B4", "#4ECDC4", "#9B59B6", "#E74C3C", "#F39C12"];
const PARTICLE_COUNT = 35;

type Particle = {
  id: number;
  color: string;
  x: number;
  shape: "rectangle" | "square";
  duration: number;
  delay: number;
  width: number;
  height: number;
  rotation: number;
  spin: number;
};

export default function GiftAnimation({
  title,
  subtitle,
  body,
  backHome,
  donateAgain,
  locale,
  greenDark,
}: GiftAnimationProps) {
  const [phase, setPhase] = useState(0);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const rectangleStyle = Math.random() > 0.5;
        return {
          id: index,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          x: Math.floor(Math.random() * 401) - 200,
          shape: rectangleStyle ? "rectangle" : "square",
          duration: 1000 + Math.random() * 1200,
          delay: Math.random() * 200,
          width: rectangleStyle ? 12 : 8,
          height: rectangleStyle ? 6 : 8,
          rotation: Math.floor(Math.random() * 360),
          spin: 540 + Math.floor(Math.random() * 181),
        };
      }),
    [],
  );

  useEffect(() => {
    const phase1Timer = window.setTimeout(() => setPhase(1), 1000);
    const phase2Timer = window.setTimeout(() => setPhase(2), 1800);
    const phase3Timer = window.setTimeout(() => setPhase(3), 2800);
    const phase4Timer = window.setTimeout(() => setPhase(4), 3200);

    return () => {
      window.clearTimeout(phase1Timer);
      window.clearTimeout(phase2Timer);
      window.clearTimeout(phase3Timer);
      window.clearTimeout(phase4Timer);
    };
  }, []);

  const showExplosion = phase >= 2;
  const showText = phase >= 4;
  const brandGreen = greenDark || "#1a5c2e";

  const streamers = [
    { id: "s1", end: "translateX(-180px) translateY(-160px) rotate(-270deg)", angle: -20 },
    { id: "s2", end: "translateX(180px) translateY(-160px) rotate(270deg)", angle: 20 },
    { id: "s3", end: "translateX(-200px) translateY(-40px) rotate(-360deg)", angle: -8 },
    { id: "s4", end: "translateX(200px) translateY(-40px) rotate(360deg)", angle: 8 },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-visible px-4 py-6 text-center md:px-8 md:py-8">
      <div className="relative mx-auto min-h-[760px] w-full overflow-visible">
        <div className="absolute left-1/2 top-[190px] z-20 -translate-x-1/2">
          <div
            className="relative"
            style={{
              width: 160,
              height: 140,
              opacity: phase >= 3 ? 0 : 1,
              transform: phase >= 3 ? "scale(0.3) translateY(-30px)" : "scale(1) translateY(0)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              animation: phase === 0 ? "giftBounceIn 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both" : undefined,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                width: 160,
                height: 140,
                borderRadius: 6,
                background: "linear-gradient(135deg, #CC0000, #8B0000, #CC0000)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                animation: phase >= 1 && phase < 2 ? "giftShake 420ms ease-in-out 4 both" : undefined,
              }}
            />
            <div
              className="absolute top-0"
              style={{
                left: 71,
                width: 18,
                height: 140,
                background: "linear-gradient(90deg, #8B6914, #FFD700, #FFD700, #8B6914)",
              }}
            />
            <div
              className="absolute left-0"
              style={{
                top: 61,
                width: 160,
                height: 18,
                background: "linear-gradient(180deg, #8B6914, #FFD700, #FFD700, #8B6914)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: 61,
                left: 71,
                width: 18,
                height: 18,
                background: "#FFE57A",
                boxShadow: "inset 0 0 6px rgba(255,255,255,0.4)",
              }}
            />

            <div
              className="absolute"
              style={{
                top: -44,
                left: -8,
                width: 176,
                height: 44,
                borderRadius: "4px 4px 0 0",
                background: "linear-gradient(135deg, #DD0000, #990000, #DD0000)",
                boxShadow: "0 -4px 16px rgba(0,0,0,0.25)",
                animation: showExplosion ? "lidFlyOff 700ms ease-out forwards" : undefined,
              }}
            >
              <div
                className="absolute left-0"
                style={{
                  top: 13,
                  width: 176,
                  height: 18,
                  background: "linear-gradient(180deg, #8B6914, #FFD700, #8B6914)",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: -12,
                  left: 78,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "radial-gradient(#FFD700, #B8960C)",
                  zIndex: 10,
                  boxShadow: "0 0 8px rgba(255,215,0,0.7)",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: -32,
                  left: 42,
                  width: 45,
                  height: 32,
                  border: "8px solid #FFD700",
                  borderRadius: "50% 0 50% 50%",
                  transform: "rotate(-40deg)",
                  background: "transparent",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: -32,
                  left: 90,
                  width: 45,
                  height: 32,
                  border: "8px solid #FFD700",
                  borderRadius: "50% 0 50% 50%",
                  transform: "rotate(40deg) scaleX(-1)",
                  background: "transparent",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: 8,
                  left: 68,
                  width: 4,
                  height: 40,
                  background: "linear-gradient(#FFD700, transparent)",
                  transform: "rotate(-20deg)",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: 8,
                  left: 88,
                  width: 4,
                  height: 40,
                  background: "linear-gradient(#FFD700, transparent)",
                  transform: "rotate(20deg)",
                }}
              />
            </div>

            {showExplosion &&
              streamers.map((streamer, index) => {
                const style: CSSProperties & { "--streamer-end": string } = {
                  top: -42,
                  left: 82 + index * 3,
                  width: 5,
                  height: 60,
                  borderRadius: 3,
                  opacity: 0,
                  transform: `rotate(${streamer.angle}deg)`,
                  transformOrigin: "top center",
                  background:
                    index % 2 === 0
                      ? "linear-gradient(180deg, #FFD700, #CC0000, #FFD700)"
                      : "linear-gradient(180deg, #CC0000, #FFD700, #CC0000)",
                  animation: "streamerShoot 1s ease-out forwards",
                  animationDelay: `${index * 0.03}s`,
                  "--streamer-end": streamer.end,
                };

                return <span key={streamer.id} className="absolute z-30" style={style} />;
              })}
          </div>
        </div>

        {showExplosion &&
          particles.map((particle) => (
            <span
              key={particle.id}
              className="absolute left-1/2 top-[235px] z-30"
              style={{
                width: particle.width,
                height: particle.height,
                background: particle.color,
                borderRadius: particle.shape === "rectangle" ? 2 : 1,
                transform: `translateX(${particle.x}px) translateY(-8px) rotate(${particle.rotation}deg)`,
                animation: `confettiBurst ${particle.duration}ms ease-out forwards`,
                animationDelay: `${particle.delay}ms`,
                ["--confetti-x" as string]: `${particle.x}px`,
                ["--confetti-spin" as string]: `${particle.spin}deg`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          ))}

        <div
          className="absolute left-1/2 top-[360px] z-40 w-full max-w-2xl -translate-x-1/2 px-3"
          style={{ animation: showText ? "textReveal 700ms ease-out forwards" : undefined, opacity: showText ? undefined : 0 }}
        >
          <div className="mb-4 text-[5rem] leading-none" style={{ animation: "pawPulse 1.8s ease-in-out infinite" }}>
            🐾
          </div>
          <h2
            className="mb-3 text-[3rem] italic leading-tight"
            style={{
              background: "linear-gradient(90deg, #e74c3c, #e67e22, #f1c40f, #2ecc71, #3498db, #9b59b6, #e74c3c)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "rainbowText 3s linear infinite",
              fontFamily: "var(--font-cormorant)",
              fontWeight: 700,
            }}
          >
            {title}
          </h2>
          <p className="mb-3 text-[1.3rem] font-semibold" style={{ color: brandGreen, marginTop: 8 }}>
            {subtitle}
          </p>
          <p className="mx-auto max-w-[400px] text-base leading-[1.8] text-[#4a4a4a]">{body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-[50px] border-2 border-[#1a5c2e] px-7 py-3.5 text-base font-semibold text-[#1a5c2e] transition-colors duration-200 hover:bg-[#1a5c2e] hover:text-white"
              style={{
                animation: showText ? "fadeInScale 0.6s ease 0.2s both" : undefined,
              }}
            >
              {backHome}
            </Link>
            <Link
              href={`/${locale}/donate`}
              className="inline-flex items-center justify-center rounded-[50px] px-7 py-3.5 text-base font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #1a5c2e, #2aa348)",
                boxShadow: "0 4px 20px rgba(26,92,46,0.4)",
                animation: showText ? "fadeInScale 0.6s ease 0.4s both" : undefined,
              }}
            >
              {donateAgain}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
