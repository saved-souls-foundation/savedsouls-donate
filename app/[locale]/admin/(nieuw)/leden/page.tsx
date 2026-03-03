import { setRequestLocale } from "next-intl/server";
import AdminLedenClient from "./AdminLedenClient";

export default async function AdminLedenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminLedenClient />;
}
