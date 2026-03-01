"use client";

import { Link } from "@/i18n/navigation";
import { useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import SiteHeader from "../../components/SiteHeader";
import TurnstileWidget from "../../components/TurnstileWidget";
import { COUNTRIES } from "@/lib/countries";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";
const ACCENT_AMBER = "#f59e0b";

function VolunteerSignupForm() {
  const t = useTranslations("volunteerSignup");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Gradient achtergrond met animatie */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${ACCENT_GREEN}25, transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, ${ACCENT_TEAL}15, transparent),
            radial-gradient(ellipse 60% 40% at 0% 80%, ${ACCENT_AMBER}12, transparent),
            linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)
          `,
        }}
      />

      {/* Subtiele floating shapes */}
      <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#2aa348]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#0d9488]/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Zwevende pootafdrukken */}
      <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-[#2aa348]/20 dark:text-emerald-400/15"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${(i * 7) % 100}%`,
              fontSize: `${14 + (i % 5) * 8}px`,
              animation: `float-heart ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Hero kop */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}
          >
            <span>🐾</span>
            {t("badge")}
            <span>🐾</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 dark:text-stone-100 mb-4 tracking-tight">
            {t("title")}{" "}
            <span
              className="relative inline-block"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_GREEN}, ${ACCENT_TEAL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-md mx-auto mb-2">
            {t("subtitle")}
          </p>
          <p className="text-sm font-medium" style={{ color: ACCENT_GREEN }}>
            {t("tagline")}
          </p>
        </div>

        {/* Formulier container */}
        <div
          className="relative rounded-3xl p-8 md:p-10 shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] group"
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderColor: ACCENT_GREEN,
            boxShadow: `0 25px 50px -12px ${ACCENT_GREEN}20, 0 0 0 1px ${ACCENT_GREEN}15`,
          }}
        >
          <div
            className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
            style={{ background: `linear-gradient(135deg, ${ACCENT_GREEN}30, ${ACCENT_TEAL}20)` }}
          />

          <h2
            className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2"
            style={{ color: ACCENT_GREEN }}
          >
            <span>🐾</span>
            {t("formTitle")}
            <span>🐾</span>
          </h2>
          <p className="text-center text-sm text-stone-500 dark:text-stone-400 mb-8">
            {t("formSubtitle")}
          </p>

          {sent ? (
            <div className="text-center py-12">
              <div className="flex justify-center gap-1 mb-4">
                <span className="text-4xl">🐾</span>
                <span className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}>
                  ✓
                </span>
                <span className="text-4xl">🐾</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t("thankYou")}</h3>
              <p className="text-stone-600 dark:text-stone-400 mb-2">
                {t("thankYouText")}
              </p>
              <p className="text-sm font-medium mb-6" style={{ color: ACCENT_GREEN }}>
                {t("thankYouTagline")}
              </p>
              <Link
                href="/volunteer"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("backToVolunteer")}
              </Link>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
                  setError(t("errorGeneric"));
                  return;
                }
                setError("");
                setSending(true);
                const form = e.currentTarget;
                const name = (form.querySelector("#name") as HTMLInputElement)?.value;
                const email = (form.querySelector("#email") as HTMLInputElement)?.value;
                const city = (form.querySelector("#city") as HTMLInputElement)?.value;
                const country = (form.querySelector("#country") as HTMLSelectElement)?.value;
                const dates = (form.querySelector("#dates") as HTMLInputElement)?.value;
                const experience = (form.querySelector("#experience") as HTMLTextAreaElement)?.value;
                const motivation = (form.querySelector("#motivation") as HTMLTextAreaElement)?.value;
                try {
                  const res = await fetch("/api/volunteer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      email,
                      city,
                      country,
                      availability: dates || undefined,
                      dates: dates || undefined,
                      experience,
                      motivation,
                      turnstileToken: turnstileToken ?? undefined,
                    }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    setError((data as { error?: string }).error || t("errorGeneric"));
                    return;
                  }
                  setSent(true);
                } catch {
                  setError(t("errorGeneric"));
                } finally {
                  setSending(false);
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    {t("name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                    placeholder={t("name")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    {t("email")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="city" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    {t("city")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                    placeholder={t("city")}
                  />
                </div>
                <div className="group">
                  <label htmlFor="country" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    {t("country")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                  >
                    <option value="">{t("countryPlaceholder")}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dates" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {t("dates")}
                </label>
                <input
                  id="dates"
                  name="dates"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                  placeholder={t("datesPlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {t("experience")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30 resize-y"
                  placeholder={t("experiencePlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="motivation" className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {t("motivation")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30 resize-y"
                  placeholder={t("motivationPlaceholder")}
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
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={sending || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_GREEN}, #1e7a38)`,
                  boxShadow: `0 4px 14px 0 ${ACCENT_GREEN}50`,
                }}
              >
                {sending ? t("sending") : t("submit")}
                <span className="text-white/90">🐾</span>
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-stone-400 dark:text-stone-500">
          Made with 🐾 for every rescued soul
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default function VolunteerSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Loading...</p>
      </div>
    }>
      <VolunteerSignupForm />
    </Suspense>
  );
}
