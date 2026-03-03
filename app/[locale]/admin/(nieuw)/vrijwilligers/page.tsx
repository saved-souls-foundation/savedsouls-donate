import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import AdminVrijwilligersClient from "./AdminVrijwilligersClient";

export type VolunteerRow = {
  user_id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  motivation: string | null;
  call_preference: string | null;
  language: string | null;
  step: number;
  created_at: string | null;
  updated_at: string | null;
};

export default async function AdminVrijwilligersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("volunteer_onboarding")
    .select("user_id, voornaam, achternaam, email, phone, city, area, motivation, call_preference, language, step, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (
    <AdminVrijwilligersClient initialRows={rows ?? []} />
  );
}
