"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const BRAND_GREEN = "#2d5a27";

type Role = "vrijwilliger" | "adoptant";

export default function PortalOnboardingPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [voornaam, setVoornaam] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!hasSupabase) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/dashboard/login");
        return;
      }
      supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
        if (data?.role === "admin") {
          router.replace("/admin/dashboard");
          return;
        }
        if (data?.role === "vrijwilliger") {
          router.replace("/portal/vrijwilliger");
          return;
        }
        if (data?.role === "adoptant") {
          router.replace("/portal/adoptant");
          return;
        }
      });
    });
  }, [hasSupabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !hasSupabase) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/dashboard/login");
        return;
      }
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          role,
          voornaam: voornaam.trim() || null,
          huidige_stap: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      if (role === "vrijwilliger") router.replace("/portal/vrijwilliger");
      else router.replace("/portal/adoptant");
      router.refresh();
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  if (!hasSupabase) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
        <p className="text-amber-600">Supabase niet geconfigureerd.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900">
      <SiteHeader />
      <main className="max-w-md mx-auto px-4 py-12 md:py-20">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          {t("portalOnboardingTitle")}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mb-8">
          {t("portalOnboardingSubtitle")}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Rol
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="vrijwilliger"
                  checked={role === "vrijwilliger"}
                  onChange={() => setRole("vrijwilliger")}
                  className="rounded-full border-stone-300"
                />
                <span>{t("onboardingVrijwilliger")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="adoptant"
                  checked={role === "adoptant"}
                  onChange={() => setRole("adoptant")}
                  className="rounded-full border-stone-300"
                />
                <span>{t("onboardingAdoptant")}</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="voornaam" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Voornaam (optioneel)
            </label>
            <input
              id="voornaam"
              type="text"
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={!role || loading}
            className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            {loading ? "..." : t("saveAndContinue")}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
