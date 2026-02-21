"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FrostDonateCard({
  src,
  alt,
  labelKey = "donateNow",
  namespace,
}: {
  src: string;
  alt: string;
  labelKey?: string;
  namespace: string;
}) {
  const t = useTranslations(namespace);
  const label = t(labelKey);

  return (
    <Link
      href="/donate"
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border-2 border-stone-200 dark:border-stone-600 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover scale-105 blur-[0.5px] group-hover:scale-110 group-hover:blur-0 transition-all duration-500"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Subtiele grijze frost overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-0"
        style={{
          background: "linear-gradient(135deg, rgba(100,100,110,0.35) 0%, rgba(80,80,90,0.4) 50%, rgba(100,100,110,0.35) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20 animate-donate-frost pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl md:text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] z-10">
        {label}
      </span>
    </Link>
  );
}
