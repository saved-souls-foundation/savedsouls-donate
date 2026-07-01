"use client";

import { COUNTERS } from "./content";
import Reveal from "./Reveal";
import { useCountUp } from "@/hooks/useCountUp";

const RING_MAX = [400, 120, 60, 20] as const;

function ImpactRing({ value, max }: { value: number; max: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <svg className="ti-impact-ring" viewBox="0 0 100 100" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(247, 241, 227, 0.18)"
        strokeWidth="2"
        strokeDasharray="3 5"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(247, 241, 227, 0.55)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}

function Counter({ target, label, max }: { target: number; label: string; max: number }) {
  const { ref, value } = useCountUp(target);

  return (
    <Reveal>
      <div ref={ref} className="ti-impact-stat">
        <div className="ti-impact-stat-ring-wrap">
          <ImpactRing value={value} max={max} />
          <div className="ti-impact-stat-value" style={{ fontFamily: "var(--ti-serif)" }}>
            {value}
          </div>
        </div>
        <div className="ti-impact-stat-label" style={{ fontFamily: "var(--ti-mono)" }}>
          {label}
        </div>
      </div>
    </Reveal>
  );
}

export default function ImpactCounters() {
  return (
    <section className="ti-impact py-24 text-rice" id="impact">
      <div className="ti-impact-texture" aria-hidden />
      <div className="ti-wrap relative z-[1]">
        <Reveal>
          <div className="ti-section-head ti-section-head--on-dark">
            <p className="ti-eyebrow ti-eyebrow--on-dark">By the numbers</p>
            <h2>What &quot;verified&quot; looks like</h2>
            <p>
              Updated figures from the sanctuary — the same numbers you&apos;d get if you called us directly.
            </p>
          </div>
        </Reveal>
        <div className="ti-impact-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {COUNTERS.map((counter, index) => (
              <Counter key={counter.label} target={counter.target} label={counter.label} max={RING_MAX[index]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
