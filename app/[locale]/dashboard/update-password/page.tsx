"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Footer from "@/app/components/Footer";
import SiteHeader from "@/app/components/SiteHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const ACCENT_GREEN = "#2aa348";

export default function DashboardUpdatePasswordPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!hasSupabase) {
      setSessionReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionReady(true);
      if (!session) {
        setError(t("updatePasswordLinkExpired"));
      }
    });
  }, [hasSupabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(t("passwordsMustMatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("updatePasswordMinLength"));
      return;
    }
    if (!hasSupabase) {
      setError("Wachtwoord herstel is niet geconfigureerd.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-stone-50 dark:bg-stone-900">
      <SiteHeader />

      <main className="max-w-md mx-auto px-4 py-12 md:py-20">
        <Link
          href="/dashboard/login"
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8"
        >
          {t("backToDashboard")}
        </Link>

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {t("updatePasswordTitle")}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1 text-sm">
            {t("updatePasswordSubtitle")}
          </p>

          {!hasSupabase ? (
            <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
              Stel NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in.
            </p>
          ) : !sessionReady ? (
            <p className="mt-6 text-stone-500 dark:text-stone-400">Laden…</p>
          ) : error && !password && !confirmPassword ? (
            <div className="mt-6 space-y-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <Link
                href="/dashboard/login"
                className="inline-block py-2 px-4 rounded-xl font-medium text-white"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {t("backToLogin")}
              </Link>
            </div>
          ) : success ? (
            <p className="mt-6 text-green-600 dark:text-green-400 font-medium">{t("updatePasswordSuccess")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t("newPassword")}
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t("confirmPassword")}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {loading ? "..." : t("updatePasswordButton")}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
