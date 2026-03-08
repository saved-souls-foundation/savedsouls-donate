"use client";

import React, { useState, useEffect, useCallback } from "react";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

type Recipient = { email: string; naam: string };

type Template = {
  id: string;
  naam?: string | null;
  onderwerp?: string | null;
  inhoud_nl?: string | null;
  inhoud_en?: string | null;
  [key: string]: unknown;
};

type TabId = "inbox" | "adoptanten" | "vrijwilligers" | "nieuwsbrief" | "handmatig";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "inbox", label: "Inbox", icon: "📧" },
  { id: "adoptanten", label: "Adoptanten", icon: "🐾" },
  { id: "vrijwilligers", label: "Vrijwilligers", icon: "🤝" },
  { id: "nieuwsbrief", label: "Nieuwsbrief", icon: "💌" },
  { id: "handmatig", label: "Handmatig", icon: "✍️" },
];

function getSubjectAndContent(template: Template, locale: string): { subject: string; content: string } {
  const lang = ["nl", "en", "es", "ru", "th", "de", "fr"].includes(locale) ? locale : "nl";
  const subject =
    (template[`onderwerp_${lang}`] as string) ??
    (template.onderwerp as string) ??
    (template.onderwerp_nl as string) ??
    "";
  const content =
    (template[`inhoud_${lang}`] as string) ??
    (template.inhoud_nl as string) ??
    (template.inhoud_en as string) ??
    "";
  return { subject, content };
}

function replacePlaceholders(text: string, naam: string): string {
  return text
    .replace(/\{\{naam\}\}/g, naam || " ")
    .replace(/\{\{organisatie\}\}/g, "Saved Souls Foundation");
}

type Props = {
  template: Template;
  locale: string;
  onClose: () => void;
  onSent: () => void;
};

export default function SendTemplateModal({ template, locale, onClose, onSent }: Props) {
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState<TabId>("inbox");
  const [inboxList, setInboxList] = useState<Recipient[]>([]);
  const [adoptantenList, setAdoptantenList] = useState<Recipient[]>([]);
  const [vrijwilligersList, setVrijwilligersList] = useState<Recipient[]>([]);
  const [nieuwsbriefList, setNieuwsbriefList] = useState<Recipient[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [handmatigText, setHandmatigText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);
  const selected = new Set(selectedRecipients.map((r) => r.email));

  const fetchList = useCallback(async (type: string) => {
    const res = await fetch(
      `/api/admin/emails/recipients?type=${type}&limit=300${search ? `&search=${encodeURIComponent(search)}` : ""}`
    );
    const data = await res.json().catch(() => ({}));
    return (data.data ?? []) as Recipient[];
  }, [search]);

  useEffect(() => {
    if (tab === "inbox") {
      setLoading(true);
      fetchList("inbox").then(setInboxList).finally(() => setLoading(false));
    } else if (tab === "adoptanten") {
      setLoading(true);
      fetchList("adoptanten").then(setAdoptantenList).finally(() => setLoading(false));
    } else if (tab === "vrijwilligers") {
      setLoading(true);
      fetchList("vrijwilligers").then(setVrijwilligersList).finally(() => setLoading(false));
    } else if (tab === "nieuwsbrief") {
      setLoading(true);
      fetchList("nieuwsbrief").then(setNieuwsbriefList).finally(() => setLoading(false));
    }
  }, [tab, fetchList]);

  const list =
    tab === "inbox"
      ? inboxList
      : tab === "adoptanten"
        ? adoptantenList
        : tab === "vrijwilligers"
          ? vrijwilligersList
          : tab === "nieuwsbrief"
            ? nieuwsbriefList
            : [];

  const toggleSelect = (r: Recipient) => {
    setSelectedRecipients((prev) =>
      prev.some((x) => x.email === r.email)
        ? prev.filter((x) => x.email !== r.email)
        : [...prev, r]
    );
  };

  const selectAll = () => {
    const inList = list.filter((r) => !selectedRecipients.some((x) => x.email === r.email));
    if (inList.length === 0) {
      setSelectedRecipients((prev) => prev.filter((x) => !list.some((r) => r.email === x.email)));
    } else {
      setSelectedRecipients((prev) => {
        const existing = new Set(prev.map((x) => x.email));
        const add = list.filter((r) => !existing.has(r.email));
        return [...prev, ...add];
      });
    }
  };

  const buildRecipientsFromStep1 = useCallback((): Recipient[] => {
    if (tab === "handmatig") {
      const emails = handmatigText
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      return [...new Set(emails)].map((email) => ({ email, naam: "" }));
    }
    return selectedRecipients;
  }, [tab, handmatigText, selectedRecipients]);

  const finalRecipients = step >= 2 ? buildRecipientsFromStep1() : [];
  const { subject, content } = getSubjectAndContent(template, locale);
  const previewContent = finalRecipients.length > 0
    ? replacePlaceholders(content, finalRecipients[0].naam)
    : replacePlaceholders(content, "Voorbeeldnaam");

  const handleNext = () => {
    if (step === 1) {
      const rec = buildRecipientsFromStep1();
      if (rec.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSend = async () => {
    if (finalRecipients.length === 0) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/emails/send-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          recipients: finalRecipients.map((r) => ({ email: r.email, naam: r.naam })),
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ success: 0, errors: finalRecipients.length });
        return;
      }
      setResult({ success: data.success ?? 0, errors: data.errors ?? 0 });
      if ((data.success ?? 0) > 0) onSent();
    } catch {
      setResult({ success: 0, errors: finalRecipients.length });
    } finally {
      setSending(false);
    }
  };

  const selectedCount =
    step === 1
      ? tab === "handmatig"
        ? handmatigText
            .split(/[\n,;]+/)
            .map((e) => e.trim().toLowerCase())
            .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).length
        : selectedRecipients.length
      : finalRecipients.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6 shadow-lg"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: ADM_TEXT }}>
            ✉️ Verstuur: {template.naam ?? "Template"}
          </h2>
          <button type="button" onClick={onClose} className="text-xl leading-none p-1" style={{ color: ADM_MUTED }} aria-label="Sluiten">
            ×
          </button>
        </div>

        {step === 1 && (
          <>
            <p className="text-sm mb-3" style={{ color: ADM_MUTED }}>
              Stap 1 – Ontvangers kiezen
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                  style={{
                    borderColor: tab === t.id ? ADM_ACCENT : ADM_BORDER,
                    color: tab === t.id ? ADM_ACCENT : ADM_TEXT,
                    background: tab === t.id ? "rgba(13,148,136,.1)" : "transparent",
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            {tab !== "handmatig" && (
              <>
                <input
                  type="search"
                  placeholder="Zoeken…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-sm font-medium"
                    style={{ color: ADM_ACCENT }}
                  >
                    {selected.size === list.length ? "Deselecteer alle" : "Selecteer alle"}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border rounded-lg mb-3" style={{ borderColor: ADM_BORDER }}>
                  {loading ? (
                    <div className="p-4 text-center text-sm" style={{ color: ADM_MUTED }}>Laden…</div>
                  ) : (
                    <ul className="divide-y" style={{ borderColor: ADM_BORDER }}>
                      {list.map((r) => (
                        <li key={r.email} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={selected.has(r.email)}
                            onChange={() => toggleSelect(r)}
                          />
                          <span className="text-sm truncate flex-1" style={{ color: ADM_TEXT }}>{r.naam || r.email}</span>
                          <span className="text-xs truncate max-w-[180px]" style={{ color: ADM_MUTED }}>{r.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
            {tab === "handmatig" && (
              <textarea
                placeholder="E-mailadressen, gescheiden door komma of nieuwe regel"
                value={handmatigText}
                onChange={(e) => setHandmatigText(e.target.value)}
                rows={6}
                className="w-full mb-3 px-3 py-2 rounded-lg border text-sm font-mono"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              />
            )}
            <p className="text-sm mb-3" style={{ color: ADM_MUTED }}>
              {selectedCount} ontvangers geselecteerd
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={selectedCount === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ACCENT }}
              >
                Volgende →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm mb-3" style={{ color: ADM_MUTED }}>
              Stap 2 – Preview
            </p>
            <div className="space-y-2 mb-4 text-sm">
              <p><strong style={{ color: ADM_TEXT }}>Van:</strong> info@savedsouls-foundation.org</p>
              <p><strong style={{ color: ADM_TEXT }}>Onderwerp:</strong> {replacePlaceholders(subject, finalRecipients[0]?.naam ?? "Voorbeeldnaam")}</p>
            </div>
            <div
              className="rounded-lg border p-4 max-h-64 overflow-y-auto text-sm"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                ← Terug
              </button>
              <button type="button" onClick={handleNext} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
                Volgende →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm mb-3" style={{ color: ADM_MUTED }}>
              Stap 3 – Versturen
            </p>
            {result == null ? (
              <>
                <p className="mb-4" style={{ color: ADM_TEXT }}>
                  Verstuur naar <strong>{finalRecipients.length}</strong> ontvangers?
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                    ← Terug
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: ADM_ACCENT }}
                  >
                    {sending ? "Bezig…" : `Verstuur naar ${finalRecipients.length} ontvangers`}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2" style={{ color: ADM_TEXT }}>
                  <strong>{result.success}</strong> verstuurd, <strong>{result.errors}</strong> mislukt.
                </p>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>
                  Sluiten
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
