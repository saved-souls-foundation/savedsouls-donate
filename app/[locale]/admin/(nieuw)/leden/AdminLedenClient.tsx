"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

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
  const [toast, setToast] = useState<"saved" | "deleted" | null>(null);
  useEffect(() => {
    if (searchParams.get("saved") === "1") setToast("saved");
    if (searchParams.get("deleted") === "1") setToast("deleted");
  }, [searchParams]);
  useEffect(() => {
    if (!toast) return;
    const tid = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(tid);
  }, [toast]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MemberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
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
  function formatDate(d: string | null) {
    if (!d) return noVal;
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
      : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
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

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <input
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
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
        <a
          href={exportUrl}
          download="members.csv"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
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
                <th className="text-left p-3">{t("type")}</th>
                <th className="text-left p-3">{t("status")}</th>
                <th className="text-left p-3">{t("memberSince")}</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center" style={{ color: ADM_MUTED }}>
                    {loadingStr}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center" style={{ color: ADM_MUTED }}>
                    {t("noResults")}
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t cursor-pointer hover:opacity-90"
                    style={{ borderColor: ADM_BORDER }}
                    onClick={() => router.push(`/admin/leden/${r.id}`)}
                  >
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {[r.voornaam, r.achternaam].filter(Boolean).join(" ") || noVal}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.email ?? noVal}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {typeLabel(r.type)}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {statusLabel(r.status)}
                    </td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>
                      {formatDate(r.lid_sinds)}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/leden/${r.id}`} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
                        {tAdmin("view")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
