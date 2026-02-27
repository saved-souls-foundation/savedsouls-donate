"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ACCENT_GREEN = "#2aa348";

/**
 * Banner voor volunteer-, sponsor- en adopt-pagina’s: link naar inloggen / mijn voortgang.
 */
export default function DashboardLoginBanner() {
  const t = useTranslations("dashboard");

  return (
    <section
      id="dashboard-login-banner"
      aria-label="Inloggen of registreren"
      className="min-h-[60px] rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-4 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-stone-700 dark:text-stone-300">
        {t("loginBannerTitle")}{" "}
        <Link
          href="/dashboard/login?register=1"
          className="font-semibold underline hover:no-underline"
          style={{ color: ACCENT_GREEN }}
        >
          {t("loginBannerOrRegister")}
        </Link>
      </p>
      <Link
        href="/dashboard/login"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
        style={{ backgroundColor: ACCENT_GREEN }}
      >
        {t("loginBannerCta")} →
      </Link>
    </section>
  );
}
