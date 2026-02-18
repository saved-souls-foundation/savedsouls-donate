"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

const SHARE_OPTIONS = [
  { id: "whatsapp", name: "WhatsApp", icon: "📱" },
  { id: "facebook", name: "Facebook", icon: "📘" },
  { id: "twitter", name: "X (Twitter)", icon: "𝕏" },
  { id: "telegram", name: "Telegram", icon: "✈️" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
  { id: "copy", name: "copy", icon: "🔗" },
] as const;

function getShareUrl(platform: string, url: string, title: string, text: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n\n${text}`);
  const combined = encodeURIComponent(`${title} ${url}`);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${combined}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return url;
  }
}

type ShareStoryButtonProps = {
  label: string;
  shareTitle: string;
  shareText: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function ShareStoryButton({ label, shareTitle, shareText, className = "", style = {} }: ShareStoryButtonProps) {
  const t = useTranslations("share");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNativeShare = async () => {
    if (typeof window === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.href,
      });
      setOpen(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") return;
    }
  };

  const handleShare = async (platform: string) => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    const shareUrl = getShareUrl(platform, url, shareTitle, shareText);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={className}
        style={style}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
      </button>

      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 py-2 px-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-600 shadow-xl z-50 min-w-[200px]"
          role="menu"
        >
          <p className="px-3 py-1 text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            {t("shareVia")}
          </p>
          {canNativeShare && (
            <button
              type="button"
              onClick={() => handleNativeShare()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-left text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors"
              role="menuitem"
            >
              <span className="text-lg">📤</span>
              <span>{t("nativeShare")}</span>
            </button>
          )}
          {SHARE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleShare(opt.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-left text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors"
              role="menuitem"
            >
              <span className="text-lg">{opt.icon}</span>
              <span>
                {opt.id === "copy"
                  ? copied
                    ? t("copied")
                    : t("copyLink")
                  : t(opt.id as "whatsapp" | "facebook" | "twitter" | "telegram" | "linkedin")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
