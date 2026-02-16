"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";

const CONSENT_KEY = "savedsouls-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 bg-white/98 dark:bg-stone-900/98 border-t border-stone-200 dark:border-stone-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-stone-600 dark:text-stone-400 flex-1">
          We use cookies to improve your experience and for essential site functionality. By continuing you agree to our use of cookies.{" "}
          <Link href="/disclaimer" className="underline hover:no-underline font-medium text-stone-800 dark:text-stone-200">
            Disclaimer
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="flex-shrink-0 px-5 py-2.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2aa348" }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
