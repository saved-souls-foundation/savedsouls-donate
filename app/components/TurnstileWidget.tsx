"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

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
          size?: "normal" | "compact" | "flexible" | "invisible";
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
  size?: "normal" | "compact" | "flexible" | "invisible";
  theme?: "light" | "dark" | "auto";
};

export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  size = "flexible",
  theme = "light",
}: TurnstileWidgetProps) {
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
  const [containerVisible, setContainerVisible] = useState(false);

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

  // Render widget pas wanneer de container in beeld is (helpt op mobiel bij formulier onderaan).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setContainerVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setContainerVisible(true);
      },
      { rootMargin: "50px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [retryKey]);

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
  }, [loaded, siteKey, containerVisible, size, theme, retryKey]);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const handleRetry = () => {
    if (widgetIdRef.current != null && typeof window !== "undefined" && window.turnstile?.remove) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
    setWidgetError(false);
    setRetryKey((k) => k + 1);
  };

  if (!envSiteKey) return null;

  return (
    <>
      <Script src={TURNSTILE_SCRIPT} strategy="afterInteractive" onLoad={handleLoad} />
      <div
        ref={containerRef}
        className="flex justify-center my-4 min-h-[65px] w-full min-w-[280px] sm:min-w-[300px] max-w-full overflow-visible"
      />
      {widgetError && (
        <div className="text-amber-600 dark:text-amber-400 text-sm mt-2 text-center space-y-2">
          <p>
            The security check could not be loaded (Cloudflare). Please try again, disable ad blockers, or contact us at{" "}
            <a href="mailto:info@savedsouls-foundation.org" className="underline font-medium">info@savedsouls-foundation.org</a>.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
          >
            Retry security check
          </button>
        </div>
      )}
    </>
  );
}
