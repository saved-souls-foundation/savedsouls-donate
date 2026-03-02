"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

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
  const [confirmUnsub, setConfirmUnsub] = useState<{ id: string; name: string } | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
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
    const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    setUnsubscribingId(null);
    setConfirmUnsub(null);
    if (res.ok) {
      fetchSubscribers();
      if (activeCount != null) setActiveCount((c) => Math.max(0, c - 1));
    }
  }

  function name(row: SubscriberRow) {
    return [row.voornaam, row.achternaam].filter(Boolean).join(" ").trim() || noVal;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <Link
          href="/admin/nieuwsbrief/versturen"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: ADM_ACCENT }}
        >
          {t("compose")}
        </Link>
      </div>

      {activeCount != null && (
        <p className="text-sm" style={{ color: ADM_MUTED }}>
          {t("totalActive", { count: activeCount })}
        </p>
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

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("name")}</th>
                <th className="text-left p-3">{t("email")}</th>
                <th className="text-left p-3">{t("type")}</th>
                <th className="text-left p-3">{t("language")}</th>
                <th className="text-left p-3">{t("subscribedOn")}</th>
                <th className="text-left p-3">{t("status")}</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center" style={{ color: ADM_MUTED }}>
                    …
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center" style={{ color: ADM_MUTED }}>
                    {t("noResults")}
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {name(r)}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.email ?? noVal}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {typeLabel(r.type)}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {languageLabel(r.language)}
                    </td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>
                      {formatDate(r.aangemeld_op)}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.actief ? t("actief") : t("inactief")}
                    </td>
                    <td className="p-3">
                      {r.actief ? (
                        <button
                          type="button"
                          disabled={unsubscribingId === r.id}
                          onClick={() => setConfirmUnsub({ id: r.id, name: name(r) })}
                          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          {unsubscribingId === r.id ? loadingStr : t("unsubscribeButton")}
                        </button>
                      ) : (
                        noVal
                      )}
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
                style={{ background: "#dc2626" }}
              >
                {t("unsubscribeButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
