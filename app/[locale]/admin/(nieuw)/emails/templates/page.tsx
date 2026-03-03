import { setRequestLocale } from "next-intl/server";
import AdminEmailTemplatesClient from "./AdminEmailTemplatesClient";

export default async function AdminEmailsTemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminEmailTemplatesClient />;
}
