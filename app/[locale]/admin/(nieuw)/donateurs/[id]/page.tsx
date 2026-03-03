import { setRequestLocale } from "next-intl/server";
import AdminDonateurDetail from "./AdminDonateurDetail";

export default async function AdminDonateursIdPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminDonateurDetail id={id} />;
}
