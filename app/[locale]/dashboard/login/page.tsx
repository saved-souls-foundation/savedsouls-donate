"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const BRAND_GREEN = "#2d5a27";
const ROLE_STORAGE_KEY = "savedsouls_login_role";

type PortalRole = "vrijwilliger" | "adoptant";

function getStoredRole(): PortalRole | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(ROLE_STORAGE_KEY);
  return v === "adoptant" || v === "vrijwilliger" ? v : null;
}

export default function DashboardLoginPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<PortalRole | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  useEffect(() => {
    if (searchParams.get("register") === "1") setIsRegister(true);
    if (searchParams.get("reset_expired") === "1") setError(t("updatePasswordLinkExpired"));
  }, [searchParams, t]);

  // Rol-keuze in sessionStorage zetten zodat die niet verloren gaat bij submit
  const setRole = (role: PortalRole | null) => {
    setSelectedRole(role);
    if (typeof window !== "undefined") {
      if (role) sessionStorage.setItem(ROLE_STORAGE_KEY, role);
      else sessionStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Redirect: admin altijd naar admin; anders naar de gekozen rol zodat Adoptant/Vrijwilliger-keuze telt.
  async function redirectAfterLogin(supabase: ReturnType<typeof createClient>, chosenRole: PortalRole | null) {
    const role = chosenRole ?? getStoredRole();
    if (typeof window !== "undefined") sessionStorage.removeItem(ROLE_STORAGE_KEY);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin")
      .eq("id", user.id)
      .single();
    const profileRole = profile?.role as string | null;
    const isAdmin = profile?.is_admin === true || profileRole === "admin";

    if (isAdmin) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }
    // Gebruik de keuze van de gebruiker op de loginpagina (Adoptant of Vrijwilliger)
    if (role === "adoptant") {
      router.push("/portal/adoptant");
      router.refresh();
      return;
    }
    if (role === "vrijwilliger") {
      router.push("/portal/vrijwilliger");
      router.refresh();
      return;
    }
    // Fallback: profielrol als er geen keuze was (bijv. directe link)
    if (profileRole === "adoptant") {
      router.push("/portal/adoptant");
      router.refresh();
      return;
    }
    if (profileRole === "vrijwilliger") {
      router.push("/portal/vrijwilliger");
      router.refresh();
      return;
    }
    router.push("/portal/onboarding");
    router.refresh();
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!hasSupabase || !email.trim()) {
      setError("Vul je e-mailadres in.");
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      // Base URL moet EXACT overeenkomen met Supabase Redirect URLs (anders gaat Supabase naar homepage).
      // Zet in Vercel: NEXT_PUBLIC_SITE_URL=https://savedsouls-foundation.com (zonder trailing slash)
      const base =
        typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL
          ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
          : typeof window !== "undefined"
            ? window.location.origin
            : "";
      const redirectTo = `${base}/${locale}/dashboard/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }
      setResetLinkSent(true);
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!hasSupabase) {
      setError("Login is nog niet geconfigureerd. Configureer Supabase (NEXT_PUBLIC_SUPABASE_URL).");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      if (isRegister) {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          const roleToSet = selectedRole || "vrijwilliger";
          await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              email: data.user.email ?? email,
              role: roleToSet,
              huidige_stap: 1,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        }
        if (data.session) {
          await redirectAfterLogin(supabase, selectedRole ?? getStoredRole());
          return;
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError && data.user) {
          await redirectAfterLogin(supabase, selectedRole ?? getStoredRole());
          return;
        }
        if (signInError?.message?.toLowerCase().includes("email") && signInError?.message?.toLowerCase().includes("confirm")) {
          setError(t("confirmEmailFirst"));
          setIsRegister(false);
        } else {
          setError(t("registerSuccessLoginHint"));
          setIsRegister(false);
        }
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const msg = authError.message?.toLowerCase() ?? "";
        if (msg.includes("email") && msg.includes("confirm")) {
          setError(t("confirmEmailFirst"));
        } else {
          setError(t("loginError"));
        }
        setLoading(false);
        return;
      }
      await redirectAfterLogin(supabase, selectedRole ?? getStoredRole());
    } catch (err) {
      const message = err instanceof Error ? err.message : t("loginError");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const showForm = selectedRole !== null || isRegister || isForgotPassword;

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900">
      <SiteHeader />

      <main className="max-w-md mx-auto px-4 py-12 md:py-20">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8"
        >
          {t("backToDashboard")}
        </Link>

        {!showForm && !resetLinkSent && (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Kies hieronder hoe je wilt inloggen en vraag eventueel een nieuwe wachtwoordherstel-link aan.</p>
              </div>
            )}
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {t("loginTitle")}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
              {t("loginChooseRole")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  setRole("vrijwilliger");
                  if (searchParams.get("register") === "1") setIsRegister(true);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-[#2d5a27] hover:shadow-lg transition-all text-stone-900 dark:text-stone-100"
              >
                <span className="text-3xl mb-2" aria-hidden>🐾</span>
                <span className="font-semibold">{t("loginAsVolunteer")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("adoptant");
                  if (searchParams.get("register") === "1") setIsRegister(true);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-[#2d5a27] hover:shadow-lg transition-all text-stone-900 dark:text-stone-100 text-left"
              >
                <span className="text-3xl mb-2" aria-hidden>🏠</span>
                <span className="font-semibold">{t("loginAsAdoptant")}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">{t("loginAsAdoptantHint")}</span>
              </button>
            </div>
          </>
        )}

        {(showForm || resetLinkSent) && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {resetLinkSent
                ? t("forgotPasswordTitle")
                : isForgotPassword
                  ? t("forgotPasswordTitle")
                  : isRegister
                    ? t("registerTitle")
                    : t("loginTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mt-1 text-sm">
              {resetLinkSent
                ? null
                : isForgotPassword
                  ? t("forgotPasswordSubtitle")
                  : isRegister
                    ? t("registerSubtitle")
                    : t("loginSubtitle")}
            </p>

          {resetLinkSent ? (
            <div className="mt-6 space-y-4">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">{t("resetLinkSent")}</p>
              <button
                type="button"
                onClick={() => {
                  setResetLinkSent(false);
                  setIsForgotPassword(false);
                  setError(null);
                }}
                className="text-sm underline hover:no-underline font-medium text-stone-600 dark:text-stone-400"
              >
                {t("backToLogin")}
              </button>
            </div>
          ) : showForm ? (
            <>
              <form
                onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {!isForgotPassword && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                      {t("password")}
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!isForgotPassword}
                      minLength={6}
                      autoComplete={isRegister ? "new-password" : "current-password"}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
                {error && (
                  <div className="space-y-1">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    {error.toLowerCase().includes("network") && (
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Controleer: is je Supabase-project actief? Werkt je internet?
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  style={{ backgroundColor: BRAND_GREEN }}
                >
                  {loading ? "..." : isForgotPassword ? t("sendResetLink") : isRegister ? t("registerButton") : t("loginButton")}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">
                <button
                  type="button"
                  onClick={() => {
                    setRole(null);
                    setIsForgotPassword(false);
                    setError(null);
                  }}
                  className="underline hover:no-underline font-medium mr-2"
                >
                  ← {t("backToLogin")}
                </button>
                {!isForgotPassword && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setIsRegister(!isRegister); setError(null); }}
                      className="underline hover:no-underline font-medium"
                    >
                      {isRegister ? t("switchToLogin") : t("switchToRegister")}
                    </button>
                    {" · "}
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setError(null); }}
                      className="underline hover:no-underline font-medium"
                    >
                      {t("forgotPassword")}
                    </button>
                  </>
                )}
              </p>
            </>
          ) : null}

            {!hasSupabase && (
              <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
                Stel NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in.
              </p>
            )}
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
