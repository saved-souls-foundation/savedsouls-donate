import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import AdminAdoptantenClient from "./AdminAdoptantenClient";

export type AdoptantRow = {
  id: string;
  email: string | null;
  voornaam: string | null;
  achternaam: string | null;
  huidige_stap: number | null;
  notities: string | null;
  aangemeld_op: string | null;
  updated_at: string | null;
  /** Eerste aangevraagde dier uit adoption_applications (voor stap-mail) */
  dierNaam: string | null;
  dierId: string | null;
};

export default async function AdminAdoptantenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("profiles")
    .select("id, email, voornaam, achternaam, huidige_stap, notities, aangemeld_op, updated_at")
    .eq("role", "adoptant")
    .order("aangemeld_op", { ascending: false });

  let applicationsByEmail: Map<string, { animal_name: string | null; animal_id: string | null }[]> = new Map();
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      const { data: apps } = await admin
        .from("adoption_applications")
        .select("email, animal_name, animal_id")
        .order("created_at", { ascending: false });
      for (const a of apps ?? []) {
        const email = (a as { email?: string }).email?.toLowerCase?.();
        if (!email) continue;
        const list = applicationsByEmail.get(email) ?? [];
        list.push({
          animal_name: (a as { animal_name?: string | null }).animal_name ?? null,
          animal_id: (a as { animal_id?: string | null }).animal_id ?? null,
        });
        applicationsByEmail.set(email, list);
      }
    } catch {
      // negeer; dierNaam blijft leeg
    }
  }

  const normalized: AdoptantRow[] = (rows ?? []).map((r) => {
    const email = r.email?.toLowerCase?.() ?? "";
    const firstApp = applicationsByEmail.get(email)?.[0];
    return {
      ...r,
      huidige_stap: Math.max(1, Number(r.huidige_stap) || 1),
      dierNaam: firstApp?.animal_name ?? null,
      dierId: firstApp?.animal_id ?? null,
    };
  });

  return <AdminAdoptantenClient initialRows={normalized} />;
}
