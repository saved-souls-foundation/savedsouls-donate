"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import Thermometer, { ADOPTANT_STEPS } from "@/app/components/Thermometer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";

const BRAND_GREEN = "#2d5a27";

type AdoptionApplication = {
  id: string;
  animal_name: string | null;
  animal_id: string | null;
  extra_animals?: Array<{ animalName?: string; animalId?: string }> | null;
  step: number;
  created_at: string;
};

export default function PortalAdoptantPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [voornaam, setVoornaam] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [adoptedAnimalImage, setAdoptedAnimalImage] = useState<string | null>(null);
  const [animalImages, setAnimalImages] = useState<Record<string, string[]>>({});
  const [animalTypes, setAnimalTypes] = useState<Record<string, "dog" | "cat">>({});

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
      void Promise.resolve(
        supabase
          .from("profiles")
          .select("voornaam, huidige_stap")
          .eq("id", user.id)
          .single()
      )
        .then(({ data }) => {
          setVoornaam(data?.voornaam ?? null);
          setCurrentStep(Math.max(1, Number(data?.huidige_stap) || 1));
        })
        .catch(() => {})
        .then(() => setLoading(false));
      // Adoptieaanvragen ophalen (RLS: alleen eigen aanvragen via e-mail)
      supabase
        .from("adoption_applications")
        .select("id, animal_name, animal_id, extra_animals, step, created_at")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setApplications((data ?? []) as AdoptionApplication[]);
        });
    });
  }, [hasSupabase, router]);

  // Foto's van aangevraagde dieren ophalen (voor lijst + stap 4)
  const animalIdsKey =
    applications
      .flatMap((app) => [
        app.animal_id,
        ...(Array.isArray(app.extra_animals) ? app.extra_animals.map((e) => e?.animalId).filter(Boolean) : []),
      ])
      .filter(Boolean)
      .map((id) => String(id))
      .join(",") || "";
  const ANIMALS_BASE_URL = "https://db.savedsouls-foundation.org";
  const PLACEHOLDER_ANIMAL = "/icons/paw.svg";

  useEffect(() => {
    if (!animalIdsKey) return;
    const ids = animalIdsKey.split(",").filter(Boolean);
    fetch("/api/animals")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data?.dogs && !data?.cats) return;
        const dogs = data.dogs || [];
        const cats = data.cats || [];
        const all = [...dogs, ...cats];
        const map: Record<string, string[]> = {};
        const types: Record<string, "dog" | "cat"> = {};
        dogs.forEach((a: { id: string }) => { types[String(a.id)] = "dog"; });
        cats.forEach((a: { id: string }) => { types[String(a.id)] = "cat"; });
        ids.forEach((id) => {
          const animal = all.find((a: { id: string }) => String(a.id) === id) as { image?: string; images?: string[] } | undefined;
          const raws = animal?.images?.length ? animal.images : (animal?.image ? [animal.image] : []);
          const urls = raws
            .slice(0, 6)
            .map((raw) => (raw.startsWith("http") ? raw : `${ANIMALS_BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`));
          if (urls.length) map[id] = urls;
        });
        setAnimalImages((prev) => ({ ...prev, ...map }));
        setAnimalTypes((prev) => ({ ...prev, ...types }));
        const firstId = ids[0];
        if (firstId && map[firstId]?.[0]) setAdoptedAnimalImage(map[firstId][0]);
      })
      .catch(() => {});
  }, [animalIdsKey]);

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
  const primaryApplication = applications[0];
  const adoptedAnimalName = primaryApplication?.animal_name ?? null;
  const adoptedAnimalId = primaryApplication?.animal_id ?? null;
  const isComplete = currentStep >= 4;

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900 relative" data-portal="adoptant-v2">
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
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          {t("portalWelcome", { name: displayName })}
        </h1>

        {/* Keuzebalk: duidelijk kiezen tussen Vrijwilliger en Adoptant */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border-2 border-stone-200 dark:border-stone-600 shadow-md p-4 md:p-5 mb-8">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-3">
            {t("portalRoleSwitch")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portal/vrijwilliger"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-600"
            >
              {t("portalVrijwilliger")} →
            </Link>
            <span
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white border-2 border-transparent"
              style={{ backgroundColor: BRAND_GREEN }}
              aria-current="true"
            >
              {t("portalAdoptant")}
            </span>
          </div>
        </div>

        {isComplete && (
          <div className="relative rounded-3xl overflow-hidden mb-8 border-2 border-amber-200 dark:border-amber-600 shadow-xl adoptant-complete-bg">
            <style>{`
              .adoptant-complete-bg {
                background: linear-gradient(135deg, #dbeafe 0%, #fef9c3 35%, #fef3c7 50%, #dbeafe 100%);
                background-size: 200% 200%;
                animation: adoptant-paspoort-fade 8s ease-in-out infinite;
              }
              @keyframes adoptant-paspoort-fade {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
            `}</style>
            {/* Achtergrond: cartoon paspoort, 25% */}
            <div
              className="absolute inset-0 flex items-end justify-end pointer-events-none"
              aria-hidden
            >
              <img
                src="/paspoort1.webp"
                alt=""
                className="w-[25%] max-w-[180px] max-h-[160px] object-contain opacity-70"
                style={{ objectPosition: "right bottom" }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.onerror = null;
                  el.src = "/paspoort-dierenpaspoort.png";
                }}
              />
            </div>
            <div className="relative p-6 md:p-10 text-center z-10">
              <p className="text-4xl mb-2" aria-hidden>♥ ♥ 🐾 ♥ ♥</p>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                {t("portalAdoptionCompleteTitle")}
              </h2>
              <p className="text-stone-700 dark:text-stone-300 mb-6 max-w-lg mx-auto">
                {t("portalAdoptionCompleteSub")}
              </p>
              {(adoptedAnimalName || adoptedAnimalId) && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                    {t("portalAdoptionCompleteAnimal")}
                  </p>
                  <div className="inline-block rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-amber-500 shadow-lg bg-white dark:bg-stone-800">
                    <img
                      src={adoptedAnimalImage || PLACEHOLDER_ANIMAL}
                      alt={adoptedAnimalName || t("portalAdoptionCompleteAnimal")}
                      className="w-48 h-48 object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.onerror = null;
                        el.src = PLACEHOLDER_ANIMAL;
                      }}
                    />
                    <p className="py-2 px-4 font-semibold text-stone-800 dark:text-stone-100">
                      ♥ {adoptedAnimalName || (adoptedAnimalId ? `ID: ${adoptedAnimalId}` : t("portalAdoptionCompleteAnimal"))} ♥
                    </p>
                  </div>
                </div>
              )}
              <TrackedDonateLink
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-95 transition-opacity"
                style={{ backgroundColor: "#7B1010" }}
              >
                <span aria-hidden>♥</span>
                {t("portalAdoptionCompleteDonate")}
                <span aria-hidden>♥</span>
              </TrackedDonateLink>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
            Jouw voortgang
          </h2>
          <Thermometer steps={ADOPTANT_STEPS} currentStep={currentStep} />
        </div>

        {applications.length > 0 && (
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8 mb-8">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
              {t("portalMyInquiries")}
            </h2>
            <ul className="space-y-4">
              {applications.map((app) => {
                const primaryId = app.animal_id ? String(app.animal_id) : null;
                const extraIds: string[] = Array.isArray(app.extra_animals)
                  ? app.extra_animals.map((e) => (e?.animalId ? String(e.animalId) : "")).filter(Boolean)
                  : [];
                const primaryImgs = primaryId ? (animalImages[primaryId] ?? []) : [];
                const extraImgs = extraIds.flatMap((id) => animalImages[id] ?? []);
                const allImgs = [...primaryImgs, ...extraImgs].filter(Boolean);
                const threeUrls: [string, string, string] = [
                  allImgs[0] || PLACEHOLDER_ANIMAL,
                  allImgs[1] || allImgs[0] || PLACEHOLDER_ANIMAL,
                  allImgs[2] || allImgs[0] || PLACEHOLDER_ANIMAL,
                ];
                return (
                  <li
                    key={app.id}
                    className="border border-stone-200 dark:border-stone-600 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {(app.animal_id || app.animal_name) && (
                      <div className="flex-shrink-0 flex gap-2">
                        {[0, 1, 2].map((i) => {
                          const animalId = primaryId;
                          const type = animalId ? (animalTypes[animalId] ?? "dog") : "dog";
                          const href = animalId ? `/adopt/${type}/${animalId}` : null;
                          const box = (
                            <div
                              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 flex-shrink-0"
                            >
                              <img
                                src={threeUrls[i]}
                                alt={app.animal_name ? `${app.animal_name} ${i + 1}` : ""}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const el = e.target as HTMLImageElement;
                                  el.onerror = null;
                                  el.src = PLACEHOLDER_ANIMAL;
                                }}
                              />
                            </div>
                          );
                          return href ? (
                            <Link key={i} href={href} className="block focus:ring-2 focus:ring-offset-2 rounded-xl focus:ring-stone-400" aria-label={app.animal_name ? `${app.animal_name} – overzicht bekijken` : "Dier overzicht"}>
                              {box}
                            </Link>
                          ) : (
                            <div key={i}>{box}</div>
                          );
                        })}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">
                        {new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </p>
                      <p className="font-medium text-stone-800 dark:text-stone-100">
                        {app.animal_name ? (
                          <>🐾 {app.animal_name}{app.animal_id ? ` (ID: ${app.animal_id})` : ""}</>
                        ) : (
                          <span className="text-stone-500 dark:text-stone-400">{t("portalNoPrimaryAnimal")}</span>
                        )}
                      </p>
                      {Array.isArray(app.extra_animals) && app.extra_animals.length > 0 && (
                        <ul className="mt-2 ml-4 space-y-1 text-sm text-stone-600 dark:text-stone-300">
                          {app.extra_animals
                            .filter((e) => e?.animalName || e?.animalId)
                            .map((extra, i) => (
                              <li key={i}>
                                {t("portalAlsoInterested")}: {extra.animalName || "—"}
                                {extra.animalId ? ` (ID: ${extra.animalId})` : ""}
                              </li>
                            ))}
                        </ul>
                      )}
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                        {t("portalStepLabel")}: {app.step}/4
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">
              <Link href="/adopt-inquiry" className="underline font-medium hover:no-underline" style={{ color: BRAND_GREEN }}>
                {t("portalNewInquiry")}
              </Link>
            </p>
          </div>
        )}

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
