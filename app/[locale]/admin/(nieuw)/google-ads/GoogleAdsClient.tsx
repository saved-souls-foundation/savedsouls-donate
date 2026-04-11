"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GoogleAdsStatRow } from "./page";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

const CAMPAIGNS = ["Emergency Donaties", "Sponsors", "Volunteers"] as const;

function ctrStatus(ctr: number): { label: string; tone: "ok" | "warn" | "danger" } {
  if (ctr > 5) return { label: "OK (Grants)", tone: "ok" };
  if (ctr >= 3) return { label: "Waarschuwing", tone: "warn" };
  return { label: "Kritiek", tone: "danger" };
}

function badgeClasses(tone: "ok" | "warn" | "danger"): string {
  if (tone === "ok") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (tone === "warn") return "bg-amber-100 text-amber-900 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export default function GoogleAdsClient({
  initialRows,
  locale,
}: {
  initialRows: GoogleAdsStatRow[];
  locale: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [campaign_name, setCampaignName] = useState<(typeof CAMPAIGNS)[number]>("Emergency Donaties");
  const [impressions, setImpressions] = useState("");
  const [clicks, setClicks] = useState("");
  const [ctr, setCtr] = useState("");
  const [conversions, setConversions] = useState("");
  const [week_start, setWeekStart] = useState("");

  const totals = useMemo(() => {
    let imp = 0;
    let clk = 0;
    let conv = 0;
    for (const r of rows) {
      imp += r.impressions ?? 0;
      clk += r.clicks ?? 0;
      conv += r.conversions ?? 0;
    }
    const avgCtr = imp > 0 ? (clk / imp) * 100 : 0;
    return { impressions: imp, clicks: clk, conversions: conv, avgCtr };
  }, [rows]);

  const lowCtrAny = useMemo(() => rows.some((r) => Number(r.ctr ?? 0) < 5), [rows]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/google-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_name,
          impressions: impressions === "" ? 0 : Number(impressions),
          clicks: clicks === "" ? 0 : Number(clicks),
          ctr: ctr === "" ? 0 : Number(ctr),
          conversions: conversions === "" ? 0 : Number(conversions),
          week_start,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(typeof json.error === "string" ? json.error : "Opslaan mislukt");
        return;
      }
      setImpressions("");
      setClicks("");
      setCtr("");
      setConversions("");
      setWeekStart("");
      router.refresh();
    } catch {
      setFormError("Netwerkfout");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  return (
    <div className="admin-main max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8 w-full min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: ADM_ACCENT }}>
          Google Ads
        </h1>
        <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
          Wekelijkse prestaties per campagne (handmatige invoer).
        </p>
      </div>

      {lowCtrAny && (
        <div
          className="mb-6 rounded-xl border px-4 py-3 text-sm font-medium"
          style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
        >
          CTR te laag — risico op Google Grants schorsing!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Totaal impressies", value: totals.impressions.toLocaleString("nl-NL") },
          { label: "Totaal klikken", value: totals.clicks.toLocaleString("nl-NL") },
          { label: "Gemiddelde CTR", value: `${totals.avgCtr.toFixed(2)}%` },
          { label: "Totaal conversies", value: totals.conversions.toLocaleString("nl-NL") },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-4 shadow-sm"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ADM_MUTED }}>
              {card.label}
            </p>
            <p className="text-2xl font-bold mt-2" style={{ color: ADM_TEXT }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl border overflow-hidden mb-8"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: ADM_BORDER, background: "#f8fafc" }}>
                <th className="px-4 py-3 font-semibold" style={{ color: ADM_TEXT }}>
                  Week
                </th>
                <th className="px-4 py-3 font-semibold" style={{ color: ADM_TEXT }}>
                  Campagne
                </th>
                <th className="px-4 py-3 font-semibold text-right" style={{ color: ADM_TEXT }}>
                  Impressies
                </th>
                <th className="px-4 py-3 font-semibold text-right" style={{ color: ADM_TEXT }}>
                  Klikken
                </th>
                <th className="px-4 py-3 font-semibold text-right" style={{ color: ADM_TEXT }}>
                  CTR
                </th>
                <th className="px-4 py-3 font-semibold text-right" style={{ color: ADM_TEXT }}>
                  Conversies
                </th>
                <th className="px-4 py-3 font-semibold" style={{ color: ADM_TEXT }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center" style={{ color: ADM_MUTED }}>
                    Nog geen rijen. Voeg hieronder een weekrapport toe.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const c = Number(r.ctr ?? 0);
                  const st = ctrStatus(c);
                  return (
                    <tr key={r.id} className="border-b" style={{ borderColor: ADM_BORDER }}>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: ADM_TEXT }}>
                        {r.week_start
                          ? new Date(r.week_start + "T12:00:00").toLocaleDateString(locale === "en" ? "en-GB" : "nl-NL", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3" style={{ color: ADM_TEXT }}>
                        {r.campaign_name}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.impressions ?? 0}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.clicks ?? 0}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClasses(st.tone)}`}
                        >
                          {c.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.conversions ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClasses(st.tone)}`}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: ADM_TEXT }}>
          Nieuwe week invoeren
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              Campagne
            </span>
            <select
              value={campaign_name}
              onChange={(e) => setCampaignName(e.target.value as (typeof CAMPAIGNS)[number])}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              required
            >
              {CAMPAIGNS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              Week start
            </span>
            <input
              type="date"
              value={week_start}
              onChange={(e) => setWeekStart(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              Impressies
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={impressions}
              onChange={(e) => setImpressions(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm tabular-nums"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              Klikken
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={clicks}
              onChange={(e) => setClicks(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm tabular-nums"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              CTR (%)
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={ctr}
              onChange={(e) => setCtr(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm tabular-nums"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: ADM_MUTED }}>
              Conversies
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={conversions}
              onChange={(e) => setConversions(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm tabular-nums"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </label>
          <div className="md:col-span-2 flex flex-col gap-2">
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: ADM_ACCENT }}
            >
              {saving ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
