"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PRESET_AMOUNTS = [5, 10, 25, 50];
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 50000;
const MAX_MESSAGE_LENGTH = 280;

export default function KofiStyleDonate() {
  const t = useTranslations("support");
  const locale = useLocale();
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveAmount = customAmount ? parseFloat(customAmount) : amount;
  const isValid = effectiveAmount >= MIN_AMOUNT && effectiveAmount <= MAX_AMOUNT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValid) return;

    if (isMonthly) {
      window.open("https://paypal.me/savedsoulsfoundation", "_blank");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          locale,
          message: message.slice(0, MAX_MESSAGE_LENGTH) || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        setError(data.error || t("errorGeneric"));
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError(t("errorGeneric"));
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-700">
        <button
          type="button"
          onClick={() => setIsMonthly(false)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            !isMonthly
              ? "text-[#2aa348] border-[#2aa348]"
              : "text-stone-600 dark:text-stone-400 border-transparent hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          {t("tabOneTime")}
        </button>
        <button
          type="button"
          onClick={() => setIsMonthly(true)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            isMonthly
              ? "text-[#2aa348] border-b-2 border-[#2aa348]"
              : "text-stone-600 dark:text-stone-400 border-b-2 border-transparent hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          {t("tabMonthly")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Payment methods - Ko-fi style */}
        {!isMonthly && (
          <div className="pb-4 border-b border-stone-200 dark:border-stone-700">
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
              {t("payDirectlyWith")}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Image src="/wero-logo.svg" alt="Wero" width={160} height={50} className="h-12 w-auto object-contain dark:hidden" />
              <Image src="/wero-logo-dark.svg" alt="Wero" width={160} height={50} className="h-12 w-auto object-contain hidden dark:block" />
              <a
                href="https://www.paypal.com/paypalme/savedsoulsfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image src="/logos/paypal-veilig-betalen-nl.jpg" alt="Veilig betalen met PayPal" width={319} height={110} className="h-12 w-auto object-contain" />
              </a>
            </div>
          </div>
        )}
        {isMonthly ? (
          <div className="space-y-4">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              {t("monthlyDescription")}
            </p>
            <button
              type="button"
              onClick={() => window.open("https://paypal.me/savedsoulsfoundation", "_blank")}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#E67A4C" }}
            >
              {t("monthlyCta")}
            </button>
            <Link
              href="/donate/causes"
              className="block text-center text-sm text-stone-500 dark:text-stone-400 hover:text-[#2aa348] underline"
            >
              {t("viewCauses")}
            </Link>
          </div>
        ) : (
          <>
            {/* Amount selection */}
            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                {t("chooseAmount")}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a);
                      setCustomAmount("");
                    }}
                    className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                      !customAmount && amount === a
                        ? "bg-[#2aa348] text-white"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                    }`}
                  >
                    €{a}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 dark:text-stone-400">€</span>
                <input
                  type="number"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={0.01}
                  placeholder={t("customAmount")}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>
              {!isValid && (customAmount || effectiveAmount < MIN_AMOUNT) && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  {t("minAmount", { amount: MIN_AMOUNT })}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="support-message" className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1 block">
                {t("privateMessage")}
              </label>
              <textarea
                id="support-message"
                maxLength={MAX_MESSAGE_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 resize-none"
              />
              <p className="text-right text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#2aa348" }}
            >
              {loading ? t("loading") : t("tipButton", { amount: effectiveAmount })}
            </button>
          </>
        )}
      </form>

      <p className="px-6 pb-4 text-[10px] text-stone-400 dark:text-stone-500 text-center">
        {t("poweredBy")}
      </p>
    </div>
  );
}
