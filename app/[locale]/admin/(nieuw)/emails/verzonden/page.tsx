import { setRequestLocale } from "next-intl/server";
import AdminSentEmailsClient from "./AdminSentEmailsClient";

export default async function AdminSentEmailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminSentEmailsClient />;
}
