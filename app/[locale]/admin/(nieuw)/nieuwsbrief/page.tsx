import { setRequestLocale } from "next-intl/server";
import AdminNieuwsbriefClient from "./AdminNieuwsbriefClient";

export default async function AdminNieuwsbriefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminNieuwsbriefClient />;
}
