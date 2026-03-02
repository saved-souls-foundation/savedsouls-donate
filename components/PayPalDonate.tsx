"use client";

import { useTranslations } from "next-intl";

const PAYPAL_ME = "https://paypal.me/savedsoulsfoundation";

export default function PayPalDonate() {
  const t = useTranslations("donate");

  return (
    <div className="mb-6 p-6 rounded-2xl bg-white/90 dark:bg-white/5 border border-stone-200 dark:border-stone-700">
      <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-4">{t("payWithPaypal")}</h2>
      <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">{t("monthlyDescription")}</p>
      <a
        href={PAYPAL_ME}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-[#0070ba] text-white hover:bg-[#005ea6] transition-colors"
      >
        {t("payWithPaypal")}
      </a>
    </div>
  );
}
