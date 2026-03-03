import { setRequestLocale } from "next-intl/server";
import AdminDonateurForm from "../AdminDonateurForm";

export default async function AdminDonateursNieuwPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminDonateurForm />;
}
