import { setRequestLocale } from "next-intl/server";
import AdminSponsorForm from "../AdminSponsorForm";

export default async function AdminSponsorenNieuwPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminSponsorForm />;
}
