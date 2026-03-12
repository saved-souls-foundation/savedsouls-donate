import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "emergency" });
  return {
    title: `${t("metaTitle")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default async function EmergencyLayout({ params, children }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
