"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

const LANGUAGES = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

const TiptapEditor = dynamic(() => import("@/app/components/admin/TiptapEditor"), { ssr: false });

type Counts = { total: number; byLanguage: Record<string, number> };

type NewsletterTemplate = {
  id: string;
  titel: string;
  subject_nl: string;
  subject_en: string;
  body_nl: string;
  body_en: string;
};

type NewsletterDraft = {
  id: string;
  titel: string | null;
  subject_nl: string | null;
  subject_en: string | null;
  aangemaakt_op: string | null;
  scheduled_at: string | null;
  verstuurd_op: string | null;
};

export default function AdminNieuwsbriefVersturenClient() {
  const t = useTranslations("admin.newsletter");
  const tAdmin = useTranslations("admin");
  const noVal = tAdmin("noValue");
  const loadingStr = tAdmin("loading");
  const [activeTab, setActiveTab] = useState<(typeof LANGUAGES)[number]>("nl");
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [counts, setCounts] = useState<Counts | null>(null);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<number | null>(null);
  const [sendError, setSendError] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [previewLang, setPreviewLang] = useState<(typeof LANGUAGES)[number] | null>(null);
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [drafts, setDrafts] = useState<NewsletterDraft[]>([]);
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    const res = await fetch("/api/admin/newsletter/drafts");
    if (res.ok) {
      const json = await res.json();
      setDrafts(json.drafts ?? []);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  async function handleDeleteDraft(id: string) {
    if (!confirm("Weet je zeker dat je deze nieuwsbrief-draft wilt verwijderen?")) return;
    setDeletingDraftId(id);
    try {
      const res = await fetch(`/api/admin/newsletter/drafts/${id}`, { method: "DELETE" });
      if (res.ok) await fetchDrafts();
      else alert("Verwijderen mislukt.");
    } finally {
      setDeletingDraftId(null);
    }
  }

  const fetchCounts = useCallback(async () => {
    const res = await fetch("/api/admin/newsletter/count");
    if (res.ok) {
      const json = await res.json();
      setCounts({ total: json.total ?? 0, byLanguage: json.byLanguage ?? {} });
    } else {
      setCounts(null);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/newsletter/templates");
      if (res.ok) {
        const json = await res.json();
        setTemplates(json.templates ?? []);
      }
    })();
  }, []);

  function loadTemplate(template: NewsletterTemplate) {
    setSubject("nl", template.subject_nl);
    setSubject("en", template.subject_en);
    setBody("nl", template.body_nl);
    setBody("en", template.body_en);
  }

  const setSubject = (lang: string, v: string) => setSubjects((s) => ({ ...s, [lang]: v }));
  const setBody = (lang: string, v: string) => setBodies((b) => ({ ...b, [lang]: v }));

  const payload = () => {
    const p: Record<string, string> = {};
    for (const lang of LANGUAGES) {
      p[`subject_${lang}`] = subjects[lang] ?? "";
      p[`body_${lang}`] = bodies[lang] ?? "";
    }
    return p;
  };

  async function handleSend() {
    setSending(true);
    setSendError(false);
    setSendSuccess(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setSendSuccess(json.total_sent ?? 0);
        setConfirmSend(false);
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  async function handleSchedule() {
    if (!scheduledAt.trim()) return;
    setScheduling(true);
    setScheduleSuccess(false);
    try {
      const res = await fetch("/api/admin/newsletter/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload(),
          scheduled_at: new Date(scheduledAt).toISOString(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.draft) {
        setScheduleSuccess(true);
        setScheduledAt("");
      }
    } finally {
      setScheduling(false);
    }
  }

  const langLabel = (l: string) => {
    const key = l as keyof typeof labels;
    return labels[key] ?? l;
  };
  const labels: Record<string, string> = {
    nl: t("languages.nl"),
    en: t("languages.en"),
    es: t("languages.es"),
    ru: t("languages.ru"),
    th: t("languages.th"),
    de: t("languages.de"),
    fr: t("languages.fr"),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("compose")}
        </h1>
        <Link
          href="/admin/nieuwsbrief"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          ← {t("subscribers")}
        </Link>
      </div>

      {counts && (
        <p className="text-sm" style={{ color: ADM_MUTED }}>
          {t("recipientCount", { count: counts.total })}
          {" — "}
          {LANGUAGES.map((l) => `${langLabel(l)}: ${counts.byLanguage[l] ?? 0}`).join(" | ")}
        </p>
      )}

      {sendSuccess !== null && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: ADM_ACCENT, background: "rgba(13,148,136,.1)", color: ADM_ACCENT }}>
          {t("sendSuccess", { count: sendSuccess })}
        </div>
      )}
      {sendError && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-300 bg-red-50 text-red-800">
          {t("sendError")}
        </div>
      )}

      {drafts.length > 0 && (
        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_TEXT }}>Geplande / verzonden nieuwsbrieven</h2>
          <ul className="space-y-2">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0" style={{ borderColor: ADM_BORDER }}>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium truncate block" style={{ color: ADM_TEXT }}>{d.titel || d.subject_nl || d.subject_en || "Nieuwsbrief"}</span>
                  <span className="text-xs" style={{ color: ADM_MUTED }}>
                    {d.scheduled_at ? `Gepland: ${new Date(d.scheduled_at).toLocaleString("nl-NL")}` : "—"}
                    {d.verstuurd_op && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verzonden
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={deletingDraftId === d.id}
                  onClick={() => handleDeleteDraft(d.id)}
                  className="shrink-0 px-3 py-1.5 rounded-lg border text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  style={{ borderColor: ADM_BORDER }}
                >
                  {deletingDraftId === d.id ? loadingStr : "Verwijderen"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {templates.length > 0 && (
        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <label className="block text-sm font-medium mb-2" style={{ color: ADM_MUTED }}>
            {t("loadSampleNewsletter")}
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedTemplateId(id);
              const template = templates.find((t) => t.id === id);
              if (template) loadTemplate(template);
            }}
            className="w-full max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            <option value="">— {t("loadSampleNewsletter")} …</option>
            {templates.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.titel}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="flex border-b overflow-x-auto" style={{ borderColor: ADM_BORDER }}>
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveTab(l)}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px"
              style={{
                borderColor: activeTab === l ? ADM_ACCENT : "transparent",
                color: activeTab === l ? ADM_ACCENT : ADM_MUTED,
              }}
            >
              {langLabel(l)}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              {t("subject")}
            </label>
            <input
              type="text"
              value={subjects[activeTab] ?? ""}
              onChange={(e) => setSubject(activeTab, e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              placeholder={t("subject")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              {t("content")}
            </label>
            <TiptapEditor
              value={bodies[activeTab] ?? ""}
              onChange={(html) => setBody(activeTab, html)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewLang(previewLang === activeTab ? null : activeTab)}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            >
              {t("preview")}
            </button>
          </div>
        </div>
      </div>

      {previewLang && (
        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: ADM_MUTED }}>
            {t("preview")} — {langLabel(previewLang)}
          </h2>
          <p className="text-sm mb-2" style={{ color: ADM_TEXT }}>
            <strong>{t("subject")}:</strong> {subjects[previewLang] ?? noVal}
          </p>
          <div
            className="prose prose-sm max-w-none p-4 rounded border"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            dangerouslySetInnerHTML={{ __html: bodies[previewLang] ?? "<p></p>" }}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium" style={{ color: ADM_MUTED }}>
            Plan voor later:
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          />
          <button
            type="button"
            disabled={scheduling || !scheduledAt.trim()}
            onClick={handleSchedule}
            className="px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50"
            style={{ borderColor: ADM_ACCENT, color: ADM_ACCENT }}
          >
            {scheduling ? loadingStr : "Inplannen"}
          </button>
          {scheduleSuccess && (
            <span className="text-sm" style={{ color: ADM_ACCENT }}>Gepland. Cron verstuurt automatisch op het gekozen tijdstip.</span>
          )}
        </div>
        <button
          type="button"
          disabled={sending || (counts?.total ?? 0) === 0}
          onClick={() => setConfirmSend(true)}
          className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ background: ADM_ACCENT }}
        >
          {sending ? loadingStr : t("sendNewsletter")}
        </button>
      </div>

      {confirmSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.4)" }}>
          <div className="rounded-xl border p-6 max-w-md w-full shadow-lg" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              {t("sendConfirm", { count: counts?.total ?? 0 })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                disabled={sending}
                onClick={() => setConfirmSend(false)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {tAdmin("members.cancel")}
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={() => handleSend()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ACCENT }}
              >
                {sending ? loadingStr : t("sendNewsletter")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
