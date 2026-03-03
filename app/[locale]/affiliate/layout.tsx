import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliate" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AffiliateLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
