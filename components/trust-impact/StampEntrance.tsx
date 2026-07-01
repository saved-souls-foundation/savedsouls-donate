"use client";

import { useEffect, useId, useRef, useState } from "react";

export const STAMP_ENTRANCE_SESSION_KEY = "ti-stamp-entrance-seen";

const CIRCLE_TEXT =
  "★ SAVED SOULS FOUNDATION ★ VERIFIED ★ SAVED SOULS FOUNDATION ★ VERIFIED ★";

type StampEntranceProps = {
  onImpact?: () => void;
  onComplete?: () => void;
};

function EntranceStampSvg({ filterId, pathId }: { filterId: string; pathId: string }) {
  const ink = "var(--color-stamp)";

  return (
    <svg viewBox="0 0 200 200" className="ti-stamp-entrance__svg" aria-hidden>
      <defs>
        <filter id={filterId} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="17" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <path
          id={pathId}
          d="M 100, 100 m -70, 0 a 70, 70 0 1, 1 140, 0 a 70, 70 0 1, 1 -140, 0"
          fill="none"
        />
      </defs>

      <g filter={`url(#${filterId})`} fill={ink} stroke={ink}>
        <circle cx="100" cy="100" r="90" fill="none" strokeWidth="3.2" />
        <circle cx="100" cy="100" r="80" fill="none" strokeWidth="1.4" opacity="0.85" />
        <text className="ti-stamp-badge__circle-text" fontSize="8.2" letterSpacing="0.22em">
          <textPath href={`#${pathId}`} startOffset="0%">
            {CIRCLE_TEXT}
          </textPath>
        </text>
      </g>

      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={ink}
        className="ti-stamp-entrance__center"
        fontSize="13"
        letterSpacing="2"
      >
        VERIFIED
      </text>
    </svg>
  );
}

export function shouldPlayStampEntrance(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return sessionStorage.getItem(STAMP_ENTRANCE_SESSION_KEY) !== "1";
}

export default function StampEntrance({ onImpact, onComplete }: StampEntranceProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `ti-entrance-grunge-${uid}`;
  const pathId = `ti-entrance-path-${uid}`;
  const [phase, setPhase] = useState<"slam" | "impact" | "exit" | "done">("slam");
  const [visible, setVisible] = useState(true);
  const callbacksRef = useRef({ onImpact, onComplete });

  useEffect(() => {
    callbacksRef.current = { onImpact, onComplete };
  }, [onImpact, onComplete]);

  useEffect(() => {
    const impactTimer = window.setTimeout(() => {
      setPhase("impact");
      callbacksRef.current.onImpact?.();
    }, 500);

    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
    }, 700);

    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      setVisible(false);
      sessionStorage.setItem(STAMP_ENTRANCE_SESSION_KEY, "1");
      callbacksRef.current.onComplete?.();
    }, 1100);

    return () => {
      window.clearTimeout(impactTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible || phase === "done") return null;

  return (
    <div className="ti-stamp-entrance" aria-hidden="true">
      <div className={`ti-stamp-entrance__stamp ti-stamp-entrance__stamp--${phase}`}>
        <EntranceStampSvg filterId={filterId} pathId={pathId} />
      </div>
      {phase === "impact" || phase === "exit" ? (
        <div className="ti-stamp-entrance__ink ti-stamp-entrance__ink--burst" />
      ) : null}
    </div>
  );
}
