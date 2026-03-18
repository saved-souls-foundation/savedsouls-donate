"use client";

import { useEffect, useRef, useState } from "react";

export interface CampaignBannerProps {
  raised: number;
  goal: number;
  donations: number;
  locale: string;
}

export default function CampaignBanner({ raised, goal, donations, locale }: CampaignBannerProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pct = Math.min((raised / goal) * 100, 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayAmount(Math.round(raised * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, raised]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setBarWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [started, pct]);

  return (
    <div ref={ref} style={{ backgroundColor: "#7B1010" }}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <div style={{ position: "relative", width: 10, height: 10 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: "#ff4444",
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                  opacity: 0.75,
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#ff6666",
                }}
              />
            </div>
            <div>
              <div style={{ color: "#fca5a5", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
                NOODHULP
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>350 honden in gevaar</div>
            </div>
          </div>

          {/* Bedrag + donaties */}
          <div className="shrink-0 text-right">
            <div style={{ color: "white", fontWeight: 700, fontSize: 20, lineHeight: 1 }}>
              €{displayAmount.toLocaleString("nl-NL")}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{donations} donaties</div>
          </div>

          {/* Progressbalk + percentage */}
          <div className="flex-1 flex items-center gap-3">
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: "white",
                  width: `${barWidth}%`,
                  transition: "width 1.5s ease-out",
                }}
              />
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, flexShrink: 0 }}>
              {pct.toFixed(1)}%
            </div>
          </div>

          {/* Doel */}
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} className="shrink-0">
            van €{goal.toLocaleString("nl-NL")}
          </div>

          {/* CTA */}
          <a
            href={`/${locale}/emergency`}
            style={{
              border: "1.5px solid rgba(255,255,255,0.6)",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 16px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "white";
              (e.currentTarget as HTMLElement).style.color = "#7B1010";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
          >
            Doneer nu →
          </a>
        </div>

        {/* Mobile layout */}
        <div className="flex sm:hidden flex-col gap-2 text-center">
          <div style={{ color: "#fca5a5", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
            🔴 NOODHULP · 350 honden in gevaar
          </div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 22 }}>
            €{displayAmount.toLocaleString("nl-NL")}
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 400 }}>
              {" "}
              · {donations} donaties · {pct.toFixed(1)}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                backgroundColor: "white",
                width: `${barWidth}%`,
                transition: "width 1.5s ease-out",
              }}
            />
          </div>
          <a
            href={`/${locale}/emergency`}
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            Doneer nu →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
