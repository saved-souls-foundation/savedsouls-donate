"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_YELLOW = "#B45309";
const PAGE_SIZE = 20;

const LEVEL_COLORS: Record<string, string> = {
  platinum: "#E5E4E2",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

const NIVEAU_OPTIONS = ["all", "platinum", "gold", "silver", "bronze"] as const;
const STATUS_OPTIONS = ["all", "actief", "inactief", "verlopen", "in_onderhandeling"] as const;

type SponsorRow = {
  id: string;
  bedrijfsnaam: string | null;
  contactpersoon_naam: string | null;
  contactpersoon_email: string | null;
  logo_url: string | null;
  niveau: string | null;
  bedrag_per_maand: number | null;
  contract_start: string | null;
  contract_eind: string | null;
  status: string;
  website?: string | null;
  bijdrage_type?: string | null;
};

type Stats = {
  activeCount: number;
  totalMonthly: number;
  perLevel: { platinum: number; gold: number; silver: number; bronze: number };
  expiringCount: number;
  expiringNames: string[];
};

export default function AdminSponsorenClient() {
  const t = useTranslations("admin.sponsors");
  const tAdmin = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SponsorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<SponsorRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (search) params.set("search", search);
    if (niveauFilter !== "all") params.set("niveau", niveauFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    const res = await fetch(`/api/admin/sponsors?${params}`);
    if (!res.ok) {
      setData([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const json = await res.json();
    setData(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [page, search, niveauFilter, statusFilter]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetch("/api/admin/sponsors/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setStats(j))
      .catch(() => setStats(null));
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function formatDate(d: string | null) {
    if (!d) return t("noValue");
    return locale === "en" ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  async function handleDelete(row: SponsorRow) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sponsors/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteConfirm(null);
      setData((prev) => prev.filter((x) => x.id !== row.id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  function formatCurrency(n: number) {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  }

  function levelLabel(n: string | null) {
    if (!n) return t("noValue");
    const key = n.toLowerCase();
    return t(`levels.${key}` as "levels.platinum" | "levels.gold" | "levels.silver" | "levels.bronze") ?? n;
  }

  function statusLabel(s: string) {
    const key = s as keyof typeof statusKeys;
    return statusKeys[key] ?? s;
  }
  const statusKeys: Record<string, string> = {
    actief: t("statuses.actief"),
    inactief: t("statuses.inactief"),
    verlopen: t("statuses.verlopen"),
    in_onderhandeling: t("statuses.in_onderhandeling"),
    verwijderd: t("statuses.verwijderd"),
  };

  const exportUrl = `/api/admin/sponsors/export?${new URLSearchParams({
    ...(search && { search }),
    ...(niveauFilter !== "all" && { niveau: niveauFilter }),
    ...(statusFilter !== "all" && { status: statusFilter }),
  })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <Link href="/admin/sponsoren/nieuw" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
          {t("addSponsor")}
        </Link>
      </div>

      {stats != null && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
              <p className="text-sm" style={{ color: ADM_MUTED }}>{t("totalActive")}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: ADM_TEXT }}>{stats.activeCount}</p>
            </div>
            <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
              <p className="text-sm" style={{ color: ADM_MUTED }}>{t("totalMonthly")}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: ADM_TEXT }}>{formatCurrency(stats.totalMonthly)}</p>
            </div>
            {(["platinum", "gold", "silver", "bronze"] as const).map((lev) => (
              <div key={lev} className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: LEVEL_COLORS[lev] ?? ADM_BORDER }}>
                <p className="text-sm uppercase font-medium" style={{ color: ADM_MUTED }}>{t(`levels.${lev}`)}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: ADM_TEXT }}>{stats.perLevel[lev] ?? 0}</p>
              </div>
            ))}
          </div>

          {stats.expiringCount > 0 && (
            <div
              className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              style={{ background: "rgba(240,192,80,.15)", borderColor: ADM_YELLOW, color: ADM_TEXT }}
            >
              <p className="text-sm font-medium">
                {t("expiringAlert", { count: stats.expiringCount })}
                {stats.expiringNames.length > 0 && (
                  <span className="block mt-1 text-xs font-normal" style={{ color: ADM_MUTED }}>
                    {stats.expiringNames.join(", ")}
                  </span>
                )}
              </p>
              <Link href="/admin/sponsoren" className="text-sm font-medium shrink-0" style={{ color: ADM_ACCENT }}>
                {tAdmin("dashboard.viewSponsors")}
              </Link>
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-4">
        <input
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        />
        <select
          value={niveauFilter}
          onChange={(e) => { setNiveauFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          {NIVEAU_OPTIONS.filter((n) => n !== "all").map((n) => (
            <option key={n} value={n}>{t(`levels.${n}`)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
        <a href={exportUrl} download="sponsors.csv" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          {t("exportCsv")}
        </a>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("company")}</th>
                <th className="text-left p-3">{t("contact")}</th>
                <th className="text-left p-3">{t("level")}</th>
                <th className="text-left p-3">{t("amountPerMonth")}</th>
                <th className="text-left p-3">{t("contractEnd")}</th>
                <th className="text-left p-3">{t("status")}</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("loading")}</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noResults")}</td></tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t cursor-pointer hover:opacity-90"
                    style={{ borderColor: ADM_BORDER }}
                    onClick={() => router.push(`/admin/sponsoren/${row.id}`)}
                  >
                    <td className="p-3" style={{ color: ADM_TEXT }}>{row.bedrijfsnaam ?? t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {[row.contactpersoon_naam, row.contactpersoon_email].filter(Boolean).join(" · ") || t("noValue")}
                    </td>
                    <td className="p-3">
                      {row.niveau ? (
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            background: `${LEVEL_COLORS[row.niveau.toLowerCase()] ?? ADM_BORDER}40`,
                            color: LEVEL_COLORS[row.niveau.toLowerCase()] ?? ADM_TEXT,
                          }}
                        >
                          {levelLabel(row.niveau)}
                        </span>
                      ) : t("noValue")}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {row.bedrag_per_maand != null ? formatCurrency(Number(row.bedrag_per_maand)) : t("noValue")}
                    </td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(row.contract_eind)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{statusLabel(row.status)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Link href={`/admin/sponsoren/${row.id}`} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{tAdmin("view")}</Link>
                        <button type="button" onClick={() => setDeleteConfirm(row)} className="text-sm font-medium" style={{ color: "#dc2626" }}>{t("delete")}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => !deleting && setDeleteConfirm(null)}>
            <div className="max-w-md w-full rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
              <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</p>
              <div className="flex gap-3">
                <button type="button" disabled={deleting} onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "#dc2626" }}>{deleting ? tAdmin("loading") : t("delete")}</button>
                <button type="button" disabled={deleting} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>{total} {t("title").toLowerCase()}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>←</button>
              <span className="px-3 py-1 text-sm" style={{ color: ADM_TEXT }}>{page} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
