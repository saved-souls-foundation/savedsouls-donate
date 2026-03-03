import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Adopt a Dog | Saved Souls Foundation",
  description:
    "Adopt a rescued dog from Saved Souls Foundation in Khon Kaen, Thailand. Disabled dogs, wheelchair dogs, and special needs animals looking for loving homes.",
};

export default async function AdoptLayout({
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
