"use client";

import Script from "next/script";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "info@savedsouls-foundation.org";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Cloudflare test key: altijd geldig, ook op localhost. Zie https://developers.cloudflare.com/turnstile/troubleshooting/testing */
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: number) => void;
          size?: "normal" | "compact" | "flexible";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  size?: "normal" | "compact" | "flexible";
  theme?: "light" | "dark" | "auto";
};

export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  theme = "light",
  size = "flexible",
}: TurnstileWidgetProps) {
  const t = useTranslations("turnstile");
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire ?? (() => {});
  onErrorRef.current = onError ?? (() => {});

  const envSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [containerVisible, setContainerVisible] = useState(true);

  // Op localhost geeft de productie-key error 110200 (domain not allowed). Gebruik dan Cloudflares test-key.
  useEffect(() => {
    if (typeof window === "undefined" || !envSiteKey) {
      setSiteKey(envSiteKey ?? null);
      return;
    }
    const isLocalhost =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setSiteKey(isLocalhost ? TURNSTILE_TEST_SITE_KEY : envSiteKey);
  }, [envSiteKey]);

  // Retry als script na 8s nog niet geladen is (vaak op mobiel).
  useEffect(() => {
    if (!containerVisible || loaded || !siteKey) return;
    // 8s: widget kan laat mounten (o.a. na data-fetch op detail-pagina's); api.js nodig de tijd om te laden
    const t = setTimeout(() => {
      setWidgetError((e) => (e ? e : true));
    }, 8000);
    return () => clearTimeout(t);
  }, [containerVisible, loaded, siteKey, retryKey]);

  useEffect(() => {
    if (!loaded || !siteKey || !containerVisible || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current != null) return;
    const id = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        setWidgetError(false);
        onVerifyRef.current(token);
      },
      "expired-callback": () => onExpireRef.current?.(),
      "error-callback": () => {
        setWidgetError(true);
        onErrorRef.current?.();
      },
      size,
      theme,
    });
    widgetIdRef.current = id;
    return () => {
      if (widgetIdRef.current != null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [loaded, siteKey, containerVisible, theme, size, retryKey]);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleScriptError = useCallback(() => setWidgetError(true), []);

  const handleRetry = () => {
    if (widgetIdRef.current != null && typeof window !== "undefined" && window.turnstile?.remove) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
    setWidgetError(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  if (!envSiteKey) return null;

  return (
    <>
      <Script
        key={retryKey}
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onLoad={handleLoad}
        onError={handleScriptError}
      />
      <div
        ref={containerRef}
        className="w-full min-h-[1px] overflow-hidden"
        aria-label={t("label")}
      />
      {widgetError && (
        <div className="text-amber-600 dark:text-amber-400 text-sm mt-2 text-center space-y-2">
          <p>
            {t("errorBeforeEmail")}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-medium">
              {CONTACT_EMAIL}
            </a>
            {t("errorAfterEmail")}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
          >
            {t("retryButton")}
          </button>
        </div>
      )}
    </>
  );
}
