import { setRequestLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import DierDetailClient from "./DierDetailClient";
import type { DierRow } from "../page";

export default async function DierDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("dieren")
    .select("id, naam, soort, ras, leeftijd, geslacht, status, foto_url, beschrijving, locatie, medisch_urgent, aangemeld_op, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) notFound();
  const dier: DierRow = {
    id: row.id,
    naam: row.naam ?? null,
    soort: row.soort ?? null,
    ras: row.ras ?? null,
    leeftijd: row.leeftijd ?? null,
    geslacht: row.geslacht ?? null,
    status: row.status ?? null,
    foto_url: row.foto_url ?? null,
    beschrijving: row.beschrijving ?? null,
    locatie: row.locatie ?? null,
    medisch_urgent: row.medisch_urgent ?? null,
    aangemeld_op: row.aangemeld_op ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
  return <DierDetailClient dier={dier} />;
}
