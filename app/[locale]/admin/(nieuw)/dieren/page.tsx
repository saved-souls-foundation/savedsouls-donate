import { createAdminClient } from "@/lib/supabase/admin";
import { setRequestLocale } from "next-intl/server";
import { AdminDierenClient } from "./AdminDierenClient";

export const revalidate = 60;

export type DierRow = {
  id: string;
  naam: string | null;
  soort: string | null;
  ras: string | null;
  leeftijd: string | null;
  geslacht: string | null;
  status: string | null;
  foto_url: string | null;
  beschrijving: string | null;
  locatie: string | null;
  medisch_urgent: boolean | null;
  aangemeld_op: string | null;
  created_at: string | null;
  updated_at: string | null;
};

async function DierenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = createAdminClient();
  const { data: dierenData, error } = await supabase
    .from("dieren")
    .select("id, naam, soort, ras, leeftijd, geslacht, status, foto_url, beschrijving, locatie, medisch_urgent, aangemeld_op, created_at, updated_at")
    .order("created_at", { ascending: false });

  const dieren: DierRow[] = error ? [] : (dierenData ?? []).map((r) => ({
    id: r.id,
    naam: r.naam ?? null,
    soort: r.soort ?? null,
    ras: r.ras ?? null,
    leeftijd: r.leeftijd ?? null,
    geslacht: r.geslacht ?? null,
    status: r.status ?? null,
    foto_url: r.foto_url ?? null,
    beschrijving: r.beschrijving ?? null,
    locatie: r.locatie ?? null,
    medisch_urgent: r.medisch_urgent ?? null,
    aangemeld_op: r.aangemeld_op ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
  }));

  return <AdminDierenClient dieren={dieren} />;
}

export default DierenPage;
