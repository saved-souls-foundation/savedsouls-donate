"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_RED = "#dc2626";
const ADM_ORANGE = "#ea580c";
const ADM_GREEN = "#16a34a";

type Email = {
  id: string;
  van_email: string | null;
  van_naam: string | null;
  onderwerp: string | null;
  inhoud: string | null;
  ontvangen_op: string;
  taal: string | null;
  ai_categorie: string | null;
  ai_confidence: number | null;
  ai_gegenereerd_antwoord: string | null;
  ai_suggestie_template_id: string | null;
  ai_urgency: string | null;
  status: string;
};

const LANGS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;
type Template = {
  id: string;
  naam: string | null;
  inhoud_nl?: string | null;
  inhoud_en?: string | null;
  inhoud_es?: string | null;
  inhoud_ru?: string | null;
  inhoud_th?: string | null;
  inhoud_de?: string | null;
  inhoud_fr?: string | null;
};

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function AdminEmailDetail({ id }: { id: string }) {
  const t = useTranslations("admin.emails");
  const locale = useLocale();
  const [email, setEmail] = useState<Email | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [ignoring, setIgnoring] = useState(false);
  const [editReply, setEditReply] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [templateOverride, setTemplateOverride] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [autoSentBanner, setAutoSentBanner] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [urgencyLoading, setUrgencyLoading] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [agendaTitle, setAgendaTitle] = useState("");
  const [agendaDate, setAgendaDate] = useState("");
  const [agendaTime, setAgendaTime] = useState("10:00");
  const [agendaSaving, setAgendaSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [eRes, tRes] = await Promise.all([
        fetch(`/api/admin/emails/${id}`),
        fetch("/api/admin/email-templates"),
      ]);
      if (cancelled) return;
      if (eRes.ok) setEmail(await eRes.json());
      if (tRes.ok) {
        const raw = await tRes.json();
        setTemplates(Array.isArray(raw) ? raw : []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/emails/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (email?.ai_gegenereerd_antwoord != null) {
      setEditReply(email.ai_gegenereerd_antwoord);
      if (!templateOverride && email.ai_suggestie_template_id) setTemplateOverride(email.ai_suggestie_template_id);
    }
  }, [email?.ai_gegenereerd_antwoord, email?.ai_suggestie_template_id]);

  async function handleAnalyze() {
    if (!email) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}/analyze`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("analyzeError"));
      }
      const data = await res.json();
      setEmail((prev) => prev ? {
        ...prev,
        ai_categorie: data.categorie,
        ai_confidence: data.confidence,
        ai_gegenereerd_antwoord: data.ai_gegenereerd_antwoord ?? prev.ai_gegenereerd_antwoord,
        ai_suggestie_template_id: data.template_id ?? prev.ai_suggestie_template_id,
        taal: data.taal ?? prev.taal,
        ...(data.autoSent ? { status: "verstuurd" as const } : {}),
      } : null);
      setEditReply(data.ai_gegenereerd_antwoord ?? "");
      if (data.template_id) setTemplateOverride(data.template_id);
      if (data.autoSent) setAutoSentBanner(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("analyzeError"));
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSend(replyText: string) {
    if (!email) return;
    setSending(true);
    setError(null);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_text: replyText, template_id: templateOverride || undefined }),
      });
      if (!res.ok) throw new Error("Send failed");
      setEmail((prev) => prev ? { ...prev, status: "verstuurd" } : null);
      setShowEdit(false);
      setToast({ type: "success", text: t("toastSuccess") });
    } catch {
      setError(t("saveError"));
      setToast({ type: "error", text: t("saveError") });
    } finally {
      setSending(false);
    }
  }

  async function handleIgnore() {
    if (!email) return;
    setIgnoring(true);
    try {
      const res = await fetch(`/api/admin/emails/${id}/ignore`, { method: "PUT" });
      if (!res.ok) throw new Error();
      setEmail((prev) => prev ? { ...prev, status: "geneigeerd" } : null);
      setToast({ type: "success", text: t("toastSuccess") });
    } catch {
      setToast({ type: "error", text: t("saveError") });
    } finally {
      setIgnoring(false);
    }
  }

  const isUrgent = email?.ai_urgency === "hoog";
  async function handleUrgencyToggle() {
    if (!email) return;
    setUrgencyLoading(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/emails/${id}/urgency`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai_urgency: isUrgent ? "normaal" : "hoog" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("saveError"));
      }
      const data = await res.json();
      setEmail((prev) => prev ? { ...prev, ai_urgency: data.ai_urgency ?? null } : null);
      setToast({ type: "success", text: isUrgent ? t("toastUrgencyNormal") : t("toastUrgencyMarked") });
    } catch (e) {
      setToast({ type: "error", text: e instanceof Error ? e.message : t("saveError") });
    } finally {
      setUrgencyLoading(false);
    }
  }

  function openAgendaModal() {
    const naam = email?.van_naam?.trim() || email?.van_email || t("noValue");
    setAgendaTitle(`Opvolging: ${naam}`);
    setAgendaDate(tomorrowISO());
    setAgendaTime("10:00");
    setAgendaModalOpen(true);
  }

  async function handleAgendaConfirm() {
    if (!email) return;
    setAgendaSaving(true);
    setToast(null);
    try {
      const [y, m, d] = agendaDate.split("-").map(Number);
      const [hh, mm] = agendaTime.split(":").map(Number);
      const start = new Date(y, m - 1, d, hh, mm, 0, 0);
      const start_time = start.toISOString();
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const end_time = end.toISOString();
      const description = `Email opvolging: ${email.onderwerp ?? ""}`.trim() || `Email opvolging (id: ${email.id})`;
      const res = await fetch("/api/admin/agenda/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: agendaTitle.trim() || `Opvolging: ${email.van_naam ?? email.van_email ?? ""}`,
          description,
          category: "afspraak",
          start_time,
          end_time,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("saveError"));
      }
      setToast({ type: "success", text: t("toastAgendaAdded") });
      setAgendaModalOpen(false);
    } catch (e) {
      setToast({ type: "error", text: e instanceof Error ? e.message : t("saveError") });
    } finally {
      setAgendaSaving(false);
    }
  }

  function formatDate(d: string) {
    return locale === "en" ? new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : new Date(d).toLocaleDateString("nl-NL", { dateStyle: "medium", timeStyle: "short" });
  }

  function confidenceColor(pct: number): string {
    if (pct >= 0.8) return ADM_GREEN;
    if (pct >= 0.5) return ADM_ORANGE;
    return ADM_RED;
  }

  const categoryKeys: Record<string, string> = {
    adoptie: t("categories.adoptie"),
    vrijwilliger: t("categories.vrijwilliger"),
    donatie: t("categories.donatie"),
    sponsor: t("categories.sponsor"),
    algemeen: t("categories.algemeen"),
  };

  function fillFromTemplate(tm: Template) {
    const taal = (email?.taal ?? "nl").toLowerCase().slice(0, 2);
    const lang = LANGS.includes(taal as (typeof LANGS)[number]) ? taal : "nl";
    const inhoudKey = `inhoud_${lang}` as keyof Template;
    let body = (tm[inhoudKey] as string) ?? (tm.inhoud_nl ?? "");
    const naam = (email?.van_naam ?? "").split(/\s+/)[0] ?? "";
    body = body
      .replace(/\{\{naam\}\}/g, naam)
      .replace(/\{\{dier\}\}/g, "")
      .replace(/\{\{organisatie\}\}/g, "Saved Souls Foundation");
    setEditReply(body);
    setTemplateOverride(tm.id);
  }

  if (loading || !email) {
    return (
      <div className="space-y-6">
        <Link href="/admin/emails" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <p style={{ color: ADM_MUTED }}>{t("loading")}</p>
      </div>
    );
  }

  const confidence = email.ai_confidence != null ? Number(email.ai_confidence) : null;
  const replyToSend = showEdit ? editReply : (email.ai_gegenereerd_antwoord ?? "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link href="/admin/emails" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUrgencyToggle}
            disabled={urgencyLoading}
            title={isUrgent ? t("tooltipUrgentMarked") : t("tooltipUrgent")}
            className="p-2 rounded-lg border transition-colors disabled:opacity-50"
            style={{ borderColor: ADM_BORDER, color: isUrgent ? ADM_RED : ADM_MUTED }}
          >
            🚨
          </button>
          <Link
            href={`/admin/adoptanten?email=${encodeURIComponent(email.van_email ?? "")}`}
            title={t("tooltipAdoptanten")}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
          >
            🐾
          </Link>
          <button
            type="button"
            onClick={openAgendaModal}
            title={t("tooltipAgenda")}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
          >
            📅
          </button>
        </div>
      </div>

      {agendaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !agendaSaving && setAgendaModalOpen(false)}>
          <div className="rounded-xl border p-4 w-full max-w-md shadow-lg" style={{ background: ADM_CARD, borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: ADM_TEXT }}>{t("agendaModalTitle")}</h3>
            <label className="block text-xs font-medium mt-2 mb-1" style={{ color: ADM_MUTED }}>{t("agendaModalTitleLabel")}</label>
            <input type="text" value={agendaTitle} onChange={(e) => setAgendaTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm mb-2" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            <label className="block text-xs font-medium mt-2 mb-1" style={{ color: ADM_MUTED }}>{t("agendaModalDateLabel")}</label>
            <input type="date" value={agendaDate} onChange={(e) => setAgendaDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm mb-2" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            <label className="block text-xs font-medium mt-2 mb-1" style={{ color: ADM_MUTED }}>{t("agendaModalTimeLabel")}</label>
            <input type="time" value={agendaTime} onChange={(e) => setAgendaTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm mb-4" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setAgendaModalOpen(false)} disabled={agendaSaving} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
              <button type="button" onClick={handleAgendaConfirm} disabled={agendaSaving} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>{agendaSaving ? t("loading") : t("agendaModalConfirm")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("originalEmail")}</h2>
          <p className="text-sm" style={{ color: ADM_TEXT }}><strong>{t("from")}:</strong> {email.van_naam ?? ""} &lt;{email.van_email ?? ""}&gt;</p>
          <p className="text-sm mt-1" style={{ color: ADM_TEXT }}><strong>{t("subject")}:</strong> {email.onderwerp ?? t("noValue")}</p>
          <p className="text-sm mt-1" style={{ color: ADM_MUTED }}><strong>{t("received")}:</strong> {formatDate(email.ontvangen_op)}</p>
          <p className="text-sm mt-1" style={{ color: ADM_TEXT }}><strong>{t("detectedLanguage")}:</strong> {(email.taal ?? "").toUpperCase() || t("noValue")}</p>
          <div className="mt-3 p-3 rounded-lg border text-sm whitespace-pre-wrap" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{email.inhoud ?? t("noValue")}</div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("aiAssistant")}</h2>
          {email.status !== "in_behandeling" ? (
            <div>
              <p style={{ color: ADM_MUTED }}>{t("statuses." + email.status)}</p>
              {autoSentBanner && email.status === "verstuurd" && (
                <p className="mt-2 text-sm font-medium" style={{ color: ADM_GREEN }}>{t("autoSentMessage")}</p>
              )}
              {email.ai_gegenereerd_antwoord && (autoSentBanner || email.status === "verstuurd") && (
                <div className="mt-3 p-3 rounded-lg border text-sm max-h-40 overflow-auto" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} dangerouslySetInnerHTML={{ __html: email.ai_gegenereerd_antwoord.replace(/\n/g, "<br>") }} />
              )}
            </div>
          ) : (
            <>
              <button type="button" onClick={handleAnalyze} disabled={analyzing} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>
                {analyzing ? t("analyzing") : t("analyze")}
              </button>
              {error && <p className="mt-2 text-sm" style={{ color: ADM_RED }}>{error}</p>}
              {email.ai_categorie != null && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><span style={{ color: ADM_MUTED }}>{t("aiCategory")}:</span> <span style={{ color: ADM_TEXT }}>{categoryKeys[email.ai_categorie] ?? email.ai_categorie}</span></p>
                  {confidence != null && (
                    <div>
                      <p className="text-sm mb-1" style={{ color: ADM_MUTED }}>{t("aiConfidence")}</p>
                      <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                        <div className="h-full rounded-full transition-all" style={{ width: `${confidence * 100}%`, background: confidenceColor(confidence) }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: ADM_TEXT }}>{Math.round(confidence * 100)}%</p>
                    </div>
                  )}
                  <p className="text-sm" style={{ color: ADM_MUTED }}>{t("suggestedTemplate")}: {templates.find((x) => x.id === email.ai_suggestie_template_id)?.naam ?? t("noTemplate")}</p>
                  {email.ai_gegenereerd_antwoord && (
                    <>
                      <p className="text-sm font-medium mt-2" style={{ color: ADM_TEXT }}>{t("generatedReply")}</p>
                      <div className="mt-1 p-3 rounded-lg border text-sm max-h-40 overflow-auto" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} dangerouslySetInnerHTML={{ __html: (showEdit ? editReply : email.ai_gegenereerd_antwoord).replace(/\n/g, "<br>") }} />
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-2" style={{ color: ADM_MUTED }}>{t("templateOverride")}</p>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1" style={{ borderColor: ADM_BORDER }}>
                          {templates.map((tm) => {
                            const isSuggested = tm.id === email.ai_suggestie_template_id;
                            const isSelected = tm.id === templateOverride;
                            return (
                              <button
                                key={tm.id}
                                type="button"
                                onClick={() => fillFromTemplate(tm)}
                                className="w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors"
                                style={{
                                  borderColor: isSuggested ? ADM_ORANGE : ADM_BORDER,
                                  background: isSelected ? "rgba(13,148,136,.1)" : isSuggested ? "rgba(234,88,12,.12)" : "transparent",
                                  color: ADM_TEXT,
                                }}
                              >
                                <span className="font-medium">{tm.naam ?? tm.id}</span>
                                {isSuggested && confidence != null && (
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                                      <div className="h-full rounded-full" style={{ width: `${confidence * 100}%`, background: confidenceColor(confidence) }} />
                                    </div>
                                    <span className="text-xs" style={{ color: ADM_MUTED }}>{Math.round(confidence * 100)}%</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {!showEdit ? (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button type="button" onClick={() => handleSend(email.ai_gegenereerd_antwoord ?? "")} disabled={sending} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>✅ {t("send")}</button>
                          <button type="button" onClick={() => setShowEdit(true)} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("editReply")}</button>
                          <button type="button" onClick={handleIgnore} disabled={ignoring} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_RED, color: ADM_RED }}>❌ {t("ignore")}</button>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <textarea value={editReply} onChange={(e) => setEditReply(e.target.value)} rows={8} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
                          <div className="flex gap-2 mt-2">
                            <button type="button" onClick={() => handleSend(editReply)} disabled={sending} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>{t("send")}</button>
                            <button type="button" onClick={() => setShowEdit(false)} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: toast.type === "success" ? ADM_GREEN : ADM_RED, background: toast.type === "success" ? "rgba(22,163,74,.1)" : "rgba(220,38,38,.1)", color: toast.type === "success" ? ADM_GREEN : ADM_RED }}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
