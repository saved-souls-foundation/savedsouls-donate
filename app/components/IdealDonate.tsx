"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

export default function IdealDonate() {
  const t = useTranslations("home");

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-center text-stone-500 dark:text-stone-400 text-sm mb-4" style={{ color: "#2aa348" }}>
        {t("donateTagline")}
      </p>

      {/* PayPal · PromptPay · Donorbox — even groot en prominent */}
      <div className="flex items-center justify-center gap-4 flex-wrap mb-3">
        <a href="https://paypal.me/savedsoulsfoundation" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 flex items-center justify-center">
          <Image src="/logos/paypal-official.png" alt="PayPal" width={100} height={62} className="h-12 w-auto object-contain" />
        </a>
        <TrackedDonateLink href="/donate/thai#promptpay" className="hover:opacity-90 flex items-center justify-center">
          <Image src="/logos/promptpay-official.png" alt="PromptPay" width={107} height={60} className="h-12 w-auto object-contain" />
        </TrackedDonateLink>
        <a href="https://donorbox.org/saved-souls-foundation-donation" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 flex items-center justify-center py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
          <Image src="/logos/donorbox-logo.png" alt="Donorbox" width={120} height={36} className="h-12 w-auto object-contain" />
        </a>
      </div>
      <p className="text-center text-sm font-bold text-stone-600 dark:text-stone-400 mb-4">
        · {t("thaiPayments")} · {t("bankTransfer")}
      </p>

      <details className="group mb-4">
        <summary className="text-xs text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 text-center list-none">
          · {t("thaiPayments")} · {t("bankTransfer")} …
        </summary>
        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2 text-center">
          <a href="https://paypal.me/savedsoulsfoundation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1">
            <Image src="/logos/paypal-official.png" alt="PayPal" width={74} height={46} className="h-10 w-auto object-contain" />
            <span className="text-xs" style={{ color: "#2aa348" }}>→</span>
          </a>
          <TrackedDonateLink href="/donate/thai#promptpay" className="inline-flex items-center justify-center gap-1">
            <Image src="/logos/promptpay-official.png" alt="PromptPay" width={71} height={40} className="h-10 w-auto object-contain" />
            <span className="text-xs" style={{ color: "#2aa348" }}>{t("thaiPaymentsMethods")} →</span>
          </TrackedDonateLink>
          <a href="https://donorbox.org/saved-souls-foundation-donation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1">
            <Image src="/logos/donorbox-logo.png" alt="Donorbox" width={80} height={24} className="h-6 w-auto object-contain" />
            <span className="text-xs" style={{ color: "#2aa348" }}>→</span>
          </a>
          <a href="#bank-transfer" className="block text-xs" style={{ color: "#2aa348" }}>{t("bankTransfer")} →</a>
        </div>
      </details>

      {/* Maandelijkse zielenredder button */}
      <div className="mt-4">
        <a
          href="https://donorbox.org/saved-souls-foundation-donation"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white text-base transition-all hover:scale-[1.02] hover:opacity-90"
          style={{ backgroundColor: "#2aa348" }}
        >
          ♥ Word maandelijkse zielenredder →
        </a>
      </div>
    </div>
  );
}
