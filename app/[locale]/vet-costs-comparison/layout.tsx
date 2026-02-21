import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vetCosts" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords").split(/\s*,\s*/),
    alternates: alternatesForPath("/vet-costs-comparison", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default function VetCostsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
