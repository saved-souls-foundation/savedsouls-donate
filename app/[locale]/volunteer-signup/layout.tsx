import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Volunteer Sign-up | Saved Souls Foundation",
  description:
    "Sign up as a volunteer at Saved Souls Foundation in Khon Kaen, Thailand. Fill out our form and join our team helping rescued dogs and cats.",
};

export default async function VolunteerSignupLayout({
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
