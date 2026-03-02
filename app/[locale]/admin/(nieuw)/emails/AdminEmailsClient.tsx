"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_RED = "#dc2626";
const PAGE_SIZE = 20;

const STATUS_OPTIONS = ["all", "in_behandeling", "verstuurd", "geneigeerd"] as const;
const CATEGORY_OPTIONS = ["all", "adoptie", "vrijwilliger", "donatie", "sponsor", "algemeen"] as const;
const LANG_OPTIONS = ["all", "nl", "en", "es", "ru", "th", "de", "fr"] as const;

type EmailRow = {
  id: string;
  van_email: string | null;
  van_naam: string | null;
  onderwerp: string | null;
  ontvangen_op: string;
  ai_categorie: string | null;
  ai_confidence: number | null;
  ai_suggestie_template_id: string | null;
  ai_gegenereerd_antwoord: string | null;
  status: string;
  taal: string | null;
};

type TemplateInfo = { id: string; naam: string | null };

type Stats = { pending: number; sentToday: number; ignored: number };

export default function AdminEmailsClient() {
  const t = useTranslations("admin.emails");
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<EmailRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [ignoringId, setIgnoringId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [hoverTooltip, setHoverTooltip] = useState<{ row: EmailRow; x: number; y: number } | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (categoryFilter !== "all") params.set("ai_categorie", categoryFilter);
    if (languageFilter !== "all") params.set("taal", languageFilter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/emails?${params}`);
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
  }, [page, statusFilter, categoryFilter, languageFilter, search]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetch("/api/admin/emails/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setStats(j))
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setTemplates(Array.isArray(data) ? data.map((t: { id: string; naam: string | null }) => ({ id: t.id, naam: t.naam })) : []))
      .catch(() => setTemplates([]));
  }, []);

  function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  function templateNaam(templateId: string | null): string {
    if (!templateId) return "";
    return templates.find((t) => t.id === templateId)?.naam ?? templateId;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function formatDate(d: string) {
    return locale === "en" ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function statusLabel(s: string) {
    const key = s as keyof typeof statusKeys;
    return statusKeys[key] ?? s;
  }
  const statusKeys: Record<string, string> = {
    in_behandeling: t("statuses.in_behandeling"),
    verstuurd: t("statuses.verstuurd"),
    geneigeerd: t("statuses.geneigeerd"),
  };
  const categoryKeys: Record<string, string> = {
    adoptie: t("categories.adoptie"),
    vrijwilliger: t("categories.vrijwilliger"),
    donatie: t("categories.donatie"),
    sponsor: t("categories.sponsor"),
    algemeen: t("categories.algemeen"),
  };

  async function handleSendReply(id: string) {
    setSendingId(id);
    try {
      const res = await fetch(`/api/admin/emails/${id}`, { method: "GET" });
      if (!res.ok) throw new Error();
      const email = await res.json();
      const reply = (email.ai_gegenereerd_antwoord as string) ?? "";
      if (!reply.trim()) {
        alert(t("saveError"));
        setSendingId(null);
        return;
      }
      const sendRes = await fetch(`/api/admin/emails/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_text: reply }),
      });
      if (!sendRes.ok) throw new Error();
      fetchList();
      if (stats) setStats({ ...stats, pending: Math.max(0, stats.pending - 1), sentToday: stats.sentToday + 1 });
    } catch {
      alert(t("saveError"));
    } finally {
      setSendingId(null);
    }
  }

  async function handleIgnore(id: string) {
    setIgnoringId(id);
    try {
      const res = await fetch(`/api/admin/emails/${id}/ignore`, { method: "PUT" });
      if (!res.ok) throw new Error();
      fetchList();
      if (stats) setStats({ ...stats, pending: Math.max(0, stats.pending - 1), ignored: stats.ignored + 1 });
    } catch {
      alert(t("saveError"));
    } finally {
      setIgnoringId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{t("title")}</h1>
        <div className="flex gap-4">
          <Link href="/admin/emails/verzonden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("sentEmails")}</Link>
          <Link href="/admin/emails/templates" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("templates")}</Link>
        </div>
      </div>

      {stats != null && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4" style={{ background: stats.pending > 0 ? "rgba(220,38,38,.08)" : ADM_CARD, borderColor: stats.pending > 0 ? ADM_RED : ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("pending")}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: stats.pending > 0 ? ADM_RED : ADM_TEXT }}>{stats.pending}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("sentToday")}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: ADM_TEXT }}>{stats.sentToday}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm" style={{ color: ADM_MUTED }}>{t("ignored")}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: ADM_TEXT }}>{stats.ignored}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <input type="search" placeholder={t("search")} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1 min-w-[200px] max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          <option value="all">{t("all")}</option>
          {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          <option value="all">{t("all")}</option>
          {CATEGORY_OPTIONS.filter((c) => c !== "all").map((c) => (
            <option key={c} value={c}>{categoryKeys[c] ?? c}</option>
          ))}
        </select>
        <select value={languageFilter} onChange={(e) => { setLanguageFilter(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          <option value="all">{t("all")}</option>
          {LANG_OPTIONS.filter((l) => l !== "all").map((l) => (
            <option key={l} value={l}>{l.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("from")}</th>
                <th className="text-left p-3">{t("subject")}</th>
                <th className="text-left p-3">{t("received")}</th>
                <th className="text-left p-3">{t("language")}</th>
                <th className="text-left p-3">{t("aiCategory")}</th>
                <th className="text-left p-3">{t("suggestedTemplate")}</th>
                <th className="text-left p-3">{t("aiConfidence")}</th>
                <th className="text-left p-3">{t("status")}</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("loading")}</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={9} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noResults")}</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-t hover:opacity-90" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {[row.van_naam, row.van_email].filter(Boolean).join(" · ") || t("noValue")}
                    </td>
                    <td className="p-3 max-w-[200px] truncate" style={{ color: ADM_TEXT }} title={row.onderwerp ?? ""}>{row.onderwerp ?? t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{formatDate(row.ontvangen_op)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{(row.taal ?? "").toUpperCase() || t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{row.ai_categorie ? (categoryKeys[row.ai_categorie] ?? row.ai_categorie) : t("noValue")}</td>
                    <td className="p-3 relative">
                      <div
                        className="inline"
                        onMouseEnter={(e) => {
                          if (!row.ai_suggestie_template_id) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoverTooltip({ row, x: rect.left, y: rect.bottom + 4 });
                        }}
                        onMouseLeave={() => setHoverTooltip(null)}
                      >
                        {row.ai_suggestie_template_id ? (
                          <span className="cursor-help underline decoration-dotted" style={{ color: ADM_ACCENT }}>
                            {templateNaam(row.ai_suggestie_template_id) || t("noValue")}
                          </span>
                        ) : (
                          <span style={{ color: ADM_MUTED }}>{t("noValue")}</span>
                        )}
                        {hoverTooltip?.row?.id === row.id && (
                          <div
                            className="fixed z-50 max-w-sm rounded-lg border p-3 text-sm shadow-lg"
                            style={{ left: hoverTooltip.x, top: hoverTooltip.y, background: ADM_CARD, borderColor: ADM_BORDER, color: ADM_TEXT }}
                          >
                            <p className="font-medium">{templateNaam(row.ai_suggestie_template_id)}</p>
                            {row.ai_confidence != null && <p style={{ color: ADM_MUTED }}>{Math.round(Number(row.ai_confidence) * 100)}%</p>}
                            {row.ai_gegenereerd_antwoord && <p className="mt-2 line-clamp-4" style={{ color: ADM_MUTED }}>{stripHtml(row.ai_gegenereerd_antwoord).slice(0, 200)}{stripHtml(row.ai_gegenereerd_antwoord).length > 200 ? "…" : ""}</p>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{row.ai_confidence != null ? `${Math.round(Number(row.ai_confidence) * 100)}%` : t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{statusLabel(row.status)}</td>
                    <td className="p-3">
                      {row.status === "in_behandeling" && (
                        <>
                          <button type="button" onClick={() => handleSendReply(row.id)} disabled={!!sendingId} className="text-sm mr-2" style={{ color: ADM_ACCENT }} title={t("sendReply")}>✅</button>
                          <button type="button" onClick={() => handleIgnore(row.id)} disabled={!!ignoringId} className="text-sm mr-2" style={{ color: ADM_MUTED }} title={t("ignore")}>❌</button>
                        </>
                      )}
                      <button type="button" onClick={() => router.push(`/admin/emails/${row.id}`)} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("view")}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>{total}</span>
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
