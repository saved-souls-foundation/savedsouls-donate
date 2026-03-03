import { setRequestLocale } from "next-intl/server";
import AdminNieuwsbriefVersturenClient from "./AdminNieuwsbriefVersturenClient";

export default async function AdminNieuwsbriefVersturenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminNieuwsbriefVersturenClient />;
}
