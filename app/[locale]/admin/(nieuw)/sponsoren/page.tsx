import { setRequestLocale } from "next-intl/server";
import AdminSponsorenClient from "./AdminSponsorenClient";

export default async function AdminSponsorenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminSponsorenClient />;
}
