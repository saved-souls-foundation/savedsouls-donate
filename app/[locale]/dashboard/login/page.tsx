"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const ACCENT_GREEN = "#2aa348";

export default function DashboardLoginPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (searchParams.get("register") === "1") setIsRegister(true);
  }, [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!hasSupabase) {
      setError("Login is nog niet geconfigureerd. Configureer Supabase (NEXT_PUBLIC_SUPABASE_URL).");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      if (isRegister) {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError && data.user) {
          router.push("/dashboard");
          router.refresh();
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
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("loginError");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

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

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {isRegister ? t("registerTitle") : t("loginTitle")}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1 text-sm">
            {isRegister ? t("registerSubtitle") : t("loginSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isRegister ? "new-password" : "current-password"}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {error && (
              <div className="space-y-1">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                {error.toLowerCase().includes("network") && (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Controleer: is je Supabase-project actief (niet gepauzeerd in Settings → General)? Werkt je internet?
                  </p>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {loading ? "..." : isRegister ? t("registerButton") : t("loginButton")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="underline hover:no-underline font-medium"
            >
              {isRegister ? t("switchToLogin") : t("switchToRegister")}
            </button>
          </p>

          {!hasSupabase && (
            <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
              Stel NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in voor e-mail/wachtwoord login.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
