"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

/** Maandelijkse bedragen in THB – minimum 300 */
const THB_AMOUNTS = [300, 500, 750, 1000, 1500, 2000, 3000, 5000];

/** Geschatte THB → EUR (voor Mollie, ~40 THB = 1 EUR) */
const THB_TO_EUR = 1 / 38;

const STORAGE_KEY = "sponsor_checkout";

type Props = {
  animalId: string;
  animalName: string;
  animalType: "dog" | "cat";
};

export default function SponsorForm({ animalId, animalName, animalType }: Props) {
  const t = useTranslations("sponsorForm");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amountThb, setAmountThb] = useState(300);
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
    const amountEur = Math.round(amountThb * THB_TO_EUR * 100) / 100;
    if (amountEur < 1) {
      setError(t("minAmount"));
      return;
    }
    setLoading(true);
    try {
      const checkoutData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        amountThb,
        message: message.trim().slice(0, 500) || undefined,
        animalId,
        animalName,
        animalType,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutData));
      router.push(`/sponsor/${animalType}/${animalId}/checkout`);
    } catch {
      setError(t("paymentError"));
    } finally {
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
        <label htmlFor="sponsor-amount" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
          {t("monthlyAmount")} *
        </label>
        <select
          id="sponsor-amount"
          required
          value={amountThb}
          onChange={(e) => setAmountThb(Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
        >
          {THB_AMOUNTS.map((a) => (
            <option key={a} value={a}>
              {a} THB (~${Math.round(a / 35)})
            </option>
          ))}
        </select>
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
