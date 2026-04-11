"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
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

type MemberRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  telefoon: string | null;
  type: string | null;
  bedrijfsnaam: string | null;
  status: string | null;
  lid_sinds: string | null;
  notities: string | null;
  created_at: string | null;
  bijdrage?: number | null;
};

export default function AdminLedenClient() {
  const t = useTranslations("admin.members");
  const tAdmin = useTranslations("admin");
  const noVal = tAdmin("noValue");
  const loadingStr = tAdmin("loading");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<"saved" | "deleted" | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  useEffect(() => {
    if (searchParams.get("saved") === "1") setToast("saved");
    if (searchParams.get("deleted") === "1") setToast("deleted");
  }, [searchParams]);
  useEffect(() => {
    if (!toast) return;
    const tid = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(tid);
  }, [toast]);
  useEffect(() => {
    if (!toastError) return;
    const tid = setTimeout(() => setToastError(null), 4000);
    return () => clearTimeout(tid);
  }, [toastError]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MemberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<MemberRow | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeBcc, setComposeBcc] = useState("");
  const [undoOpen, setUndoOpen] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [pendingUndoRows, setPendingUndoRows] = useState<MemberRow[] | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const res = await fetch(`/api/admin/members?${params}`);
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
  }, [search, statusFilter, typeFilter, page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportUrl = `/api/admin/members/export?${new URLSearchParams({
    ...(search && { search }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  })}`;

  function statusLabel(s: string | null) {
    if (s === "actief") return t("actief");
    if (s === "inactief") return t("inactief");
    if (s === "verwijderd") return t("verwijderd");
    return s ?? noVal;
  }
  function typeLabel(ty: string | null) {
    if (ty === "persoon") return t("persoon");
    if (ty === "bedrijf") return t("bedrijf");
    return ty ?? noVal;
  }
  function typeIcon(ty: string | null) {
    if (ty === "persoon") return "👤";
    if (ty === "bedrijf") return "🏢";
    if (ty === "organisatie" || (ty && ty.toLowerCase() === "organisatie")) return "🏛️";
    return "";
  }
  function statusBadgeType(s: string | null): "success" | "warning" | "danger" | "gray" {
    if (s === "actief" || s === "Actief") return "success";
    if (s === "verlopen" || s === "Verlopen") return "danger";
    if (s === "proef" || s === "Proef") return "warning";
    return "gray";
  }
  function formatDate(d: string | null) {
    if (!d) return noVal;
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
      : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const pageIds = data.map((r) => r.id);

  function selectedMemberEmails(): string {
    const emails = data.filter((r) => selectedIds.has(r.id) && r.email?.trim()).map((r) => r.email!.trim());
    return [...new Set(emails)].join(", ");
  }

  async function restoreMembers(rows: MemberRow[]) {
    for (const r of rows) {
      const voornaam = r.voornaam?.trim() || "—";
      const achternaam = r.achternaam?.trim() || "—";
      const email = r.email?.trim();
      if (!email) continue;
      await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voornaam,
          achternaam,
          email,
          telefoon: r.telefoon ?? null,
          type: r.type === "bedrijf" ? "bedrijf" : "persoon",
          bedrijfsnaam: r.bedrijfsnaam ?? null,
          status: r.status === "inactief" ? "inactief" : "actief",
          lid_sinds: r.lid_sinds ?? undefined,
          notities: r.notities ?? null,
        }),
      });
    }
    await fetchMembers();
  }

  async function handleBulkDelete() {
    const rows = data.filter((r) => selectedIds.has(r.id));
    if (rows.length === 0) return;
    setDeleting(true);
    setToastError(null);
    try {
      for (const row of rows) {
        const res = await fetch(`/api/admin/members/${row.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      }
      setData((prev) => prev.filter((x) => !selectedIds.has(x.id)));
      setTotal((prev) => Math.max(0, prev - rows.length));
      setPendingUndoRows(rows);
      setUndoCount(rows.length);
      setUndoOpen(true);
      setSelectedIds(new Set());
      setBulkDeleteConfirm(false);
    } catch {
      setToastError("Verwijderen mislukt");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDelete(row: MemberRow) {
    setDeleting(true);
    setToastError(null);
    try {
      const res = await fetch(`/api/admin/members/${row.id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.log("[handleDelete] status:", res.status, "body:", body);
        alert(`Status: ${res.status}`);
        throw new Error();
      }
      setDeleteConfirm(null);
      setData((prev) => prev.filter((x) => x.id !== row.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setToast("deleted");
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
        <Link
          href="/admin/leden/nieuw"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: ADM_ACCENT }}
        >
          {t("addMember")}
        </Link>
      </div>

      {error && (
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
          {error}
        </div>
      )}
      {toast && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: ADM_ACCENT,
            background: "rgba(13,148,136,.1)",
            color: ADM_ACCENT,
          }}
        >
          {toast === "saved" ? t("savedToast") : t("deletedToast")}
        </div>
      )}
      {toastError && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-200 bg-red-50 text-red-600">
          {toastError}
        </div>
      )}

      <AdminBulkActionBar
        selectedCount={selectedIds.size}
        onEmail={() => {
          const bcc = selectedMemberEmails();
          if (!bcc) {
            setToastError("Geen geldige e-mailadressen in selectie");
            return;
          }
          setComposeBcc(bcc);
          setComposeOpen(true);
        }}
        onDelete={() => setBulkDeleteConfirm(true)}
        onClear={() => setSelectedIds(new Set())}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Totaal leden" value={data.length} />
        <StatCard
          icon="✅"
          label="Actief"
          value={data.filter((l) => ["actief", "Actief"].includes(l.status ?? "")).length}
          accentColor="green"
        />
        <StatCard
          icon="⚠️"
          label="Verlopen"
          value={data.filter((l) => ["verlopen", "Verlopen"].includes(l.status ?? "")).length}
          accentColor="red"
        />
        <StatCard
          icon="💳"
          label="Omzet/maand"
          value={"€" + data.reduce((sum, l) => sum + (Number(l.bijdrage) || 0), 0).toLocaleString("nl-NL")}
          accentColor="orange"
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
          <option value="all">{t("allStatus")}</option>
          <option value="actief">{t("actief")}</option>
          <option value="inactief">{t("inactief")}</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("allType")}</option>
          <option value="persoon">{t("persoon")}</option>
          <option value="bedrijf">{t("bedrijf")}</option>
        </select>
        <button
          type="button"
          onClick={() => setCsvImportOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          Importeer CSV
        </button>
        <a
          href={exportUrl}
          download="members.csv"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          {t("exportCsv")}
        </a>
      </div>
      {csvImportOpen && (
        <CsvImportModal
          title="Leden importeren"
          columns={[
            { key: "voornaam", label: "Voornaam" },
            { key: "achternaam", label: "Achternaam" },
            { key: "email", label: "E-mail" },
            { key: "telefoon", label: "Telefoon" },
            { key: "geboortedatum", label: "Geboortedatum" },
            { key: "lid_sinds", label: "Lid sinds" },
            { key: "notities", label: "Notities" },
          ]}
          exampleCsvContent={`voornaam,achternaam,email,telefoon,geboortedatum,lid_sinds,notities\nJan,Jansen,jan@example.com,0612345678,1985-03-15,2024-01-01,Lid sinds 2024\nMarie,Pieters,marie@example.com,,,2024-06-01,`}
          exampleFilename="leden-voorbeeld.csv"
          apiEndpoint="/api/admin/members/import"
          requiredKeys={["voornaam", "achternaam", "email"]}
          onClose={() => setCsvImportOpen(false)}
          onImported={() => { setCsvImportOpen(false); fetchMembers(); }}
          validateRow={(row) => {
            const voornaam = (row.voornaam ?? "").trim();
            const achternaam = (row.achternaam ?? "").trim();
            const email = (row.email ?? "").trim().toLowerCase();
            if (!email) return "E-mail is verplicht";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ongeldig e-mailadres";
            if (!voornaam) return "Voornaam is verplicht";
            if (!achternaam) return "Achternaam is verplicht";
            return null;
          }}
        />
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        {loading ? (
          <div className="p-6 text-center text-gray-500">{loadingStr}</div>
        ) : data.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Geen leden gevonden"
            description="Voeg een lid toe of pas je zoekopdracht of filters aan."
            actionLabel={t("addMember")}
            onAction={() => router.push("/admin/leden/nieuw")}
          />
        ) : (
          <TableWrapper>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-500">
                  <AdminBulkSelectAllTh pageIds={pageIds} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                  <th className="text-left p-3">{t("name")}</th>
                  <th className="text-left p-3">{t("email")}</th>
                  <th className="text-left p-3">{t("type")}</th>
                  <th className="text-left p-3">{t("status")}</th>
                  <th className="text-left p-3">{t("memberSince")}</th>
                  <th className="text-left p-3">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => {
                  const naam = [r.voornaam, r.achternaam].filter(Boolean).join(" ") || noVal;
                  return (
                    <tr
                      key={r.id}
                      className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
                      onClick={() => router.push(`/admin/leden/${r.id}`)}
                    >
                      <td className="p-3 w-12 min-w-[3rem] align-middle" onClick={(e) => e.stopPropagation()}>
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
                          <Avatar name={naam} size="sm" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{naam}</div>
                            <div className="text-xs text-gray-400">{r.email ?? noVal}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{r.email ?? noVal}</td>
                      <td className="p-3 text-gray-900">
                        {typeIcon(r.type) ? (
                          <span><span aria-hidden>{typeIcon(r.type)}</span> {typeLabel(r.type)}</span>
                        ) : (
                          typeLabel(r.type)
                        )}
                      </td>
                      <td className="p-3">
                        <StatusBadge label={statusLabel(r.status)} type={statusBadgeType(r.status)} />
                      </td>
                      <td className="p-3 text-gray-500">{formatDate(r.lid_sinds)}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <QuickActions
                          actions={[
                            { icon: "📧", label: "Email", onClick: () => router.push(`/admin/leden/${r.id}`) },
                            { icon: "🔄", label: "Verlengen", onClick: () => router.push(`/admin/leden/${r.id}`) },
                            { icon: "📄", label: "Factuur", onClick: () => router.push(`/admin/leden/${r.id}`) },
                            { icon: "🗑️", label: "Verwijderen", onClick: () => setDeleteConfirm(r) },
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
        {bulkDeleteConfirm && (
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
                Weet je zeker dat je {selectedIds.size} lid{selectedIds.size === 1 ? "" : "en"} wilt verwijderen? Dit kan niet ongedaan worden gemaakt na 10 seconden.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void handleBulkDelete()}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: "#7B1010" }}
                >
                  {deleting ? loadingStr : t("delete")}
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
        )}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,.6)" }}
            onClick={() => !deleting && setDeleteConfirm(null)}
          >
            <div
              className="max-w-md w-full rounded-xl border p-6"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: "#7B1010" }}
                >
                  {deleting ? loadingStr : t("delete")}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>
              {total} {t("title").toLowerCase()}
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

      {composeOpen && (
        <ComposeEmailModal
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          onSent={() => {
            setComposeOpen(false);
            setSelectedIds(new Set());
          }}
          initialBcc={composeBcc}
          initialSubject=""
        />
      )}

      <AdminBulkUndoToast
        open={undoOpen}
        deletedCount={undoCount}
        onUndo={async () => {
          if (pendingUndoRows?.length) await restoreMembers(pendingUndoRows);
          setUndoOpen(false);
          setPendingUndoRows(null);
        }}
        onExpired={() => {
          setUndoOpen(false);
          setPendingUndoRows(null);
        }}
      />
    </div>
  );
}
