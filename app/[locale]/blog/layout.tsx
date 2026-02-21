import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("metaTitle")} | Saved Souls Foundation`,
    description: t("metaDescription"),
    alternates: alternatesForPath("/blog", locale),
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
