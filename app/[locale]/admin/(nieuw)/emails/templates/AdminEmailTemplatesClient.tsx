"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TiptapEditor from "@/app/components/admin/TiptapEditor";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_RED = "#dc2626";

const LANGS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;

type Template = {
  id: string;
  naam: string | null;
  categorie: string | null;
  actief: boolean;
  onderwerp?: string | null;
  onderwerp_nl?: string | null;
  onderwerp_en?: string | null;
  onderwerp_es?: string | null;
  onderwerp_ru?: string | null;
  onderwerp_th?: string | null;
  onderwerp_de?: string | null;
  onderwerp_fr?: string | null;
  inhoud_nl?: string | null;
  inhoud_en?: string | null;
  inhoud_es?: string | null;
  inhoud_ru?: string | null;
  inhoud_th?: string | null;
  inhoud_de?: string | null;
  inhoud_fr?: string | null;
};

export default function AdminEmailTemplatesClient() {
  const t = useTranslations("admin.emails");
  const [list, setList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Template> & { naam?: string; categorie?: string; actief?: boolean }>({ actief: true });
  const [activeTab, setActiveTab] = useState<string>("nl");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setList(data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function loadIntoForm(tm: Template) {
    setForm({
      id: tm.id,
      naam: tm.naam ?? "",
      categorie: tm.categorie ?? "",
      actief: tm.actief,
      onderwerp: tm.onderwerp ?? "",
      onderwerp_nl: tm.onderwerp_nl ?? tm.onderwerp ?? "",
      onderwerp_en: tm.onderwerp_en ?? "",
      onderwerp_es: tm.onderwerp_es ?? "",
      onderwerp_ru: tm.onderwerp_ru ?? "",
      onderwerp_th: tm.onderwerp_th ?? "",
      onderwerp_de: tm.onderwerp_de ?? "",
      onderwerp_fr: tm.onderwerp_fr ?? "",
      inhoud_nl: tm.inhoud_nl ?? "",
      inhoud_en: tm.inhoud_en ?? "",
      inhoud_es: tm.inhoud_es ?? "",
      inhoud_ru: tm.inhoud_ru ?? "",
      inhoud_th: tm.inhoud_th ?? "",
      inhoud_de: tm.inhoud_de ?? "",
      inhoud_fr: tm.inhoud_fr ?? "",
    });
    setEditingId(tm.id);
  }

  function insertPlaceholder(placeholder: string) {
    const key = `inhoud_${activeTab}` as keyof typeof form;
    const current = (form[key] as string) ?? "";
    setForm((prev) => ({ ...prev, [key]: current + placeholder }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, unknown> = {
        naam: form.naam ?? "",
        categorie: form.categorie ?? null,
        actief: form.actief ?? true,
      };
      LANGS.forEach((lang) => {
        payload[`onderwerp_${lang}`] = form[`onderwerp_${lang}` as keyof typeof form] ?? null;
        payload[`inhoud_${lang}`] = form[`inhoud_${lang}` as keyof typeof form] ?? null;
      });
      if (editingId) {
        const res = await fetch(`/api/admin/email-templates/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setList((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
        setMessage({ type: "success", text: t("saveSuccess") });
      } else {
        const res = await fetch("/api/admin/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setList((prev) => [...prev, created]);
        setForm({ actief: true });
        setEditingId(null);
        setMessage({ type: "success", text: t("saveSuccess") });
      }
    } catch {
      setMessage({ type: "error", text: t("saveError") });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(tid: string) {
    try {
      const res = await fetch(`/api/admin/email-templates/${tid}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList((prev) => prev.filter((x) => x.id !== tid));
      if (editingId === tid) { setEditingId(null); setForm({ actief: true }); }
      setDeleteConfirmId(null);
    } catch {
      setMessage({ type: "error", text: t("saveError") });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/emails" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{t("templatesTitle")}</h1>
      </div>

      {message && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: message.type === "success" ? ADM_ACCENT : ADM_RED, background: message.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)", color: message.type === "success" ? ADM_ACCENT : ADM_RED }}>{message.text}</div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        {loading ? (
          <p className="p-6" style={{ color: ADM_MUTED }}>{t("loading")}</p>
        ) : (
          <ul className="divide-y" style={{ borderColor: ADM_BORDER }}>
            {list.map((tm) => (
              <li key={tm.id} className="flex items-center justify-between p-4">
                <div>
                  <span className="font-medium" style={{ color: ADM_TEXT }}>{tm.naam ?? tm.id}</span>
                  {tm.categorie && <span className="ml-2 text-sm" style={{ color: ADM_MUTED }}>{tm.categorie}</span>}
                  {!tm.actief && <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: ADM_MUTED, color: "#fff" }}>{t("inactive")}</span>}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => loadIntoForm(tm)} className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("editTemplate")}</button>
                  {deleteConfirmId === tm.id ? (
                    <>
                      <span className="text-sm" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</span>
                      <button type="button" onClick={() => handleDelete(tm.id)} className="text-sm px-2 py-1 rounded" style={{ background: ADM_RED, color: "#fff" }}>{t("delete")}</button>
                      <button type="button" onClick={() => setDeleteConfirmId(null)} className="text-sm" style={{ color: ADM_MUTED }}>{t("cancel")}</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setDeleteConfirmId(tm.id)} className="text-sm" style={{ color: ADM_RED }}>{t("delete")}</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: ADM_MUTED }}>{editingId ? t("editTemplateForm") : t("addTemplate")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("templateName")}</label>
            <input type="text" value={form.naam ?? ""} onChange={(e) => setForm((p) => ({ ...p, naam: e.target.value }))} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("category")}</label>
            <input type="text" value={form.categorie ?? ""} onChange={(e) => setForm((p) => ({ ...p, categorie: e.target.value }))} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} placeholder="adoptie, vrijwilliger, donatie, sponsor, algemeen" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actief" checked={form.actief ?? true} onChange={(e) => setForm((p) => ({ ...p, actief: e.target.checked }))} />
            <label htmlFor="actief" className="text-sm" style={{ color: ADM_TEXT }}>{t("active")}</label>
          </div>
        </div>

        <p className="text-sm font-medium mb-2" style={{ color: ADM_MUTED }}>{t("placeholders")}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button type="button" onClick={() => insertPlaceholder("{{naam}}")} className="px-2 py-1 rounded text-sm border" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("placeholderNaam")}</button>
          <button type="button" onClick={() => insertPlaceholder("{{dier}}")} className="px-2 py-1 rounded text-sm border" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("placeholderDier")}</button>
          <button type="button" onClick={() => insertPlaceholder("{{organisatie}}")} className="px-2 py-1 rounded text-sm border" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("placeholderOrg")}</button>
        </div>

        <div className="border-b flex gap-2 mb-4" style={{ borderColor: ADM_BORDER }}>
          {LANGS.map((lang) => (
            <button key={lang} type="button" onClick={() => setActiveTab(lang)} className="px-3 py-2 text-sm font-medium border-b-2 -mb-px" style={{ borderColor: activeTab === lang ? ADM_ACCENT : "transparent", color: activeTab === lang ? ADM_ACCENT : ADM_MUTED }}>{lang.toUpperCase()}</button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("subjectLabel")} ({activeTab.toUpperCase()})</label>
            <input type="text" value={(form[`onderwerp_${activeTab}` as keyof typeof form] as string) ?? ""} onChange={(e) => setForm((p) => ({ ...p, [`onderwerp_${activeTab}`]: e.target.value }))} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contentLabel")} ({activeTab.toUpperCase()})</label>
            <TiptapEditor key={activeTab} value={(form[`inhoud_${activeTab}` as keyof typeof form] as string) ?? ""} onChange={(html) => setForm((p) => ({ ...p, [`inhoud_${activeTab}`]: html }))} />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>{saving ? t("loading") : t("save")}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ actief: true }); }} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>}
        </div>
      </div>
    </div>
  );
}
