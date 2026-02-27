"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import ProgressThermometer, { type ThermometerStep } from "@/app/components/ProgressThermometer";
import { createClient } from "@/lib/supabase/client";

const ACCENT_GREEN = "#2aa348";

/** Demo/mock data – vervang met echte data uit Supabase */
const MOCK_ADOPT_STEPS: ThermometerStep[] = [
  { id: 1, label: "Aanvraag", done: true },
  { id: 2, label: "Intro call", done: false },
  { id: 3, label: "Documenten", done: false },
  { id: 4, label: "Vlucht", done: false },
  { id: 5, label: "Aankomst", done: false },
];

const MOCK_VOLUNTEER_STEPS: ThermometerStep[] = [
  { id: 1, label: "Aanmelding", done: true },
  { id: 2, label: "Documenten", done: false },
  { id: 3, label: "Bevestiging", done: false },
  { id: 4, label: "Vertrek", done: false },
];

const MOCK_SPONSOR_STEPS: ThermometerStep[] = [
  { id: 1, label: "Aanmelding", done: true },
  { id: 2, label: "Actief", done: true },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [userType, setUserType] = useState<"adopt" | "volunteer">("adopt");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, [isClient]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    setLoggingOut(false);
  };

  const steps = isClient
    ? userType === "adopt"
      ? MOCK_ADOPT_STEPS
      : MOCK_VOLUNTEER_STEPS
    : MOCK_ADOPT_STEPS;

  const currentStep = steps.filter((s) => s.done).length || 1;
  const progressPercent = (currentStep / steps.length) * 100;

  const subtitle =
    userType === "volunteer"
      ? "2 documenten nog in te leveren"
      : undefined;

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {t("title")}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Type selector – alleen adopt en vrijwilliger (geen sponsor in inlogscherm) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["adopt", "volunteer"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                userType === type
                  ? "text-white"
                  : "text-stone-600 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600"
              }`}
              style={userType === type ? { backgroundColor: ACCENT_GREEN } : {}}
            >
              {t(`type${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </button>
          ))}
        </div>

        {/* Progress card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-6">
            {t("progressTitle")}
          </h2>
          <ProgressThermometer
            type={userType}
            steps={steps}
            currentStep={currentStep}
            progressPercent={progressPercent}
            subtitle={subtitle}
            stepLabel={t("stepOf", { current: currentStep, total: steps.length })}
          />
        </div>

        {/* Logout (ingelogd) of Login CTA (niet ingelogd) */}
        {isLoggedIn ? (
          <div className="mt-8 p-6 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {t("loggedInHint")}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 px-5 py-2.5 rounded-xl font-semibold text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors disabled:opacity-60"
            >
              {loggingOut ? "..." : t("logout")}
            </button>
          </div>
        ) : (
          <div className="mt-8 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t("loginHint")}
            </p>
            <Link
              href="/dashboard/login"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl font-semibold text-white"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("loginCta")}
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
