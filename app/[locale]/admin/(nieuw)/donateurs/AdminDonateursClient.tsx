"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [onetimeData, setOnetimeData] = useState<OnetimeRow[]>([]);
  const [recurringData, setRecurringData] = useState<RecurringRow[]>([]);
  const [onetimeTotal, setOnetimeTotal] = useState(0);
  const [recurringTotal, setRecurringTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ activeCount: number; totalMonthlyAmount: number; paymentIssuesCount: number } | null>(null);

  const fetchOnetime = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("tab", "onetime");
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const res = await fetch(`/api/admin/donors?${params}`);
    if (!res.ok) {
      setOnetimeData([]);
      setOnetimeTotal(0);
      setLoading(false);
      return;
    }
    const json = await res.json();
    setOnetimeData(json.data ?? []);
    setOnetimeTotal(json.total ?? 0);
    setLoading(false);
  }, [search, country, dateFrom, dateTo, page]);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("tab", "recurring");
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const res = await fetch(`/api/admin/donors?${params}`);
    if (!res.ok) {
      setRecurringData([]);
      setRecurringTotal(0);
      setLoading(false);
      return;
    }
    const json = await res.json();
    setRecurringData(json.data ?? []);
    setRecurringTotal(json.total ?? 0);
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    if (tab === "onetime") fetchOnetime();
    else fetchRecurring();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <Link href="/admin/donateurs/nieuw" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
          {t("addDonor")}
        </Link>
      </div>

      <div className="flex border-b gap-2" style={{ borderColor: ADM_BORDER }}>
        <button type="button" onClick={() => { setTab("onetime"); setPage(1); }} className="px-4 py-2 text-sm font-medium border-b-2 -mb-px" style={{ borderColor: tab === "onetime" ? ADM_ACCENT : "transparent", color: tab === "onetime" ? ADM_ACCENT : ADM_MUTED }}>
          {t("tabOnetime")}
        </button>
        <button type="button" onClick={() => { setTab("recurring"); setPage(1); }} className="px-4 py-2 text-sm font-medium border-b-2 -mb-px" style={{ borderColor: tab === "recurring" ? ADM_ACCENT : "transparent", color: tab === "recurring" ? ADM_ACCENT : ADM_MUTED }}>
          {t("tabRecurring")}
        </button>
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
        <input type="search" placeholder={t("search")} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1 min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
        {tab === "onetime" && (
          <>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
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
                    <tr key={r.id} className="border-t cursor-pointer hover:opacity-90" style={{ borderColor: ADM_BORDER }} onClick={() => router.push(`/admin/donateurs/${r.id}`)}>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{name(r)}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{r.email ?? t("noValue")}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{r.land ?? t("noValue")}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{formatCurrency(r.total_donated)}</td>
                      <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(r.last_donation)}</td>
                      <td className="p-3" style={{ color: ADM_TEXT }}>{r.donation_count}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/admin/donateurs/${r.id}`} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{tAdmin("view")}</Link>
                      </td>
                    </tr>
                  ))
                )
              ) : recurringData.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noResults")}</td></tr>
              ) : (
                recurringData.map((r) => (
                  <tr key={r.recurring_id} className="border-t cursor-pointer hover:opacity-90" style={{ borderColor: ADM_BORDER }} onClick={() => router.push(`/admin/donateurs/${r.id}`)}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{name(r)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{r.email ?? t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{formatCurrency(r.amount, r.valuta)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{freqLabel(r.frequentie)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{statusLabel(r.status)}</td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(r.start_datum)}</td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(r.volgende_betaling_datum)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/donateurs/${r.id}`} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{tAdmin("view")}</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
