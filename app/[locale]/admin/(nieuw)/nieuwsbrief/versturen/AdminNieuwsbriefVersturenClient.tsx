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

      <div className="flex justify-end">
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
