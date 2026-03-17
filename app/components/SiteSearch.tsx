"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

const pillButtonClass = "flex items-center justify-center gap-1.5 rounded-full border text-sm transition-all duration-150 cursor-pointer select-none shrink-0";
const pillOverlayStyle = {
  borderColor: "rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.8)",
};
const pillLightStyle = {
  borderColor: "var(--color-border-secondary, #e5e7eb)",
  background: "var(--color-background-secondary, #f9fafb)",
  color: "var(--color-text-secondary, #4b5563)",
};

const sparkleStyle = (
  <style dangerouslySetInnerHTML={{ __html: `
  @keyframes sparkle-pulse {
    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
    25% { opacity: 0.8; transform: scale(1.2) rotate(15deg); }
    75% { opacity: 0.9; transform: scale(1.1) rotate(-10deg); }
  }
  .sparkle-animate {
    display: inline-block;
    animation: sparkle-pulse 3s ease-in-out infinite;
  }
` }} />
);

export default function SiteSearch({ mobileIcon = false, desktopIconOnly = false, overlay = false }: { mobileIcon?: boolean; desktopIconOnly?: boolean; overlay?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const isOverlayStyle = overlay;
  const style = isOverlayStyle ? pillOverlayStyle : pillLightStyle;
  const sparkleColor = "#1a5c2e";

  const goToSearch = () => router.push("/search");

  if (mobileIcon) {
    const mobilePillStyle = isOverlayStyle
      ? { display: "flex" as const, alignItems: "center" as const, gap: "4px", padding: "6px 10px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", fontSize: "13px", cursor: "pointer" as const }
      : { display: "flex" as const, alignItems: "center" as const, gap: "4px", padding: "6px 10px", borderRadius: "20px", border: "1px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", fontSize: "13px", cursor: "pointer" as const };
    return (
      <>
        {sparkleStyle}
        <div className="relative shrink-0 flex items-center" style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
          <button type="button" onClick={goToSearch} style={mobilePillStyle} aria-label={t("siteSearchPlaceholder")}>
            <span className="sparkle-animate" style={{ color: sparkleColor, fontSize: "13px" }}>✦</span>
            <span>{locale === "nl" ? "Zoek..." : "Search..."}</span>
          </button>
        </div>
      </>
    );
  }

  if (desktopIconOnly) {
    return (
      <div className="relative shrink-0 flex items-center">
        {sparkleStyle}
        <button
          type="button"
          onClick={goToSearch}
          onMouseOver={(e) => {
            if (overlay) e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            else e.currentTarget.style.background = "var(--color-background-hover, #f3f4f6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = style.background as string;
          }}
          className={pillButtonClass + " px-3 py-1.5"}
          style={style}
          aria-label={t("siteSearchPlaceholder")}
        >
          <span className="sparkle-animate" style={{ color: sparkleColor, fontSize: "14px" }}>✦</span>
          <span>{locale === "nl" ? "Zoek..." : "Search..."}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative shrink-0 flex items-center">
      {sparkleStyle}
      <button
        type="button"
        onClick={goToSearch}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "var(--color-background-hover, #f3f4f6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = pillLightStyle.background as string;
        }}
        className={pillButtonClass + " px-3 py-1.5"}
        style={pillLightStyle}
        aria-label={t("siteSearchPlaceholder")}
      >
        <span className="sparkle-animate" style={{ color: sparkleColor, fontSize: "14px" }}>✦</span>
        <span>{locale === "nl" ? "Zoek..." : "Search..."}</span>
      </button>
    </div>
  );
}
