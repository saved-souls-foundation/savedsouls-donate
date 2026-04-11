"use client";

import { useTranslations } from "next-intl";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

export default function DonationCtaBlock() {
  const t = useTranslations("donationCta");

  return (
    <section className="rounded-2xl p-8 md:p-10 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-3">
        {t("headline")}
      </h2>
      <p className="text-stone-600 dark:text-stone-400 text-lg mb-6 max-w-xl mx-auto">
        {t("subtext")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <span className="text-2xl" aria-hidden>🐶</span>
        <span className="text-2xl" aria-hidden>🐱</span>
        <TrackedDonateLink
          href="/donate"
          className="donate-cta-button"
        >
          {t("buttonText")}
        </TrackedDonateLink>
        <span className="text-2xl" aria-hidden>🐾</span>
      </div>
    </section>
  );
}
