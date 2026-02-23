"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const ACCENT_GREEN = "#2aa348";

const AMOUNTS = [10, 25, 50, 75, 100, 150, 200, 250, 500, 1000, 2500, 5000, 10000];
const AMOUNTS_THB = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

export default function DonationImpactSpinner() {
  const t = useTranslations("streetDogsThailand");
  const locale = useLocale();
  const isThai = locale === "th";
  const amounts = isThai ? AMOUNTS_THB : AMOUNTS;
  const [amount, setAmount] = useState(isThai ? 1000 : 100);

  const IMPACT_KEYS: Record<number, string> = {
    10: "donation10", 25: "donation25", 50: "donation50", 75: "donation75",
    100: "donation100", 150: "donation150", 200: "donation200", 250: "donation250",
    500: "donation500", 1000: "donation1000", 2500: "donation2500", 5000: "donation5000", 10000: "donation10000",
  };
  const impactText = t(IMPACT_KEYS[amount] || "donationImpactGeneric");

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-xl">
      <h2 className="text-2xl font-bold mb-2 text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
        {t("donationImpactTitle")}
      </h2>
      <p className="text-stone-600 dark:text-stone-400 mb-6">{t("donationImpactIntro")}</p>

      {/* Spinner / amount selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <label htmlFor="impact-amount" className="text-sm font-medium text-stone-700 dark:text-stone-300 shrink-0">
          {t("impactAmountLabel")}
        </label>
        <select
          id="impact-amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full sm:w-48 px-4 py-3 rounded-xl border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          {amounts.map((a) => (
            <option key={a} value={a}>
              {isThai ? `฿${a.toLocaleString("th-TH")}` : `€${a.toLocaleString(locale)} / $${a.toLocaleString(locale)}`}
            </option>
          ))}
        </select>
      </div>

      {/* Impact result */}
      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6">
        <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          {isThai ? `฿${amount.toLocaleString("th-TH")}` : `€${amount.toLocaleString(locale)} / $${amount.toLocaleString(locale)}`} — {impactText}
        </p>
      </div>

      <Link
        href="/donate"
        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-opacity hover:opacity-95"
        style={{ backgroundColor: ACCENT_GREEN }}
      >
        {t("btnDonate")}
      </Link>
    </div>
  );
}
