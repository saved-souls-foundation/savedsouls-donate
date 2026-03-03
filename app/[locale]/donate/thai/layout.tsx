import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate.thai" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("subtitle"),
  };
}

export default async function ThaiDonateLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
