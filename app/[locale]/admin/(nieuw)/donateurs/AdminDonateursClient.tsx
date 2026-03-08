"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { EmptyState, StatCard, TableWrapper, Avatar, StatusBadge, QuickActions } from "../components/ui/design-system";
import CsvImportModal from "@/app/components/admin/CsvImportModal";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const PAGE_SIZE = 20;

const COUNTRY_OPTIONS = ["", "NL", "BE", "DE", "FR", "GB", "US", "ES", "IT", "TH", "CH", "AT", "PL"];
const RECURRING_STATUS_OPTIONS = ["all", "actief", "gepauzeerd", "gestopt", "betalingsprobleem"] as const;

type OnetimeRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  land: string | null;
  total_donated: number;
  last_donation: string | null;
  donation_count: number;
};

type RecurringRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  land: string | null;
  recurring_id: string;
  amount: number;
  valuta: string;
  frequentie: string | null;
  status: string;
  start_datum: string | null;
  volgende_betaling_datum: string | null;
};

export default function AdminDonateursClient() {
  const t = useTranslations("admin.donors");
  const tAdmin = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<"onetime" | "recurring">("onetime");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [methodeFilter, setMethodeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [onetimeData, setOnetimeData] = useState<OnetimeRow[]>([]);
  const [recurringData, setRecurringData] = useState<RecurringRow[]>([]);
  const [onetimeTotal, setOnetimeTotal] = useState(0);
  const [recurringTotal, setRecurringTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ activeCount: number; totalMonthlyAmount: number; paymentIssuesCount: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  useEffect(() => {
    if (!toastError) return;
    const tid = setTimeout(() => setToastError(null), 4000);
    return () => clearTimeout(tid);
  }, [toastError]);

  const fetchOnetime = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("tab", "onetime");
      if (search) params.set("search", search);
      if (country) params.set("country", country);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (methodeFilter === "paypal" || methodeFilter === "bank" || methodeFilter === "other") params.set("methode", methodeFilter);
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      const res = await fetch(`/api/admin/donors?${params}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOnetimeData([]);
        setOnetimeTotal(0);
        const msg = (json as { error?: string }).error || "Kon data niet laden";
        setError(msg);
        console.error("[AdminDonateurs] fetchOnetime error:", res.status, msg, json);
        setLoading(false);
        return;
      }
      setOnetimeData(json.data ?? []);
      setOnetimeTotal(json.total ?? 0);
    } catch (err) {
      setOnetimeData([]);
      setOnetimeTotal(0);
      const msg = err instanceof Error ? err.message : "Kon data niet laden (netwerkfout)";
      setError(msg);
      console.error("[AdminDonateurs] fetchOnetime exception:", err);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [search, country, dateFrom, dateTo, methodeFilter, page]);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("tab", "recurring");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      const res = await fetch(`/api/admin/donors?${params}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRecurringData([]);
        setRecurringTotal(0);
        const msg = (json as { error?: string }).error || "Kon data niet laden";
        setError(msg);
        console.error("[AdminDonateurs] fetchRecurring error:", res.status, msg, json);
        setLoading(false);
        return;
      }
      setRecurringData(json.data ?? []);
      setRecurringTotal(json.total ?? 0);
    } catch (err) {
      setRecurringData([]);
      setRecurringTotal(0);
      const msg = err instanceof Error ? err.message : "Kon data niet laden (netwerkfout)";
      setError(msg);
      console.error("[AdminDonateurs] fetchRecurring exception:", err);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    const run = () => {
      if (tab === "onetime") fetchOnetime();
      else fetchRecurring();
    };
    const id = setTimeout(run, 0);
    return () => clearTimeout(id);
  }, [tab, fetchOnetime, fetchRecurring]);

  useEffect(() => {
    if (tab === "recurring") {
      fetch("/api/admin/donors/stats?tab=recurring")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => j && setStats({ activeCount: j.activeCount ?? 0, totalMonthlyAmount: j.totalMonthlyAmount ?? 0, paymentIssuesCount: j.paymentIssuesCount ?? 0 }))
        .catch(() => setStats(null));
    }
  }, [tab]);

  const totalPages = tab === "onetime" ? Math.max(1, Math.ceil(onetimeTotal / PAGE_SIZE)) : Math.max(1, Math.ceil(recurringTotal / PAGE_SIZE));
  const exportUrl = `/api/admin/donors/export?${new URLSearchParams({ ...(search && { search }), ...(country && { country }) })}`;

  function formatDate(d: string | null) {
    if (!d) return t("noValue");
    return locale === "en" ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function formatCurrency(n: number, curr = "EUR") {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "nl-NL", { style: "currency", currency: curr }).format(n);
  }
  function statusLabel(s: string) {
    const key = s as keyof typeof statusKeys;
    return statusKeys[key] ?? s;
  }
  const statusKeys: Record<string, string> = {
    actief: t("statuses.actief"),
    gepauzeerd: t("statuses.gepauzeerd"),
    gestopt: t("statuses.gestopt"),
    betalingsprobleem: t("statuses.betalingsprobleem"),
  };
  function freqLabel(f: string | null) {
    if (!f) return t("noValue");
    const key = f as keyof typeof freqKeys;
    return freqKeys[key] ?? f;
  }
  const freqKeys: Record<string, string> = {
    maandelijks: t("frequencies.maandelijks"),
    kwartaal: t("frequencies.kwartaal"),
    jaarlijks: t("frequencies.jaarlijks"),
  };
  function name(r: { voornaam: string | null; achternaam: string | null }) {
    return [r.voornaam, r.achternaam].filter(Boolean).join(" ").trim() || t("noValue");
  }

  async function handleDelete(donorId: string) {
    setDeleting(true);
    setToastError(null);
    try {
      const res = await fetch(`/api/admin/donors/${donorId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteConfirm(null);
      setOnetimeData((prev) => prev.filter((r) => r.id !== donorId));
      setRecurringData((prev) => prev.filter((r) => r.id !== donorId));
      setOnetimeTotal((prev) => Math.max(0, prev - (onetimeData.some((r) => r.id === donorId) ? 1 : 0)));
      setRecurringTotal((prev) => Math.max(0, prev - (recurringData.some((r) => r.id === donorId) ? 1 : 0)));
    } catch {
      setToastError("Verwijderen mislukt");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
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
          <Link href="/admin/donateurs/nieuw" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
            {t("addDonor")}
          </Link>
        </div>
      </div>
      {csvImportOpen && (
        <CsvImportModal
          title="Donateurs importeren"
          columns={[
            { key: "naam", label: "Naam" },
            { key: "email", label: "E-mail" },
            { key: "bedrag", label: "Bedrag" },
            { key: "datum", label: "Datum" },
            { key: "type", label: "Type (eenmalig/maandelijks)" },
            { key: "land", label: "Land" },
            { key: "notities", label: "Notities" },
          ]}
          exampleCsvContent={`naam,email,bedrag,datum,type,land,notities\n"Jan Jansen",jan@example.com,50,2024-01-15,eenmalig,NL,Donatie\n"Marie Pieters",marie@example.com,25,2024-02-01,maandelijks,BE,Maandelijkse gift`}
          exampleFilename="donateurs-voorbeeld.csv"
          apiEndpoint="/api/admin/donateurs/import"
          onClose={() => setCsvImportOpen(false)}
          onImported={() => { setCsvImportOpen(false); tab === "onetime" ? fetchOnetime() : fetchRecurring(); }}
        />
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            type="button"
            onClick={() => (tab === "onetime" ? fetchOnetime() : fetchRecurring())}
            className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      )}
      {toastError && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-200 bg-red-50 text-red-600">
          {toastError}
        </div>
      )}

      <div className="flex border-b gap-2" style={{ borderColor: ADM_BORDER }}>
        <button type="button" onClick={() => { setTab("onetime"); setPage(1); }} className="px-4 py-2 text-sm font-medium border-b-2 -mb-px" style={{ borderColor: tab === "onetime" ? ADM_ACCENT : "transparent", color: tab === "onetime" ? ADM_ACCENT : ADM_MUTED }}>
          {t("tabOnetime")}
        </button>
        <button type="button" onClick={() => { setTab("recurring"); setPage(1); }} className="px-4 py-2 text-sm font-medium border-b-2 -mb-px" style={{ borderColor: tab === "recurring" ? ADM_ACCENT : "transparent", color: tab === "recurring" ? ADM_ACCENT : ADM_MUTED }}>
          {t("tabRecurring")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="💰"
          label="Totaal donateurs"
          value={tab === "onetime" ? onetimeTotal : recurringTotal}
        />
        <StatCard
          icon="📈"
          label="Totaal opgehaald"
          value={"€" + (tab === "onetime"
            ? onetimeData.reduce((s, d) => s + (Number(d.total_donated) || 0), 0).toLocaleString("nl-NL")
            : recurringData.reduce((s, d) => s + (Number(d.amount) || 0), 0).toLocaleString("nl-NL"))}
          accentColor="green"
        />
        <StatCard
          icon="📅"
          label="Deze maand"
          value={"€" + (tab === "onetime"
            ? onetimeData.filter((d) => {
                const dt = new Date(d.last_donation || d.id);
                const now = new Date();
                return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
              }).reduce((s, d) => s + (Number(d.total_donated) || 0), 0).toLocaleString("nl-NL")
            : recurringData.filter((d) => {
                const dt = new Date(d.start_datum || d.volgende_betaling_datum || "");
                const now = new Date();
                return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
              }).reduce((s, d) => s + (Number(d.amount) || 0), 0).toLocaleString("nl-NL"))}
          sub="lopende maand"
          accentColor="orange"
        />
        <StatCard
          icon="🔄"
          label="Maandelijks"
          value={tab === "recurring" ? recurringData.length : recurringTotal}
          sub="vaste donateurs"
          accentColor="violet"
        />
      </div>

      {tab === "recurring" && stats != null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("totalActiveRecurring")}</p>
            <p className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{stats.activeCount}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("totalMonthlyAmount")}</p>
            <p className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{formatCurrency(stats.totalMonthlyAmount)}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: stats.paymentIssuesCount > 0 ? "#fecaca" : ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("paymentIssues")}</p>
            <p className="text-xl font-semibold" style={{ color: stats.paymentIssuesCount > 0 ? "#dc2626" : ADM_TEXT }}>{stats.paymentIssuesCount}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <input type="search" placeholder={t("search")} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1 min-w-0 sm:min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
        {tab === "onetime" && (
          <>
            <select value={methodeFilter} onChange={(e) => { setMethodeFilter(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} title={t("filterMethod")}>
              <option value="">{t("filterMethodAll")}</option>
              <option value="paypal">{t("filterMethodPaypal")}</option>
              <option value="bank">{t("filterMethodBank")}</option>
              <option value="other">{t("filterMethodOther")}</option>
            </select>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
              <option value="">{t("filterCountry")}</option>
              {COUNTRY_OPTIONS.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
          </>
        )}
        {tab === "recurring" && (
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
            <option value="all">{t("all")}</option>
            {RECURRING_STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
        )}
        <a href={exportUrl} download="donors.csv" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          {t("exportCsv")}
        </a>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        {!loading && !error && (tab === "onetime" ? onetimeData.length === 0 : recurringData.length === 0) ? (
          <EmptyState
            icon="💰"
            title={t("noResults")}
            description={tab === "onetime" ? t("noDonorsOnetime") ?? "Er zijn nog geen eenmalige donaties." : t("noDonorsRecurring") ?? "Er zijn nog geen maandelijkse donateurs."}
            actionLabel={t("addDonor")}
            onAction={() => router.push("/admin/donateurs/nieuw")}
          />
        ) : (
        <TableWrapper>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left p-3">{t("name")}</th>
                <th className="text-left p-3">{t("email")}</th>
                {tab === "onetime" ? (
                  <>
                    <th className="text-left p-3">{t("country")}</th>
                    <th className="text-left p-3">{t("totalDonated")}</th>
                    <th className="text-left p-3">{t("lastDonation")}</th>
                    <th className="text-left p-3">{t("donationCount")}</th>
                  </>
                ) : (
                  <>
                    <th className="text-left p-3">{t("amountPerMonth")}</th>
                    <th className="text-left p-3">{t("frequency")}</th>
                    <th className="text-left p-3">{t("status")}</th>
                    <th className="text-left p-3">{t("startDate")}</th>
                    <th className="text-left p-3">{t("nextPayment")}</th>
                  </>
                )}
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={tab === "onetime" ? 8 : 8} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("loading")}</td></tr>
              ) : tab === "onetime" ? (
                onetimeData.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noResults")}</td></tr>
                ) : (
                  onetimeData.map((r) => (
                    <tr key={r.id} className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100 cursor-pointer" onClick={() => router.push(`/admin/donateurs/${r.id}`)}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={name(r)} size="sm" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{name(r)}</div>
                            <div className="text-xs text-gray-400">{r.email ?? t("noValue")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{r.email ?? t("noValue")}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{r.land ?? t("noValue")}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{formatCurrency(r.total_donated)}</td>
                      <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(r.last_donation)}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{r.donation_count}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <QuickActions
                          actions={[
                            { icon: "👁️", label: tAdmin("view"), onClick: () => router.push(`/admin/donateurs/${r.id}`) },
                            { icon: "🗑️", label: t("delete"), onClick: () => setDeleteConfirm({ id: r.id, name: name(r) }) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )
              ) : recurringData.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noResults")}</td></tr>
              ) : (
                recurringData.map((r) => (
                  <tr key={r.recurring_id} className="group border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100 cursor-pointer last:border-b-0" onClick={() => router.push(`/admin/donateurs/${r.id}`)}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={name(r)} size="sm" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{name(r)}</div>
                          <div className="text-xs text-gray-400">{r.email ?? t("noValue")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{r.email ?? t("noValue")}</td>
                    <td className="p-3 text-gray-900">{formatCurrency(r.amount, r.valuta)}</td>
                    <td className="p-3 text-gray-900">{freqLabel(r.frequentie)}</td>
                    <td className="p-3">
                      <StatusBadge label={statusLabel(r.status)} type={r.status === "actief" ? "success" : r.status === "betalingsprobleem" || r.status === "gestopt" ? "danger" : "gray"} />
                    </td>
                    <td className="p-3 text-gray-500">{formatDate(r.start_datum)}</td>
                    <td className="p-3 text-gray-500">{formatDate(r.volgende_betaling_datum)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <QuickActions
                        actions={[
                          { icon: "👁️", label: tAdmin("view"), onClick: () => router.push(`/admin/donateurs/${r.id}`) },
                          { icon: "🗑️", label: t("delete"), onClick: () => setDeleteConfirm({ id: r.id, name: name(r) }) },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
        )}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => !deleting && setDeleteConfirm(null)}>
            <div className="max-w-md w-full rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
              <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</p>
              <div className="flex gap-3">
                <button type="button" disabled={deleting} onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "#dc2626" }}>{deleting ? tAdmin("loading") : t("delete")}</button>
                <button type="button" disabled={deleting} onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>{tab === "onetime" ? onetimeTotal : recurringTotal} {t("title").toLowerCase()}</span>
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
