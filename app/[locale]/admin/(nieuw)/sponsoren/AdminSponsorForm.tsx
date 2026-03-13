"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_ERROR = "#7B1010";

const NIVEAU_OPTIONS = ["bronze", "silver", "gold", "platinum"] as const;
const BIJDRAGE_OPTIONS = ["geld", "producten", "diensten", "combinatie"] as const;
const STATUS_OPTIONS_NIEUW = ["in_onderhandeling", "actief"] as const;
const STATUS_OPTIONS_EDIT = ["actief", "inactief", "verlopen", "in_onderhandeling"] as const;

type SponsorRow = {
  id: string;
  bedrijfsnaam: string | null;
  contactpersoon_naam: string | null;
  contactpersoon_email: string | null;
  contactpersoon_telefoon: string | null;
  website: string | null;
  logo_url: string | null;
  niveau: string | null;
  bedrag_per_maand: number | null;
  bijdrage_type: string | null;
  omschrijving: string | null;
  contract_start: string | null;
  contract_eind: string | null;
  status: string;
  notities: string | null;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminSponsorForm({ sponsor = null, onSuccess }: { sponsor?: SponsorRow | null; onSuccess?: () => void }) {
  const t = useTranslations("admin.sponsors");
  const router = useRouter();
  const isEdit = Boolean(sponsor?.id);

  const [bedrijfsnaam, setBedrijfsnaam] = useState(sponsor?.bedrijfsnaam ?? "");
  const [contactpersoon_naam, setContactpersoonNaam] = useState(sponsor?.contactpersoon_naam ?? "");
  const [contactpersoon_email, setContactpersoonEmail] = useState(sponsor?.contactpersoon_email ?? "");
  const [contactpersoon_telefoon, setContactpersoonTelefoon] = useState(sponsor?.contactpersoon_telefoon ?? "");
  const [website, setWebsite] = useState(sponsor?.website ?? "");
  const [niveau, setNiveau] = useState<string>((sponsor?.niveau as string) || "bronze");
  const [bedrag_per_maand, setBedragPerMaand] = useState(sponsor?.bedrag_per_maand != null ? String(sponsor.bedrag_per_maand) : "");
  const [bijdrage_type, setBijdrageType] = useState<string>((sponsor?.bijdrage_type as string) || "geld");
  const [omschrijving, setOmschrijving] = useState(sponsor?.omschrijving ?? "");
  const [contract_start, setContractStart] = useState(sponsor?.contract_start ?? new Date().toISOString().slice(0, 10));
  const [contract_eind, setContractEind] = useState(sponsor?.contract_eind ?? "");
  const [status, setStatus] = useState(sponsor?.status ?? (isEdit ? "actief" : "in_onderhandeling"));
  const [notities, setNotities] = useState(sponsor?.notities ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bedrijfsnaam.trim() || !contactpersoon_naam.trim() || !contactpersoon_email.trim()) {
      setMessage({ type: "error", text: t("saveError") });
      return;
    }
    if (!emailRegex.test(contactpersoon_email)) {
      setMessage({ type: "error", text: t("saveError") });
      return;
    }
    if (!contract_eind.trim()) {
      setMessage({ type: "error", text: t("saveError") });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const body = {
        bedrijfsnaam: bedrijfsnaam.trim(),
        contactpersoon_naam: contactpersoon_naam.trim(),
        contactpersoon_email: contactpersoon_email.trim().toLowerCase(),
        contactpersoon_telefoon: contactpersoon_telefoon.trim() || null,
        website: website.trim() || null,
        niveau: NIVEAU_OPTIONS.includes(niveau as (typeof NIVEAU_OPTIONS)[number]) ? niveau : "bronze",
        bedrag_per_maand: bedrag_per_maand !== "" ? parseFloat(bedrag_per_maand) : null,
        bijdrage_type: BIJDRAGE_OPTIONS.includes(bijdrage_type as (typeof BIJDRAGE_OPTIONS)[number]) ? bijdrage_type : "geld",
        omschrijving: omschrijving.trim() || null,
        contract_start: contract_start || null,
        contract_eind: contract_eind.trim(),
        status,
        notities: notities.trim() || null,
      };
      if (sponsor) {
        const res = await fetch(`/api/admin/sponsors/${sponsor.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        setMessage({ type: "success", text: t("saveSuccess") });
        if (onSuccess) onSuccess();
        else setTimeout(() => router.refresh(), 800);
      } else {
        const res = await fetch("/api/admin/sponsors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        const data = await res.json();
        setMessage({ type: "success", text: t("saveSuccess") });
        setTimeout(() => router.push(`/admin/sponsoren/${data.id}`), 800);
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("saveError") });
    } finally {
      setSaving(false);
    }
  }

  const statusOptions = isEdit ? STATUS_OPTIONS_EDIT : STATUS_OPTIONS_NIEUW;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sponsoren" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {sponsor ? t("editSponsor") : t("newSponsor")}
        </h1>
      </div>

      {message && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: message.type === "success" ? ADM_ACCENT : ADM_ERROR,
            background: message.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)",
            color: message.type === "success" ? ADM_ACCENT : ADM_ERROR,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border overflow-hidden p-6 space-y-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("company")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("company")} *</label>
              <input type="text" value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("website")}</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contactName")} *</label>
              <input type="text" value={contactpersoon_naam} onChange={(e) => setContactpersoonNaam(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contactEmail")} *</label>
              <input type="email" value={contactpersoon_email} onChange={(e) => setContactpersoonEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contactPhone")}</label>
              <input type="text" value={contactpersoon_telefoon} onChange={(e) => setContactpersoonTelefoon(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("level")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("level")}</label>
              <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                {NIVEAU_OPTIONS.map((n) => (
                  <option key={n} value={n}>{t(`levels.${n}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("amountPerMonth")}</label>
              <input type="number" step="0.01" min="0" value={bedrag_per_maand} onChange={(e) => setBedragPerMaand(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contributionType")}</label>
              <select value={bijdrage_type} onChange={(e) => setBijdrageType(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                {BIJDRAGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>{t(`contributionTypes.${b}`)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("description")}</label>
              <textarea value={omschrijving} onChange={(e) => setOmschrijving(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("contractStart")} / {t("contractEnd")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contractStart")}</label>
              <input type="date" value={contract_start} onChange={(e) => setContractStart(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("contractEnd")} *</label>
              <input type="date" value={contract_eind} onChange={(e) => setContractEind(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("status")}</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{t(`statuses.${s}`)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("notes")}</label>
              <textarea value={notities} onChange={(e) => setNotities(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>
            {saving ? t("loading") : t("save")}
          </button>
          <Link href="/admin/sponsoren" className="px-4 py-2 rounded-lg border text-sm font-medium inline-flex items-center" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}
