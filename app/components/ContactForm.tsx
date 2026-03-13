"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import TurnstileWidget from "./TurnstileWidget";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

type ContactFormProps = {
  idPrefix?: string;
  showTitle?: boolean;
  className?: string;
  /** Locale van de pagina (bv. uit URL); heeft voorrang op useLocale() voor de auto-reply taal. */
  locale?: string;
};

export default function ContactForm({ idPrefix = "contact", showTitle = true, className = "", locale: localeProp }: ContactFormProps) {
  const localeFromContext = useLocale();
  const locale = (localeProp && localeProp.trim()) || localeFromContext || "en";
  const t = useTranslations("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t("contactError"));
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          locale: locale.slice(0, 2).toLowerCase(),
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || t("contactError"));
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTurnstileToken(null);
    } catch {
      setError(t("contactError"));
    } finally {
      setSending(false);
    }
  };

  const nameId = `${idPrefix}-name`;
  const emailId = `${idPrefix}-email`;
  const subjectId = `${idPrefix}-subject`;
  const messageId = `${idPrefix}-message`;

  return (
    <section className={className}>
      <div className="max-w-xl mx-auto w-full px-4">
        {showTitle && (
          <h2 className="text-xl font-bold mb-6 text-center dark:text-[#2aa348]" style={{ color: ACCENT_GREEN }}>
            {t("contactTitle")}
          </h2>
        )}
        {sent ? (
          <div className="text-center py-8 px-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("contactThanksTitle")}
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-base">
              {t("contactThanksMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor={nameId} className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t("contactName")}
              </label>
              <input
                id={nameId}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={t("contactNamePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor={emailId} className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t("contactEmail")}
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={t("contactEmailPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor={subjectId} className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t("contactSubject")}
              </label>
              <input
                id={subjectId}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                placeholder={t("contactSubjectPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor={messageId} className="block text-base font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t("contactMessage")}
              </label>
              <textarea
                id={messageId}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348] resize-y"
                placeholder={t("contactMessagePlaceholder")}
              />
            </div>
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="space-y-2">
                <p className="text-sm text-stone-500 dark:text-stone-400">Security check</p>
                <TurnstileWidget
                  size="flexible"
                  onVerify={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>
            )}
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
              className="w-full py-3 min-h-[48px] rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {sending ? t("contactSending") : t("contactSend")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
