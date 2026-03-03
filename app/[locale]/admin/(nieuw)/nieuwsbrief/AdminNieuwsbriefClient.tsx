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
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  useEffect(() => {
    if (!toastError) return;
    const tid = setTimeout(() => setToastError(null), 4000);
    return () => clearTimeout(tid);
  }, [toastError]);

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
    return [row.voornaam, row.achternaam].filter(Boolean).join(" ").trim() || noVal;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <div className="flex items-center gap-2">
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
                <th className="text-left p-3">Nieuwsbrief</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center" style={{ color: ADM_MUTED }}>
                    …
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center" style={{ color: ADM_MUTED }}>
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
                    <td className="p-3 flex flex-wrap items-center gap-2">
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
                      <button
                        type="button"
                        disabled={deletingId === r.id}
                        onClick={() => setConfirmDelete({ id: r.id, name: name(r) })}
                        className="text-sm text-stone-500 hover:text-red-600 disabled:opacity-50"
                        title={t("deleteButton")}
                      >
                        {deletingId === r.id ? loadingStr : "🗑 " + t("deleteButton")}
                      </button>
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
                style={{ background: "#dc2626" }}
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
              <p className="text-sm" style={{ color: "#dc2626" }}>
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
    </div>
  );
}
