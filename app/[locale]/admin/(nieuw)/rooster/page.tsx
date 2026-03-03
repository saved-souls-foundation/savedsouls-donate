import { setRequestLocale } from "next-intl/server";
import RoosterClient from "./RoosterClient";

export const metadata = {
  title: "Rooster | Admin",
  robots: { index: false, follow: false },
};

export default async function RoosterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RoosterClient />;
}
