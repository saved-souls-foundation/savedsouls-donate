"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import TurnstileWidget from "@/app/components/TurnstileWidget";

const PINK = "#ec4899";
const GREEN = "#2aa348";

export default function DonatieboxAanvragenPage() {
  const t = useTranslations("donatieboxAanvragen");
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      setError(t("agreeScreening"));
      return;
    }
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t("errorGeneric"));
      return;
    }
    setError("");
    setSending(true);
    const form = e.currentTarget;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value.trim();

    const body = [
      "Aanvraag: Saved Souls donatiebox (screening)",
      "",
      `Organisatie: ${get("organisation")}`,
      `Type locatie: ${get("organisationType")}`,
      `Adres: ${get("address")}`,
      `Telefoon: ${get("phone")}`,
      `Website/social: ${get("website") || "—"}`,
      `Plaatsing box: ${get("placement")}`,
      `Bezoekers per dag: ${get("visitors")}`,
      `Camerabewaking: ${get("security")}`,
      `Verantwoordelijke: ${get("responsible")}`,
      `Duur hosting: ${get("duration")}`,
      get("references") ? `Referenties: ${get("references")}` : "",
      "",
      `Motivatie:\n${get("motivation")}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          subject: "Donatiebox aanvraag — screening Saved Souls Foundation",
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
      setAgreed(false);
      setTurnstileToken("");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200";
  const labelClass = "block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1";

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

        <section className="mb-10 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200/60 dark:border-amber-900/40 p-6 md:p-8 shadow-lg">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t("screeningTitle")}</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{t("screeningText")}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t("name")} <span className="text-red-500">*</span>
                  </label>
                  <input id="name" name="name" type="text" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t("email")} <span className="text-red-500">*</span>
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t("phone")} <span className="text-red-500">*</span>
                  </label>
                  <input id="phone" name="phone" type="tel" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="organisation" className={labelClass}>
                    {t("organisation")} <span className="text-red-500">*</span>
                  </label>
                  <input id="organisation" name="organisation" type="text" required className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="organisationType" className={labelClass}>
                  {t("organisationType")} <span className="text-red-500">*</span>
                </label>
                <select id="organisationType" name="organisationType" required className={inputClass} defaultValue="">
                  <option value="" disabled>
                    {t("organisationTypePlaceholder")}
                  </option>
                  <option value={t("typeVet")}>{t("typeVet")}</option>
                  <option value={t("typeShop")}>{t("typeShop")}</option>
                  <option value={t("typeHotel")}>{t("typeHotel")}</option>
                  <option value={t("typeRestaurant")}>{t("typeRestaurant")}</option>
                  <option value={t("typeOther")}>{t("typeOther")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="address" className={labelClass}>
                  {t("address")} <span className="text-red-500">*</span>
                </label>
                <textarea id="address" name="address" required rows={2} className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>
                  {t("website")}
                </label>
                <input id="website" name="website" type="url" className={inputClass} placeholder="https://" />
              </div>
              <div>
                <label htmlFor="placement" className={labelClass}>
                  {t("placement")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="placement"
                  name="placement"
                  required
                  rows={2}
                  placeholder={t("placementPlaceholder")}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="visitors" className={labelClass}>
                    {t("visitors")} <span className="text-red-500">*</span>
                  </label>
                  <input id="visitors" name="visitors" type="text" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="security" className={labelClass}>
                    {t("security")} <span className="text-red-500">*</span>
                  </label>
                  <select id="security" name="security" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      —
                    </option>
                    <option value={t("securityYes")}>{t("securityYes")}</option>
                    <option value={t("securityNo")}>{t("securityNo")}</option>
                    <option value={t("securityPartial")}>{t("securityPartial")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="responsible" className={labelClass}>
                    {t("responsible")} <span className="text-red-500">*</span>
                  </label>
                  <input id="responsible" name="responsible" type="text" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="duration" className={labelClass}>
                    {t("duration")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    required
                    placeholder={t("durationPlaceholder")}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="references" className={labelClass}>
                  {t("references")}
                </label>
                <textarea
                  id="references"
                  name="references"
                  rows={2}
                  placeholder={t("referencesPlaceholder")}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <div>
                <label htmlFor="motivation" className={labelClass}>
                  {t("motivation")} <span className="text-red-500">*</span>
                </label>
                <textarea id="motivation" name="motivation" required rows={4} className={`${inputClass} resize-y`} />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-stone-300"
                  required
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">{t("agreeScreening")}</span>
              </label>
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
          <Link href="/partners/flyer-aanvragen" className="text-sm font-medium underline hover:no-underline" style={{ color: GREEN }}>
            {t("requestFlyerLink")}
          </Link>
        </p>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
