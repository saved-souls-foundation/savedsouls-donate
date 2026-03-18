"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

const ACCENT_GREEN = "#2aa348";

/** Standaard bedrag THB – echte bedrag kies je bij de betaling (checkout) */
const DEFAULT_THB = 300;
const DEFAULT_THB_THAI = 1000;

const STORAGE_KEY = "sponsor_checkout";

type Props = {
  animalId: string;
  animalName: string;
  animalType: "dog" | "cat";
};

export default function SponsorForm({ animalId, animalName, animalType }: Props) {
  const t = useTranslations("sponsorForm");
  const locale = useLocale();
  const router = useRouter();
  const isThai = locale === "th";
  const defaultThb = isThai ? DEFAULT_THB_THAI : DEFAULT_THB;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError(t("requiredFields"));
      return;
    }
    setLoading(true);
    try {
      // Sla op in database (fire and forget)
      fetch("/api/sponsor-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId,
          animalName,
          animalType,
          donorName: name.trim(),
          donorEmail: email.trim().toLowerCase(),
          message: message.trim().slice(0, 500) || undefined,
          locale,
        }),
      }).catch(() => {});

      // Redirect naar Donorbox
      const comment = encodeURIComponent(
        `Sponsor ${animalName} (${animalType})`
      );
      const donorboxUrl =
        `https://donorbox.org/saved-souls-foundation-donation` +
        `?amount=10&recurring=true&currency=eur&comment=${comment}`;

      window.location.href = donorboxUrl;
    } catch {
      setError(t("paymentError"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="sponsor-name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
          {t("name")} *
        </label>
        <input
          id="sponsor-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
          placeholder={t("namePlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="sponsor-email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
          {t("email")} *
        </label>
        <input
          id="sponsor-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
          placeholder={t("emailPlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="sponsor-message" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
          {t("message")}
        </label>
        <textarea
          id="sponsor-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348] resize-y"
          placeholder={t("messagePlaceholder")}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ backgroundColor: ACCENT_GREEN }}
      >
        {loading ? t("loading") : t("submit", { name: animalName })}
      </button>
    </form>
  );
}
