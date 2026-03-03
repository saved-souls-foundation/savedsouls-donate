import { setRequestLocale } from "next-intl/server";
import AdminDonateursClient from "./AdminDonateursClient";

export default async function AdminDonateursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminDonateursClient />;
}
