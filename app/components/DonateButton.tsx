"use client";

import Image from "next/image";

const BUTTON_ORANGE = "#E67A4C";

export default function DonateButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-2xl inline-flex items-center justify-center px-8 py-4 font-semibold text-white text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      {/* Dog photo - frost overlay, 100% helder bij hover */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-hug.png"
          alt=""
          fill
          className="object-cover scale-105 blur-[0.5px] group-hover:scale-110 group-hover:blur-0 transition-all duration-500"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        {/* Frost overlay - verdwijnt bij hover */}
        <div
          className="absolute inset-0 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-0"
          style={{
            background: `linear-gradient(135deg, ${BUTTON_ORANGE}77 0%, ${BUTTON_ORANGE}66 50%, #d4693a88 100%)`,
          }}
        />
        {/* Frost shimmer - verdwijnt bij hover */}
        <div
          className="absolute inset-0 opacity-25 animate-donate-frost pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      {/* Text layer */}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {children}
      </span>
    </a>
  );
}
