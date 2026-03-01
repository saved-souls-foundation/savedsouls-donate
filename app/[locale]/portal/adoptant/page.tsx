"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import Thermometer, { ADOPTANT_STEPS } from "@/app/components/Thermometer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const BRAND_GREEN = "#2d5a27";

export default function PortalAdoptantPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [voornaam, setVoornaam] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/dashboard/login");
        return;
      }
      supabase
        .from("profiles")
        .select("voornaam, huidige_stap")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setVoornaam(data?.voornaam ?? null);
          setCurrentStep(Math.max(1, Number(data?.huidige_stap) || 1));
          setLoading(false);
        });
    });
  }, [hasSupabase, router]);

  useEffect(() => {
    if (!hasSupabase) return;
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.id) return;
      channel = supabase
        .channel("profile-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const newStep = (payload.new as { huidige_stap?: number }).huidige_stap;
            if (typeof newStep === "number") setCurrentStep(Math.max(1, newStep));
          }
        )
        .subscribe();
    });
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [hasSupabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
        <p className="text-stone-500">Laden…</p>
      </div>
    );
  }

  const displayName = voornaam || "daar";

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          {t("portalWelcome", { name: displayName })}
        </h1>
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-8"
          style={{ backgroundColor: BRAND_GREEN }}
        >
          {t("portalAdoptant")}
        </span>

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
            Jouw voortgang
          </h2>
          <Thermometer steps={ADOPTANT_STEPS} currentStep={currentStep} />
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400">
          <Link href="/contact" className="underline font-medium hover:no-underline">
            {t("portalHelp")}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
