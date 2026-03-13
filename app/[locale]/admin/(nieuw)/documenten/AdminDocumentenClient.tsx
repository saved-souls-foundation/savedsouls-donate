"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DocRow } from "./page";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_ERROR = "#7B1010";

export default function AdminDocumentenClient({ docs }: { docs: DocRow[] }) {
  const t = useTranslations("admin");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function bekijken(path: string) {
    setLoading(path);
    setError("");
    try {
      const res = await fetch("/api/admin/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorGeneric"));
      if (data.url) window.open(data.url, "_blank");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border p-4"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
      >
        <p className="text-sm mb-3" style={{ color: ADM_TEXT }}>
          {t("documentenIntro")}
        </p>
        <a
          href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "rgba(13,148,136,.15)", color: ADM_ACCENT }}
        >
          {t("brochureButton")}
        </a>
      </div>

      {error && (
        <p className="text-sm" style={{ color: ADM_ERROR }}>
          {error}
        </p>
      )}

      {docs.length === 0 ? (
        <p className="text-sm" style={{ color: ADM_MUTED }}>
          {t("noDocuments")}
        </p>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: ADM_MUTED }}>
                  <th className="text-left p-3">{t("volunteerCol")}</th>
                  <th className="text-left p-3">{t("type")}</th>
                  <th className="text-left p-3">{t("filename")}</th>
                  <th className="text-left p-3">{t("view")}</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d, i) => (
                  <tr key={`${d.path}-${i}`} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {d.naam}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {d.type}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {d.bestandsnaam}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={loading === d.path}
                        onClick={() => bekijken(d.path)}
                        className="text-sm font-medium disabled:opacity-50"
                        style={{ color: ADM_ACCENT }}
                      >
                        {loading === d.path ? t("loading") : t("view")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
