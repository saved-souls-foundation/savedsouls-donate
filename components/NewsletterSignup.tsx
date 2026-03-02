"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2 } from "lucide-react";

const ACCENT_GREEN = "#2aa348";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Variant = "compact" | "expanded";

type Props = {
  variant?: Variant;
};

export default function NewsletterSignup({ variant = "compact" }: Props) {
  const t = useTranslations("newsletter");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [type, setType] = useState<"persoon" | "bedrijf">("persoon");
  const [bedrijfsnaam, setBedrijfsnaam] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    // Validatie vóór fetch: bij leeg of ongeldig e-mailadres wordt géén API-request gedaan.
    if (!trimmedEmail) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[NewsletterSignup] Geen request: e-mail is leeg (validation)");
      }
      setErrorMessage(t("validationEmail"));
      setStatus("error");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[NewsletterSignup] Geen request: ongeldig e-mailformaat (validation)", trimmedEmail);
      }
      setErrorMessage(t("validationEmail"));
      setStatus("error");
      return;
    }
    setErrorMessage("");
    setStatus("idle");
    setLoading(true);
    try {
      const body: Record<string, string> = {
        email: trimmedEmail,
        taal: locale,
      };
      if (variant === "expanded") {
        if (voornaam.trim()) body.voornaam = voornaam.trim();
        body.type = type;
        if (type === "bedrijf" && bedrijfsnaam.trim()) body.bedrijfsnaam = bedrijfsnaam.trim();
      }
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      const data = (() => {
        try {
          return JSON.parse(text) as { error?: string; message?: string };
        } catch {
          return {};
        }
      })();
      if (res.ok) {
        if (data.message === "already subscribed") {
          setStatus("already");
        } else {
          setStatus("success");
        }
        return;
      }
      setStatus("error");
      const apiError = typeof data.error === "string" ? data.error : null;
      setErrorMessage(apiError || t("errorMessage"));
      // Altijd in console loggen zodat je de echte fout kunt terugvinden (Network-tab of serverlogs)
      console.error("[newsletter subscribe]", res.status, apiError ?? (text.slice(0, 200) || "Geen response-body"));
    } catch {
      setStatus("error");
      setErrorMessage(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-8 text-center">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-500" style={{ color: ACCENT_GREEN }} aria-hidden />
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            {t("successTitle")}
          </h3>
          <p className="mt-2 text-stone-600 dark:text-stone-400 text-sm">
            {t("successBody")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-8 text-center">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm">
          <p className="text-stone-700 dark:text-stone-300">
            {t("alreadySubscribed")}
          </p>
          <Link href="/" className="inline-block mt-4 text-sm font-medium underline" style={{ color: ACCENT_GREEN }}>
            {tCommon("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const isExpanded = variant === "expanded";

  return (
    <div className="max-w-[480px] mx-auto px-4 py-8">
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 text-center">
          {t("title")}
        </h2>
        <p className="mt-1 text-stone-600 dark:text-stone-400 text-sm text-center mb-6">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isExpanded && (
            <div>
              <label htmlFor="newsletter-voornaam" className="sr-only">
                {t("voornaamPlaceholder")}
              </label>
              <input
                id="newsletter-voornaam"
                type="text"
                placeholder={t("voornaamPlaceholder")}
                value={voornaam}
                onChange={(e) => setVoornaam(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-stone-900 focus:ring-[#2aa348]"
                autoComplete="given-name"
              />
            </div>
          )}

          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              {t("emailPlaceholder")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-stone-900 focus:ring-[#2aa348]"
              autoComplete="email"
            />
          </div>

          {isExpanded && (
            <>
              <div>
                <label htmlFor="newsletter-type" className="sr-only">
                  Type
                </label>
                <select
                  id="newsletter-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "persoon" | "bedrijf")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-stone-900 focus:ring-[#2aa348]"
                >
                  <option value="persoon">{t("typePersoon")}</option>
                  <option value="bedrijf">{t("typeBedrijf")}</option>
                </select>
              </div>
              {type === "bedrijf" && (
                <div>
                  <label htmlFor="newsletter-bedrijfsnaam" className="sr-only">
                    {t("bedrijfsnaamPlaceholder")}
                  </label>
                  <input
                    id="newsletter-bedrijfsnaam"
                    type="text"
                    placeholder={t("bedrijfsnaamPlaceholder")}
                    value={bedrijfsnaam}
                    onChange={(e) => setBedrijfsnaam(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-stone-900 focus:ring-[#2aa348]"
                    autoComplete="organization"
                  />
                </div>
              )}
            </>
          )}

          {status === "error" && errorMessage && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
                {t("subscribing")}
              </>
            ) : (
              t("subscribeButton")
            )}
          </button>
        </form>

        {isExpanded && (
          <p className="mt-4 text-xs text-stone-500 dark:text-stone-400 text-center">
            <Link href="/privacy-policy" className="underline hover:opacity-80" style={{ color: ACCENT_GREEN }}>
              {t("privacy")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
