import { setRequestLocale } from "next/intl/server";
import { Link } from "@/i18n/navigation";

export default async function DierNieuwPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold text-gray-900 mb-2">Dier toevoegen</h1>
      <p className="text-gray-500 mb-4">Formulier voor nieuw dier registreren — binnenkort beschikbaar.</p>
      <Link href="/admin/dieren" className="text-[#2aa348] font-semibold hover:underline">
        ← Terug naar dieren
      </Link>
    </div>
  );
}
