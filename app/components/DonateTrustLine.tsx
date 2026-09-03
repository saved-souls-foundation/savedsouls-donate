"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Trust strip under the primary donate CTA. Always renders three parts + registration link. */
export default function DonateTrustLine() {
  const t = useTranslations("donate.trust");

  return (
    <p className="mt-3 text-center text-xs text-stone-500 leading-relaxed">
      <span>{t("secure")}</span>
      {" · "}
      <span>{t("hundred")}</span>
      {" · "}
      <Link
        href="/about/registration"
        className="underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
      >
        {t("registration")}
      </Link>
    </p>
  );
}
