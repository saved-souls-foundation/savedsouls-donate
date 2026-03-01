"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import Thermometer, { VRIJWILLIGER_STEPS } from "@/app/components/Thermometer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const BRAND_GREEN = "#2d5a27";

type AdoptionApplication = {
  id: string;
  animal_name: string | null;
  animal_id: string | null;
  extra_animals?: Array<{ animalName?: string; animalId?: string }> | null;
  step: number;
  created_at: string;
};

export default function PortalVrijwilligerClient() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [voornaam, setVoornaam] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>([]);
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
        setLoading(false);
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
        })
        .finally(() => setLoading(false));
      supabase
        .from("adoption_applications")
        .select("id, animal_name, animal_id, extra_animals, step, created_at")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setAdoptionApplications((data ?? []) as AdoptionApplication[]);
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

  const displayName = voornaam || "daar";

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900 relative" data-portal="vrijwilliger-v2">
      <SiteHeader />
      {/* Paspoort-afbeelding achter de tekst, iets groter, stopt bij laatste witte regel (niet in footer) */}
      <div className="absolute right-0 top-0 bottom-[180px] w-[min(48%,380px)] pointer-events-none z-0 flex justify-end items-start pt-20 md:pt-24" aria-hidden>
        <img
          src="/paspoort1.webp"
          alt=""
          className="h-[min(48vh,340px)] w-auto max-w-full object-contain object-right opacity-50"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.onerror = null;
            el.src = "/paspoort-dierenpaspoort.png";
          }}
        />
      </div>
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          {t("portalWelcome", { name: displayName })}
        </h1>

        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">Kies hier: Vrijwilliger of Adoptant</p>

        <div className="mb-4">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#dc2626" }}
          >
            ♥ Doneren
          </Link>
        </div>

        <div className="bg-amber-50/90 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-700 shadow-md p-4 md:p-5 mb-8">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
            Ik ben hier als
          </p>
          <div className="flex flex-wrap gap-3">
            <span
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white border-2 border-transparent"
              style={{ backgroundColor: BRAND_GREEN }}
              aria-current="true"
            >
              Vrijwilliger
            </span>
            <Link
              href="/portal/adoptant"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 hover:bg-amber-100 dark:hover:bg-stone-600 shadow-sm"
            >
              Adoptant →
            </Link>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-3">
            Heb je een adoptieaanvraag gedaan? Klik op Adoptant om je aanvragen en aangevraagde dier(en) te zien.
          </p>
        </div>

        {adoptionApplications.length > 0 && (
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-400">
            Je hebt ook adoptieaanvragen.{" "}
            <Link href="/portal/adoptant" className="font-medium underline hover:no-underline" style={{ color: BRAND_GREEN }}>
              Adoptantenportaal →
            </Link>
          </p>
        )}

        {loading ? (
          <div className="py-8 text-center text-stone-500 dark:text-stone-400">Laden…</div>
        ) : (
          <>
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8 mb-8">
              <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
                Jouw voortgang
              </h2>
              <Thermometer steps={VRIJWILLIGER_STEPS} currentStep={currentStep} />
            </div>

            <div className="bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-8">
              <Link
                href="/portal/onboarding/volunteer"
                className="text-sm font-medium underline hover:no-underline"
                style={{ color: BRAND_GREEN }}
              >
                {t("portalVolunteerOnboardingLinkShort")} →
              </Link>
            </div>
          </>
        )}

        <p className="text-sm text-stone-600 dark:text-stone-400 mt-6">
          <Link href="/contact" className="underline font-medium hover:no-underline">
            {t("portalHelp")}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
