"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

export function RefreshAnimalsCard({ dateLocale }: { dateLocale: string }) {
  const t = useTranslations("admin.dashboard");
  const [loading, setLoading] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/refresh-animals", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; refreshedAt?: string; error?: string };
      if (!res.ok || !data.ok || typeof data.refreshedAt !== "string") {
        setError(data.error || t("refreshAnimalsError"));
        return;
      }
      setRefreshedAt(data.refreshedAt);
    } catch {
      setError(t("refreshAnimalsError"));
    } finally {
      setLoading(false);
    }
  }

  const timeLabel = refreshedAt
    ? new Date(refreshedAt).toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: ADM_BORDER }}>
        <h2 className="font-extrabold" style={{ color: ADM_TEXT }}>
          {t("refreshAnimalsTitle")}
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: ADM_MUTED }}>
          {t("refreshAnimalsHelp")}
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: ADM_ACCENT }}
        >
          {loading ? t("refreshAnimalsLoading") : t("refreshAnimalsButton")}
        </button>
        {refreshedAt && !error && (
          <p className="text-sm font-medium text-green-700" role="status">
            {t("refreshAnimalsSuccess", { time: timeLabel })}
          </p>
        )}
        {error && (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
