"use client";
import { useTranslations } from "next-intl";

export default function NewsletterHero() {
  const t = useTranslations("newsletterHero");

  return (
    <div style={{ background: "#0f2614", padding: "4rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7ed99a", flexShrink: 0 }} />
          <span style={{ color: "#7ed99a", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {t("tag")}
          </span>
        </div>

        <h2 style={{ color: "#fff", fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1rem" }}>
          <span style={{ color: "#7ed99a" }}>{t("heroAccent")}</span>
          <br />
          {t("title")}
        </h2>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "460px" }}>
          {t("subtitle")}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", background: "rgba(255,255,255,0.08)",
          borderRadius: "12px", overflow: "hidden", marginBottom: "2.5rem"
        }}>
          {[
            { num: "350", label: t("stat1") },
            { num: "98",  label: t("stat2") },
            { num: "50",  label: t("stat3") },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", padding: "1.25rem 1rem", textAlign: "center" }}>
              <div style={{ color: "#7ed99a", fontSize: "26px", fontWeight: 800 }}>{s.num}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "2rem" }}>
          {[t("benefit1"), t("benefit2"), t("benefit3")].map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2aa348", flexShrink: 0, display: "inline-block" }} />
              {b}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
