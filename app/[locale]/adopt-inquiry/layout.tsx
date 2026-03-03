import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Adoption Inquiry | Saved Souls Foundation",
  description:
    "Start your adoption journey. Fill out our adoption inquiry form and give a rescued dog or cat a second chance at a loving home.",
};

export default async function AdoptInquiryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
