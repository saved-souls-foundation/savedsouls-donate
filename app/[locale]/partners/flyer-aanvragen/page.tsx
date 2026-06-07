"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import TurnstileWidget from "@/app/components/TurnstileWidget";

const PINK = "#ec4899";
const GREEN = "#2aa348";

export default function FlyerAanvragenPage() {
  const t = useTranslations("donatieboxFlyer");
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t("errorGeneric"));
      return;
    }
    setError("");
    setSending(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const organisation = (form.elements.namedItem("organisation") as HTMLInputElement).value.trim();
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement).value.trim();
    const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();

    const body = [
      "Aanvraag: gratis Saved Souls flyer",
      "",
      `Organisatie: ${organisation}`,
      `Postadres: ${address}`,
      `Aantal flyers: ${quantity}`,
      message ? `Toelichting: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: "Flyer aanvraag — Saved Souls Foundation",
          message: body,
          locale: locale.slice(0, 2).toLowerCase(),
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || t("errorGeneric"));
        return;
      }
      setSent(true);
      form.reset();
      setTurnstileToken("");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" speed={0.2}>
      <main className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg font-semibold mb-2" style={{ color: PINK }}>
            {t("subtitle")}
          </p>
          <p className="text-stone-600 dark:text-stone-400">{t("intro")}</p>
        </header>

        <section className="mb-10 rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200 dark:border-stone-700 p-6 shadow-lg text-center">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t("previewTitle")}</h2>
          <a
            href="/downloads/savedsouls-foundation-flyer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-md hover:shadow-xl transition-shadow mb-4"
          >
            <img
              src="/partners/layan-vet/reception.png"
              alt={t("previewAlt")}
              className="w-full max-w-sm mx-auto h-48 object-cover"
            />
          </a>
          <a
            href="/downloads/savedsouls-foundation-flyer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold underline hover:no-underline"
            style={{ color: GREEN }}
          >
            {t("downloadPdf")} (PDF)
          </a>
        </section>

        <div className="rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-10 shadow-xl">
          <h2 className="text-xl font-bold text-center mb-1" style={{ color: PINK }}>
            {t("formTitle")}
          </h2>
          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mb-8">{t("formSubtitle")}</p>

          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t("thankYou")}</h3>
              <p className="text-stone-600 dark:text-stone-400 mb-6">{t("thankYouText")}</p>
              <Link href="/partners" className="underline hover:no-underline" style={{ color: PINK }}>
                {t("backToPartners")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label htmlFor="organisation" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("organisation")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("address")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 resize-y"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("quantity")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  required
                  placeholder={t("quantityPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder={t("messagePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 resize-y"
                />
              </div>
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
              )}
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={sending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: PINK }}
              >
                {sending ? t("sending") : t("submit")}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-8">
          <Link href="/partners/donatiebox-aanvragen" className="text-sm font-medium underline hover:no-underline" style={{ color: GREEN }}>
            {t("requestBoxLink")}
          </Link>
        </p>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
