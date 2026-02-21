"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const BUTTON_ORANGE = "#E67A4C";

export default function ClinicActionButton() {
  const t = useTranslations("home");

  return (
    <Link
      href="/clinic-renovation"
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse hover:scale-105 transition-transform"
      style={{ backgroundColor: BUTTON_ORANGE }}
      aria-label={t("clinicActionCta")}
    >
      <span className="text-2xl" aria-hidden>⭐</span>
      <span className="text-base md:text-lg">{t("clinicActionCta")}</span>
    </Link>
  );
}
