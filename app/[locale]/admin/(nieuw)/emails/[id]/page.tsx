import { setRequestLocale } from "next-intl/server";
import AdminEmailDetail from "./AdminEmailDetail";

export default async function AdminEmailsIdPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminEmailDetail id={id} />;
}
