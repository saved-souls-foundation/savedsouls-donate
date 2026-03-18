"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CONSENT_KEY = "cookie-consent";
type ConsentStatus = "granted" | "denied";

function updateGtagConsent(analyticsStorage: ConsentStatus): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: analyticsStorage,
  });
}

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
    if (stored != null) {
      updateGtagConsent(stored);
      return;
    }
    setVisible(true);
  }, []);

  const accept = () => {
    updateGtagConsent("granted");
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
  };

  const deny = () => {
    updateGtagConsent("denied");
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 bg-white/98 dark:bg-stone-900/98 border-t border-stone-200 dark:border-stone-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] mb-20 sm:mb-0"
      role="dialog"
      aria-label={t("ariaLabel")}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-stone-600 dark:text-stone-400 flex-1">
          {t("message")}{" "}
          <Link
            href="/disclaimer#cookies"
            className="underline hover:no-underline font-medium text-stone-800 dark:text-stone-200"
          >
            {t("disclaimer")}
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={deny}
            className="px-5 py-2.5 rounded-lg font-semibold text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {t("deny")}
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-5 py-2.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2aa348" }}
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
