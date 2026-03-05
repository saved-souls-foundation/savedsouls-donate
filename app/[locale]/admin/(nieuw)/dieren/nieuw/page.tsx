import { setRequestLocale } from "next-intl/server";
import DierNieuwForm from "./DierNieuwForm";

export default async function DierNieuwPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold text-gray-900 mb-2">Dier toevoegen</h1>
      <p className="text-gray-500 mb-6">Registreer een nieuw dier in de opvang.</p>
      <DierNieuwForm />
    </div>
  );
}
