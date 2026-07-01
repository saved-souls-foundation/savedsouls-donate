"use client";

import { useId } from "react";
import type { CSSProperties } from "react";

export type StampColor = "stamp" | "amethyst" | "ember";

type StampBadgeProps = {
  value: string;
  label: string;
  color: StampColor;
  rotation: number;
  circleText?: string;
  size?: "default" | "mini";
};

const INK: Record<StampColor, string> = {
  stamp: "var(--color-stamp)",
  amethyst: "var(--color-amethystdim)",
  ember: "var(--color-ember)",
};

const DEFAULT_CIRCLE =
  "★ SAVED SOULS FOUNDATION ★ VERIFIED ★ SAVED SOULS FOUNDATION ★ VERIFIED ★";
const COMPACT_CIRCLE = "★ SAVED SOULS ★ VERIFIED ★ SAVED SOULS ★ VERIFIED ★";

function splitLabel(label: string): string[] {
  const up = label.toUpperCase();
  if (up.length <= 22) return [up];
  const amp = up.indexOf(" & ");
  if (amp > 0) {
    return [up.slice(0, amp + 3), up.slice(amp + 3).trim()];
  }
  const space = up.indexOf(" ", Math.floor(up.length / 2));
  if (space > 0) return [up.slice(0, space), up.slice(space + 1)];
  return [up];
}

function MiniStampBadge({
  text,
  color,
  rotation,
  filterId,
  ariaLabel,
}: {
  text: string;
  color: StampColor;
  rotation: number;
  filterId: string;
  ariaLabel: string;
}) {
  const ink = INK[color];

  return (
    <div
      className={`ti-stamp-badge ti-stamp-badge--${color} ti-stamp-badge--mini`}
      style={{ "--ti-stamp-rotation": `${rotation}deg` } as CSSProperties}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 200 200" className="ti-stamp-badge__svg" aria-hidden>
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
        </defs>

        <g filter={`url(#${filterId})`} fill="none" stroke={ink}>
          <circle cx="100" cy="100" r="92" strokeWidth="3.2" />
          <circle cx="100" cy="100" r="82" strokeWidth="1.4" opacity="0.85" />
        </g>

        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={ink}
          className="ti-stamp-badge__mini-text"
          fontSize="12"
          letterSpacing="0.6"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

export default function StampBadge({
  value,
  label,
  color,
  rotation,
  circleText,
  size = "default",
}: StampBadgeProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `ti-stamp-grunge-${uid}`;
  const pathId = `ti-stamp-path-${uid}`;
  const ink = INK[color];
  const fullText = circleText ?? DEFAULT_CIRCLE;
  const labelLines = label ? splitLabel(label) : [];
  const miniText = (label || value).toUpperCase();
  const ariaLabel = label ? `${value}, ${label}` : value || miniText;

  if (size === "mini") {
    return (
      <MiniStampBadge
        text={miniText}
        color={color}
        rotation={rotation}
        filterId={filterId}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <div
      className={`ti-stamp-badge ti-stamp-badge--${color}`}
      style={{ "--ti-stamp-rotation": `${rotation}deg` } as CSSProperties}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 200 200" className="ti-stamp-badge__svg" aria-hidden>
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
          <text
            className="ti-stamp-badge__circle-text ti-stamp-badge__circle-text--full"
            fontSize="8.2"
            letterSpacing="0.22em"
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              {fullText}
            </textPath>
          </text>
          <text
            className="ti-stamp-badge__circle-text ti-stamp-badge__circle-text--compact"
            fontSize="8.6"
            letterSpacing="0.2em"
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              {COMPACT_CIRCLE}
            </textPath>
          </text>
        </g>

        <text
          x="100"
          y={labelLines.length > 1 ? 88 : 96}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={ink}
          className="ti-stamp-badge__value"
        >
          {value}
        </text>
        {labelLines.length > 0 && (
          <text
            x="100"
            y={labelLines.length > 1 ? 116 : 122}
            textAnchor="middle"
            fill={ink}
            className="ti-stamp-badge__label"
            opacity="0.9"
          >
            {labelLines.map((line, i) => (
              <tspan key={line} x="100" dy={i === 0 ? 0 : "1.35em"}>
                {line}
              </tspan>
            ))}
          </text>
        )}
      </svg>
    </div>
  );
}
