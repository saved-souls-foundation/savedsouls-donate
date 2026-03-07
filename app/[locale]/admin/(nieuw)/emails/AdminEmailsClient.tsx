"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { Avatar, EmptyState } from "../components/ui/design-system";
import ComposeEmailModal from "./ComposeEmailModal";

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
  ai_automatisch_verstuurd?: boolean | null;
  status: string;
  taal: string | null;
  bron?: string | null;
  ai_urgency?: string | null;
};

type EmailDetail = EmailRow & { inhoud?: string | null };

type TemplateInfo = { id: string; naam: string | null };
type Stats = { pending: number; sentToday: number; ignored: number };

type AiProcessedRow = {
  id: string;
  van_naam: string | null;
  van_email: string | null;
  onderwerp: string | null;
  ontvangen_op: string;
  inhoud: string | null;
  ai_category: string | null;
  ai_urgency: string | null;
  ai_language: string | null;
  ai_suggested_reply: string | null;
  ai_used_template: boolean | null;
  ai_processed_at: string | null;
};

const cats: Record<string, [string, string, string, string]> = {
  adoptie: ["bg-blue-50", "text-blue-700", "border-blue-200", "🏠 Adoptie"],
  donatie: ["bg-green-50", "text-green-700", "border-green-200", "💰 Donatie"],
  vrijwilliger: ["bg-violet-50", "text-violet-700", "border-violet-200", "🤝 Vrijwilliger"],
  vraag: ["bg-amber-50", "text-amber-700", "border-amber-200", "❓ Vraag"],
  overig: ["bg-gray-50", "text-gray-600", "border-gray-200", "📨 Overig"],
};

const LANGUAGE_FLAGS: Record<string, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  th: "🇹🇭",
  es: "🇪🇸",
  ru: "🇷🇺",
};

/** Fallback: taal uit e-maildomein als taal onbekend is (.nl → nl, .de → de, .com → en, etc.). */
function getLanguageFromEmailDomain(van_email: string | null): string | null {
  if (!van_email || typeof van_email !== "string") return null;
  const domain = van_email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  if (domain.endsWith(".nl")) return "nl";
  if (domain.endsWith(".de")) return "de";
  if (domain.endsWith(".fr")) return "fr";
  if (domain.endsWith(".es")) return "es";
  if (domain.endsWith(".ru")) return "ru";
  if (domain.endsWith(".th")) return "th";
  if (domain.endsWith(".co.uk") || domain.endsWith(".com") || domain.endsWith(".org") || domain.endsWith(".net") || domain.endsWith(".eu")) return "en";
  return null;
}

function getLanguageFlag(taal: string | null, van_email?: string | null): string | null {
  const key = (taal && typeof taal === "string" ? taal : getLanguageFromEmailDomain(van_email ?? null))?.toLowerCase().slice(0, 2);
  if (!key) return null;
  return LANGUAGE_FLAGS[key] ?? null;
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category || category === "overig") return null;
  const [bg, text, border, label] = cats[category] ?? cats.overig;
  return (
    <span
      className={`text-xs font-semibold py-0.5 px-2 rounded-full border ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}

function timeDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return "Zojuist";
  if (mins < 60) return `${mins} min geleden`;
  if (hrs < 24) return `${hrs} uur geleden`;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Gisteren";
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

type AdminEmailsClientProps = { initialEmailId?: string };

export default function AdminEmailsClient({ initialEmailId }: AdminEmailsClientProps = {}) {
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
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [ignoringId, setIgnoringId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [hoverTooltip, setHoverTooltip] = useState<{ row: EmailRow; x: number; y: number } | null>(null);

  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [replyLang, setReplyLang] = useState<"nl" | "en" | "th">("nl");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [replyComposeOpen, setReplyComposeOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [aiProcessedData, setAiProcessedData] = useState<AiProcessedRow[]>([]);
  const [aiProcessedLoading, setAiProcessedLoading] = useState(false);
  const [expandedAiReplyIds, setExpandedAiReplyIds] = useState<Set<string>>(new Set());
  const [expandedOriginalIds, setExpandedOriginalIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!toastError) return;
    const tid = setTimeout(() => setToastError(null), 4000);
    return () => clearTimeout(tid);
  }, [toastError]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      setError("Kon data niet laden");
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

  // Open specifieke email vanaf dashboard-link (/admin/emails?id=xxx)
  useEffect(() => {
    if (!initialEmailId || selectedEmail != null) return;
    fetchEmailDetail(initialEmailId);
  }, [initialEmailId]);

  // STAP 3: log positie Beantwoord-label op mobiel
  useEffect(() => {
    if (!selectedEmail || typeof window === "undefined" || window.innerWidth >= 768) return;
    console.log("[STAP 3] Mobiele email-detail: het groene 'Beantwoord'-label staat in een eigen rij boven de afzendernaam; de berichttekst staat daaronder. Geen overlap.");
  }, [selectedEmail?.id]);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/emails/stats");
    if (res.ok) {
      const j = await res.json();
      setStats(j ?? null);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (statusFilter !== "ai_beantwoord") return;
    setAiProcessedLoading(true);
    fetch("/api/emails/ai-processed", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AiProcessedRow[]) => setAiProcessedData(Array.isArray(data) ? data : []))
      .catch(() => setAiProcessedData([]))
      .finally(() => setAiProcessedLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setTemplates(
          Array.isArray(data) ? data.map((t: { id: string; naam: string | null }) => ({ id: t.id, naam: t.naam })) : []
        )
      )
      .catch(() => setTemplates([]));
  }, []);

  async function fetchEmailDetail(id: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/emails/${id}`);
      if (!res.ok) throw new Error();
      const row = await res.json();
      setSelectedEmail(row);
      setReplyText(row.ai_gegenereerd_antwoord ?? "");
      setAiSuggestion("");
      setSentSuccess(false);
      fetch("/api/admin/emails/mark-read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {});
      router.refresh();
    } finally {
      setDetailLoading(false);
    }
  }

  const inboxCount = stats?.pending ?? 0;
  const sentCount = stats?.sentToday ?? 0;
  const ignoredCount = stats?.ignored ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function formatDate(d: string) {
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(d).toLocaleDateString("nl-NL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
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

  async function handleAiSuggest() {
    if (!selectedEmail) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/email-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedEmail.onderwerp,
          body: selectedEmail.inhoud ?? selectedEmail.ai_gegenereerd_antwoord,
          category: selectedEmail.ai_categorie,
          language: replyLang,
        }),
      });
      const data = await res.json();
      setAiSuggestion(data.suggestion ?? "");
    } catch (e) {
      console.error("AI suggest error:", e);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSendReply(id: string) {
    setSendingId(id);
    setToastError(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}`, { method: "GET" });
      if (!res.ok) throw new Error();
      const email = await res.json();
      const reply = (replyText || email.ai_gegenereerd_antwoord) ?? "";
      if (!reply.trim()) {
        setToastError(t("saveError"));
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
      setSentSuccess(true);
    } catch {
      setToastError(t("saveError"));
    } finally {
      setSendingId(null);
    }
  }

  async function handleIgnore(id: string) {
    setIgnoringId(id);
    setToastError(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}/ignore`, { method: "PUT" });
      if (!res.ok) throw new Error();
      fetchList();
      if (stats) setStats({ ...stats, pending: Math.max(0, stats.pending - 1), ignored: stats.ignored + 1 });
      setSelectedEmail(null);
      setReplyText("");
      setAiSuggestion("");
    } catch {
      setToastError(t("saveError"));
    } finally {
      setIgnoringId(null);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === displayData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayData.map((r) => r.id)));
  }

  async function handleDeleteOne(id: string) {
    if (!confirm("Weet je zeker dat je deze mail wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
    setDeletingIds((prev) => new Set(prev).add(id));
    setToastError(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Verwijderen mislukt");
      }
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
        setReplyText("");
        setAiSuggestion("");
      }
      setData((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      fetchStats();
    } catch (err) {
      setToastError(err instanceof Error ? err.message : "Verwijderen mislukt");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0) return;
    const msg =
      selectedIds.size === 1
        ? "Weet je zeker dat je deze mail wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        : `Weet je zeker dat je ${selectedIds.size} mails wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`;
    if (!confirm(msg)) return;
    setDeletingIds(new Set(selectedIds));
    setToastError(null);
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error ?? "Verwijderen mislukt");
        }
      }
      if (selectedEmail && selectedIds.has(selectedEmail.id)) {
        setSelectedEmail(null);
        setReplyText("");
        setAiSuggestion("");
      }
      const deletedSet = new Set(selectedIds);
      setData((prev) => prev.filter((r) => !deletedSet.has(r.id)));
      setTotal((prev) => Math.max(0, prev - deletedSet.size));
      setSelectedIds(new Set());
      fetchStats();
    } catch (err) {
      setToastError(err instanceof Error ? err.message : "Verwijderen mislukt");
    } finally {
      setDeletingIds(new Set());
    }
  }

  const tabCounts = {
    inbox: inboxCount,
    sent: sentCount,
    ignored: ignoredCount,
    all: total,
  };

  // Beantwoord-tab: alleen beantwoorde (verstuurd) tonen; client-side filter als extra zekerheid
  const displayData =
    statusFilter === "ai_beantwoord"
      ? []
      : statusFilter === "all"
        ? data
        : data.filter((row) => row.status === statusFilter);

  if (statusFilter === "verstuurd") {
    console.log("[Beantwoord-tab] Aantal zichtbare emails (alleen beantwoorde):", displayData.length);
  }

  const isAiBeantwoordTab = statusFilter === "ai_beantwoord";

  function toggleAiReply(id: string) {
    setExpandedAiReplyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleOriginal(id: string) {
    setExpandedOriginalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-[#2aa348] hover:bg-[#166534] transition-colors"
          >
            Nieuwe mail opstellen
          </button>
          <Link href="/admin/emails/templates" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
            {t("templates")}
          </Link>
        </div>
      </div>

      {error && (
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">{error}</div>
      )}
      {toastError && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-200 bg-red-50 text-red-600">
          {toastError}
        </div>
      )}

      {/* Split layout: desktop 38% / 62%, mobile stack */}
      <div className="flex flex-col md:flex-row rounded-xl border overflow-hidden bg-white" style={{ borderColor: ADM_BORDER, minHeight: "70vh" }}>
        {/* LEFT PANEL — Email list */}
        <div
          className={`flex flex-col border-gray-200 bg-white ${selectedEmail ? "hidden md:flex md:w-[38%] border-r" : "w-full md:w-[38%] md:border-r"}`}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200 shrink-0 flex-wrap">
            {[
              { id: "in_behandeling", label: t("statuses.in_behandeling"), count: tabCounts.inbox },
              { id: "verstuurd", label: "Beantwoord", count: tabCounts.sent },
              { id: "ai_beantwoord", label: "🤖 AI Beantwoord", count: null as number | null },
              { id: "geneigeerd", label: "Genegeerd", count: tabCounts.ignored },
              { id: "all", label: "Alles", count: tabCounts.all },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id === "all" ? "all" : tab.id);
                  setPage(1);
                  if (tab.id === "ai_beantwoord") setSelectedEmail(null);
                }}
                className={`px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  (tab.id === "all" && statusFilter === "all") || statusFilter === tab.id
                    ? tab.id === "geneigeerd"
                      ? "border-red-600 text-red-600"
                      : "border-[#2aa348] text-[#2aa348]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} {tab.count != null && tab.count > 0 ? `(${tab.count})` : ""}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 p-2 border-b border-gray-100 items-center">
            {!isAiBeantwoordTab && (
              <>
            <input
              type="search"
              placeholder={t("search")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 min-w-0 max-w-[200px] px-3 py-1.5 rounded-lg border text-sm bg-transparent outline-none"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
            {displayData.length > 0 && (
              <>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === displayData.length && displayData.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                  Selecteer alles
                </label>
                <button
                  type="button"
                  disabled={selectedIds.size === 0 || deletingIds.size > 0}
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingIds.size > 0 ? "Verwijderen…" : `Verwijder geselecteerde${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`}
                </button>
              </>
            )}
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isAiBeantwoordTab ? (
              aiProcessedLoading ? (
                <div className="p-6 text-center text-gray-500 min-h-[60px]">{t("loading")}</div>
              ) : aiProcessedData.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 min-h-[60px]">{t("noResults")}</div>
              ) : (
                aiProcessedData.map((row) => {
                  const sender = row.van_naam || row.van_email || "—";
                  const urgencyHigh = (row.ai_urgency ?? "").toLowerCase() === "hoog";
                  const lang = (row.ai_language ?? "").toUpperCase().slice(0, 2) || "—";
                  const replyOpen = expandedAiReplyIds.has(row.id);
                  const originalOpen = expandedOriginalIds.has(row.id);
                  return (
                    <div
                      key={row.id}
                      className="border-b border-gray-100 p-4 min-h-[60px] flex flex-col gap-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="font-semibold text-sm text-gray-900 break-words">
                          {sender}
                        </div>
                        <div className="text-xs text-gray-500 break-all">{row.van_email ?? "—"}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-800 break-words">{row.onderwerp ?? "—"}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(row.ontvangen_op)}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <CategoryBadge category={row.ai_category} />
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            urgencyHigh ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {urgencyHigh ? "Hoog" : "Normaal"}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                          {lang}
                        </span>
                        {row.ai_used_template && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                            Template gebruikt
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => toggleAiReply(row.id)}
                          className="text-xs font-medium text-[#2aa348] hover:underline py-2 min-h-[44px] flex items-center"
                        >
                          {replyOpen ? "▼ Verberg AI-antwoord" : "▶ Toon AI-antwoord"}
                        </button>
                        {replyOpen && row.ai_suggested_reply && (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-3 mt-1">
                            {stripHtml(row.ai_suggested_reply) || "—"}
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleOriginal(row.id)}
                          className="text-xs font-medium text-gray-600 hover:underline py-2 min-h-[44px] flex items-center"
                        >
                          {originalOpen ? "▼ Verberg originele email" : "▶ Toon originele email"}
                        </button>
                        {originalOpen && (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-3 mt-1">
                            {stripHtml(row.inhoud ?? "") || "—"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            ) : loading ? (
              <div className="p-6 text-center text-gray-500">{t("loading")}</div>
            ) : displayData.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">{t("noResults")}</div>
            ) : (
              displayData.map((row) => {
                const selected = selectedEmail?.id === row.id;
                const senderName = row.van_naam || row.van_email || t("noValue");
                const isRowSelected = selectedIds.has(row.id);
                const isDeleting = deletingIds.has(row.id);
                const langFlag = getLanguageFlag(row.taal, row.van_email);
                const isUrgent = (row.ai_urgency ?? "").toLowerCase() === "hoog";
                return (
                  <div
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => fetchEmailDetail(row.id)}
                    onKeyDown={(e) => e.key === "Enter" && fetchEmailDetail(row.id)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selected ? "bg-green-50 border-l-4 border-l-[#2aa348]" : ""
                    } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isRowSelected}
                        onChange={() => toggleSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded border-gray-300 shrink-0"
                        aria-label="Selecteer mail"
                      />
                      <Avatar name={senderName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-gray-900 truncate min-w-0 flex items-center gap-0.5 flex-1">
                            {senderName}
                            {langFlag && (
                              <span className="text-sm shrink-0" aria-hidden>{langFlag}</span>
                            )}
                            {isUrgent && (
                              <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0 ml-1" aria-label="Urgent" />
                            )}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {timeDisplay(row.ontvangen_op)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate font-medium">
                          {row.onderwerp ?? "—"}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-nowrap overflow-x-auto min-w-0">
                          {row.bron === "aanvraag" && (
                            <span className="text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-full py-0.5 px-2 shrink-0">Aanvraag</span>
                          )}
                          {(row.bron === "inkomend" || row.bron === "resend_webhook") && (
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full py-0.5 px-2 shrink-0">Inkomend</span>
                          )}
                          {row.bron === "line" && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full py-0.5 px-2 shrink-0" title="Line bericht">💬 Line</span>
                          )}
                          {row.ai_automatisch_verstuurd && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full py-0.5 px-2 shrink-0" title="Automatisch beantwoord door AI">🤖 AI</span>
                          )}
                          <CategoryBadge category={row.ai_categorie} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOne(row.id);
                        }}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                        title="Verwijderen"
                        aria-label="Verwijderen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Detail + Reply */}
        <div className={`flex-1 flex flex-col min-w-0 ${selectedEmail ? "flex md:w-[62%]" : "hidden md:flex md:w-[62%]"}`}>
          {selectedEmail ? (
            <>
              {/* Mobile back */}
              <div className="md:hidden flex items-center gap-2 p-3 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  ← Terug
                </button>
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {selectedEmail.onderwerp ?? "—"}
                </span>
              </div>

              {detailLoading ? (
                <div className="p-6 text-center text-gray-500">Laden…</div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  {/* Email header — mobiel: Beantwoord-label boven afzender, dan avatar+info, dan actie-icoontjes; desktop: ongewijzigd */}
                  <div className="md:flex md:items-start md:gap-3 md:flex-wrap">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-0 md:rounded-none md:border-0 md:bg-transparent md:relative md:contents">
                      {/* STAP 3: Beantwoord op mobiel in eigen rij boven afzendernaam, nooit over berichttekst; desktop in flex-rij */}
                      <div className="flex justify-end w-full mb-3 md:mb-0 md:static md:order-2 md:w-auto md:flex md:items-center md:gap-1">
                        <button
                          type="button"
                          onClick={() => setReplyComposeOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#2aa348] text-white text-xs font-semibold hover:bg-[#166534] min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0"
                        >
                          Beantwoord
                        </button>
                      </div>
                      {/* Rij: avatar + naam/onderwerp/datum */}
                      <div className="flex flex-row flex-wrap items-start gap-3 md:flex-1 md:min-w-0">
                        <Avatar
                          name={(selectedEmail.van_naam || selectedEmail.van_email) ?? "—"}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900">
                            {(selectedEmail.van_naam || selectedEmail.van_email) ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">{selectedEmail.van_email ?? "—"}</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {selectedEmail.onderwerp ?? "—"}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {formatDate(selectedEmail.ontvangen_op)}
                            {selectedEmail.ai_automatisch_verstuurd && (
                              <span className="ml-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">🤖 Automatisch beantwoord</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Rij 2 op mobiel: alleen actie-icoontjes; op desktop in dezelfde flex-rij */}
                      <div className="flex items-center gap-1 mt-3 md:order-3">
                        <div className="flex items-center gap-1 md:flex md:items-center md:gap-1">
                          <button
                            type="button"
                            onClick={() => selectedEmail && handleDeleteOne(selectedEmail.id)}
                            disabled={selectedEmail && deletingIds.has(selectedEmail.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                            title="Verwijderen"
                          >
                            🗑️
                          </button>
                          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" title="Urgent">
                            🚨
                          </button>
                          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" title="Koppel dier">
                            🐾
                          </button>
                          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" title="Agenda">
                            📅
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {replyComposeOpen && selectedEmail && (
                    <ComposeEmailModal
                      open={replyComposeOpen}
                      onClose={() => setReplyComposeOpen(false)}
                      onSent={() => {
                        setSentSuccess(true);
                        fetchList();
                        router.refresh();
                      }}
                      initialTo={selectedEmail.van_email ?? ""}
                      initialSubject={`RE: ${selectedEmail.onderwerp ?? "Your message"}`}
                      incomingEmailId={selectedEmail.id}
                    />
                  )}

                  {/* Body */}
                  <div className="rounded-xl border border-gray-200 p-5 bg-white">
                    <div className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {stripHtml(selectedEmail.inhoud ?? selectedEmail.ai_gegenereerd_antwoord ?? "") || "—"}
                    </div>
                  </div>

                  {/* AI Suggestie box */}
                  <div className="rounded-xl border border-[#2aa348]/30 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🤖</span>
                      <span className="text-sm font-bold text-gray-700">AI Suggestie</span>
                      <span className="text-xs text-gray-400">(Claude analyseerde deze email)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-gray-400">Categorie</div>
                        <div className="font-semibold mt-0.5">
                          {selectedEmail.ai_categorie ? categoryKeys[selectedEmail.ai_categorie] ?? selectedEmail.ai_categorie : "–"}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-gray-400">Taal</div>
                        <div className="font-semibold mt-0.5">{selectedEmail.taal ?? "Nederlands"}</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="text-gray-400">Urgentie</div>
                        <div className="font-semibold mt-0.5">🟢 Normaal</div>
                      </div>
                    </div>
                    {aiSuggestion ? (
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                        {aiSuggestion}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAiSuggest}
                        disabled={aiLoading}
                        className="w-full py-2 rounded-lg border-2 border-dashed border-[#2aa348]/40 text-[#2aa348] text-sm font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        {aiLoading ? "⏳ AI denkt na..." : "✨ Genereer AI antwoordsuggestie"}
                      </button>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyText(aiSuggestion)}
                        className="flex-1 py-1.5 rounded-lg bg-[#2aa348] text-white text-xs font-semibold hover:bg-[#166534] transition-colors"
                      >
                        Gebruik suggestie
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiSuggestion("")}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
                      >
                        Negeer
                      </button>
                    </div>
                  </div>

                  {sentSuccess ? (
                    <div className="mt-6 p-8 bg-green-50 border border-green-200 rounded-2xl text-center">
                      <div className="text-5xl mb-3">✅</div>
                      <div className="text-lg font-bold text-green-700">Verzonden!</div>
                      <div className="text-sm text-green-600 mt-2">
                        Verstuurd naar{" "}
                        <span className="font-semibold">
                          {(selectedEmail?.van_naam || selectedEmail?.van_email) ?? "—"}
                        </span>
                      </div>
                      <div className="flex gap-3 justify-center mt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setSentSuccess(false);
                            setSelectedEmail(null);
                            setReplyText("");
                            setAiSuggestion("");
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#2aa348] text-white font-semibold text-sm hover:bg-[#166534]"
                        >
                          Volgende email →
                        </button>
                        <button
                          type="button"
                          onClick={() => setSentSuccess(false)}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                          Nog een antwoord
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                  {/* Reply editor */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Antwoord schrijven</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Taal:</span>
                        {(["nl", "en", "th"] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setReplyLang(lang)}
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              replyLang === lang ? "bg-[#2aa348] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Schrijf je antwoord hier, of gebruik de AI suggestie..."
                      className="w-full h-32 p-3 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                        >
                          📎 Bijlage
                        </button>
                        <button
                          type="button"
                          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                        >
                          📋 Template
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmail(null);
                            setAiSuggestion("");
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
                        >
                          ⛔ Negeer
                        </button>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                        >
                          💾 Concept
                        </button>
                        <button
                          type="button"
                          disabled={!replyText.trim()}
                          onClick={() => handleSendReply(selectedEmail.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#2aa348] text-white text-xs font-semibold hover:bg-[#166534] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          📤 Verstuur
                        </button>
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                icon="📬"
                title="Selecteer een email"
                description="Klik op een email links om te lezen en beantwoorden"
              />
            </div>
          )}
        </div>
      </div>

      {!isAiBeantwoordTab && totalPages > 1 && (
        <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2 rounded-b-xl border border-t-0" style={{ borderColor: ADM_BORDER }}>
          <span className="text-sm" style={{ color: ADM_MUTED }}>
            {total}
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

      {composeOpen && (
        <ComposeEmailModal
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          onSent={() => {
            setComposeOpen(false);
            fetchList();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
