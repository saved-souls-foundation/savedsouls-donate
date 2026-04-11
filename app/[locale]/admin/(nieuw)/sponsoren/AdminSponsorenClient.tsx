"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { StatCard, TableWrapper, Avatar, QuickActions, EmptyState } from "../components/ui/design-system";
import { AdminBulkActionBar, AdminBulkSelectAllTh, AdminBulkUndoToast } from "../components/AdminBulkSelection";
import ComposeEmailModal from "../emails/ComposeEmailModal";
import CsvImportModal from "@/app/components/admin/CsvImportModal";

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

type SponsorLead = {
  id: string;
  animal_id: string;
  animal_name: string;
  animal_type: string;
  donor_name: string;
  donor_email: string;
  message: string | null;
  locale: string | null;
  created_at: string;
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
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<Set<string>>(new Set());
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeBcc, setComposeBcc] = useState("");
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkLeadDeleteConfirm, setBulkLeadDeleteConfirm] = useState(false);
  const [undoOpen, setUndoOpen] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [pendingUndoSponsors, setPendingUndoSponsors] = useState<SponsorRow[] | null>(null);
  const [pendingUndoLeads, setPendingUndoLeads] = useState<SponsorLead[] | null>(null);

  const [activeTab, setActiveTab] = useState<"bedrijven" | "dieren">("bedrijven");
  const [leads, setLeads] = useState<SponsorLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "dieren") return;
    setLeadsLoading(true);
    fetch("/api/admin/sponsor-leads")
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((j) => setLeads(j.data ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, [activeTab]);

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
    setSelectedSponsorIds(new Set());
  }, [page, search, niveauFilter, statusFilter]);

  useEffect(() => {
    setSelectedLeadIds(new Set());
  }, [activeTab]);

  useEffect(() => {
    setBulkDeleteConfirm(false);
    setBulkLeadDeleteConfirm(false);
  }, [activeTab]);

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

  const sponsorPageIds = data.map((r) => r.id);
  const leadPageIds = leads.map((l) => l.id);

  function sponsorBulkEmails(): string {
    const emails = data.filter((r) => selectedSponsorIds.has(r.id) && r.contactpersoon_email?.trim()).map((r) => r.contactpersoon_email!.trim());
    return [...new Set(emails)].join(", ");
  }

  function leadBulkEmails(): string {
    const emails = leads.filter((l) => selectedLeadIds.has(l.id) && l.donor_email?.trim()).map((l) => l.donor_email.trim());
    return [...new Set(emails)].join(", ");
  }

  async function restoreSponsors(rows: SponsorRow[]) {
    for (const row of rows) {
      const status = row.status && row.status !== "verwijderd" ? row.status : "actief";
      await fetch(`/api/admin/sponsors/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedrijfsnaam: row.bedrijfsnaam ?? "",
          contactpersoon_naam: row.contactpersoon_naam ?? "",
          contactpersoon_email: row.contactpersoon_email ?? "",
          contactpersoon_telefoon: null,
          website: row.website ?? null,
          niveau: (row.niveau?.toLowerCase() as "platinum" | "gold" | "silver" | "bronze") || "bronze",
          bedrag_per_maand: row.bedrag_per_maand ?? null,
          bijdrage_type: row.bijdrage_type ?? "geld",
          omschrijving: null,
          contract_start: row.contract_start,
          contract_eind: row.contract_eind,
          status,
          notities: null,
        }),
      });
    }
    await fetchList();
  }

  async function handleBulkDeleteSponsors() {
    const rows = data.filter((r) => selectedSponsorIds.has(r.id)).map((r) => ({ ...r }));
    if (rows.length === 0) return;
    setDeleting(true);
    try {
      for (const row of rows) {
        const res = await fetch(`/api/admin/sponsors/${row.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      }
      setData((prev) => prev.filter((x) => !selectedSponsorIds.has(x.id)));
      setTotal((prev) => Math.max(0, prev - rows.length));
      setPendingUndoSponsors(rows);
      setPendingUndoLeads(null);
      setUndoCount(rows.length);
      setUndoOpen(true);
      setSelectedSponsorIds(new Set());
      setBulkDeleteConfirm(false);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  async function restoreLeads(rows: SponsorLead[]) {
    const res = await fetch("/api/admin/sponsoren/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads: rows }),
    });
    if (!res.ok) return;
    const r = await fetch("/api/admin/sponsor-leads");
    if (!r.ok) return;
    const j = (await r.json()) as { data?: SponsorLead[] };
    setLeads(j.data ?? []);
  }

  async function handleBulkDeleteLeads() {
    const rows = leads.filter((l) => selectedLeadIds.has(l.id)).map((l) => ({ ...l }));
    if (rows.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/sponsoren/leads/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: rows.map((r) => r.id) }),
      });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((l) => !selectedLeadIds.has(l.id)));
      setPendingUndoLeads(rows);
      setPendingUndoSponsors(null);
      setUndoCount(rows.length);
      setUndoOpen(true);
      setSelectedLeadIds(new Set());
      setBulkLeadDeleteConfirm(false);
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
  function niveauStijl(niveau: string | null) {
    const n = (niveau || "").toLowerCase();
    if (n === "platinum") return "bg-gray-100 text-gray-700 border-gray-300";
    if (n === "gold") return "bg-amber-50 text-amber-700 border-amber-300";
    if (n === "silver") return "bg-slate-50 text-slate-600 border-slate-300";
    if (n === "bronze") return "bg-orange-50 text-orange-700 border-orange-300";
    return "bg-gray-50 text-gray-500 border-gray-200";
  }
  function contractKleur(datum: string | null) {
    if (!datum) return "text-gray-400";
    const dagen = Math.floor(
      (new Date(datum).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (dagen < 0) return "text-red-600 font-semibold";
    if (dagen < 30) return "text-red-600 font-semibold";
    if (dagen < 90) return "text-amber-600 font-medium";
    return "text-gray-600";
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
      <div className="flex flex-wrap gap-2 border-b mb-4 mt-2"
        style={{ borderColor: ADM_BORDER }}>
        <button
          type="button"
          onClick={() => setActiveTab("bedrijven")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "bedrijven"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🏢 Bedrijfssponsoren
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dieren")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "dieren"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🐾 Dier sponsors
        </button>
      </div>
      {(activeTab === "bedrijven" ? selectedSponsorIds.size : selectedLeadIds.size) >= 1 ? (
        <AdminBulkActionBar
          selectedCount={activeTab === "bedrijven" ? selectedSponsorIds.size : selectedLeadIds.size}
          onEmail={() => {
            const bcc = activeTab === "bedrijven" ? sponsorBulkEmails() : leadBulkEmails();
            setComposeBcc(bcc);
            setComposeOpen(true);
          }}
          onDelete={() => {
            if (activeTab === "bedrijven") setBulkDeleteConfirm(true);
            else setBulkLeadDeleteConfirm(true);
          }}
          onClear={() =>
            activeTab === "bedrijven" ? setSelectedSponsorIds(new Set()) : setSelectedLeadIds(new Set())
          }
        />
      ) : null}
      {activeTab === "bedrijven" && (
        <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCsvImportOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            Importeer CSV
          </button>
          <Link href="/admin/sponsoren/nieuw" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
            {t("addSponsor")}
          </Link>
        </div>
      </div>
      {csvImportOpen && (
        <CsvImportModal
          title="Sponsoren importeren"
          columns={[
            { key: "naam", label: "Naam" },
            { key: "email", label: "E-mail" },
            { key: "bedrag", label: "Bedrag" },
            { key: "startdatum", label: "Startdatum" },
            { key: "einddatum", label: "Einddatum" },
            { key: "pakket", label: "Pakket" },
            { key: "notities", label: "Notities" },
          ]}
          exampleCsvContent={`naam,email,bedrag,startdatum,einddatum,pakket,notities\n"Bedrijf BV",contact@bedrijf.nl,500,2024-01-01,2025-12-31,gold,Sponsor overeenkomst`}
          exampleFilename="sponsoren-voorbeeld.csv"
          apiEndpoint="/api/admin/sponsoren/import"
          onClose={() => setCsvImportOpen(false)}
          onImported={() => { setCsvImportOpen(false); fetchList(); }}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="🏢"
          label="Actieve sponsoren"
          value={data.filter((s) => s.status === "actief" || s.status === "Actief").length}
        />
        <StatCard
          icon="💶"
          label="Totaal/maand"
          value={"€" + data.reduce((s, sp) => s + (Number(sp.bedrag_per_maand) || 0), 0).toLocaleString("nl-NL")}
          accentColor="green"
        />
        <StatCard
          icon="🥇"
          label="Gold+"
          value={data.filter((s) => ["platinum", "gold", "Platinum", "Gold"].includes(s.niveau ?? "")).length}
          accentColor="amber"
        />
        <StatCard
          icon="⚠️"
          label="Contract verloopt"
          value={data.filter((s) => {
            const end = s.contract_eind;
            if (!end) return false;
            const d = new Date(end);
            const now = new Date();
            const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return diff < 90 && diff > 0;
          }).length}
          sub="binnen 90 dagen"
          accentColor="red"
        />
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
          className="flex-1 min-w-0 sm:min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
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
        {loading ? (
          <div className="p-6 text-center text-gray-500">{t("loading")}</div>
        ) : data.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="Geen sponsoren gevonden"
            description="Voeg een sponsor toe om te beginnen"
            actionLabel="+ Sponsor toevoegen"
            onAction={() => router.push("/admin/sponsoren/nieuw")}
          />
        ) : (
          <TableWrapper>
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-gray-500">
                  <AdminBulkSelectAllTh
                    pageIds={sponsorPageIds}
                    selectedIds={selectedSponsorIds}
                    setSelectedIds={setSelectedSponsorIds}
                  />
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
                {data.map((row) => {
                  const bedrijfNaam = row.bedrijfsnaam ?? "–";
                  const contact = row.contactpersoon_naam ?? row.contactpersoon_email ?? "–";
                  return (
                    <tr
                      key={row.id}
                      className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
                      onClick={() => router.push(`/admin/sponsoren/${row.id}`)}
                    >
                      <td className="p-3 w-12 min-w-[3rem] align-middle" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedSponsorIds.has(row.id)}
                          onChange={() =>
                            setSelectedSponsorIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(row.id)) next.delete(row.id);
                              else next.add(row.id);
                              return next;
                            })
                          }
                          className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#2aa348]"
                          aria-label="Selecteer rij"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={bedrijfNaam} size="sm" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {row.bedrijfsnaam ?? "–"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {contact}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {[row.contactpersoon_naam, row.contactpersoon_email].filter(Boolean).join(" · ") || t("noValue")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${niveauStijl(row.niveau)}`}
                        >
                          {row.niveau ? levelLabel(row.niveau) : "–"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-semibold text-[#2aa348]">
                          €{Number(row.bedrag_per_maand ?? 0).toLocaleString("nl-NL")}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-sm ${contractKleur(row.contract_eind)}`}>
                          {row.contract_eind
                            ? new Date(row.contract_eind).toLocaleDateString("nl-NL")
                            : "–"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-900">{statusLabel(row.status)}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <QuickActions
                          actions={[
                            { icon: "📧", label: "Email", onClick: () => router.push(`/admin/sponsoren/${row.id}`) },
                            { icon: "📄", label: "Contract", onClick: () => router.push(`/admin/sponsoren/${row.id}`) },
                            { icon: "🔄", label: "Verlengen", onClick: () => router.push(`/admin/sponsoren/${row.id}`) },
                            { icon: "🗑️", label: "Verwijderen", onClick: () => setDeleteConfirm(row) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        )}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => !deleting && setDeleteConfirm(null)}>
            <div className="max-w-md w-full rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
              <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</p>
              <div className="flex gap-3">
                <button type="button" disabled={deleting} onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "#7B1010" }}>{deleting ? tAdmin("loading") : t("delete")}</button>
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
        </>
      )}
      {activeTab === "dieren" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${ADM_BORDER}` }}>
                <AdminBulkSelectAllTh
                  pageIds={leadPageIds}
                  selectedIds={selectedLeadIds}
                  setSelectedIds={setSelectedLeadIds}
                  className="px-4 py-3 align-top text-left w-[min(12rem,32vw)] min-w-[8.5rem]"
                />
                <th className="px-4 py-3 text-left font-medium" style={{ color: ADM_MUTED }}>Naam</th>
                <th className="px-4 py-3 text-left font-medium" style={{ color: ADM_MUTED }}>E-mail</th>
                <th className="px-4 py-3 text-left font-medium" style={{ color: ADM_MUTED }}>Dier</th>
                <th className="px-4 py-3 text-left font-medium" style={{ color: ADM_MUTED }}>Type</th>
                <th className="px-4 py-3 text-left font-medium" style={{ color: ADM_MUTED }}>Datum</th>
              </tr>
            </thead>
            <tbody>
              {leadsLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: ADM_MUTED }}>
                    Laden...
                  </td>
                </tr>
              )}
              {!leadsLoading && leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: ADM_MUTED }}>
                    Geen dier sponsors gevonden
                  </td>
                </tr>
              )}
              {!leadsLoading && leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: `1px solid ${ADM_BORDER}` }}>
                  <td className="px-4 py-3 w-12 min-w-[3rem] align-middle">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.has(lead.id)}
                      onChange={() =>
                        setSelectedLeadIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(lead.id)) next.delete(lead.id);
                          else next.add(lead.id);
                          return next;
                        })
                      }
                      className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#2aa348]"
                      aria-label="Selecteer rij"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: ADM_TEXT }}>
                    {lead.donor_name}
                  </td>
                  <td className="px-4 py-3" style={{ color: ADM_MUTED }}>
                    {lead.donor_email}
                  </td>
                  <td className="px-4 py-3" style={{ color: ADM_TEXT }}>
                    {lead.animal_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: lead.animal_type === "dog" ? "#e8f5ec" : "#e8f0fe",
                        color: lead.animal_type === "dog" ? "#1a5c2e" : "#3730a3"
                      }}>
                      {lead.animal_type === "dog" ? "🐕 Hond" : "🐈 Kat"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: ADM_MUTED }}>
                    {new Date(lead.created_at).toLocaleDateString("nl-NL", {
                      day: "2-digit", month: "2-digit", year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ComposeEmailModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSent={() => setComposeOpen(false)}
        initialBcc={composeBcc}
      />
      <AdminBulkUndoToast
        open={undoOpen}
        deletedCount={undoCount}
        onUndo={async () => {
          if (pendingUndoSponsors?.length) await restoreSponsors(pendingUndoSponsors);
          if (pendingUndoLeads?.length) await restoreLeads(pendingUndoLeads);
          setUndoOpen(false);
          setPendingUndoSponsors(null);
          setPendingUndoLeads(null);
        }}
        onExpired={() => {
          setUndoOpen(false);
          setPendingUndoSponsors(null);
          setPendingUndoLeads(null);
        }}
      />
      {bulkDeleteConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => !deleting && setBulkDeleteConfirm(false)}
        >
          <div
            className="max-w-md w-full rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              Weet je zeker dat je {selectedSponsorIds.size}{" "}
              {selectedSponsorIds.size === 1 ? "sponsor" : "sponsoren"} wilt verwijderen? Ze worden als verwijderd gemarkeerd.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleBulkDeleteSponsors()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#7B1010" }}
              >
                {deleting ? tAdmin("loading") : t("delete")}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setBulkDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {bulkLeadDeleteConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => !deleting && setBulkLeadDeleteConfirm(false)}
        >
          <div
            className="max-w-md w-full rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              Weet je zeker dat je {selectedLeadIds.size}{" "}
              {selectedLeadIds.size === 1 ? "dier sponsor lead" : "dier sponsor leads"} wilt verwijderen?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleBulkDeleteLeads()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#7B1010" }}
              >
                {deleting ? tAdmin("loading") : t("delete")}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setBulkLeadDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
