import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "luchtbrug" });
  return {
    title: `${t("metaTitle")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default function LuchtbrugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
