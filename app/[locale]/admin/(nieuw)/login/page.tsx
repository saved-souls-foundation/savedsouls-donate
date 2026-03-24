"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ACCENT = "#0d9488";
const BG = "#f1f5f9";
const CARD_BG = "#ffffff";
const TEXT = "#1e293b";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      const userId = signInData.user?.id;
      if (!userId) {
        setError(t("errorGeneric"));
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", userId)
        .single();

      const isAdmin = profile?.is_admin === true || profile?.role === "admin";
      if (!isAdmin) {
        await supabase.auth.signOut();
        setError(t("loginError"));
        setLoading(false);
        return;
      }
      router.push(`/${locale}/admin/dashboard`);
      router.refresh();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email.trim()) {
      setError("Vul je e-mailadres in.");
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      // Base URL moet EXACT overeenkomen met Supabase Redirect URLs (anders gaat Supabase naar homepage).
      // Zet in Vercel: NEXT_PUBLIC_SITE_URL=https://savedsouls-foundation.org (zonder trailing slash)
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
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: BG,
        color: TEXT,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl border p-8 shadow-sm"
          style={{
            background: CARD_BG,
            borderColor: BORDER,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <img src="/savedsouls-logo-darkgreen.png" alt="" className="h-9 w-9 object-contain" />
            <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: ACCENT }}>
              SavedSoulsFoundation
            </span>
          </div>
          <span
            className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
            style={{ background: "rgba(13,148,136,.15)", color: ACCENT }}
          >
            Admin
          </span>
          <p className="text-sm mb-6" style={{ color: MUTED }}>
            {t("subtitle")}
          </p>

          {resetLinkSent ? (
            <div className="py-2">
              <p className="text-sm mb-4" style={{ color: "#0f766e" }}>
                {t("resetLinkSent")}
              </p>
              <button
                type="button"
                onClick={() => { setResetLinkSent(false); setShowForgot(false); }}
                className="text-sm font-medium hover:underline"
                style={{ color: ACCENT }}
              >
                ← {t("loginButton")}
              </button>
            </div>
          ) : showForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm" style={{ color: MUTED }}>
                {t("forgotPasswordHint")}
              </p>
              <div>
                <label htmlFor="admin-forgot-email" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                  {t("email")}
                </label>
                <input
                  id="admin-forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-offset-0"
                  style={{
                    borderColor: BORDER,
                    color: TEXT,
                    background: CARD_BG,
                  }}
                  placeholder="admin@example.com"
                />
              </div>
              {error && (
                <p className="text-sm" style={{ color: "#7B1010" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50"
                style={{ background: ACCENT }}
              >
                {loading ? t("pleaseWait") : t("sendResetLink")}
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(""); }}
                className="w-full text-sm font-medium"
                style={{ color: MUTED }}
              >
                ← {t("loginButton")}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                    {t("email")}
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      borderColor: BORDER,
                      color: TEXT,
                      background: CARD_BG,
                    }}
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                    {t("password")}
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      borderColor: BORDER,
                      color: TEXT,
                      background: CARD_BG,
                    }}
                  />
                </div>
                {error && (
                  <p className="text-sm" style={{ color: "#7B1010" }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50"
                  style={{ background: ACCENT }}
                >
                  {loading ? t("pleaseWait") : t("loginButton")}
                </button>
              </form>

              <p className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setShowForgot(true); setError(""); }}
                  className="text-sm font-medium hover:underline"
                  style={{ color: ACCENT }}
                >
                  {t("forgotPassword")}
                </button>
              </p>
            </>
          )}

          <p className="text-center mt-6">
            <Link
              href={`/${locale}`}
              className="text-sm hover:underline"
              style={{ color: MUTED }}
            >
              {t("backToWebsite")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
