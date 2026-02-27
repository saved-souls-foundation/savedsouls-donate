"use client";

import { useTranslations } from "next-intl";

const REVIEWS = [
  { name: "Sarah M.", flag: "🇳🇱", initials: "SM", textKey: "review1Text" },
  { name: "James R.", flag: "🇬🇧", initials: "JR", textKey: "review2Text" },
  { name: "Maria L.", flag: "🇵🇭", initials: "ML", textKey: "review3Text" },
  { name: "Thomas V.", flag: "🇧🇪", initials: "TV", textKey: "review4Text" },
] as const;

/** Replace with real Google Maps / Place review URL when available */
const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Saved+Souls+Foundation+Khon+Kaen+reviews";

type TitleKey = "volunteers" | "support";

export default function GoogleReviewsSection({ titleKey }: { titleKey: TitleKey }) {
  const t = useTranslations("googleReviews");
  const title = titleKey === "volunteers" ? t("titleVolunteers") : t("titleSupport");

  return (
    <section className="rounded-2xl p-6 md:p-8 bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 shadow-sm">
      <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center" style={{ color: "#2aa348" }}>
        {title}
      </h2>
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-stone-900 px-5 py-2.5 shadow-sm border border-stone-200 dark:border-stone-600">
          <span className="text-2xl font-bold text-amber-600">4.9</span>
          <span className="text-amber-500" aria-hidden>⭐</span>
          <span className="text-stone-500 dark:text-stone-400 text-sm">{t("ratingOutOf")}</span>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400">{t("basedOnReviews")}</p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-stone-700 dark:text-stone-300 hover:underline"
          style={{ color: "#2aa348" }}
        >
          {t("readAllReviews")}
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REVIEWS.map((r) => (
          <article
            key={r.initials}
            className="rounded-xl bg-white dark:bg-stone-900 p-5 shadow-md border border-stone-200 dark:border-stone-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ backgroundColor: "#2aa348" }}
              >
                {r.initials}
              </div>
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">
                  {r.name} <span aria-hidden>{r.flag}</span>
                </p>
                <p className="text-amber-500 text-sm" aria-hidden>⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              <span className="text-stone-400 dark:text-stone-500 text-lg leading-none align-top">&ldquo;</span>
              {t(r.textKey)}
              <span className="text-stone-400 dark:text-stone-500 text-lg leading-none align-top">&rdquo;</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
