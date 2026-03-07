import { setRequestLocale } from "next-intl/server";
import AdminEmailsClient from "./AdminEmailsClient";

export default async function AdminEmailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; tab?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return <AdminEmailsClient initialEmailId={sp?.id ?? undefined} initialTab={sp?.tab ?? undefined} />;
}
