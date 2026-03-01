"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import VolunteerOnboarding from "@/app/components/VolunteerOnboarding";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function PortalOnboardingVolunteerPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/dashboard/login");
        return;
      }
      supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
        if (data?.role === "adoptant") router.replace("/portal/adoptant");
        if (data?.role === "admin") router.replace("/admin/dashboard");
        // vrijwilliger of nog geen rol: mag deze flow zien
      });
    });
  }, [router]);

  return <VolunteerOnboarding />;
}
