"use client";

import { Link } from "@/i18n/navigation";

export default function NavLogo() {
  return (
    <Link
      href="/"
      className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
    >
      <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
        <video
          src="/savedsouls-fondation-logo.mp4"
          width={70}
          height={70}
          className="block w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          title="Saved Souls Foundation logo"
        />
      </div>
      <span className="text-sm font-semibold" style={{ color: "#2aa348" }}>Saved Souls Foundation</span>
    </Link>
  );
}
