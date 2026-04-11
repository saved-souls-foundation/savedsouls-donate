"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { StatCard, TableWrapper, Avatar, StatusBadge, QuickActions, EmptyState } from "../components/ui/design-system";
import { AdminBulkActionBar, AdminBulkSelectAllTh, AdminBulkUndoToast } from "../components/AdminBulkSelection";
import ComposeEmailModal from "../emails/ComposeEmailModal";
import CsvImportModal from "@/app/components/admin/CsvImportModal";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const PAGE_SIZE = 20;

const LANG_OPTIONS = ["all", "nl", "en", "es", "ru", "th", "de", "fr"] as const;

type SubscriberRow = {
  id: string;
  email: string | null;
  voornaam: string | null;
  achternaam: string | null;
  naam?: string | null;
  type: string | null;
  language: string | null;
  actief: boolean;
  aangemeld_op: string | null;
  uitgeschreven_op: string | null;
};

export default function AdminNieuwsbriefClient() {
  const t = useTranslations("admin.newsletter");
  const tAdmin = useTranslations("admin");
  const noVal = tAdmin("noValue");
  const loadingStr = tAdmin("loading");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SubscriberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmUnsub, setConfirmUnsub] = useState<{ id: string; name: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addVoornaam, setAddVoornaam] = useState("");
  const [addAchternaam, setAddAchternaam] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addLanguage, setAddLanguage] = useState<string>("nl");
  const [addType, setAddType] = useState<string>("persoon");
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [testingEmailId, setTestingEmailId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeBcc, setComposeBcc] = useState("");
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [undoOpen, setUndoOpen] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [pendingUndoRows, setPendingUndoRows] = useState<SubscriberRow[] | null>(null);

  useEffect(() => {
    if (!toastError) return;
    const tid = setTimeout(() => setToastError(null), 4000);
    return () => clearTimeout(tid);
  }, [toastError]);

  useEffect(() => {
    if (!toastSuccess) return;
    const tid = setTimeout(() => setToastSuccess(null), 4000);
    return () => clearTimeout(tid);
  }, [toastSuccess]);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (languageFilter !== "all") params.set("language", languageFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const res = await fetch(`/api/admin/newsletter?${params}`);
    if (!res.ok) {
      setData([]);
      setTotal(0);
      setError("Kon data niet laden");
      setLoading(false);
      return;
    }
    const json = await res.json();
    setData(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [search, statusFilter, typeFilter, languageFilter, page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, search, statusFilter, typeFilter, languageFilter]);

  useEffect(() => {
    fetch("/api/admin/newsletter?status=actief&limit=1")
      .then((r) => r.ok ? r.json() : { total: 0 })
      .then((json) => setActiveCount(json.total ?? 0))
      .catch(() => setActiveCount(null));
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const exportUrl = `/api/admin/newsletter/export?${new URLSearchParams({
    ...(search && { search }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
    ...(languageFilter !== "all" && { language: languageFilter }),
  })}`;

  function typeLabel(ty: string | null) {
    if (ty === "persoon") return t("persoon");
    if (ty === "bedrijf") return t("bedrijf");
    return ty ?? noVal;
  }
  function languageLabel(lang: string | null) {
    if (!lang) return noVal;
    const key = lang as keyof typeof langKeys;
    return langKeys[key] ?? lang;
  }
  const langKeys: Record<string, string> = {
    nl: t("languages.nl"),
    en: t("languages.en"),
    es: t("languages.es"),
    ru: t("languages.ru"),
    th: t("languages.th"),
    de: t("languages.de"),
    fr: t("languages.fr"),
  };
  function formatDate(d: string | null) {
    if (!d) return noVal;
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
      : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  async function handleUnsubscribe(id: string) {
    setUnsubscribingId(id);
    setToastError(null);
    const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    setUnsubscribingId(null);
    setConfirmUnsub(null);
    if (res.ok) {
      fetchSubscribers();
      if (activeCount != null) setActiveCount((c) => Math.max(0, (c ?? 0) - 1));
    } else {
      setToastError("Uitschrijven mislukt");
    }
  }

  async function handleDelete(id: string, wasActief: boolean) {
    setDeletingId(id);
    setToastError(null);
    const res = await fetch(`/api/admin/newsletter/${id}/delete`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmDelete(null);
    if (res.ok) {
      fetchSubscribers();
      if (wasActief && activeCount != null) setActiveCount((c) => Math.max(0, (c ?? 0) - 1));
    } else {
      setToastError("Verwijderen mislukt");
    }
  }

  const subscriberPageIds = data.map((r) => r.id);

  function subscriberBulkEmails(): string {
    const emails = data
      .filter((r) => selectedIds.has(r.id) && r.email?.trim())
      .map((r) => r.email!.trim().toLowerCase());
    return [...new Set(emails)].join(", ");
  }

  async function handleBulkDeleteSelected() {
    const rows = data.filter((r) => selectedIds.has(r.id)).map((r) => ({ ...r }));
    if (rows.length === 0) return;
    setBulkDeleting(true);
    setToastError(null);
    try {
      for (const r of rows) {
        const res = await fetch(`/api/admin/newsletter/${r.id}/delete`, { method: "DELETE" });
        if (!res.ok) throw new Error("delete failed");
      }
      setData((prev) => prev.filter((x) => !selectedIds.has(x.id)));
      setTotal((prev) => Math.max(0, prev - rows.length));
      const actiefDel = rows.filter((r) => r.actief).length;
      if (activeCount != null) setActiveCount((c) => Math.max(0, (c ?? 0) - actiefDel));
      setPendingUndoRows(rows);
      setUndoCount(rows.length);
      setUndoOpen(true);
      setSelectedIds(new Set());
      setBulkDeleteConfirm(false);
    } catch {
      setToastError("Verwijderen mislukt");
    } finally {
      setBulkDeleting(false);
    }
  }

  async function handleTestEmail(row: SubscriberRow) {
    const email = row.email?.trim();
    if (!email) {
      setToastError("Geen e-mailadres");
      return;
    }
    setTestingEmailId(row.id);
    setToastError(null);
    setToastSuccess(null);
    try {
      const res = await fetch("/api/admin/nieuwsbrief/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, naam: name(row) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToastError(data?.error ?? "Test e-mail verzenden mislukt");
        return;
      }
      setToastSuccess(`Test e-mail verzonden naar ${email}`);
    } finally {
      setTestingEmailId(null);
    }
  }

  async function handleToggleActief(row: SubscriberRow) {
    const newActief = !row.actief;
    setTogglingId(row.id);
    try {
      const res = await fetch(`/api/admin/newsletter/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actief: newActief }),
      });
      if (res.ok) {
        setData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  actief: newActief,
                  uitgeschreven_op: newActief ? null : (r.uitgeschreven_op ?? new Date().toISOString()),
                }
              : r
          )
        );
        if (activeCount != null) {
          setActiveCount((c) => (newActief ? (c ?? 0) + 1 : Math.max(0, (c ?? 0) - 1)));
        }
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleAddSubscriber() {
    const email = addEmail.trim().toLowerCase();
    if (!email) {
      setAddError("E-mailadres is verplicht.");
      return;
    }
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          voornaam: addVoornaam.trim() || null,
          achternaam: addAchternaam.trim() || null,
          language: addLanguage,
          type: addType === "persoon" || addType === "bedrijf" ? addType : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddError(data?.error === "Dit e-mailadres staat al in de lijst." ? t("emailExistsError") : (data?.error ?? "Opslaan mislukt."));
        return;
      }
      setAddModalOpen(false);
      fetchSubscribers();
      if (activeCount != null) setActiveCount((c) => (c ?? 0) + 1);
    } finally {
      setAddSaving(false);
    }
  }

  function name(row: SubscriberRow) {
    const volledigeNaam = [row.voornaam, row.achternaam].filter(Boolean).join(" ").trim();
    return volledigeNaam || (row.naam ?? noVal);
  }
  function taalVlag(taal: string | null) {
    if (!taal) return "🌐";
    if (["Nederlands", "nl"].includes(taal)) return "🇳🇱";
    if (["Engels", "en", "English"].includes(taal)) return "🇬🇧";
    if (["Thai", "th", "ไทย"].includes(taal)) return "🇹🇭";
    return "🌐";
  }
  function typeIcoon(type: string | null) {
    if (!type) return "?";
    if (["Donor", "donor"].includes(type)) return "💰";
    if (["Vrijwilliger", "vrijwilliger"].includes(type)) return "🤝";
    if (["Adoptant", "adoptant"].includes(type)) return "🏠";
    return "?";
  }
  function statusBadgeType(r: SubscriberRow): "success" | "danger" | "gray" {
    if (r.actief) return "success";
    if (r.uitgeschreven_op) return "danger";
    return "gray";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCsvImportOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            Importeer CSV
          </button>
          <button
            type="button"
            onClick={() => { setAddModalOpen(true); setAddError(null); setAddVoornaam(""); setAddAchternaam(""); setAddEmail(""); setAddLanguage("nl"); setAddType("persoon"); }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: ADM_ACCENT, color: ADM_ACCENT }}
          >
            {t("addSubscriberButton")}
          </button>
          <Link
            href="/admin/nieuwsbrief/sjablonen"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: ADM_ACCENT, color: ADM_ACCENT }}
          >
            {t("sjablonen")}
          </Link>
          <Link
            href="/admin/nieuwsbrief/versturen"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: ADM_ACCENT }}
          >
            {t("compose")}
          </Link>
        </div>
      </div>
      {csvImportOpen && (
        <CsvImportModal
          title="Nieuwsbrief abonnees importeren"
          columns={[
            { key: "naam", label: "Naam" },
            { key: "email", label: "E-mail" },
            { key: "taal", label: "Taal" },
            { key: "datum_aangemeld", label: "Datum aangemeld" },
            { key: "actief", label: "Actief (true/false)" },
          ]}
          exampleCsvContent={`naam,email,taal,datum_aangemeld,actief\n"Jan Jansen",jan@example.com,nl,2024-01-15,true\n"Marie Pieters",marie@example.com,en,2024-02-01,false`}
          exampleFilename="nieuwsbrief-abonnees-voorbeeld.csv"
          apiEndpoint="/api/admin/nieuwsbrief/import"
          onClose={() => setCsvImportOpen(false)}
          onImported={() => { setCsvImportOpen(false); fetchSubscribers(); if (activeCount != null) fetch("/api/admin/newsletter?status=actief&limit=1").then((r) => r.ok ? r.json() : { total: 0 }).then((json) => setActiveCount(json.total ?? 0)); }}
          validateRow={(row) => {
            const email = (row.email ?? "").trim().toLowerCase();
            if (!email) return "E-mail is verplicht";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ongeldig e-mailadres";
            return null;
          }}
        />
      )}

      {activeCount != null && (
        <p className="text-sm" style={{ color: ADM_MUTED }}>
          {t("totalActive", { count: activeCount })}
        </p>
      )}

      {error && (
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
          {error}
        </div>
      )}
      {toastError && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-200 bg-red-50 text-red-600">
          {toastError}
        </div>
      )}
      {toastSuccess && (
        <div className="rounded-lg border px-4 py-3 text-sm border-green-200 bg-green-50 text-green-700">
          {toastSuccess}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="📬"
          label="Actieve abonnees"
          value={data.filter((a) => a.actief || (a as { status?: string; nieuwsbrief?: boolean }).nieuwsbrief === true).length}
        />
        <StatCard
          icon="🇳🇱"
          label="Nederlands"
          value={data.filter((a) => ["Nederlands", "nl"].includes(a.language ?? "")).length}
          accentColor="blue"
        />
        <StatCard
          icon="🇬🇧"
          label="Engels"
          value={data.filter((a) => ["Engels", "en", "English"].includes(a.language ?? "")).length}
          accentColor="orange"
        />
        <StatCard
          icon="📊"
          label="Open rate"
          value="–"
          sub="koppel email tool"
          accentColor="violet"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <input
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-0 sm:min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          <option value="actief">{t("actief")}</option>
          <option value="inactief">{t("inactief")}</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          <option value="persoon">{t("persoon")}</option>
          <option value="bedrijf">{t("bedrijf")}</option>
        </select>
        <select
          value={languageFilter}
          onChange={(e) => { setLanguageFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          {LANG_OPTIONS.filter((l) => l !== "all").map((l) => (
            <option key={l} value={l}>
              {langKeys[l] ?? l}
            </option>
          ))}
        </select>
        <a
          href={exportUrl}
          download="newsletter-subscribers.csv"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          {t("exportCsv")}
        </a>
      </div>

      {selectedIds.size >= 1 ? (
        <AdminBulkActionBar
          selectedCount={selectedIds.size}
          onEmail={() => {
            setComposeBcc(subscriberBulkEmails());
            setComposeOpen(true);
          }}
          onDelete={() => setBulkDeleteConfirm(true)}
          onClear={() => setSelectedIds(new Set())}
        />
      ) : null}

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        {loading ? (
          <div className="p-6 text-center text-gray-500">…</div>
        ) : data.length === 0 ? (
          <EmptyState
            icon="📬"
            title="Geen abonnees gevonden"
            description="Voeg abonnees toe of pas je filter aan"
          />
        ) : (
          <TableWrapper>
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-gray-500">
                  <AdminBulkSelectAllTh pageIds={subscriberPageIds} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                  <th className="text-left p-3">{t("name")}</th>
                  <th className="text-left p-3">{t("email")}</th>
                  <th className="text-left p-3">{t("type")}</th>
                  <th className="text-left p-3">{t("language")}</th>
                  <th className="text-left p-3">{t("subscribedOn")}</th>
                  <th className="text-left p-3">{t("status")}</th>
                  <th className="text-left p-3">Nieuwsbrief</th>
                  <th className="text-left p-3">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr
                    key={r.id}
                    className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100"
                  >
                    <td className="p-3 w-12 min-w-[3rem] align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(r.id)}
                        onChange={() =>
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(r.id)) next.delete(r.id);
                            else next.add(r.id);
                            return next;
                          })
                        }
                        className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#2aa348]"
                        aria-label="Selecteer rij"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={(name(r) || r.email) ?? "–"} size="sm" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {name(r) || "–"}
                          </div>
                          <div className="text-xs text-gray-400">{r.email ?? "–"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{r.email ?? noVal}</td>
                    <td className="p-3 text-gray-900">
                      <span aria-hidden>{typeIcoon(r.type)}</span> {typeLabel(r.type)}
                    </td>
                    <td className="p-3 text-gray-900">
                      <span aria-hidden>{taalVlag(r.language)}</span> {r.language ? languageLabel(r.language) : "–"}
                    </td>
                    <td className="p-3 text-gray-500">{formatDate(r.aangemeld_op)}</td>
                    <td className="p-3">
                      <StatusBadge
                        label={r.actief ? t("actief") : t("inactief")}
                        type={statusBadgeType(r)}
                      />
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={togglingId === r.id}
                        onClick={() => handleToggleActief(r)}
                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: r.actief ? "#22c55e" : "#94a3b8",
                        }}
                        title={r.actief ? t("inactief") : t("actief")}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition mt-0.5 ${
                            r.actief ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <QuickActions
                        actions={[
                          {
                            icon: "📧",
                            label: "Test email",
                            onClick: () => handleTestEmail(r),
                          },
                          {
                            icon: "⛔",
                            label: "Uitschrijven",
                            onClick: () => setConfirmUnsub({ id: r.id, name: name(r) }),
                          },
                          {
                            icon: "🗑️",
                            label: "Verwijderen",
                            onClick: () => setConfirmDelete({ id: r.id, name: name(r) }),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>
              {total} {t("subscribers").toLowerCase()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                ←
              </button>
              <span className="px-3 py-1 text-sm" style={{ color: ADM_TEXT }}>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmUnsub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.4)" }}
        >
          <div className="rounded-xl border p-6 max-w-md w-full shadow-lg" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              {t("unsubscribeConfirm")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmUnsub(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {tAdmin("members.cancel")}
              </button>
              <button
                type="button"
                onClick={() => confirmUnsub && handleUnsubscribe(confirmUnsub.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "#7B1010" }}
              >
                {t("unsubscribeButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.4)" }}
        >
          <div className="rounded-xl border p-6 max-w-md w-full shadow-lg" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              {t("deleteConfirm", { name: confirmDelete.name })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {tAdmin("members.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const row = data.find((d) => d.id === confirmDelete.id);
                  confirmDelete && handleDelete(confirmDelete.id, row?.actief ?? false);
                }}
                disabled={deletingId === confirmDelete.id}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#7B1010" }}
              >
                {deletingId === confirmDelete.id ? loadingStr : "🗑 " + t("deleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.4)" }}
        >
          <div className="rounded-xl border p-6 max-w-md w-full shadow-lg space-y-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <h2 className="text-lg font-semibold" style={{ color: ADM_TEXT }}>
              {t("addSubscriber")}
            </h2>
            {addError && (
              <p className="text-sm" style={{ color: "#7B1010" }}>
                {addError}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("voornaam")}</label>
              <input
                type="text"
                value={addVoornaam}
                onChange={(e) => setAddVoornaam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("achternaam")}</label>
              <input
                type="text"
                value={addAchternaam}
                onChange={(e) => setAddAchternaam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("emailRequired")}</label>
              <input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                placeholder="naam@voorbeeld.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("language")}</label>
              <select
                value={addLanguage}
                onChange={(e) => setAddLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {LANG_OPTIONS.filter((l) => l !== "all").map((l) => (
                  <option key={l} value={l}>{langKeys[l] ?? l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("type")}</label>
              <select
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                <option value="persoon">{t("persoon")}</option>
                <option value="bedrijf">{t("bedrijf")}</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setAddModalOpen(false); setAddError(null); }}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {tAdmin("members.cancel")}
              </button>
              <button
                type="button"
                onClick={handleAddSubscriber}
                disabled={addSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ACCENT }}
              >
                {addSaving ? loadingStr : tAdmin("members.save")}
              </button>
            </div>
          </div>
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
          if (!pendingUndoRows?.length) return;
          const res = await fetch("/api/admin/newsletter/restore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rows: pendingUndoRows.map((r) => ({
                email: r.email,
                voornaam: r.voornaam,
                achternaam: r.achternaam,
                type: r.type,
                language: r.language,
                actief: r.actief,
                aangemeld_op: r.aangemeld_op,
                uitgeschreven_op: r.uitgeschreven_op,
              })),
            }),
          });
          if (res.ok) {
            const actiefRest = pendingUndoRows.filter((r) => r.actief).length;
            if (activeCount != null) setActiveCount((c) => (c ?? 0) + actiefRest);
            await fetchSubscribers();
          }
          setUndoOpen(false);
          setPendingUndoRows(null);
        }}
        onExpired={() => {
          setUndoOpen(false);
          setPendingUndoRows(null);
        }}
      />

      {bulkDeleteConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.4)" }}
          onClick={() => !bulkDeleting && setBulkDeleteConfirm(false)}
        >
          <div
            className="rounded-xl border p-6 max-w-md w-full shadow-lg"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              Weet je zeker dat je {selectedIds.size}{" "}
              {selectedIds.size === 1 ? "abonnee" : "abonnees"} permanent wilt verwijderen?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                disabled={bulkDeleting}
                onClick={() => setBulkDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {tAdmin("members.cancel")}
              </button>
              <button
                type="button"
                disabled={bulkDeleting}
                onClick={() => void handleBulkDeleteSelected()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#7B1010" }}
              >
                {bulkDeleting ? loadingStr : `🗑 ${t("deleteButton")}`}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
