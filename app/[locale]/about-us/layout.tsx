import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

const BASE_URL = "https://www.savedsouls-foundation.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs" });
  const title = `${t("heroTitle")} | Saved Souls Foundation`;
  const description = t("metaDescription");
  const url = `${BASE_URL}/${locale}/about-us`;

  return {
    title,
    description,
    keywords: [
      "animal shelter Thailand",
      "dog rescue Khon Kaen",
      "Saved Souls Foundation",
      "swimming therapy dogs",
      "wheelchair dogs",
      "animal sterilization Thailand",
      "dog adoption Thailand",
    ],
    alternates: alternatesForPath("/about-us", locale),
    openGraph: {
      title,
      description,
      url,
      siteName: "Saved Souls Foundation",
      type: "website",
      locale: locale === "en" ? "en_US" : locale === "nl" ? "nl_NL" : locale === "de" ? "de_DE" : locale === "es" ? "es_ES" : locale === "th" ? "th_TH" : "ru_RU",
      images: [{ url: `${BASE_URL}/team-dogs.webp`, width: 1200, height: 630, alt: "Saved Souls Foundation" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AboutUsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
