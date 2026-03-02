"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import type { Editor } from "@tiptap/react";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_RED = "#dc2626";

const LANGS = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;
const TiptapEditor = dynamic(() => import("@/app/components/admin/TiptapEditor"), { ssr: false });

const PREVIEW_NAAM = "Anna";
const PREVIEW_DIER = "Luna";
const PREVIEW_ORG = "SavedSouls Foundation";

type TemplateForm = {
  naam: string;
  categorie: string;
  actief: boolean;
  onderwerp_nl: string;
  onderwerp_en: string;
  onderwerp_es: string;
  onderwerp_ru: string;
  onderwerp_th: string;
  onderwerp_de: string;
  onderwerp_fr: string;
  inhoud_nl: string;
  inhoud_en: string;
  inhoud_es: string;
  inhoud_ru: string;
  inhoud_th: string;
  inhoud_de: string;
  inhoud_fr: string;
};

const emptyForm: TemplateForm = {
  naam: "",
  categorie: "algemeen",
  actief: true,
  onderwerp_nl: "",
  onderwerp_en: "",
  onderwerp_es: "",
  onderwerp_ru: "",
  onderwerp_th: "",
  onderwerp_de: "",
  onderwerp_fr: "",
  inhoud_nl: "",
  inhoud_en: "",
  inhoud_es: "",
  inhoud_ru: "",
  inhoud_th: "",
  inhoud_de: "",
  inhoud_fr: "",
};

function previewHtml(html: string): string {
  return html
    .replace(/\{\{naam\}\}/g, PREVIEW_NAAM)
    .replace(/\{\{dier\}\}/g, PREVIEW_DIER)
    .replace(/\{\{organisatie\}\}/g, PREVIEW_ORG);
}

export default function AdminEmailTemplateEditClient({ id }: { id: string }) {
  const t = useTranslations("admin.emails");
  const router = useRouter();
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [activeTab, setActiveTab] = useState<(typeof LANGS)[number]>("nl");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editorRef, setEditorRef] = useState<Editor | null>(null);

  useEffect(() => {
    if (id === "nieuw") {
      setForm({ ...emptyForm });
      setLoading(false);
      return;
    }
    fetch(`/api/admin/email-templates/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setForm({
            naam: data.naam ?? "",
            categorie: data.categorie ?? "algemeen",
            actief: data.actief !== false,
            onderwerp_nl: data.onderwerp_nl ?? data.onderwerp ?? "",
            onderwerp_en: data.onderwerp_en ?? "",
            onderwerp_es: data.onderwerp_es ?? "",
            onderwerp_ru: data.onderwerp_ru ?? "",
            onderwerp_th: data.onderwerp_th ?? "",
            onderwerp_de: data.onderwerp_de ?? "",
            onderwerp_fr: data.onderwerp_fr ?? "",
            inhoud_nl: data.inhoud_nl ?? "",
            inhoud_en: data.inhoud_en ?? "",
            inhoud_es: data.inhoud_es ?? "",
            inhoud_ru: data.inhoud_ru ?? "",
            inhoud_th: data.inhoud_th ?? "",
            inhoud_de: data.inhoud_de ?? "",
            inhoud_fr: data.inhoud_fr ?? "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const insertAtCursor = useCallback(
    (placeholder: string) => {
      editorRef?.chain().focus().insertContent(placeholder).run();
    },
    [editorRef]
  );

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, unknown> = {
        naam: form.naam.trim() || null,
        categorie: form.categorie || null,
        actief: form.actief,
      };
      LANGS.forEach((lang) => {
        payload[`onderwerp_${lang}`] = (form[`onderwerp_${lang}` as keyof TemplateForm] as string)?.trim() || null;
        payload[`inhoud_${lang}`] = (form[`inhoud_${lang}` as keyof TemplateForm] as string)?.trim() || null;
      });
      if (id === "nieuw") {
        const res = await fetch("/api/admin/email-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        router.push(`/admin/emails/templates/${created.id}`);
        return;
      }
      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: t("saveSuccess") });
    } catch {
      setMessage({ type: "error", text: t("saveError") });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/emails/templates");
    } catch {
      setMessage({ type: "error", text: t("saveError") });
    } finally {
      setDeleteConfirm(false);
    }
  }

  const currentInhoud = form[`inhoud_${activeTab}` as keyof TemplateForm] as string;
  const livePreviewHtml = previewHtml(currentInhoud ?? "");

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/emails/templates" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          ← {t("backToList")}
        </Link>
        <p style={{ color: ADM_MUTED }}>{t("loading")}</p>
      </div>
    );
  }

  if (notFound && id !== "nieuw") {
    return (
      <div className="space-y-6">
        <Link href="/admin/emails/templates" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          ← {t("backToList")}
        </Link>
        <p style={{ color: ADM_RED }}>{t("noTemplates")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/emails/templates" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          ← {t("backToList")}
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: ADM_ACCENT }}
          >
            {saving ? t("loading") : t("save")}
          </button>
          {id !== "nieuw" && (
            <>
              {!deleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: ADM_RED, color: ADM_RED }}
                >
                  {t("delete")}
                </button>
              ) : (
                <>
                  <span className="text-sm py-2" style={{ color: ADM_MUTED }}>
                    {t("deleteConfirm")}
                  </span>
                  <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: ADM_RED }}>
                    {t("delete")}
                  </button>
                  <button type="button" onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                    {t("cancel")}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {message && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: message.type === "success" ? ADM_ACCENT : ADM_RED,
            background: message.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)",
            color: message.type === "success" ? ADM_ACCENT : ADM_RED,
          }}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                  {t("templateName")}
                </label>
                <input
                  type="text"
                  value={form.naam}
                  onChange={(e) => setForm((p) => ({ ...p, naam: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                  {t("category")}
                </label>
                <select
                  value={form.categorie}
                  onChange={(e) => setForm((p) => ({ ...p, categorie: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  <option value="adoptie">{t("categories.adoptie")}</option>
                  <option value="vrijwilliger">{t("categories.vrijwilliger")}</option>
                  <option value="donatie">{t("categories.donatie")}</option>
                  <option value="sponsor">{t("categories.sponsor")}</option>
                  <option value="algemeen">{t("categories.algemeen")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actief"
                  checked={form.actief}
                  onChange={(e) => setForm((p) => ({ ...p, actief: e.target.checked }))}
                />
                <label htmlFor="actief" className="text-sm" style={{ color: ADM_TEXT }}>
                  {t("active")}
                </label>
              </div>
            </div>

            <p className="text-sm font-medium mb-2" style={{ color: ADM_MUTED }}>
              {t("insertPlaceholder")}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={() => insertAtCursor("{{naam}}")}
                className="px-2 py-1 rounded text-sm border"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {"[{{naam}}]"}
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("{{dier}}")}
                className="px-2 py-1 rounded text-sm border"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {"[{{dier}}]"}
              </button>
              <button
                type="button"
                onClick={() => insertAtCursor("{{organisatie}}")}
                className="px-2 py-1 rounded text-sm border"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {"[{{organisatie}}]"}
              </button>
            </div>

            <div className="border-b flex gap-2 mb-4" style={{ borderColor: ADM_BORDER }}>
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className="px-3 py-2 text-sm font-medium border-b-2 -mb-px"
                  style={{
                    borderColor: activeTab === lang ? ADM_ACCENT : "transparent",
                    color: activeTab === lang ? ADM_ACCENT : ADM_MUTED,
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                  {t("subjectLabel")} ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={(form[`onderwerp_${activeTab}` as keyof TemplateForm] as string) ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [`onderwerp_${activeTab}`]: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                  {t("contentLabel")} ({activeTab.toUpperCase()})
                </label>
                <TiptapEditor
                  key={activeTab}
                  value={(form[`inhoud_${activeTab}` as keyof TemplateForm] as string) ?? ""}
                  onChange={(html) => setForm((p) => ({ ...p, [`inhoud_${activeTab}`]: html }))}
                  onEditorReady={setEditorRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4 h-fit" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: ADM_MUTED }}>
            {t("livePreview")}
          </h3>
          <p className="text-xs mb-2" style={{ color: ADM_MUTED }}>
            {activeTab.toUpperCase()} — {"{{naam}}"} → {PREVIEW_NAAM}, {"{{dier}}"} → {PREVIEW_DIER}, {"{{organisatie}}"} → {PREVIEW_ORG}
          </p>
          <div
            className="prose prose-sm max-w-none p-4 rounded-lg border min-h-[200px] overflow-auto"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            dangerouslySetInnerHTML={{ __html: livePreviewHtml || "<p></p>" }}
          />
        </div>
      </div>
    </div>
  );
}
