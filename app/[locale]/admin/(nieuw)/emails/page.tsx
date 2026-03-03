import { setRequestLocale } from "next-intl/server";
import AdminEmailsClient from "./AdminEmailsClient";

export default async function AdminEmailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminEmailsClient />;
}
