"use client";

import { Link } from "@/i18n/navigation";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import TurnstileWidget from "@/app/components/TurnstileWidget";
import { COUNTRIES } from "@/lib/countries";

const ACCENT_GREEN = "#2aa348";
const ACCENT_TEAL = "#0d9488";

export type AdoptInquiryFormProps = {
  animalName?: string;
  animalId?: string;
  idPrefix?: string;
  embedded?: boolean;
};

export default function AdoptInquiryForm({
  animalName = "",
  animalId = "",
  idPrefix = "adopt",
  embedded = false,
}: AdoptInquiryFormProps) {
  const t = useTranslations("adoptInquiry");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const securityRef = useRef<HTMLDivElement>(null);

  const nameId = `${idPrefix}-name`;
  const emailId = `${idPrefix}-email`;
  const cityId = `${idPrefix}-city`;
  const countryId = `${idPrefix}-country`;
  const experienceId = `${idPrefix}-experience`;
  const aboutId = `${idPrefix}-about`;
  const animal2NameId = `${idPrefix}-animal2Name`;
  const animal2IdId = `${idPrefix}-animal2Id`;
  const animal3NameId = `${idPrefix}-animal3Name`;
  const animal3IdId = `${idPrefix}-animal3Id`;

  return (
    <div
      className={`relative rounded-3xl shadow-xl border-2 transition-all duration-300 ${
        embedded ? "p-5 md:p-6" : "p-8 md:p-10 hover:shadow-2xl hover:scale-[1.01] group"
      }`}
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: ACCENT_GREEN,
        boxShadow: `0 25px 50px -12px ${ACCENT_GREEN}20, 0 0 0 1px ${ACCENT_GREEN}15`,
      }}
    >
      {!embedded && (
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
          style={{ background: `linear-gradient(135deg, ${ACCENT_GREEN}30, ${ACCENT_TEAL}20)` }}
        />
      )}

      <h2
        className={`font-bold flex items-center justify-center gap-2 ${embedded ? "text-xl mb-1" : "text-2xl text-center mb-2"}`}
        style={{ color: ACCENT_GREEN }}
      >
        <span className="text-rose-400">♥</span>
        {t("formTitle")}
        <span className="text-rose-400">♥</span>
      </h2>
      <p className={`text-center text-stone-500 dark:text-stone-400 ${embedded ? "text-sm mb-6" : "text-sm mb-8"}`}>
        {t("formSubtitle")}
      </p>

      {sent ? (
        <div className="text-center py-8">
          <div className="flex justify-center gap-1 mb-4">
            <span className="text-4xl text-rose-400 animate-[pulse-heart_1s_ease-in-out_infinite]">♥</span>
            <span className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${ACCENT_GREEN}20`, color: ACCENT_GREEN }}>
              ✓
            </span>
            <span className="text-4xl text-rose-400 animate-[pulse-heart_1s_ease-in-out_infinite]" style={{ animationDelay: "0.3s" }}>♥</span>
          </div>
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t("thankYouTitle")}</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-2">
            {t("thankYouText")}
          </p>
          <p className="text-rose-400/80 text-sm font-medium mb-6">{t("thankYouTagline")}</p>
          <Link
            href="/adopt"
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("browseMore")}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSending(true);
            const form = e.currentTarget;
            const name = (form.querySelector(`#${nameId}`) as HTMLInputElement)?.value;
            const email = (form.querySelector(`#${emailId}`) as HTMLInputElement)?.value;
            const city = (form.querySelector(`#${cityId}`) as HTMLInputElement)?.value;
            const country = (form.querySelector(`#${countryId}`) as HTMLSelectElement)?.value;
            const experience = (form.querySelector(`#${experienceId}`) as HTMLTextAreaElement)?.value;
            const about = (form.querySelector(`#${aboutId}`) as HTMLTextAreaElement)?.value;
            const animal2Name = (form.querySelector(`#${animal2NameId}`) as HTMLInputElement)?.value?.trim?.();
            const animal2Id = (form.querySelector(`#${animal2IdId}`) as HTMLInputElement)?.value?.trim?.();
            const animal3Name = (form.querySelector(`#${animal3NameId}`) as HTMLInputElement)?.value?.trim?.();
            const animal3Id = (form.querySelector(`#${animal3IdId}`) as HTMLInputElement)?.value?.trim?.();
            try {
              const res = await fetch("/api/adopt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  email,
                  city,
                  country,
                  dogPreference: animalName || undefined,
                  motivation: about,
                  experience,
                  about,
                  animalName: animalName || undefined,
                  animalId: animalId || undefined,
                  ...(animal2Name || animal2Id ? { animalName2: animal2Name, animalId2: animal2Id } : {}),
                  ...(animal3Name || animal3Id ? { animalName3: animal3Name, animalId3: animal3Id } : {}),
                  turnstileToken: turnstileToken ?? undefined,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                setError((data as { error?: string }).error || "Something went wrong. Please try again.");
                return;
              }
              setSent(true);
            } catch {
              setError("Something went wrong. Please try again.");
            } finally {
              setSending(false);
            }
          }}
          className="space-y-6"
        >
          {animalName && (
            <p className="text-sm font-medium" style={{ color: ACCENT_GREEN }}>
              Interested in: {animalName}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={nameId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id={nameId}
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor={emailId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={cityId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id={cityId}
                name="city"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
                placeholder="Your city"
              />
            </div>
            <div>
              <label htmlFor={countryId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id={countryId}
                name="country"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={experienceId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
              What is your experience with dogs? <span className="text-red-500">*</span>
            </label>
            <textarea
              id={experienceId}
              name="experience"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30 resize-y"
              placeholder="Tell us about your experience with dogs..."
            />
          </div>

          <div>
            <label htmlFor={aboutId} className="block text-base font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Tell us about yourself and why you want to adopt <span className="text-red-500">*</span>
            </label>
            <textarea
              id={aboutId}
              name="about"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:border-[#2aa348] hover:border-stone-300 dark:hover:border-stone-500 focus:ring-[#2aa348]/30 resize-y"
              placeholder="Share your story and what you're looking for..."
            />
          </div>

          <div className="rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-600 p-4 space-y-4" style={{ borderColor: `${ACCENT_GREEN}40` }}>
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
              {t("alsoInterestedIn")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={animal2NameId} className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{t("secondAnimal")}</label>
                <input
                  id={animal2NameId}
                  name="animal2Name"
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
                  placeholder={t("animalNamePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor={animal2IdId} className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">ID</label>
                <input
                  id={animal2IdId}
                  name="animal2Id"
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
                  placeholder={t("animalIdPlaceholder")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={animal3NameId} className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{t("thirdAnimal")}</label>
                <input
                  id={animal3NameId}
                  name="animal3Name"
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
                  placeholder={t("animalNamePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor={animal3IdId} className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">ID</label>
                <input
                  id={animal3IdId}
                  name="animal3Id"
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
                  placeholder={t("animalIdPlaceholder")}
                />
              </div>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div ref={securityRef} className="space-y-2 scroll-mt-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">Security check</p>
              <TurnstileWidget
                size="flexible"
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>
          )}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm font-medium" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-h-[52px]"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_GREEN}, #1e7a38)`,
              boxShadow: `0 4px 14px 0 ${ACCENT_GREEN}50`,
            }}
          >
            {sending ? "Sending…" : "Submit Adoption Inquiry"}
            <span className="text-white/90">♥</span>
          </button>
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t("securityOptional")}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
