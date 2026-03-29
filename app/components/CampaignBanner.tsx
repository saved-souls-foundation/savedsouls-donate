"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface CampaignBannerProps {
  raised: number;
  goal: number;
  donations: number;
  locale: string;
}

export default function CampaignBanner({ raised, goal, donations, locale }: CampaignBannerProps) {
  const tEmergency = useTranslations("emergency");
  const [displayAmount, setDisplayAmount] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pct = Math.min((raised / goal) * 100, 100);
  const remaining = goal - raised;

  const t: Record<string, { emergency: string; dogs: string; raised: string; of: string; donate: string }> = {
    nl: { emergency: "Noodhulp", dogs: "350 honden", raised: "opgehaald", of: "van", donate: "Doneer nu →" },
    en: { emergency: "Emergency", dogs: "350 dogs", raised: "raised", of: "of", donate: "Donate now →" },
    de: { emergency: "Nothilfe", dogs: "350 Hunde", raised: "gesammelt", of: "von", donate: "Jetzt spenden →" },
    fr: { emergency: "Urgence", dogs: "350 chiens", raised: "collectés", of: "sur", donate: "Faire un don →" },
    es: { emergency: "Urgente", dogs: "350 perros", raised: "recaudado", of: "de", donate: "Donar ahora →" },
    th: { emergency: "ฉุกเฉิน", dogs: "350 สุนัข", raised: "ที่ระดมได้", of: "จาก", donate: "บริจาคเลย →" },
    ru: { emergency: "Срочно", dogs: "350 собак", raised: "собрано", of: "из", donate: "Пожертвовать →" },
  };
  const lang = t[locale] ?? t["nl"];

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
    const duration = 1800;
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
    const timer = setTimeout(() => setBarWidth(Math.max(pct, 0.8)), 200);
    return () => clearTimeout(timer);
  }, [started, pct]);

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .banner-amount {
          background: linear-gradient(90deg, #ffffff 0%, #fca5a5 50%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .donate-btn {
          background: white;
          color: #7B1010;
          border: none;
          padding: 10px 22px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        .donate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          background: #fff5f5;
        }
        @media (max-width: 640px) {
          .campaign-banner-inner {
            padding: 14px 16px;
          }
          .donate-btn {
            font-size: 12px;
            padding: 9px 16px;
          }
        }
      `}</style>

      <div
        ref={ref}
        style={{
          background: "linear-gradient(135deg, #6b0e0e 0%, #7B1010 50%, #8b1515 100%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="campaign-banner-inner"
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            padding: "14px 24px",
          }}
        >
          {/* DESKTOP */}
          <div
            style={{ alignItems: "center", gap: 24 }}
            className="hidden sm:flex"
          >
            {/* Pulserende dot + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ position: "relative", width: 10, height: 10 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    backgroundColor: "#ff6b6b",
                    animation: "pulse-dot 1.8s ease-in-out infinite",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {lang.emergency}
                </div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{lang.dogs}</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

            {/* Bedrag */}
            <div style={{ flexShrink: 0 }}>
              <span
                className="banner-amount"
                style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                €{displayAmount.toLocaleString("nl-NL")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginLeft: 6 }}>
                {lang.raised}
              </span>
            </div>

            {/* Progressbalk blok */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {/* Balk */}
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background: "white",
                    width: `${barWidth}%`,
                    transition: "width 1.5s ease-out",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                <span>{pct.toFixed(1)}%</span>
                <span>{lang.of} €{goal.toLocaleString("nl-NL")}</span>
              </div>
            </div>

            {/* CTA */}
            <a href={`/${locale}/emergency`} className="donate-btn">
              {lang.donate}
            </a>
          </div>

          {/* MOBILE */}
          <div className="flex flex-col gap-3 text-center sm:hidden">
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {lang.emergency} · {lang.dogs}
            </div>
            <div>
              <span
                className="banner-amount"
                style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                €{displayAmount.toLocaleString("nl-NL")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {" "}
                · {donations} {tEmergency("donationsLabel")} · {pct.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: "white",
                  width: `${barWidth}%`,
                  transition: "width 1.5s ease-out",
                }}
              />
            </div>
            <a href={`/${locale}/emergency`} className="donate-btn">
              {lang.donate}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
