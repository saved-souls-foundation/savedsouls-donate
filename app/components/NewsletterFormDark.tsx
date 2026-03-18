"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const ACCENT_GREEN = "#2aa348";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterFormDark() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage(t("validationConsent"));
      setStatus("error");
      return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage(t("validationEmail"));
      setStatus("error");
      return;
    }
    setErrorMessage("");
    setStatus("idle");
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, taal: locale }),
      });
      const text = await res.text();
      const data = (() => { try { return JSON.parse(text); } catch { return {}; } })();
      if (res.ok) {
        setStatus(data.message === "already subscribed" ? "already" : "success");
        return;
      }
      setStatus("error");
      setErrorMessage(typeof data.error === "string" ? data.error : t("errorMessage"));
    } catch {
      setStatus("error");
      setErrorMessage(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "success" || status === "already") {
    return (
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "#7ed99a", fontSize: "16px", fontWeight: 600 }}>
          {status === "success" ? t("successTitle") : t("alreadySubscribed")}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", padding: "1.5rem" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, textAlign: "center", marginBottom: "0.25rem" }}>
          {t("title")}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", textAlign: "center", marginBottom: "1.25rem" }}>
          {t("subtitle")}
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "14px", outline: "none" }}
            autoComplete="email"
          />
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "rgba(255,255,255,0.85)", fontSize: "13px", cursor: "pointer" }}>
            <input
              type="checkbox"
              id="newsletter-consent-dark"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: "3px", width: "18px", height: "18px", flexShrink: 0, accentColor: ACCENT_GREEN }}
            />
            <span>
              {t("consentBeforeLink")}
              <Link href="/privacy-policy" className="underline hover:opacity-90" style={{ color: ACCENT_GREEN }}>
                {t("privacyLinkText")}
              </Link>
            </span>
          </label>
          {status === "error" && errorMessage && (
            <p style={{ color: "#f87171", fontSize: "13px" }} role="alert">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={loading || !consent}
            style={{ width: "100%", padding: "13px", background: ACCENT_GREEN, color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t("subscribing") : t("subscribeButton")}
          </button>
        </form>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center", marginTop: "0.75rem" }}>
          {t("noSpam")}
        </p>
      </div>
    </div>
  );
}
