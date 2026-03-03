import { setRequestLocale } from "next-intl/server";
import AdminSponsorDetail from "./AdminSponsorDetail";

export default async function AdminSponsorenIdPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminSponsorDetail id={id} />;
}
