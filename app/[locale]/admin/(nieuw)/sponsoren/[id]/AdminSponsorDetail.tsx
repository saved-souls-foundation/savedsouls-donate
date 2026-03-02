"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import AdminSponsorForm from "../AdminSponsorForm";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_ERROR = "#dc2626";
const ADM_GREEN = "#16a34a";
const ADM_ORANGE = "#ea580c";
const ADM_RED = "#dc2626";

const LEVEL_COLORS: Record<string, string> = {
  platinum: "#E5E4E2",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

type Sponsor = {
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

export default function AdminSponsorDetail({ id }: { id: string }) {
  const t = useTranslations("admin.sponsors");
  const locale = useLocale();
  const router = useRouter();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/admin/sponsors/${id}`);
      if (cancelled) return;
      if (!res.ok) {
        setSponsor(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setSponsor(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  function formatDate(d: string | null) {
    if (!d) return t("noValue");
    return locale === "en" ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatCurrency(n: number) {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  }

  function daysRemaining(end: string | null): number | null {
    if (!end) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return diff;
  }

  function daysRemainingColor(days: number | null): { bg: string; text: string } {
    if (days === null) return { bg: ADM_MUTED, text: ADM_TEXT };
    if (days < 0) return { bg: "#e2e8f0", text: ADM_MUTED };
    if (days <= 30) return { bg: "rgba(220,38,38,.15)", text: ADM_RED };
    if (days <= 60) return { bg: "rgba(234,88,12,.15)", text: ADM_ORANGE };
    return { bg: "rgba(22,163,74,.15)", text: ADM_GREEN };
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) {
      setLogoError(t("logoHint"));
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setLogoError(t("logoHint"));
      return;
    }
    setLogoError(null);
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/sponsors/${id}/logo`, { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("saveError"));
      }
      const data = await res.json();
      setSponsor((prev) => (prev ? { ...prev, logo_url: data.logo_url } : null));
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/sponsoren?deleted=1");
    } catch {
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  if (editing && sponsor) {
    return (
      <AdminSponsorForm
        sponsor={sponsor}
        onSuccess={() => {
          setEditing(false);
          (async () => {
            const res = await fetch(`/api/admin/sponsors/${id}`);
            if (res.ok) setSponsor(await res.json());
          })();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/sponsoren" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <p style={{ color: ADM_MUTED }}>{t("loading")}</p>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="space-y-6">
        <Link href="/admin/sponsoren" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <p style={{ color: ADM_MUTED }}>{t("notFound")}</p>
      </div>
    );
  }

  const days = daysRemaining(sponsor.contract_eind);
  const daysStyle = daysRemainingColor(days);
  const levelColor = sponsor.niveau ? (LEVEL_COLORS[sponsor.niveau.toLowerCase()] ?? ADM_BORDER) : ADM_BORDER;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/admin/sponsoren" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{sponsor.bedrijfsnaam ?? t("noValue")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("company")}</h2>
          <p className="font-medium" style={{ color: ADM_TEXT }}>{sponsor.bedrijfsnaam ?? t("noValue")}</p>
          {sponsor.website && (
            <a href={sponsor.website.startsWith("http") ? sponsor.website : `https://${sponsor.website}`} target="_blank" rel="noopener noreferrer" className="text-sm block mt-1" style={{ color: ADM_ACCENT }}>{sponsor.website}</a>
          )}
          <p className="text-sm mt-2" style={{ color: ADM_TEXT }}>{t("contact")}: {sponsor.contactpersoon_naam ?? t("noValue")}</p>
          <p className="text-sm" style={{ color: ADM_TEXT }}>{sponsor.contactpersoon_email ?? t("noValue")}</p>
          {sponsor.contactpersoon_telefoon && <p className="text-sm" style={{ color: ADM_TEXT }}>{sponsor.contactpersoon_telefoon}</p>}
        </div>

        <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("logoUpload")}</h2>
          {sponsor.logo_url && (
            <div className="mb-3">
              <img src={sponsor.logo_url} alt="" className="max-h-20 object-contain" />
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml" onChange={handleLogoChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={logoUploading} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
            {logoUploading ? t("loading") : t("logoUpload")}
          </button>
          <p className="text-xs mt-1" style={{ color: ADM_MUTED }}>{t("logoHint")}</p>
          {logoError && <p className="text-sm mt-1" style={{ color: ADM_ERROR }}>{logoError}</p>}
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("level")} / {t("contributionType")}</h2>
        <div className="flex flex-wrap gap-4">
          {sponsor.niveau && (
            <span className="inline-block px-2 py-1 rounded text-sm font-medium" style={{ background: `${levelColor}40`, color: levelColor }}>
              {t(`levels.${sponsor.niveau.toLowerCase()}` as "levels.platinum" | "levels.gold" | "levels.silver" | "levels.bronze")}
            </span>
          )}
          {sponsor.bedrag_per_maand != null && <span style={{ color: ADM_TEXT }}>{formatCurrency(Number(sponsor.bedrag_per_maand))} {t("perMonth")}</span>}
          {sponsor.bijdrage_type && <span style={{ color: ADM_TEXT }}>{t(`contributionTypes.${sponsor.bijdrage_type}` as "contributionTypes.geld")}</span>}
        </div>
        {sponsor.omschrijving && <p className="mt-2 text-sm" style={{ color: ADM_TEXT }}>{sponsor.omschrijving}</p>}
      </div>

      <div className="rounded-xl border p-4" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: ADM_MUTED }}>{t("contractStart")} / {t("contractEnd")}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <span style={{ color: ADM_TEXT }}>{t("contractStart")}: {formatDate(sponsor.contract_start)}</span>
          <span style={{ color: ADM_TEXT }}>{t("contractEnd")}: {formatDate(sponsor.contract_eind)}</span>
          <span style={{ color: ADM_TEXT }}>{t("status")}: {t(`statuses.${sponsor.status as "actief"}`)}</span>
          <span
            className="inline-block px-2 py-1 rounded text-sm font-medium"
            style={{ background: daysStyle.bg, color: daysStyle.text }}
          >
            {days !== null && days < 0 ? t("expired") : days !== null ? t("daysRemaining", { days }) : t("noValue")}
          </span>
        </div>
        {sponsor.notities && <p className="mt-2 text-sm" style={{ color: ADM_MUTED }}>{t("notes")}: {sponsor.notities}</p>}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
          {t("editSponsor")}
        </button>
        {!deleteConfirm ? (
          <button type="button" onClick={() => setDeleteConfirm(true)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_ERROR, color: ADM_ERROR }}>
            {t("delete")}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</span>
            <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ERROR }}>
              {deleting ? t("loading") : t("delete")}
            </button>
            <button type="button" onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
