"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GOFUNDME_CAMPAIGN_URL, gtagReportConversion } from "@/lib/gtag";

const GOFUNDME_URL = GOFUNDME_CAMPAIGN_URL;

const LS_DONATED = "ssf_donated";
const LS_SHOWN = "ssf_popup_shown";
const LS_CLOSED_AT = "ssf_popup_closed_at";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const MOBILE_MAX_WIDTH = 768;
const DESKTOP_MIN_MS = 15_000;
const MOBILE_TIMER_MS = 30_000;
const MOBILE_SCROLL_THRESHOLD = 120;
const FAST_SCROLL_UP_PX = 100;
const FAST_SCROLL_MAX_MS = 400;

const BLOCKED_FIRST_SEGMENTS = new Set(["donate", "doneer", "spenden", "emergency"]);

function isPathBlocked(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  const afterLocale = parts.slice(1);
  const first = afterLocale[0]?.toLowerCase();
  return first != null && BLOCKED_FIRST_SEGMENTS.has(first);
}

function hasGoFundMeOnPage(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.querySelector(
      'a[href*="gofundme.com"], a[href*="gofund.me"], iframe[src*="gofundme"]',
    ) != null
  );
}

/**
 * Geen donateurs; na sluiten minstens 7 dagen wachten (ssf_popup_closed_at), daarna opnieuw tonen mogelijk.
 * ssf_popup_shown wordt gezet bij tonen (tracking); gate gebruikt alleen donated + 7d.
 */
function readMayShowPopup(): boolean {
  try {
    if (localStorage.getItem(LS_DONATED)) return false;
    const closedRaw = localStorage.getItem(LS_CLOSED_AT);
    if (closedRaw) {
      const ts = parseInt(closedRaw, 10);
      if (!Number.isNaN(ts) && Date.now() - ts < SEVEN_DAYS_MS) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default function ExitIntentPopup() {
  const t = useTranslations("exitPopup");
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  const pageEnterRef = useRef(0);
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileScrollAccumRef = useRef(0);
  const mobileQualifiedRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  const closePopup = useCallback((recordDismiss: boolean) => {
    openRef.current = false;
    setOpen(false);
    if (recordDismiss) {
      try {
        localStorage.setItem(LS_CLOSED_AT, String(Date.now()));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const tryOpen = useCallback(() => {
    if (openRef.current) return;
    if (!readMayShowPopup()) return;
    if (isPathBlocked(pathname) || hasGoFundMeOnPage()) return;
    try {
      localStorage.setItem(LS_SHOWN, "true");
    } catch {
      /* ignore */
    }
    openRef.current = true;
    setOpen(true);
  }, [pathname]);

  const onDonateClick = useCallback(() => {
    try {
      localStorage.setItem(LS_DONATED, "true");
    } catch {
      /* ignore */
    }
    openRef.current = false;
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup(true);
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, closePopup]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearMobileTimer = () => {
      if (mobileTimerRef.current != null) {
        clearTimeout(mobileTimerRef.current);
        mobileTimerRef.current = null;
      }
    };

    setOpen(false);
    openRef.current = false;
    clearMobileTimer();
    pageEnterRef.current = Date.now();
    mobileScrollAccumRef.current = 0;
    mobileQualifiedRef.current = false;
    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = Date.now();

    if (!readMayShowPopup() || isPathBlocked(pathname)) return;

    const isMobile = () => window.innerWidth < MOBILE_MAX_WIDTH;

    const onScroll = () => {
      if (openRef.current) return;
      if (!readMayShowPopup()) return;
      if (isPathBlocked(pathname) || hasGoFundMeOnPage()) return;

      const y = window.scrollY;
      const now = Date.now();

      if (isMobile()) {
        mobileScrollAccumRef.current += Math.abs(y - lastScrollYRef.current);
        lastScrollYRef.current = y;
        if (!mobileQualifiedRef.current && mobileScrollAccumRef.current >= MOBILE_SCROLL_THRESHOLD) {
          mobileQualifiedRef.current = true;
          clearMobileTimer();
          mobileTimerRef.current = setTimeout(() => {
            tryOpen();
          }, MOBILE_TIMER_MS);
        }
        return;
      }

      const dt = now - lastScrollTimeRef.current;
      const up = lastScrollYRef.current - y;
      if (up > FAST_SCROLL_UP_PX && dt > 0 && dt < FAST_SCROLL_MAX_MS) {
        if (Date.now() - pageEnterRef.current >= DESKTOP_MIN_MS) {
          tryOpen();
        }
      }
      lastScrollYRef.current = y;
      lastScrollTimeRef.current = now;
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (openRef.current) return;
      if (isMobile()) return;
      if (!readMayShowPopup()) return;
      if (isPathBlocked(pathname) || hasGoFundMeOnPage()) return;
      if (Date.now() - pageEnterRef.current < DESKTOP_MIN_MS) return;
      if (e.clientY < 10) tryOpen();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      clearMobileTimer();
    };
  }, [pathname, tryOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ssf-exit-popup-title"
      onClick={() => closePopup(true)}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-800 shadow-xl dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 ssf-exit-popup-pulse"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          aria-label={t("closeLabel")}
          onClick={() => closePopup(true)}
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
        <div className="relative max-h-[200px] w-full overflow-hidden">
          <Image
            src="/dog-wheelchair-small.webp"
            alt=""
            width={800}
            height={200}
            className="h-auto max-h-[200px] w-full object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>
        <div className="px-5 pb-6 pt-4">
          <h2 id="ssf-exit-popup-title" className="pr-10 text-lg font-bold leading-snug">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {t("subtitle")}
          </p>
          <a
            href={GOFUNDME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            onClick={(e) => {
              e.preventDefault();
              onDonateClick();
              gtagReportConversion(GOFUNDME_URL, { navigate: "new-tab" });
            }}
          >
            {t("buttonText")}
          </a>
        </div>
      </div>
    </div>
  );
}
