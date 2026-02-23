"use client";

import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

const ORGS = [
  { key: "soiDog", url: "https://www.soidog.org" },
  { key: "fourPaws", url: "https://www.fourpaws.org/thailand" },
  { key: "hsi", url: "https://www.hsi.org" },
  { key: "icam", url: "https://www.icam-coalition.org" },
  { key: "afa", url: "https://www.asiaforanimals.com" },
] as const;

export default function AnimalWelfareOrgsSection() {
  const t = useTranslations("gidsen.animalWelfareOrgs");

  return (
    <section className="rounded-2xl border border-stone-200/80 dark:border-stone-700 overflow-hidden bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50">
      <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-700" style={{ borderLeft: "4px solid #a78bfa" }}>
        <h2 className="font-medium text-stone-900 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
          {t("title")}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {t("subtitle")}
        </p>
      </div>
      <div className="divide-y divide-stone-200 dark:divide-stone-700">
        {ORGS.map((org) => (
          <div key={org.key} className="px-5 py-4">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200">
              {t(`${org.key}.name`)}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              {t(`${org.key}.desc`)}
            </p>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium hover:underline"
              style={{ color: ACCENT_GREEN }}
            >
              {t("website")} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
