"use client";

import { useState, useEffect } from "react";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";

type ComposeEmailModalProps = {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
  initialTo?: string;
  initialSubject?: string;
  /** When set, POST includes this and incoming_emails row is marked verstuurd. */
  incomingEmailId?: string;
};

export default function ComposeEmailModal({
  open,
  onClose,
  onSent,
  initialTo = "",
  initialSubject = "",
  incomingEmailId,
}: ComposeEmailModalProps) {
  const [to_email, setToEmail] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setToEmail(initialTo);
      setSubject(initialSubject);
      setBody("");
      setError(null);
    }
  }, [open, initialTo, initialSubject]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!to_email.trim() || !subject.trim() || !body.trim()) {
      setError("Vul alle velden in.");
      return;
    }
    setSending(true);
    try {
      const payload: { to_email: string; subject: string; body: string; incoming_email_id?: string } = {
        to_email: to_email.trim(),
        subject: subject.trim(),
        body: body.trim(),
      };
      if (incomingEmailId) payload.incoming_email_id = incomingEmailId;
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Verzenden mislukt");
        return;
      }
      onSent();
      onClose();
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl border shadow-xl w-full md:max-w-lg md:max-h-[90vh] h-[100dvh] md:h-auto overflow-hidden flex flex-col"
        style={{ borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b shrink-0" style={{ borderColor: ADM_BORDER }}>
          <h2 className="text-lg font-semibold" style={{ color: ADM_TEXT }}>
            {incomingEmailId ? "Beantwoord" : "Nieuwe mail opstellen"}
          </h2>
        </div>
        <form id="compose-email-form" onSubmit={handleSubmit} className="p-4 space-y-3 flex-1 overflow-y-auto min-h-0">
          {error && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>Aan</label>
            <input
              type="email"
              value={to_email}
              onChange={(e) => setToEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm min-h-[44px]"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              placeholder="email@voorbeeld.nl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>Onderwerp</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm min-h-[44px]"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              placeholder="Onderwerp"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>Bericht</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm resize-y min-h-[120px]"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              placeholder="Schrijf je bericht..."
              required
            />
          </div>
        </form>
        <div className="p-4 border-t flex justify-end gap-2 shrink-0" style={{ borderColor: ADM_BORDER }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm min-h-[44px] min-w-[44px] flex items-center justify-center" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>Annuleren</button>
          <button type="submit" form="compose-email-form" disabled={sending} className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-[#2aa348] hover:bg-[#166534] disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center">Verstuur</button>
        </div>
      </div>
    </div>
  );
}
