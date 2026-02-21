import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

const BASE_URL = "https://savedsouls-foundation.org";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "story" });
  const title = `${t("heroTitle")} | Saved Souls Foundation`;
  const description = t("metaDescription");
  const url = `${BASE_URL}/${locale}/story`;

  return {
    title,
    description,
    keywords: [
      "dog rescue Thailand",
      "animal shelter Khon Kaen",
      "Saved Souls Foundation",
      "disabled dogs Thailand",
      "wheelchair dogs",
      "dog meat trade rescue",
      "animal sanctuary Thailand",
      "Gabriela Leonhard",
    ],
    alternates: alternatesForPath("/story", locale),
    openGraph: {
      title,
      description,
      url,
      siteName: "Saved Souls Foundation",
      type: "article",
      locale: locale === "en" ? "en_US" : locale === "nl" ? "nl_NL" : locale === "de" ? "de_DE" : locale === "th" ? "th_TH" : "ru_RU",
      images: [{ url: `${BASE_URL}/savedsoul-logo.webp`, width: 1200, height: 630, alt: "Saved Souls Foundation" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StoryLayout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "story" });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("heroTitle"),
    description: t("metaDescription"),
    author: {
      "@type": "Organization",
      name: "Saved Souls Foundation",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Saved Souls Foundation",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/savedsoul-logo.webp` },
    },
    datePublished: "2017-10-09",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/${locale}/story` },
    image: `${BASE_URL}/team-dogs.webp`,
    keywords: "dog rescue Thailand, animal shelter Khon Kaen, disabled dogs, wheelchair dogs, dog meat trade, animal sanctuary",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
