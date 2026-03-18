"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { messages } from "@/data/ticker-messages";

const DONORBOX_URL = "https://donorbox.org/saved-souls-foundation-donation";

const getDailyOffset = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % messages.length;
};

export default function ImpactTicker() {
  const locale = useLocale();
  const lang = locale === "nl" ? "nl" : locale === "de" ? "de" : "en";
  const [raised, setRaised] = useState<number>(0);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/campaign-stats")
      .then((r) => r.json())
      .then((d) => {
        const amount = d.raised ?? 0;
        if (amount > 0) {
          setRaised(amount);
          setIndex(0); // zet index naar 0 = dynamicMessage
        }
      })
      .catch(() => {});
  }, []);

  const dynamicMessage = {
    nl: `❤️ Al €${raised.toLocaleString("nl-NL")} opgehaald — help ons verder!`,
    en: `❤️ €${raised.toLocaleString("en-GB")} raised — help us reach our goal!`,
    de: `❤️ €${raised.toLocaleString("de-DE")} gesammelt — hilf uns weiter!`,
    url: "/emergency",
  };

  const allMessages = raised > 0 ? [dynamicMessage, ...messages] : messages;

  useEffect(() => {
    setMounted(true);
    setIndex(getDailyOffset());
    const dismissed = sessionStorage.getItem("tickerDismissed");
    if (dismissed === "true") setDismissed(true);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % allMessages.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed, raised]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("tickerDismissed", "true");
  };

  const url = allMessages[index]?.url;
  const currentHref = url
    ? url.startsWith("http")
      ? url
      : `/${locale}${url}`
    : DONORBOX_URL;

  if (!mounted) return null;

  if (dismissed) {
    return (
      <button
        onClick={() => {
          setDismissed(false);
          setVisible(true);
          sessionStorage.removeItem("tickerDismissed");
        }}
        className="fixed bottom-4 right-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ backgroundColor: "#2aa348" }}
        aria-label="Ticker openen"
      >
        🐾
      </button>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shimmerTicker {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .ticker-shimmer {
          background: linear-gradient(90deg, #1a6b2e 0%, #2aa348 40%, #3db85a 50%, #2aa348 60%, #1a6b2e 100%);
          background-size: 400px 100%;
          animation: shimmerTicker 4s linear infinite;
        }
        .ticker-bg {
          background: linear-gradient(135deg, #1a6b2e 0%, #2aa348 100%);
        }
      `}</style>

      {/* MOBILE: bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[50] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="ticker-bg shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="ticker-shimmer h-0.5 w-full" />
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <a
              href={currentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-white text-xs font-medium truncate transition-opacity duration-400"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {allMessages[index][lang]}
            </a>
            <a
              href={currentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg text-white border border-white/30 hover:bg-white/10 transition-all"
            >
              ♥ Doneer
            </a>
            <button
              onClick={handleDismiss}
              className="shrink-0 text-white/60 hover:text-white text-lg leading-none ml-1"
              aria-label="Sluiten"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP: floating card bottom right */}
      <div className="fixed hidden md:block pointer-events-none" style={{ bottom: "24px", right: "16px", width: "300px", zIndex: 50 }}>
        <div className="ticker-bg rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(42,163,72,0.35),0_2px_8px_rgba(0,0,0,0.2)] pointer-events-auto">
          <div className="ticker-shimmer h-1 w-full" />
          <div className="px-4 pt-3 pb-2 flex items-start gap-2">
            <span className="relative flex h-2 w-2 shrink-0 mt-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <p
              className="text-white text-xs font-medium leading-relaxed flex-1 transition-opacity duration-400"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <a href={currentHref} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">
                {allMessages[index][lang]}
              </a>
            </p>
            <button
              onClick={handleDismiss}
              className="text-white/40 hover:text-white transition-colors text-lg leading-none shrink-0 -mt-0.5"
              aria-label="Sluiten"
            >
              ×
            </button>
          </div>
          <div className="px-4 pb-3 pt-1">
            <a
              href={currentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-xs font-bold py-2 rounded-xl hover:bg-white/20 transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              ♥ Doneer nu — red een leven
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
