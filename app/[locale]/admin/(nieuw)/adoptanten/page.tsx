import { createClient } from "@/lib/supabase/server";
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
};

export default async function AdminAdoptantenPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("profiles")
    .select("id, email, voornaam, achternaam, huidige_stap, notities, aangemeld_op, updated_at")
    .eq("role", "adoptant")
    .order("aangemeld_op", { ascending: false });

  const normalized = (rows ?? []).map((r) => ({
    ...r,
    huidige_stap: Math.max(1, Number(r.huidige_stap) || 1),
  }));

  return <AdminAdoptantenClient initialRows={normalized} />;
}
