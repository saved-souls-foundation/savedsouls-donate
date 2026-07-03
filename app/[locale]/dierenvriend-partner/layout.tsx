import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

const BASE_URL = "https://www.savedsouls-foundation.org";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dierenvriendPartner" });
  const url = `${BASE_URL}/${locale}/dierenvriend-partner`;

  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
    alternates: alternatesForPath("/dierenvriend-partner", locale),
    openGraph: {
      type: "website",
      siteName: "Saved Souls Foundation",
      title: t("ogTitle"),
      description: t("metaDescription"),
      url,
      images: [{ url: `${BASE_URL}/images/poster-ssf-a4.png`, alt: t("posterAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function DierenvriendPartnerLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
