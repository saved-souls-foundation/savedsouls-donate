import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords").split(/\s*,\s*/),
    alternates: alternatesForPath("/faq", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function FaqLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: 30 }, (_, i) => ({
      "@type": "Question",
      name: t(`q${i + 1}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`a${i + 1}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
