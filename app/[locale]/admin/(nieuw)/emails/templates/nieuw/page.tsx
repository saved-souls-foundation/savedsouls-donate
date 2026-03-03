import { setRequestLocale } from "next-intl/server";
import AdminEmailTemplateEditClient from "../[id]/AdminEmailTemplateEditClient";

export default async function AdminEmailTemplateNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminEmailTemplateEditClient id="nieuw" />;
}
