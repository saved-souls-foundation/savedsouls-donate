import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

export async function seoGuideMetadata(
  path: string,
  namespace: string,
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords").split(/\s*,\s*/),
    alternates: alternatesForPath(path, locale),
    robots: { index: true, follow: true },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [{ url: "/og-image.jpg" }],
    },
  };
}
