"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import AdminDonateurForm from "../AdminDonateurForm";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_ERROR = "#dc2626";

const VALUTA_OPTIONS = ["EUR", "USD", "GBP", "THB"];
const METHODE_OPTIONS = ["ideal", "paypal", "creditcard", "bank", "mollie", "stripe", "contant", "overig"];
const DONATION_STATUS_OPTIONS = ["voltooid", "in_behandeling", "mislukt", "terugbetaald"];
const RECURRING_METHODE_OPTIONS = ["stripe", "mollie", "bank", "paypal"];
const FREQ_OPTIONS = ["maandelijks", "kwartaal", "jaarlijks"];
const RECURRING_STATUS_OPTIONS = ["actief", "gepauzeerd", "gestopt"];

type Donor = { id: string; voornaam: string | null; achternaam: string | null; email: string | null; telefoon: string | null; type: string | null; bedrijfsnaam: string | null; land: string | null; notities: string | null };
type Donation = { id: string; bedrag: number; valuta: string; methode: string | null; status: string | null; donatie_datum: string | null; betalingskenmerk: string | null; anoniem: boolean; campagne: string | null };
type Recurring = { id: string; bedrag: number; valuta: string | null; frequentie: string | null; status: string; start_datum: string | null; volgende_betaling_datum: string | null; provider_subscription_id: string | null; methode: string | null } | null;

export default function AdminDonateurDetail({ id }: { id: string }) {
  const t = useTranslations("admin.donors");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [recurring, setRecurring] = useState<Recurring>(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [addDonationOpen, setAddDonationOpen] = useState(false);
  const [addRecurringOpen, setAddRecurringOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [donationMethodeFilter, setDonationMethodeFilter] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/admin/donors/${id}`);
      if (cancelled) return;
      if (!res.ok) {
        setDonor(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setDonor(data.donor);
      setDonations(data.donations ?? []);
      setRecurring(data.recurring);
      setTotalDonated(data.total_donated ?? 0);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (searchParams.get("addDonation") !== "1") return;
    const id = setTimeout(() => setAddDonationOpen(true), 0);
    return () => clearTimeout(id);
  }, [searchParams]);

  function formatDate(d: string | null) {
    if (!d) return t("noValue");
    return locale === "en" ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function formatCurrency(n: number, curr = "EUR") {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "nl-NL", { style: "currency", currency: curr }).format(n);
  }
  function statusLabel(s: string | null) {
    if (!s) return t("noValue");
    const key = s as keyof typeof statusKeys;
    return statusKeys[key] ?? s;
  }
  const statusKeys: Record<string, string> = {
    actief: t("statuses.actief"),
    gepauzeerd: t("statuses.gepauzeerd"),
    gestopt: t("statuses.gestopt"),
    betalingsprobleem: t("statuses.betalingsprobleem"),
    voltooid: t("statuses.voltooid"),
    in_behandeling: t("statuses.in_behandeling"),
    mislukt: t("statuses.mislukt"),
    terugbetaald: t("statuses.terugbetaald"),
  };
  const freqKeys: Record<string, string> = {
    maandelijks: t("frequencies.maandelijks"),
    kwartaal: t("frequencies.kwartaal"),
    jaarlijks: t("frequencies.jaarlijks"),
  };
  function name() {
    return donor ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ").trim() || t("noValue") : t("noValue");
  }

  async function refetch() {
    const res = await fetch(`/api/admin/donors/${id}`);
    if (res.ok) {
      const data = await res.json();
      setDonor(data.donor);
      setDonations(data.donations ?? []);
      setRecurring(data.recurring);
      setTotalDonated(data.total_donated ?? 0);
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/admin/donors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setToast({ type: "error", text: t("saveError") });
      setDeleteConfirm(false);
      return;
    }
    setToast({ type: "success", text: t("saveSuccess") });
    setTimeout(() => router.push("/admin/donateurs?deleted=1"), 600);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <p style={{ color: ADM_MUTED }}>…</p>
      </div>
    );
  }
  if (!donor) {
    return (
      <div className="space-y-6">
        <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <p style={{ color: ADM_ERROR }}>{t("noResults")}</p>
      </div>
    );
  }
  if (editing) {
    return (
      <AdminDonateurForm
        donor={donor as Parameters<typeof AdminDonateurForm>[0]["donor"]}
        onSuccess={() => {
          setEditing(false);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>{t("backToList")}</Link>
        <div className="flex gap-2">
          <button type="button" onClick={() => setAddDonationOpen(true)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>{t("addDonation")}</button>
          <button type="button" onClick={() => setAddRecurringOpen(true)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("addRecurring")}</button>
          <button type="button" onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ACCENT }}>{t("edit")}</button>
          <button type="button" onClick={() => setDeleteConfirm(true)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_ERROR, color: ADM_ERROR }}>{t("delete")}</button>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: toast.type === "success" ? ADM_ACCENT : ADM_ERROR, background: toast.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)", color: toast.type === "success" ? ADM_ACCENT : ADM_ERROR }}>
          {toast.text}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: ADM_TEXT }}>{name()}</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><dt style={{ color: ADM_MUTED }}>{t("email")}</dt><dd style={{ color: ADM_TEXT }}>{donor.email ?? t("noValue")}</dd></div>
          <div><dt style={{ color: ADM_MUTED }}>{t("telefoon")}</dt><dd style={{ color: ADM_TEXT }}>{donor.telefoon ?? t("noValue")}</dd></div>
          <div><dt style={{ color: ADM_MUTED }}>{t("type")}</dt><dd style={{ color: ADM_TEXT }}>{donor.type === "bedrijf" ? t("bedrijf") : t("persoon")}</dd></div>
          {donor.type === "bedrijf" && <div><dt style={{ color: ADM_MUTED }}>{t("bedrijfsnaam")}</dt><dd style={{ color: ADM_TEXT }}>{donor.bedrijfsnaam ?? t("noValue")}</dd></div>}
          <div><dt style={{ color: ADM_MUTED }}>{t("country")}</dt><dd style={{ color: ADM_TEXT }}>{donor.land ?? t("noValue")}</dd></div>
        </dl>
        {donor.notities && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: ADM_BORDER }}>
            <dt style={{ color: ADM_MUTED }} className="mb-1">{t("notities")}</dt>
            <dd style={{ color: ADM_TEXT }} className="whitespace-pre-wrap">{donor.notities}</dd>
          </div>
        )}
        <p className="mt-4 text-sm font-medium" style={{ color: ADM_TEXT }}>{t("totalDonated")}: {formatCurrency(totalDonated)}</p>
      </div>

      {recurring && (
        <div className="rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: ADM_MUTED }}>{t("recurringInfo")}</h3>
          <p className="text-sm" style={{ color: ADM_TEXT }}>{formatCurrency(recurring.bedrag, recurring.valuta ?? "EUR")} / {freqKeys[recurring.frequentie ?? ""] ?? recurring.frequentie} — {statusLabel(recurring.status)}</p>
          <p className="text-sm" style={{ color: ADM_MUTED }}>{t("startDate")}: {formatDate(recurring.start_datum)} — {t("nextPayment")}: {formatDate(recurring.volgende_betaling_datum)}</p>
          {recurring.provider_subscription_id && <p className="text-xs mt-1" style={{ color: ADM_MUTED }}>ID: {recurring.provider_subscription_id}</p>}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="p-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: ADM_BORDER }}>
          <h3 className="text-sm font-semibold" style={{ color: ADM_TEXT }}>{t("donationHistory")}</h3>
          <select value={donationMethodeFilter} onChange={(e) => setDonationMethodeFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
            <option value="">{t("filterMethodAll")}</option>
            <option value="paypal">{t("filterMethodPaypal")}</option>
            <option value="bank">{t("filterMethodBank")}</option>
            <option value="other">{t("filterMethodOther")}</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("date")}</th>
                <th className="text-left p-3">{t("amount")}</th>
                <th className="text-left p-3">{t("method")}</th>
                <th className="text-left p-3">{t("status")}</th>
                <th className="text-left p-3">{t("reference")}</th>
                <th className="text-left p-3">{t("campaign")}</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = donationMethodeFilter === "paypal" ? donations.filter((d) => d.methode === "paypal") : donationMethodeFilter === "bank" ? donations.filter((d) => d.methode === "bank") : donationMethodeFilter === "other" ? donations.filter((d) => d.methode === "overig" || !d.methode) : donations;
                if (filtered.length === 0) return <tr><td colSpan={6} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noDonations")}</td></tr>;
                return filtered.map((d) => (
                  <tr key={d.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{formatDate(d.donatie_datum)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{formatCurrency(d.bedrag, d.valuta)} {d.anoniem ? `(${t("anonymous")})` : ""}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{d.methode ?? t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{statusLabel(d.status)}</td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{d.betalingskenmerk ?? t("noValue")}</td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>{d.campagne ?? t("noValue")}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {addDonationOpen && (
        <AddDonationModal
          donorId={id}
          t={t}
          onClose={() => setAddDonationOpen(false)}
          onSuccess={() => { refetch(); setAddDonationOpen(false); setToast({ type: "success", text: t("saveSuccess") }); }}
        />
      )}
      {addRecurringOpen && (
        <AddRecurringModal
          donorId={id}
          t={t}
          recurring={recurring}
          onClose={() => setAddRecurringOpen(false)}
          onSuccess={() => { refetch(); setAddRecurringOpen(false); setToast({ type: "success", text: t("saveSuccess") }); }}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => setDeleteConfirm(false)}>
          <div className="max-w-md w-full rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteConfirm")}</p>
            <div className="flex gap-3">
              <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: ADM_ERROR }}>{t("delete")}</button>
              <button type="button" onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddDonationModal({
  donorId,
  t,
  onClose,
  onSuccess,
}: {
  donorId: string;
  t: (k: string) => string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [bedrag, setBedrag] = useState("");
  const [valuta, setValuta] = useState("EUR");
  const [methode, setMethode] = useState("");
  const [status, setStatus] = useState("voltooid");
  const [donatie_datum, setDonatie_datum] = useState(new Date().toISOString().slice(0, 10));
  const [betalingskenmerk, setBetalingskenmerk] = useState("");
  const [campagne, setCampagne] = useState("");
  const [anoniem, setAnoniem] = useState(false);
  const [saving, setSaving] = useState(false);
  const ADM_BORDER = "#e2e8f0";
  const ADM_TEXT = "#1e293b";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(bedrag);
    if (Number.isNaN(amount) || amount <= 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/donors/${donorId}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedrag: amount,
          valuta,
          methode: methode || null,
          status,
          donatie_datum,
          betalingskenmerk: betalingskenmerk.trim() || null,
          campagne: campagne.trim() || null,
          anoniem,
        }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="max-w-md w-full rounded-xl border p-6 max-h-[90vh] overflow-auto" style={{ background: "#fff", borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: ADM_TEXT }}>{t("addDonation")}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("amount")} *</label>
            <input type="number" step="0.01" min="0" value={bedrag} onChange={(e) => setBedrag(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("currency")}</label>
            <select value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              {VALUTA_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("method")}</label>
            <select value={methode} onChange={(e) => setMethode(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              <option value="">{t("noValue")}</option>
              {METHODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("status")}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              {DONATION_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("date")}</label>
            <input type="date" value={donatie_datum} onChange={(e) => setDonatie_datum(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("reference")}</label>
            <input type="text" value={betalingskenmerk} onChange={(e) => setBetalingskenmerk(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("campaign")}</label>
            <input type="text" value={campagne} onChange={(e) => setCampagne(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={anoniem} onChange={(e) => setAnoniem(e.target.checked)} />
            <span className="text-sm" style={{ color: ADM_TEXT }}>{t("anonymous")}</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>{saving ? t("loading") : t("save")}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddRecurringModal({
  donorId,
  t,
  recurring,
  onClose,
  onSuccess,
}: {
  donorId: string;
  t: (k: string) => string;
  recurring: Recurring;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [bedrag, setBedrag] = useState(recurring?.bedrag?.toString() ?? "");
  const [valuta, setValuta] = useState(recurring?.valuta ?? "EUR");
  const [frequentie, setFrequentie] = useState(recurring?.frequentie ?? "maandelijks");
  const [methode, setMethode] = useState(recurring?.methode ?? "");
  const [provider_subscription_id, setProviderSubscriptionId] = useState(recurring?.provider_subscription_id ?? "");
  const [start_datum, setStart_datum] = useState(recurring?.start_datum ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState(recurring?.status ?? "actief");
  const [saving, setSaving] = useState(false);
  const ADM_BORDER = "#e2e8f0";
  const ADM_TEXT = "#1e293b";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(bedrag);
    if (Number.isNaN(amount) || amount <= 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/donors/${donorId}/recurring`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedrag: amount,
          valuta,
          frequentie,
          methode: methode || null,
          provider_subscription_id: provider_subscription_id.trim() || null,
          start_datum,
          status,
        }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="max-w-md w-full rounded-xl border p-6 max-h-[90vh] overflow-auto" style={{ background: "#fff", borderColor: ADM_BORDER }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: ADM_TEXT }}>{t("addRecurring")}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("amountPerMonth")} *</label>
            <input type="number" step="0.01" min="0" value={bedrag} onChange={(e) => setBedrag(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("currency")}</label>
            <select value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              {VALUTA_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("frequency")}</label>
            <select value={frequentie} onChange={(e) => setFrequentie(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{t(`frequencies.${f}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("method")}</label>
            <select value={methode} onChange={(e) => setMethode(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              <option value="">{t("noValue")}</option>
              {RECURRING_METHODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("providerSubscriptionId")}</label>
            <input type="text" value={provider_subscription_id} onChange={(e) => setProviderSubscriptionId(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} placeholder={t("placeholderProviderId")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("startDate")}</label>
            <input type="date" value={start_datum} onChange={(e) => setStart_datum(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>{t("status")}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: ADM_BORDER }}>
              {RECURRING_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: ADM_ACCENT }}>{saving ? t("loading") : t("save")}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{t("cancel")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
