import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export type AdoptionApplication = {
  id: string;
  email: string;
  name: string;
  city: string;
  country: string;
  experience: string;
  about: string;
  animal_name: string | null;
  animal_id: string | null;
  step: number;
  created_at: string;
};

export type VolunteerApplication = {
  id: string;
  email: string;
  name: string;
  city: string;
  country: string;
  dates: string | null;
  experience: string;
  motivation: string;
  step: number;
  created_at: string;
};

export type SponsorRecord = {
  id: string;
  total_amount_cents: number;
  animals: unknown;
  updated_at: string;
};

export async function GET() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      adopt: [],
      volunteer: [],
      sponsor: [],
      _meta: { source: "none", message: "Supabase admin niet geconfigureerd" },
    });
  }

  try {
    const supabase = createAdminClient();

    const [adoptRes, volunteerRes, sponsorRes] = await Promise.all([
      supabase
        .from("adoption_applications")
        .select("id, email, name, city, country, experience, about, animal_name, animal_id, step, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("volunteer_applications")
        .select("id, email, name, city, country, dates, experience, motivation, step, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("sponsor_progress")
        .select("id, total_amount_cents, animals, updated_at")
        .order("updated_at", { ascending: false }),
    ]);

    const adopt: AdoptionApplication[] = adoptRes.error ? [] : (adoptRes.data ?? []);
    const volunteer: VolunteerApplication[] = volunteerRes.error ? [] : (volunteerRes.data ?? []);
    let sponsor: SponsorRecord[] = sponsorRes.error ? [] : (sponsorRes.data ?? []);

    return NextResponse.json({
      adopt,
      volunteer,
      sponsor,
      _meta: { source: "supabase" },
    });
  } catch (e) {
    console.error("Admin applications API error:", e);
    return NextResponse.json(
      { adopt: [], volunteer: [], sponsor: [], _meta: { source: "error" } },
      { status: 200 }
    );
  }
}
