"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

const BUTTON_ORANGE = "#2aa348";
const ACCENT_GREEN = "#2aa348";

const HEART_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function DogDonateButton({
  href,
  children,
  variant = "orange",
  imageSrc = "/hero-hug.png",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "orange" | "green";
  imageSrc?: string;
  className?: string;
}) {
  const color = variant === "orange" ? BUTTON_ORANGE : ACCENT_GREEN;
  const glowClass =
    variant === "orange"
      ? "shadow-[0_0_20px_rgba(230,122,76,0.4)] hover:shadow-[0_0_30px_rgba(230,122,76,0.55)]"
      : "shadow-[0_0_20px_rgba(42,163,72,0.35)] hover:shadow-[0_0_28px_rgba(42,163,72,0.5)]";

  return (
    <Link
      href={href}
      className={`group relative overflow-visible rounded-xl inline-flex items-center justify-center px-8 py-4 font-semibold text-white text-base transition-all duration-500 hover:scale-[1.02] min-h-[52px] ${glowClass} ${className}`}
    >
      {/* Dog photo - frost overlay, helder bij hover */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover scale-105 blur-[0.5px] group-hover:scale-110 group-hover:blur-0 transition-all duration-500 rounded-xl"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        {/* Frost overlay - verdwijnt bij hover */}
        <div
          className="absolute inset-0 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-0 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${color}88 0%, ${color}66 50%, ${color}77 100%)`,
          }}
        />
        {/* Frost shimmer */}
        <div
          className="absolute inset-0 opacity-20 animate-donate-frost pointer-events-none transition-opacity duration-500 group-hover:opacity-0 rounded-xl"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Hearts - vliegen naar rechts bij hover */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none z-10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="opacity-0 group-hover:animate-heart-fly-right"
            style={{
              color,
              animationDelay: `${i * 80}ms`,
              animationFillMode: "forwards",
            }}
          >
            {HEART_SVG}
          </span>
        ))}
      </div>

      {/* Text layer */}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] pr-6">
        {children}
      </span>
    </Link>
  );
}
