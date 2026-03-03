import { setRequestLocale } from "next-intl/server";
import AdminEmailTemplateEditClient from "./AdminEmailTemplateEditClient";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminEmailTemplateEditPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AdminEmailTemplateEditClient id={id} />;
}
