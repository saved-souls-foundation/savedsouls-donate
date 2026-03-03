import { setRequestLocale } from "next-intl/server";
import AdminLedenForm from "../AdminLedenForm";

export default async function AdminLedenNieuwPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminLedenForm />;
}
