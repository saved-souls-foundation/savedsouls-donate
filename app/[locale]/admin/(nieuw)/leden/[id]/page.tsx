import { setRequestLocale } from "next-intl/server";
import AdminLedenDetail from "./AdminLedenDetail";

export default async function AdminLedenIdPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminLedenDetail id={id} />;
}
