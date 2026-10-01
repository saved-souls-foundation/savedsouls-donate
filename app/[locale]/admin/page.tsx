import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/** Oude CMS-pagina (PUT /api/animals + data/animals.json) is verwijderd. */
export default async function AdminIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/admin/dashboard`);
}
