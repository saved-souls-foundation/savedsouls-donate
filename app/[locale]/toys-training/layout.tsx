import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "toysTraining" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default function ToysTrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
