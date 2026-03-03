import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Thank You | Saved Souls Foundation",
  description:
    "A big thank you to all sponsors, donors, adopters, volunteers and founders of Saved Souls Foundation. Your support makes a difference.",
};

export default async function ThankYouLayout({
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
