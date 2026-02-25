"use client";

import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

const ORGS = [
  { key: "soiDog", url: "https://www.soidog.org", logo: "/logos/soi-dog.png", initials: "SD" },
  { key: "fourPaws", url: "https://fourpaws.org/", logo: "/logos/four-paws.png", initials: "FP" },
  { key: "hsi", url: "https://humaneworld.org/en", logo: "/logos/hsi.png", initials: "HS" },
  { key: "icam", url: "https://www.icam-coalition.org", logo: "/logos/icam.png", initials: "IC" },
  { key: "afa", url: "https://www.asiaforanimals.com", logo: "/logos/asia-for-animals.png", initials: "Af" },
] as const;

export default function AnimalWelfareOrgsSection() {
  const t = useTranslations("gidsen.animalWelfareOrgs");

  return (
    <section>
      <h2 className="font-bold text-lg text-stone-900 dark:text-stone-100 mb-4">
        {t("title")}
      </h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
        {t("subtitle")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORGS.map((org) => (
          <div
            key={org.key}
            className="rounded-2xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shrink-0 overflow-hidden border border-stone-100 dark:border-stone-700">
                <span
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold text-stone-600 dark:text-stone-400"
                  aria-hidden
                >
                  {org.initials}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.logo}
                  alt=""
                  width={48}
                  height={48}
                  className="relative z-10 w-full h-full object-contain p-1.5 bg-white dark:bg-stone-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-800 dark:text-stone-200">
                  {t(`${org.key}.name`)}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {t(`${org.key}.desc`)}
                </p>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_GREEN }}
                >
                  {t("website")} →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
