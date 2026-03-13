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

type MemberRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  telefoon: string | null;
  type: string | null;
  bedrijfsnaam: string | null;
  status: string | null;
  lid_sinds: string | null;
  notities: string | null;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLedenForm({ member = null, onSuccess }: { member?: MemberRow | null; onSuccess?: () => void }) {
  const t = useTranslations("admin.members");
  const tAdmin = useTranslations("admin");
  const router = useRouter();
  const [voornaam, setVoornaam] = useState(member?.voornaam ?? "");
  const [achternaam, setAchternaam] = useState(member?.achternaam ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [telefoon, setTelefoon] = useState(member?.telefoon ?? "");
  const [type, setType] = useState<"persoon" | "bedrijf">((member?.type as "persoon" | "bedrijf") || "persoon");
  const [bedrijfsnaam, setBedrijfsnaam] = useState(member?.bedrijfsnaam ?? "");
  const [status, setStatus] = useState(member?.status === "inactief" ? "inactief" : "actief");
  const [lid_sinds, setLidSinds] = useState(member?.lid_sinds ?? new Date().toISOString().slice(0, 10));
  const [notities, setNotities] = useState(member?.notities ?? "");
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
      const body = {
        voornaam: voornaam.trim(),
        achternaam: achternaam.trim(),
        email: email.trim(),
        telefoon: telefoon.trim() || null,
        type,
        bedrijfsnaam: type === "bedrijf" ? bedrijfsnaam.trim() || null : null,
        status,
        lid_sinds: lid_sinds || null,
        notities: notities.trim() || null,
      };
      if (member) {
        const res = await fetch(`/api/admin/members/${member.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        setMessage({ type: "success", text: t("saveSuccess") });
        if (onSuccess) onSuccess();
        else setTimeout(() => router.push("/admin/leden?saved=1"), 800);
      } else {
        const res = await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? t("saveError"));
        }
        setMessage({ type: "success", text: t("saveSuccess") });
        setTimeout(() => router.push("/admin/leden?saved=1"), 800);
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
        <Link href="/admin/leden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {member ? t("editMember") : t("newMember")}
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

      <form onSubmit={handleSubmit} className="rounded-xl border overflow-hidden p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
              {t("voornaam")} *
            </label>
            <input
              type="text"
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
              {t("achternaam")} *
            </label>
            <input
              type="text"
              value={achternaam}
              onChange={(e) => setAchternaam(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
            {t("email")} *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
            {t("telefoon")}
          </label>
          <input
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          />
        </div>
        <div className="mt-4">
          <span className="block text-sm font-medium mb-2" style={{ color: ADM_TEXT }}>
            {t("type")}
          </span>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" checked={type === "persoon"} onChange={() => setType("persoon")} />
              <span style={{ color: ADM_TEXT }}>{t("persoon")}</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" checked={type === "bedrijf"} onChange={() => setType("bedrijf")} />
              <span style={{ color: ADM_TEXT }}>{t("bedrijf")}</span>
            </label>
          </div>
        </div>
        {type === "bedrijf" && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
              {t("bedrijfsnaam")}
            </label>
            <input
              type="text"
              value={bedrijfsnaam}
              onChange={(e) => setBedrijfsnaam(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </div>
        )}
        <div className="mt-4">
          <span className="block text-sm font-medium mb-2" style={{ color: ADM_TEXT }}>
            {t("status")}
          </span>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" checked={status === "actief"} onChange={() => setStatus("actief")} />
              <span style={{ color: ADM_TEXT }}>{t("actief")}</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" checked={status === "inactief"} onChange={() => setStatus("inactief")} />
              <span style={{ color: ADM_TEXT }}>{t("inactief")}</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
            {t("memberSince")}
          </label>
          <input
            type="date"
            value={lid_sinds}
            onChange={(e) => setLidSinds(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
            {t("notities")}
          </label>
          <textarea
            value={notities}
            onChange={(e) => setNotities(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none resize-y"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: ADM_ACCENT }}
          >
            {saving ? tAdmin("loading") : t("save")}
          </button>
          <Link
            href="/admin/leden"
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}
