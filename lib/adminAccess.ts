import { createClient } from "@/lib/supabase/server";

/**
 * Is de huidige bezoeker een ingelogde admin? Zelfde regel als de admin-API's en de
 * admin-login: profiles.role === "admin" of profiles.is_admin === true.
 * Faalt dicht: bij elke fout `false`.
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
    return profile?.role === "admin" || profile?.is_admin === true;
  } catch {
    return false;
  }
}
