import { setRequestLocale } from "next-intl/server";
import AdminNieuwsbriefSjablonenClient from "./AdminNieuwsbriefSjablonenClient";

export default async function AdminNieuwsbriefSjablonenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminNieuwsbriefSjablonenClient />;
}
