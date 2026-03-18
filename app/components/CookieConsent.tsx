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
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 rounded-2xl bg-white dark:bg-stone-900 shadow-xl overflow-hidden border border-stone-200 dark:border-stone-700"
      role="dialog"
      aria-label={t("ariaLabel")}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-40 h-32 md:h-auto flex-shrink-0">
          <img
            src="/ourwork-1.webp"
            alt="Saved Souls Foundation"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div>
            <p className="font-medium text-sm text-stone-800 dark:text-stone-100 mb-1">
              {t("cookieTitle")}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t("message")}{" "}
              <Link
                href="/disclaimer#cookies"
                className="underline hover:no-underline font-medium text-stone-800 dark:text-stone-200"
              >
                {t("disclaimer")}
              </Link>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={deny}
              className="flex-1 h-10 rounded-xl border-2 border-stone-800 dark:border-stone-200 text-stone-800 dark:text-stone-200 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              {t("deny")}
            </button>
            <button
              type="button"
              onClick={accept}
              className="flex-1 h-10 rounded-xl bg-[#1a3d2b] text-white text-sm font-medium hover:bg-[#2aa348] transition-colors"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
