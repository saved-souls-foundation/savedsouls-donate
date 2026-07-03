"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import TurnstileWidget from "@/app/components/TurnstileWidget";

const ACCENT_GREEN = "#2aa348";

type Partner = {
  name: string;
  logo?: string;
  url?: string;
};

const PREFERENCE_KEYS = ["digital", "a3", "a4", "moreInfo"] as const;

export default function DierenvriendPartnerPage() {
  const t = useTranslations("dierenvriendPartner");
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch("/data/dierenvriend-partners.json")
      .then((r) => r.json())
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch(() => setPartners([]));
  }, []);

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t("errorGeneric"));
      return;
    }
    setError("");
    setSending(true);
    const form = e.currentTarget;
    const practiceName = (form.elements.namedItem("practiceName") as HTMLInputElement).value.trim();
    const contactPerson = (form.elements.namedItem("contactPerson") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement).value.trim();
    const preference = (form.elements.namedItem("preference") as HTMLSelectElement).value;
    const comments = (form.elements.namedItem("comments") as HTMLTextAreaElement).value.trim();
    const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;

    try {
      const res = await fetch("/api/partner-aanmelding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practiceName,
          contactPerson,
          email,
          phone: phone || undefined,
          address: address || undefined,
          preference:
            (
              {
                digital: t("preferenceDigital"),
                a3: t("preferenceA3"),
                a4: t("preferenceA4"),
                moreInfo: t("preferenceMoreInfo"),
              } as Record<string, string>
            )[preference] ?? preference,
          comments: comments || undefined,
          consent,
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

  const benefits = [
    { icon: "🌐", text: t("benefit1") },
    { icon: "🏆", text: t("benefit2") },
    { icon: "📱", text: t("benefit3") },
    { icon: "📰", text: t("benefit4") },
    { icon: "💌", text: t("benefit5") },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-6" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </p>
        </header>

        <section className="space-y-8">
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{t("intro1")}</p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro2")}</p>
          </div>

          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
              {t("benefitsTitle")}
            </h2>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3 text-stone-600 dark:text-stone-400">
                  <span className="text-xl shrink-0" aria-hidden>
                    {b.icon}
                  </span>
                  <span className="leading-relaxed">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {t("badgeTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-6 max-w-lg mx-auto">{t("benefit2")}</p>
            <div className="rounded-xl overflow-hidden mb-6 max-w-[220px] mx-auto">
              <Image
                src="/downloads/ssf-dierenvriend-partner-badge.png"
                alt={t("badgeAlt")}
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/downloads/ssf-dierenvriend-partner-badge.png"
                download="ssf-dierenvriend-partner-badge.png"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("downloadBadgePng")}
              </a>
              <a
                href="/downloads/ssf-dierenvriend-partner-badge.svg"
                download="ssf-dierenvriend-partner-badge.svg"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("downloadBadgeSvg")}
              </a>
            </div>
          </div>

          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
              {t("posterTitle")}
            </h2>
            <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-md mb-6 max-w-md mx-auto bg-white">
              <Image
                src="/images/poster-ssf-a4.png"
                alt={t("posterAlt")}
                width={1753}
                height={2480}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/downloads/SSF_poster_NL_A4.pdf"
                download="SSF_poster_NL_A4.pdf"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("downloadButton")}
              </a>
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("requestButton")}
              </button>
            </div>
          </div>

          <div
            id="contact-form"
            className="rounded-2xl p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center" style={{ color: ACCENT_GREEN }}>
              {t("formTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8 text-center text-sm md:text-base">
              {t("formIntro")}
            </p>

            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 text-green-600">✓</div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t("thankYou")}</h3>
                <p className="text-stone-600 dark:text-stone-400">{t("thankYouText")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="practiceName" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("practiceName")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="practiceName"
                    name="practiceName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  />
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("contactPerson")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("phone")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("address")}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 resize-y focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  />
                </div>
                <div>
                  <label htmlFor="preference" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("preferenceLabel")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preference"
                    name="preference"
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  >
                    <option value="" disabled>
                      {t("preferencePlaceholder")}
                    </option>
                    {PREFERENCE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`preference${key.charAt(0).toUpperCase()}${key.slice(1)}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comments" className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("comments")}
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 resize-y focus:outline-none focus:ring-2 focus:ring-[#2aa348]/50"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-stone-300 text-[#2aa348] focus:ring-[#2aa348]"
                  />
                  <label htmlFor="consent" className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {t("consent")} <span className="text-red-500">*</span>
                  </label>
                </div>
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
                )}
                {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={sending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                  className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ACCENT_GREEN }}
                >
                  {sending ? t("sending") : t("submit")}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl p-6 md:p-8 bg-stone-50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center" style={{ color: ACCENT_GREEN }}>
              {t("partnersTitle")}
            </h2>
            {partners.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 min-h-[100px]"
                  >
                    {partner.logo ? (
                      <Image src={partner.logo} alt={partner.name} width={120} height={60} className="object-contain max-h-12 w-auto mb-2" />
                    ) : null}
                    {partner.url ? (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-center hover:underline"
                        style={{ color: ACCENT_GREEN }}
                      >
                        {partner.name}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 text-center">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 dark:text-stone-400 italic leading-relaxed">
                {t("partnersPlaceholder")}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
