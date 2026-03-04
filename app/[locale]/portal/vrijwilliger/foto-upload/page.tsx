import { setRequestLocale } from "next-intl/server";
import FotoUploadClient from "./FotoUploadClient";

export const dynamic = "force-dynamic";

export default async function FotoUploadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FotoUploadClient />;
}
