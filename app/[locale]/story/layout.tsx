import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("story");
  return {
    title: `${t("heroTitle")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
