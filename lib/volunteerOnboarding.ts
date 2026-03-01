/**
 * Vrijwilliger onboarding: laden/opslaan formulier + upload documenten naar Supabase.
 * Vereist: tabel volunteer_onboarding, storage bucket volunteer-docs (zie migratie).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type VolunteerOnboardingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  motivation: string;
  callPreference: string;
  language: string;
};

export type VolunteerOnboardingFiles = {
  id: File[];
  vog: File[];
  certs: File[];
  extra: File[];
};

type VolunteerOnboardingRow = {
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
  id_doc_paths: string[];
  vog_doc_paths: string[];
  certs_doc_paths: string[];
  extra_doc_paths: string[];
  created_at: string;
  updated_at: string;
};

const BUCKET = "volunteer-docs";

function formToRow(form: VolunteerOnboardingFormData): Omit<VolunteerOnboardingRow, "user_id" | "created_at" | "updated_at" | "id_doc_paths" | "vog_doc_paths" | "certs_doc_paths" | "extra_doc_paths"> {
  return {
    voornaam: form.firstName.trim() || null,
    achternaam: form.lastName.trim() || null,
    email: form.email.trim() || null,
    phone: form.phone.trim() || null,
    city: form.city.trim() || null,
    area: form.area || null,
    motivation: form.motivation.trim() || null,
    call_preference: form.callPreference.trim() || null,
    language: form.language || null,
    step: 1,
  };
}

function rowToForm(row: VolunteerOnboardingRow): VolunteerOnboardingFormData {
  return {
    firstName: row.voornaam ?? "",
    lastName: row.achternaam ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    city: row.city ?? "",
    area: row.area ?? "",
    motivation: row.motivation ?? "",
    callPreference: row.call_preference ?? "",
    language: row.language ?? "",
  };
}

/** Laadt bestaande onboarding voor de ingelogde gebruiker. */
export async function loadOnboarding(
  supabase: SupabaseClient
): Promise<{ form: VolunteerOnboardingFormData; step: number; docPaths: VolunteerOnboardingFilesPaths } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row, error } = await supabase
    .from("volunteer_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // geen rij
    throw error;
  }

  const r = row as VolunteerOnboardingRow;
  return {
    form: rowToForm(r),
    step: r.step,
    docPaths: {
      id: r.id_doc_paths ?? [],
      vog: r.vog_doc_paths ?? [],
      certs: r.certs_doc_paths ?? [],
      extra: r.extra_doc_paths ?? [],
    },
  };
}

export type VolunteerOnboardingFilesPaths = {
  id: string[];
  vog: string[];
  certs: string[];
  extra: string[];
};

/** Slaat formulier + stap op (upsert). Geef docPaths mee na upload; anders blijven bestaande paden behouden. */
export async function saveOnboardingStep(
  supabase: SupabaseClient,
  form: VolunteerOnboardingFormData,
  step: number,
  docPaths?: VolunteerOnboardingFilesPaths
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Niet ingelogd");

  const base = formToRow(form);
  let id_doc_paths: string[] = [];
  let vog_doc_paths: string[] = [];
  let certs_doc_paths: string[] = [];
  let extra_doc_paths: string[] = [];

  if (docPaths) {
    id_doc_paths = docPaths.id;
    vog_doc_paths = docPaths.vog;
    certs_doc_paths = docPaths.certs;
    extra_doc_paths = docPaths.extra;
  } else {
    const { data: existing } = await supabase
      .from("volunteer_onboarding")
      .select("id_doc_paths, vog_doc_paths, certs_doc_paths, extra_doc_paths")
      .eq("user_id", user.id)
      .single();
    if (existing) {
      id_doc_paths = (existing.id_doc_paths as string[]) ?? [];
      vog_doc_paths = (existing.vog_doc_paths as string[]) ?? [];
      certs_doc_paths = (existing.certs_doc_paths as string[]) ?? [];
      extra_doc_paths = (existing.extra_doc_paths as string[]) ?? [];
    }
  }

  const { error } = await supabase
    .from("volunteer_onboarding")
    .upsert(
      {
        user_id: user.id,
        ...base,
        step,
        id_doc_paths,
        vog_doc_paths,
        certs_doc_paths,
        extra_doc_paths,
      },
      { onConflict: "user_id" }
    );

  if (error) throw error;
}

/** Uploadt bestanden naar Storage en retourneert de paden voor volunteer_onboarding. */
export async function uploadOnboardingFiles(
  supabase: SupabaseClient,
  files: VolunteerOnboardingFiles
): Promise<VolunteerOnboardingFilesPaths> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Niet ingelogd");

  const prefix = user.id;
  const result: VolunteerOnboardingFilesPaths = { id: [], vog: [], certs: [], extra: [] };

  const upload = async (type: keyof VolunteerOnboardingFiles, list: File[]): Promise<string[]> => {
    const paths: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const safeName = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const path = `${prefix}/${type}/${safeName}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) throw error;
      paths.push(path);
    }
    return paths;
  };

  result.id = await upload("id", files.id);
  result.vog = await upload("vog", files.vog);
  result.certs = await upload("certs", files.certs);
  result.extra = await upload("extra", files.extra);

  return result;
}
