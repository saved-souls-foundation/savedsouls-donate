import { setRequestLocale } from "next-intl/server";
import AgendaClient from "./AgendaClient";

export const metadata = {
  title: "Agenda | Admin",
  robots: { index: false, follow: false },
};

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgendaClient />;
}
