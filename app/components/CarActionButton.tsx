"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const BUTTON_BLUE = "#2563eb";

export default function CarActionButton() {
  const t = useTranslations("home");
  const pathname = usePathname();
  if (pathname === "/" || pathname === "") return null;

  return (
    <Link
      href="/car-action"
      className="fixed bottom-6 left-6 z-[100] flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse-blue hover:scale-105 transition-transform"
      style={{ backgroundColor: BUTTON_BLUE }}
      aria-label={t("carActionCta")}
    >
      <span className="text-2xl" aria-hidden>🚗</span>
      <span className="text-base md:text-lg">{t("carActionCta")}</span>
    </Link>
  );
}
