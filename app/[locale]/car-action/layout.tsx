import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carAction" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default function CarActionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
