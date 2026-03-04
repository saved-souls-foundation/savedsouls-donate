"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { VolunteerRow } from "./page";
import { StatCard, TableWrapper, Avatar, QuickActions, EmptyState } from "../components/ui/design-system";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_GREEN = "#3D8B5E";
const ADM_YELLOW = "#B45309";
const ADM_ERROR = "#dc2626";

const vrijwilligerStapLabels: Record<number, string> = {
  1: "Aangemeld & ingeschreven",
  2: "Video call ingepland",
  3: "Documenten ontvangen",
  4: "Reis & plan gereed — welkom aan boord! 🇹🇭",
};

function getAreaLabel(t: (key: string) => string, noValue: string, area: string | null): string {
  if (!area) return noValue;
  const key = area === "lokaal" ? "areaLokaal" : area === "thailand" ? "areaThailand" : null;
  return key ? t(key) : area;
}

const AREA_OPTIONS: { value: string; label: string }[] = [
  { value: "thailand", label: "Op locatie in Thailand" },
  { value: "lokaal", label: "Vanuit huis" },
  { value: "beide", label: "Beide" },
];
const LANGUAGE_OPTIONS = ["nl", "en", "de", "es", "fr", "ru", "th"] as const;

export default function AdminVrijwilligersClient({ initialRows }: { initialRows: VolunteerRow[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<VolunteerRow | null>(null);
  const [savingStep, setSavingStep] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<VolunteerRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    language: "nl",
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return initialRows;
    return initialRows.filter((r) => {
      const naam = [r.voornaam, r.achternaam].filter(Boolean).join(" ").toLowerCase();
      const email = (r.email ?? "").toLowerCase();
      return naam.includes(q) || email.includes(q);
    });
  }, [initialRows, search]);

  async function updateStep(userId: string, row: VolunteerRow, nieuweStap: number) {
    setSavingStep(userId);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("volunteer_onboarding")
        .update({ step: nieuweStap, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (updateError) throw updateError;
      const res = await fetch("/api/portal/notify-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: row.email,
          naam: [row.voornaam, row.achternaam].filter(Boolean).join(" "),
          stepLabel: vrijwilligerStapLabels[nieuweStap],
          role: "vrijwilliger",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "E-mail kon niet worden verstuurd.");
      }
      if (nieuweStap === 4) {
        const travelRes = await fetch("/api/portal/send-travel-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: row.email ?? "",
            voornaam: row.voornaam ?? "",
            achternaam: row.achternaam ?? "",
            city: row.city ?? "",
            locale: row.language === "en" ? "en" : "nl",
          }),
        });
        if (!travelRes.ok) {
          const data = await travelRes.json().catch(() => ({}));
          throw new Error(data.error ?? "Reisplan-mail kon niet worden verstuurd.");
        }
      }
      if (detail?.user_id === userId) setDetail({ ...detail, step: nieuweStap });
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setSavingStep(null);
    }
  }

  async function handleDelete(row: VolunteerRow) {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/volunteers/${row.user_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteConfirm(null);
      if (detail?.user_id === row.user_id) setDetail(null);
      window.location.reload();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setDeleting(false);
    }
  }

  async function handleAddVolunteer(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.voornaam.trim() || !addForm.email.trim()) {
      setError("Voornaam en e-mail zijn verplicht.");
      return;
    }
    setAddSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voornaam: addForm.voornaam.trim(),
          achternaam: addForm.achternaam.trim() || undefined,
          email: addForm.email.trim(),
          phone: addForm.phone.trim() || undefined,
          city: addForm.city.trim() || undefined,
          area: addForm.area || undefined,
          language: addForm.language || "nl",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Opslaan mislukt.");
        return;
      }
      setAddModalOpen(false);
      setAddForm({ voornaam: "", achternaam: "", email: "", phone: "", city: "", area: "", language: "nl" });
      window.location.reload();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setAddSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: ADM_MUTED }}>
        {t("vrijwilligersIntro")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <input
          type="search"
          placeholder={t("searchPlaceholderVol")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        />
        <button
          type="button"
          onClick={() => { setAddModalOpen(true); setError(""); setAddForm({ voornaam: "", achternaam: "", email: "", phone: "", city: "", area: "", language: "nl" }); }}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white shrink-0"
          style={{ background: ADM_ACCENT }}
        >
          + Vrijwilliger toevoegen
        </button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: ADM_ERROR }}>
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🤝" label="Totaal vrijwilligers" value={initialRows.length} />
        <StatCard
          icon="✈️"
          label="Actief in Thailand"
          value={initialRows.filter((v) => (v as { status?: string }).status === "actief" || v.step === 4).length}
          accentColor="blue"
        />
        <StatCard
          icon="📅"
          label="Nieuwe aanmeldingen"
          value={initialRows.filter((v) => {
            const d = new Date((v as { aangemeld_op?: string }).aangemeld_op || v.created_at || 0);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length}
          sub="deze maand"
          accentColor="orange"
        />
        <StatCard
          icon="⏳"
          label="In behandeling"
          value={initialRows.filter((v) => (v.step ?? 0) < 4).length}
          accentColor="violet"
        />
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="🤝"
            title="Geen vrijwilligers gevonden"
            description="Voeg een vrijwilliger toe of pas je zoekopdracht aan"
            actionLabel="+ Vrijwilliger toevoegen"
            onAction={() => { setAddModalOpen(true); setError(""); setAddForm({ voornaam: "", achternaam: "", email: "", phone: "", city: "", area: "", language: "nl" }); }}
          />
        ) : (
          <TableWrapper>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left p-3">{t("name")}</th>
                  <th className="text-left p-3">{t("emailCol")}</th>
                  <th className="text-left p-3">{t("city")}</th>
                  <th className="text-left p-3">{t("area")}</th>
                  <th className="text-left p-3">{t("step")}</th>
                  <th className="text-left p-3">{t("registeredAt")}</th>
                  <th className="text-left p-3">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const naam = [r.voornaam, r.achternaam].filter(Boolean).join(" ") || t("noValue");
                  return (
                    <tr
                      key={r.user_id}
                      className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
                      onClick={() => setDetail(r)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={naam} size="sm" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{naam}</div>
                            <div className="text-xs text-gray-400">{r.email ?? t("noValue")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{r.email ?? t("noValue")}</td>
                      <td className="p-3 text-gray-900">{r.city ?? t("noValue")}</td>
                      <td className="p-3 text-gray-900">{getAreaLabel(t, t("noValue"), r.area)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${i <= (r.step ?? 0) ? "bg-[#2aa348]" : "bg-gray-200"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{(r.step ?? 0)}/4</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString("nl-NL", { dateStyle: "short" }) : t("noValue")}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <QuickActions
                          actions={[
                            { icon: "📧", label: "Email", onClick: () => setDetail(r) },
                            { icon: "📋", label: "Taken", onClick: () => setDetail(r) },
                            { icon: "✅", label: "Voltooien", onClick: () => updateStep(r.user_id, r, 4) },
                            { icon: "🗑️", label: "Verwijderen", onClick: () => setDeleteConfirm(r) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </div>

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => !deleting && setDeleteConfirm(null)}
        >
          <div
            className="max-w-md w-full rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("deleteVolunteerConfirm")}</p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ERROR }}
              >
                {deleting ? t("loading") : t("deleteButton")}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {t("members.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => !addSaving && setAddModalOpen(false)}
        >
          <div
            className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: ADM_TEXT }}>Vrijwilliger toevoegen</h3>
              <button
                type="button"
                onClick={() => !addSaving && setAddModalOpen(false)}
                className="text-xl leading-none"
                style={{ color: ADM_MUTED }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Voornaam *</label>
                <input
                  type="text"
                  required
                  value={addForm.voornaam}
                  onChange={(e) => setAddForm((f) => ({ ...f, voornaam: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Achternaam</label>
                <input
                  type="text"
                  value={addForm.achternaam}
                  onChange={(e) => setAddForm((f) => ({ ...f, achternaam: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>E-mail *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Telefoon</label>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Stad</label>
                <input
                  type="text"
                  value={addForm.city}
                  onChange={(e) => setAddForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Werkgebied</label>
                <select
                  value={addForm.area}
                  onChange={(e) => setAddForm((f) => ({ ...f, area: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  <option value="">—</option>
                  {AREA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Taal</label>
                <select
                  value={addForm.language}
                  onChange={(e) => setAddForm((f) => ({ ...f, language: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={addSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: ADM_ACCENT }}
                >
                  {addSaving ? t("loading") : "Opslaan"}
                </button>
                <button
                  type="button"
                  disabled={addSaving}
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  {t("members.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => setDetail(null)}
        >
          <div
            className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: ADM_TEXT }}>
                {[detail.voornaam, detail.achternaam].filter(Boolean).join(" ") || t("volunteerLabel")}
              </h3>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-xl leading-none"
                style={{ color: ADM_MUTED }}
              >
                ×
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("emailCol")}</dt>
                <dd style={{ color: ADM_TEXT }}>{detail.email ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("phone")}</dt>
                <dd style={{ color: ADM_TEXT }}>{detail.phone ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("city")}</dt>
                <dd style={{ color: ADM_TEXT }}>{detail.city ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("area")}</dt>
                <dd style={{ color: ADM_TEXT }}>{getAreaLabel(t, t("noValue"), detail.area)}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("motivation")}</dt>
                <dd style={{ color: ADM_TEXT }} className="whitespace-pre-wrap">{detail.motivation ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("callPreferenceLabel")}</dt>
                <dd style={{ color: ADM_TEXT }}>{detail.call_preference ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("languageLabel")}</dt>
                <dd style={{ color: ADM_TEXT }}>{detail.language ?? t("noValue")}</dd>
              </div>
              <div>
                <dt style={{ color: ADM_MUTED }}>{t("currentStep")}</dt>
                <dd>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: detail.step === 4 ? "rgba(61,139,94,.2)" : "rgba(240,192,80,.2)",
                      color: detail.step === 4 ? ADM_GREEN : ADM_YELLOW,
                    }}
                  >
                    {vrijwilligerStapLabels[detail.step]}
                  </span>
                </dd>
              </div>
            </dl>
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 justify-between" style={{ borderColor: ADM_BORDER }}>
              <div>
                <p className="text-sm mb-2" style={{ color: ADM_MUTED }}>
                  {t("updateStep")} ({t("updateStepHint")})
                </p>
                <div className="flex flex-wrap gap-2">
                {([1, 2, 3, 4] as const).map((stap) => (
                  <button
                    key={stap}
                    type="button"
                    disabled={savingStep === detail.user_id || detail.step === stap}
                    onClick={() => updateStep(detail.user_id, detail, stap)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{
                      background: detail.step === stap ? ADM_ACCENT : "rgba(42,157,143,.2)",
                      color: detail.step === stap ? "#fff" : ADM_ACCENT,
                    }}
                  >
                    {savingStep === detail.user_id ? t("loading") : `${t("step")} ${stap}`}
                  </button>
                ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setDetail(null); setDeleteConfirm(detail); }}
                className="px-4 py-2 rounded-lg border text-sm font-medium self-end"
                style={{ borderColor: ADM_ERROR, color: ADM_ERROR }}
              >
                {t("deleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
