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
  status: string;
  taal: string | null;
};

type EmailDetail = EmailRow & { inhoud?: string | null };

type TemplateInfo = { id: string; naam: string | null };
type Stats = { pending: number; sentToday: number; ignored: number };

const cats: Record<string, [string, string, string, string]> = {
  adoptie: ["bg-blue-50", "text-blue-700", "border-blue-200", "🏠 Adoptie"],
  donatie: ["bg-green-50", "text-green-700", "border-green-200", "💰 Donatie"],
  vrijwilliger: ["bg-violet-50", "text-violet-700", "border-violet-200", "🤝 Vrijwilliger"],
  vraag: ["bg-amber-50", "text-amber-700", "border-amber-200", "❓ Vraag"],
  overig: ["bg-gray-50", "text-gray-600", "border-gray-200", "📨 Overig"],
};

function CategoryBadge({ category }: { category: string | null }) {
  const [bg, text, border, label] = cats[category ?? ""] ?? cats.overig;
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}u geleden`;
  return `${Math.floor(hrs / 24)}d geleden`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

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
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [ignoringId, setIgnoringId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [hoverTooltip, setHoverTooltip] = useState<{ row: EmailRow; x: number; y: number } | null>(null);

  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLang, setReplyLang] = useState<"nl" | "en" | "th">("nl");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [replyComposeOpen, setReplyComposeOpen] = useState(false);

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

  useEffect(() => {
    fetch("/api/admin/emails/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setStats(j))
      .catch(() => setStats(null));
  }, []);

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

  const tabCounts = {
    inbox: inboxCount,
    sent: sentCount,
    ignored: ignoredCount,
    all: total,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/emails/verzonden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
            {t("sentEmails")}
          </Link>
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
          <div className="flex border-b border-gray-200 shrink-0">
            {[
              { id: "in_behandeling", label: t("statuses.in_behandeling"), count: tabCounts.inbox },
              { id: "verstuurd", label: "Beantwoord", count: tabCounts.sent },
              { id: "geneigeerd", label: "Geneigeerd", count: tabCounts.ignored },
              { id: "all", label: "Alles", count: tabCounts.all },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id === "all" ? "all" : tab.id);
                  setPage(1);
                }}
                className={`px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  (tab.id === "all" && statusFilter === "all") || statusFilter === tab.id
                    ? "border-[#2aa348] text-[#2aa348]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} {tab.count != null && tab.count > 0 ? `(${tab.count})` : ""}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 p-2 border-b border-gray-100">
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
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">{t("loading")}</div>
            ) : data.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">{t("noResults")}</div>
            ) : (
              data.map((row) => {
                const selected = selectedEmail?.id === row.id;
                const senderName = row.van_naam || row.van_email || t("noValue");
                return (
                  <div
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => fetchEmailDetail(row.id)}
                    onKeyDown={(e) => e.key === "Enter" && fetchEmailDetail(row.id)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selected ? "bg-green-50 border-l-4 border-l-[#2aa348]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={senderName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {senderName}
                          </span>
                          <span className="text-xs text-gray-400 ml-2 shrink-0">
                            {timeAgo(row.ontvangen_op)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate font-medium">
                          {row.onderwerp ?? "—"}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <CategoryBadge category={row.ai_categorie} />
                          {row.status === "in_behandeling" && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-1.5 py-0.5">
                              URGENT
                            </span>
                          )}
                        </div>
                      </div>
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
                  {/* Email header */}
                  <div className="flex items-start gap-3 flex-wrap">
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
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setReplyComposeOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#2aa348] text-white text-xs font-semibold hover:bg-[#166534] min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0"
                      >
                        Beantwoord
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

                  {replyComposeOpen && selectedEmail && (
                    <ComposeEmailModal
                      open={replyComposeOpen}
                      onClose={() => setReplyComposeOpen(false)}
                      onSent={() => {
                        setSentSuccess(true);
                        fetchList();
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

      {totalPages > 1 && (
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
    </div>
  );
}
