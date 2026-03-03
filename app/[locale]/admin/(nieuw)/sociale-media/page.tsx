import { setRequestLocale } from "next-intl/server";
import SocialeMediaClient from "./SocialeMediaClient";

export const metadata = {
  title: "Sociale media | Admin",
  robots: { index: false, follow: false },
};

export default async function SocialeMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SocialeMediaClient />;
}
