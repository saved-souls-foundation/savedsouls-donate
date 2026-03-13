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

const COUNTRY_OPTIONS = ["NL", "BE", "DE", "FR", "GB", "US", "ES", "IT", "TH", "CH", "AT", "PL", ""];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DonorRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  telefoon: string | null;
  type: string | null;
  bedrijfsnaam: string | null;
  land: string | null;
  notities: string | null;
};

export default function AdminDonateurForm({ donor = null, onSuccess }: { donor?: DonorRow | null; onSuccess?: () => void }) {
  const t = useTranslations("admin.donors");
  const router = useRouter();
  const [voornaam, setVoornaam] = useState(donor?.voornaam ?? "");
  const [achternaam, setAchternaam] = useState(donor?.achternaam ?? "");
  const [email, setEmail] = useState(donor?.email ?? "");
  const [telefoon, setTelefoon] = useState(donor?.telefoon ?? "");
  const [type, setType] = useState<"persoon" | "bedrijf">((donor?.type as "persoon" | "bedrijf") || "persoon");
  const [bedrijfsnaam, setBedrijfsnaam] = useState(donor?.bedrijfsnaam ?? "");
  const [land, setLand] = useState(donor?.land ?? "NL");
  const [notities, setNotities] = useState(donor?.notities ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!voornaam.trim() || !achternaam.trim() || !email.trim()) {
      setMessage({ type: "error", text: t("saveError") });
      return;
    }
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: t("saveError") });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const body = { voornaam: voornaam.trim(), achternaam: achternaam.trim(), email: email.trim().toLowerCase(), telefoon: telefoon.trim() || null, type, bedrijfsnaam: type === "bedrijf" ? bedrijfsnaam.trim() || null : null, land: land || "NL", notities: notities.trim() || null };
      if (donor) {
        const res = await fetch(`/api/admin/donors/${donor.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        setMessage({ type: "success", text: t("saveSuccess") });
        if (onSuccess) onSuccess();
        else setTimeout(() => router.push("/admin/donateurs?saved=1"), 800);
      } else {
        const res = await fetch("/api/admin/donors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        const data = await res.json();
        setMessage({ type: "success", text: t("saveSuccess") });
        setTimeout(() => router.push(`/admin/donateurs/${data.id}?addDonation=1`), 800);
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("saveError") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {donor ? t("edit") : t("newDonor")}
        </h1>
      </div>

      {message && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: message.type === "success" ? ADM_ACCENT : ADM_ERROR, background: message.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)", color: message.type === "success" ? ADM_ACCENT : ADM_ERROR }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border overflow-hidden p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("voornaam")} *</label>
            <input type="text" value={voornaam} onChange={(e) => setVoornaam(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("achternaam")} *</label>
            <input type="text" value={achternaam} onChange={(e) => setAchternaam(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("email")} *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("telefoon")}</label>
            <input type="text" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("type")}</label>
            <select value={type} onChange={(e) => setType(e.target.value as "persoon" | "bedrijf")} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
              <option value="persoon">{t("persoon")}</option>
              <option value="bedrijf">{t("bedrijf")}</option>
            </select>
          </div>
          {type === "bedrijf" && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("bedrijfsnaam")}</label>
              <input type="text" value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("country")}</label>
            <select value={land} onChange={(e) => setLand(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
              {COUNTRY_OPTIONS.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("notities")}</label>
          <textarea value={notities} onChange={(e) => setNotities(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }} />
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>
            {saving ? t("loading") : t("save")}
          </button>
          <Link href="/admin/donateurs" className="px-4 py-2 rounded-lg border text-sm font-medium inline-flex items-center" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}
