import { setRequestLocale } from "next/intl/server";
import { Link } from "@/i18n/navigation";

export default async function DierDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold text-gray-900 mb-2">Dier bewerken</h1>
      <p className="text-gray-500 mb-4">Volledig bewerken van dit dier — binnenkort beschikbaar.</p>
      <Link href="/admin/dieren" className="text-[#2aa348] font-semibold hover:underline">
        ← Terug naar dieren
      </Link>
    </div>
  );
}
