"use client";

import { useCallback, useState } from "react";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

type ModalType = "autoReplies" | "newsletterTemplates" | null;

type EmailTemplate = {
  id: string;
  naam: string | null;
  onderwerp?: string | null;
  inhoud_nl?: string | null;
  inhoud_en?: string | null;
  created_at?: string;
  updated_at?: string;
};

type NewsletterTemplate = {
  id: string;
  titel: string;
  subject_nl?: string;
  subject_en?: string;
  body_nl?: string;
  body_en?: string;
  volgorde?: number;
};

type Props = {
  initialEmailCount: number;
  initialNewsletterCount: number;
  labels: { autoReplies: string; newsletterTemplates: string };
};

export function DashboardAutoRepliesNewsletterCards({
  initialEmailCount,
  initialNewsletterCount,
  labels,
}: Props) {
  const [emailCount, setEmailCount] = useState(initialEmailCount);
  const [newsletterCount, setNewsletterCount] = useState(initialNewsletterCount);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [list, setList] = useState<(EmailTemplate | NewsletterTemplate)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<EmailTemplate | NewsletterTemplate | null>(null);
  const [editItem, setEditItem] = useState<EmailTemplate | NewsletterTemplate | null>(null);
  const [addForm, setAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchList = useCallback(async (type: "autoReplies" | "newsletterTemplates") => {
    setLoading(true);
    setError(null);
    try {
      if (type === "autoReplies") {
        const res = await fetch("/api/admin/email-templates");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Laden mislukt");
        setList(Array.isArray(data) ? data : []);
        setEmailCount(Array.isArray(data) ? data.length : 0);
      } else {
        const res = await fetch("/api/admin/newsletter/templates");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Laden mislukt");
        const templates = data?.templates ?? [];
        setList(templates);
        setNewsletterCount(templates.length);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Laden mislukt");
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = useCallback(
    (type: "autoReplies" | "newsletterTemplates") => {
      setModalType(type);
      setViewItem(null);
      setEditItem(null);
      setAddForm(false);
      setDeleteConfirm(null);
      fetchList(type);
    },
    [fetchList]
  );

  const closeModal = useCallback(() => {
    setModalType(null);
    setViewItem(null);
    setEditItem(null);
    setAddForm(false);
    setDeleteConfirm(null);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!modalType) return;
      setSaving(true);
      try {
        const url =
          modalType === "autoReplies"
            ? `/api/admin/email-templates/${id}`
            : `/api/admin/newsletter/templates/${id}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Verwijderen mislukt");
        }
        setDeleteConfirm(null);
        setViewItem(null);
        setEditItem(null);
        await fetchList(modalType);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Verwijderen mislukt");
      } finally {
        setSaving(false);
      }
    },
    [modalType, fetchList]
  );

  const getTitle = (item: EmailTemplate | NewsletterTemplate) =>
    "naam" in item ? (item.naam ?? "—") : (item as NewsletterTemplate).titel;
  const getDate = (item: EmailTemplate | NewsletterTemplate) =>
    "created_at" in item && (item as EmailTemplate).created_at
      ? new Date((item as EmailTemplate).created_at).toLocaleDateString("nl-NL")
      : "—";

  const cards = [
    { type: "autoReplies" as const, icon: "🤖", label: labels.autoReplies, value: emailCount },
    { type: "newsletterTemplates" as const, icon: "📰", label: labels.newsletterTemplates, value: newsletterCount },
  ];

  return (
    <>
      {cards.map((c) => (
        <button
          key={c.type}
          type="button"
          onClick={() => openModal(c.type)}
          className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition block w-full text-left"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        >
          <span className="text-2xl">{c.icon}</span>
          <p className="text-2xl font-bold mt-2" style={{ color: ADM_TEXT }}>
            {c.value}
          </p>
          <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
            {c.label}
          </p>
        </button>
      ))}

      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl"
            style={{ borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: ADM_BORDER }}>
              <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
                {modalType === "autoReplies" ? labels.autoReplies : labels.newsletterTemplates}
              </h2>
              <button type="button" onClick={closeModal} className="text-xl leading-none" style={{ color: ADM_MUTED }}>
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {error && (
                <p className="text-sm mb-2" style={{ color: "#dc2626" }}>
                  {error}
                </p>
              )}
              {loading ? (
                <p style={{ color: ADM_MUTED }}>Laden…</p>
              ) : viewItem ? (
                <ViewContent
                  item={viewItem}
                  type={modalType}
                  onClose={() => setViewItem(null)}
                  onEdit={() => {
                    setViewItem(null);
                    setEditItem(viewItem);
                  }}
                />
              ) : editItem ? (
                <EditForm
                  item={editItem}
                  type={modalType}
                  onClose={() => setEditItem(null)}
                  onSaved={() => {
                    setEditItem(null);
                    fetchList(modalType);
                  }}
                  setError={setError}
                  saving={saving}
                  setSaving={setSaving}
                />
              ) : addForm ? (
                <AddForm
                  type={modalType}
                  onClose={() => setAddForm(false)}
                  onSaved={() => {
                    setAddForm(false);
                    fetchList(modalType);
                  }}
                  setError={setError}
                  saving={saving}
                  setSaving={setSaving}
                />
              ) : (
                <>
                  <ul className="space-y-2">
                    {list.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-2 py-2 border-b"
                        style={{ borderColor: ADM_BORDER }}
                      >
                        <div>
                          <span className="font-medium" style={{ color: ADM_TEXT }}>
                            {getTitle(item)}
                          </span>
                          <span className="text-sm ml-2" style={{ color: ADM_MUTED }}>
                            {getDate(item)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewItem(item)}
                            className="text-sm px-2 py-1 rounded"
                            style={{ color: ADM_ACCENT }}
                            title="Lezen"
                          >
                            👁
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditItem(item)}
                            className="text-sm px-2 py-1 rounded"
                            style={{ color: ADM_ACCENT }}
                            title="Bewerken"
                          >
                            ✏️
                          </button>
                          {deleteConfirm === item.id ? (
                            <>
                              <span className="text-xs" style={{ color: ADM_MUTED }}>
                                Verwijderen?
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={saving}
                                className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                              >
                                Ja
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs px-2 py-1 rounded"
                                style={{ borderColor: ADM_BORDER }}
                              >
                                Nee
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(item.id)}
                              className="text-sm px-2 py-1 rounded"
                              style={{ color: "#dc2626" }}
                              title="Verwijderen"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setAddForm(true)}
                      className="text-sm font-medium px-3 py-2 rounded"
                      style={{ background: ADM_ACCENT, color: "#fff" }}
                    >
                      ➕ Toevoegen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ViewContent({
  item,
  type,
  onClose,
  onEdit,
}: {
  item: EmailTemplate | NewsletterTemplate;
  type: "autoReplies" | "newsletterTemplates";
  onClose: () => void;
  onEdit: () => void;
}) {
  const isEmail = type === "autoReplies";
  const t = item as EmailTemplate;
  const n = item as NewsletterTemplate;
  return (
    <div>
      <div className="prose prose-sm max-w-none mb-4" style={{ color: ADM_TEXT }}>
        {isEmail ? (
          <>
            <p><strong>Naam:</strong> {t.naam ?? "—"}</p>
            <p><strong>Onderwerp:</strong> {t.onderwerp ?? "—"}</p>
            <p><strong>Inhoud (NL):</strong></p>
            <div className="whitespace-pre-wrap">{t.inhoud_nl ?? "—"}</div>
            {t.inhoud_en && (
              <>
                <p><strong>Inhoud (EN):</strong></p>
                <div className="whitespace-pre-wrap">{t.inhoud_en}</div>
              </>
            )}
          </>
        ) : (
          <>
            <p><strong>Titel:</strong> {n.titel}</p>
            <p><strong>Onderwerp NL:</strong> {n.subject_nl ?? "—"}</p>
            <p><strong>Onderwerp EN:</strong> {n.subject_en ?? "—"}</p>
            <p><strong>Body (NL):</strong></p>
            <div className="whitespace-pre-wrap">{n.body_nl ?? "—"}</div>
            {n.body_en && (
              <>
                <p><strong>Body (EN):</strong></p>
                <div className="whitespace-pre-wrap">{n.body_en}</div>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onEdit} className="text-sm px-3 py-2 rounded" style={{ background: ADM_ACCENT, color: "#fff" }}>
          ✏️ Bewerken
        </button>
        <button type="button" onClick={onClose} className="text-sm px-3 py-2 rounded border" style={{ borderColor: ADM_BORDER }}>
          Sluiten
        </button>
      </div>
    </div>
  );
}

function EditForm({
  item,
  type,
  onClose,
  onSaved,
  setError,
  saving,
  setSaving,
}: {
  item: EmailTemplate | NewsletterTemplate;
  type: "autoReplies" | "newsletterTemplates";
  onClose: () => void;
  onSaved: () => void;
  setError: (s: string | null) => void;
  saving: boolean;
  setSaving: (b: boolean) => void;
}) {
  const isEmail = type === "autoReplies";
  const [naam, setNaam] = useState(isEmail ? (item as EmailTemplate).naam ?? "" : "");
  const [onderwerp, setOnderwerp] = useState(isEmail ? (item as EmailTemplate).onderwerp ?? "" : "");
  const [inhoudNl, setInhoudNl] = useState(isEmail ? (item as EmailTemplate).inhoud_nl ?? "" : "");
  const [inhoudEn, setInhoudEn] = useState(isEmail ? (item as EmailTemplate).inhoud_en ?? "" : "");
  const [titel, setTitel] = useState(!isEmail ? (item as NewsletterTemplate).titel ?? "" : "");
  const [subjectNl, setSubjectNl] = useState(!isEmail ? (item as NewsletterTemplate).subject_nl ?? "" : "");
  const [subjectEn, setSubjectEn] = useState(!isEmail ? (item as NewsletterTemplate).subject_en ?? "" : "");
  const [bodyNl, setBodyNl] = useState(!isEmail ? (item as NewsletterTemplate).body_nl ?? "" : "");
  const [bodyEn, setBodyEn] = useState(!isEmail ? (item as NewsletterTemplate).body_en ?? "" : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = isEmail
        ? `/api/admin/email-templates/${item.id}`
        : `/api/admin/newsletter/templates/${item.id}`;
      const body = isEmail
        ? { naam: naam || null, onderwerp: onderwerp || null, inhoud_nl: inhoudNl || null, inhoud_en: inhoudEn || null }
        : { titel, subject_nl: subjectNl, subject_en: subjectEn, body_nl: bodyNl, body_en: bodyEn };
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Opslaan mislukt");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  if (isEmail) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Naam</label>
          <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp</label>
          <input type="text" value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Inhoud NL</label>
          <textarea value={inhoudNl} onChange={(e) => setInhoudNl(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Inhoud EN</label>
          <textarea value={inhoudEn} onChange={(e) => setInhoudEn(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-3 py-2 rounded text-white" style={{ background: ADM_ACCENT }}>Opslaan</button>
          <button type="button" onClick={onClose} className="px-3 py-2 rounded border" style={{ borderColor: ADM_BORDER }}>Annuleren</button>
        </div>
      </form>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Titel</label>
        <input type="text" value={titel} onChange={(e) => setTitel(e.target.value)} required className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp NL</label>
        <input type="text" value={subjectNl} onChange={(e) => setSubjectNl(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp EN</label>
        <input type="text" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Body NL</label>
        <textarea value={bodyNl} onChange={(e) => setBodyNl(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Body EN</label>
        <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-3 py-2 rounded text-white" style={{ background: ADM_ACCENT }}>Opslaan</button>
        <button type="button" onClick={onClose} className="px-3 py-2 rounded border" style={{ borderColor: ADM_BORDER }}>Annuleren</button>
      </div>
    </form>
  );
}

function AddForm({
  type,
  onClose,
  onSaved,
  setError,
  saving,
  setSaving,
}: {
  type: "autoReplies" | "newsletterTemplates";
  onClose: () => void;
  onSaved: () => void;
  setError: (s: string | null) => void;
  saving: boolean;
  setSaving: (b: boolean) => void;
}) {
  const isEmail = type === "autoReplies";
  const [naam, setNaam] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [inhoudNl, setInhoudNl] = useState("");
  const [inhoudEn, setInhoudEn] = useState("");
  const [titel, setTitel] = useState("");
  const [subjectNl, setSubjectNl] = useState("");
  const [subjectEn, setSubjectEn] = useState("");
  const [bodyNl, setBodyNl] = useState("");
  const [bodyEn, setBodyEn] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEmail) {
        const res = await fetch("/api/admin/email-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ naam: naam || null, onderwerp: onderwerp || null, inhoud_nl: inhoudNl || null, inhoud_en: inhoudEn || null }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Aanmaken mislukt");
      } else {
        if (!titel.trim()) throw new Error("Titel is verplicht");
        const res = await fetch("/api/admin/newsletter/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titel: titel.trim(), subject_nl: subjectNl || titel, subject_en: subjectEn || titel, body_nl: bodyNl, body_en: bodyEn }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Aanmaken mislukt");
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aanmaken mislukt");
    } finally {
      setSaving(false);
    }
  };

  if (isEmail) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Naam</label>
          <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp</label>
          <input type="text" value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Inhoud NL</label>
          <textarea value={inhoudNl} onChange={(e) => setInhoudNl(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Inhoud EN</label>
          <textarea value={inhoudEn} onChange={(e) => setInhoudEn(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-3 py-2 rounded text-white" style={{ background: ADM_ACCENT }}>Toevoegen</button>
          <button type="button" onClick={onClose} className="px-3 py-2 rounded border" style={{ borderColor: ADM_BORDER }}>Annuleren</button>
        </div>
      </form>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Titel *</label>
        <input type="text" value={titel} onChange={(e) => setTitel(e.target.value)} required className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp NL</label>
        <input type="text" value={subjectNl} onChange={(e) => setSubjectNl(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Onderwerp EN</label>
        <input type="text" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Body NL</label>
        <textarea value={bodyNl} onChange={(e) => setBodyNl(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Body EN</label>
        <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} rows={4} className="w-full border rounded px-2 py-1.5" style={{ borderColor: ADM_BORDER }} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-3 py-2 rounded text-white" style={{ background: ADM_ACCENT }}>Toevoegen</button>
        <button type="button" onClick={onClose} className="px-3 py-2 rounded border" style={{ borderColor: ADM_BORDER }}>Annuleren</button>
      </div>
    </form>
  );
}
