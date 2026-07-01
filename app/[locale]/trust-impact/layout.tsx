import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";
import { FAQ_SCHEMA } from "@/components/trust-impact/content";
import "@/app/trust-impact.css";

const BASE_URL = "https://www.savedsouls-foundation.org";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE_URL}/${locale}/trust-impact`;

  return {
    title: "Saved Souls Foundation — Verified Facts & Impact | Animal Rescue, Khon Kaen, Thailand",
    description:
      "Saved Souls Foundation is a registered Thai non-profit (No. 1/2560) rescuing dogs and cats in Khon Kaen, Thailand since 2010. 350+ dogs, 98 cats, 50+ disabled dogs in daily care. Verified facts, impact and how to help.",
    robots: "index, follow",
    alternates: alternatesForPath("/trust-impact", locale),
    openGraph: {
      type: "website",
      siteName: "Saved Souls Foundation",
      title: "Saved Souls Foundation — Verified Facts & Impact",
      description:
        "A registered non-profit in Khon Kaen, Thailand. Every fact on this page is verifiable — read who we are, what we do, and how to help.",
      url,
      images: [{ url: `${BASE_URL}/og-image.jpg` }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function TrustImpactLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* FAQPage uniek voor deze route — NGO-schema staat al in app/[locale]/layout.tsx */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      {children}
    </>
  );
}
