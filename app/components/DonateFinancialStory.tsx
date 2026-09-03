"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

const GREEN = "#2aa348";
const TOGETHER_RATIO = 0.5;

type CostItem = {
  emoji: string;
  title: string;
  detail: string;
  percent: number;
  color: string;
};

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  monthlyNeedTitle: string;
  perMonth: string;
  approxEuro: string;
  gapText: string;
  breakdownTitle: string;
  costs: CostItem[];
  sponsorStatsTitle: string;
  sponsorStatsText: string;
  sponsorStatsConclusion: string;
  goalTitle: string;
  goalText: string;
  moreLinkLabel: string;
  labels: {
    togetherWeCover: string;
    yourHelpCloses: string;
    watchAddUp: string;
    tapHint: string;
    runningTotal: string;
    ofBudget: string;
    replay: string;
  };
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start == null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

export default function DonateFinancialStory({
  badge,
  title,
  subtitle,
  monthlyNeedTitle,
  perMonth,
  approxEuro,
  gapText,
  breakdownTitle,
  costs,
  sponsorStatsTitle,
  sponsorStatsText,
  sponsorStatsConclusion,
  goalTitle,
  goalText,
  moreLinkLabel,
  labels,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [playId, setPlayId] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setBarWidth(TOGETHER_RATIO * 100), 400);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    setRevealed(0);
    setActiveIdx(null);
    const timers: number[] = [];
    costs.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setActiveIdx(i);
          setRevealed(i + 1);
        }, 550 + i * 550)
      );
    });
    timers.push(
      window.setTimeout(() => setActiveIdx(null), 550 + costs.length * 550 + 300)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, playId, costs]);

  const runningPercent = useMemo(
    () => costs.slice(0, revealed).reduce((sum, c) => sum + c.percent, 0),
    [costs, revealed]
  );
  const runningDisplay = useCountUp(runningPercent, revealed > 0, 400);
  const togetherDisplay = useCountUp(50, inView, 1600);

  return (
    <section
      ref={rootRef}
      className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="px-5 py-5 border-b border-stone-100">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: GREEN }}>
          💚 {badge}
        </p>
        <h2 className="text-xl font-bold text-stone-800 mb-1">{title}</h2>
        <p className="text-sm text-stone-500">{subtitle}</p>
      </div>

      <div
        className="relative px-5 py-6 overflow-hidden border-b border-emerald-100"
        style={{ background: "linear-gradient(145deg, #ecfdf5 0%, #f0fdf4 60%, #eff6ff 100%)" }}
      >
        <h3 className="text-sm font-bold mb-2" style={{ color: GREEN }}>
          {monthlyNeedTitle}
        </h3>
        <p className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: GREEN }}>
          ฿500.000
        </p>
        <p className="text-sm text-stone-600 mt-0.5">{perMonth}</p>
        <p className="text-sm text-stone-500 mb-4">{approxEuro}</p>

        <div className="mb-3">
          <div className="flex justify-between text-[11px] font-medium mb-1.5 gap-2">
            <span className="text-emerald-700">
              {labels.togetherWeCover} · {Math.round(togetherDisplay)}%
            </span>
            <span className="text-sky-700 text-right">{labels.yourHelpCloses}</span>
          </div>
          <div className="h-3 rounded-full bg-white/80 border border-emerald-100 overflow-hidden flex">
            <div
              className="h-full rounded-l-full transition-all duration-1000 ease-out"
              style={{
                width: `${barWidth}%`,
                background: "linear-gradient(90deg, #4ade80, #2aa348)",
              }}
            />
            <div
              className="h-full flex-1 transition-opacity duration-700"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #bae6fd 0 5px, #7dd3fc 5px 10px)",
                opacity: inView ? 0.85 : 0,
              }}
            />
          </div>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">{gapText}</p>
      </div>

      <div className="px-5 py-5 border-b border-stone-100">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold" style={{ color: GREEN }}>
            {breakdownTitle}
          </h3>
          <button
            type="button"
            onClick={() => setPlayId((n) => n + 1)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors"
          >
            ↻ {labels.replay}
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          {labels.watchAddUp} · {labels.tapHint}
        </p>

        <div className="h-3.5 rounded-full bg-stone-100 overflow-hidden flex mb-4">
          {costs.map((c, i) => {
            const show = i < revealed;
            return (
              <div
                key={c.title}
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: show ? `${c.percent}%` : "0%",
                  backgroundColor: c.color,
                  opacity: activeIdx === i ? 1 : show ? 0.9 : 0,
                }}
              />
            );
          })}
        </div>

        <div className="flex items-end justify-between mb-4 rounded-xl bg-emerald-50/70 border border-emerald-100 px-3.5 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-stone-400 font-semibold">
              {labels.runningTotal}
            </p>
            <p className="text-2xl font-black tabular-nums" style={{ color: GREEN }}>
              {Math.round(runningDisplay)}%
            </p>
          </div>
          <p className="text-xs text-stone-500 pb-1">{labels.ofBudget}</p>
        </div>

        <div className="space-y-2">
          {costs.map((c, i) => {
            const isOn = activeIdx === i;
            const isShown = i < revealed;
            return (
              <button
                key={c.title}
                type="button"
                onClick={() => {
                  setActiveIdx(i);
                  setRevealed((r) => Math.max(r, i + 1));
                }}
                className="w-full text-left rounded-xl border px-3.5 py-3 transition-all duration-300"
                style={{
                  borderColor: isOn ? c.color : isShown ? "#e7e5e4" : "#f5f5f4",
                  background: isOn ? `${c.color}14` : isShown ? "#fff" : "#fafaf9",
                  transform: isOn ? "scale(1.01)" : "scale(1)",
                  boxShadow: isOn ? `0 0 0 2px ${c.color}33` : "none",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg" aria-hidden>
                      {c.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{c.title}</p>
                      <p className="text-xs text-stone-500 leading-snug line-clamp-2">{c.detail}</p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-bold tabular-nums shrink-0 transition-opacity duration-300"
                    style={{ color: c.color, opacity: isShown ? 1 : 0.3 }}
                  >
                    {c.percent}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="px-5 py-5 border-b border-emerald-50"
        style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #fff 100%)" }}
      >
        <h3 className="text-sm font-bold mb-2" style={{ color: GREEN }}>
          {sponsorStatsTitle}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-3">{sponsorStatsText}</p>
        <div className="rounded-xl border border-emerald-200 bg-white/90 px-3.5 py-3">
          <p className="text-sm font-semibold text-emerald-900 leading-snug">
            ✦ {sponsorStatsConclusion}
          </p>
        </div>
      </div>

      <div className="px-5 py-5">
        <h3 className="text-sm font-bold mb-2" style={{ color: GREEN }}>
          {goalTitle}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-4">{goalText}</p>
        <Link
          href="/financial-overview"
          className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:opacity-80"
          style={{ color: GREEN }}
        >
          {moreLinkLabel} →
        </Link>
      </div>
    </section>
  );
}
