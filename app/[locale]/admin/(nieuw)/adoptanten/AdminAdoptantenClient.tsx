"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { AdoptantRow } from "./page";

const ANIMALS_BASE_URL = "https://db.savedsouls-foundation.org";
const PLACEHOLDER_ANIMAL = "/icons/paw.svg";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_GREEN = "#3D8B5E";
const ADM_YELLOW = "#B45309";
const ADM_ERROR = "#dc2626";

const adoptantStapLabels: Record<number, string> = {
  1: "Aangemeld als adoptant",
  2: "Gesprek gehad met SSF",
  3: "Documenten ingezonden",
  4: "Adoptie overdracht dier 🐾",
};

export default function AdminAdoptantenClient({ initialRows }: { initialRows: AdoptantRow[] }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<AdoptantRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingStep, setSavingStep] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState("");
  const [detailAnimalImage, setDetailAnimalImage] = useState<string | null>(null);
  const [detailAnimalType, setDetailAnimalType] = useState<"dog" | "cat" | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return initialRows;
    return initialRows.filter((r) => {
      const naam = [r.voornaam, r.achternaam].filter(Boolean).join(" ").toLowerCase();
      return naam.includes(q);
    });
  }, [initialRows, search]);

  function openDetail(row: AdoptantRow) {
    setDetail(row);
    setNotesDraft(row.notities ?? "");
    setDetailAnimalImage(null);
    setDetailAnimalType(null);
  }

  useEffect(() => {
    if (!detail?.dierId) return;
    const id = String(detail.dierId);
    fetch("/api/animals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.dogs && !data?.cats) return;
        const dogs = data.dogs || [];
        const cats = data.cats || [];
        const dog = dogs.find((a: { id: string }) => String(a.id) === id);
        const cat = cats.find((a: { id: string }) => String(a.id) === id);
        const animal = dog || cat;
        if (animal) {
          setDetailAnimalType(dog ? "dog" : "cat");
          const raws = animal.images?.length ? animal.images : (animal.image ? [animal.image] : []);
          const url = raws[0]
            ? (raws[0].startsWith("http") ? raws[0] : `${ANIMALS_BASE_URL}${raws[0].startsWith("/") ? "" : "/"}${raws[0]}`)
            : null;
          setDetailAnimalImage(url);
        }
      })
      .catch(() => {});
  }, [detail?.dierId]);

  async function saveNotes() {
    if (!detail) return;
    setSavingNotes(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/adoptanten/${detail.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notities: notesDraft }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? t("errorGeneric"));
      }
      setDetail({ ...detail, notities: notesDraft });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setSavingNotes(false);
    }
  }

  async function updateStep(profileId: string, row: AdoptantRow, nieuweStap: number) {
    setSavingStep(profileId);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ huidige_stap: nieuweStap, updated_at: new Date().toISOString() })
        .eq("id", profileId);
      if (updateError) throw updateError;
      const res = await fetch("/api/portal/notify-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: row.email,
          naam: [row.voornaam, row.achternaam].filter(Boolean).join(" "),
          stepLabel: adoptantStapLabels[nieuweStap],
          role: "adoptant",
          dierNaam: row.dierNaam ?? undefined,
          dierInfo: row.dierId ? `ID: ${row.dierId}` : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("errorGeneric"));
      }
      if (detail?.id === profileId) setDetail({ ...detail, huidige_stap: nieuweStap });
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setSavingStep(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: ADM_MUTED }}>
        {t("adoptantenIntro")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder={t("searchPlaceholderAd")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        />
      </div>

      {error && (
        <p className="text-sm" style={{ color: ADM_ERROR }}>
          {error}
        </p>
      )}

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("name")}</th>
                <th className="text-left p-3">{t("step")}</th>
                <th className="text-left p-3">{t("notesPreview")}</th>
                <th className="text-left p-3">{t("registeredAt")}</th>
                <th className="text-left p-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                  <td className="p-3" style={{ color: ADM_TEXT }}>
                    {[r.voornaam, r.achternaam].filter(Boolean).join(" ") || t("noValue")}
                  </td>
                  <td className="p-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: (r.huidige_stap ?? 0) === 4 ? "rgba(61,139,94,.2)" : "rgba(240,192,80,.2)",
                        color: (r.huidige_stap ?? 0) === 4 ? ADM_GREEN : ADM_YELLOW,
                      }}
                    >
                      {(r.huidige_stap ?? 0) === 4 ? t("completed") : t("stepN", { n: r.huidige_stap ?? 1 })}
                    </span>
                  </td>
                  <td className="p-3 max-w-[200px] truncate" style={{ color: ADM_TEXT }}>
                    {r.notities ? `${r.notities.slice(0, 60)}${r.notities.length > 60 ? t("ellipsis") : ""}` : t("noValue")}
                  </td>
                  <td className="p-3" style={{ color: ADM_MUTED }}>
                    {r.aangemeld_op ? new Date(r.aangemeld_op).toLocaleDateString("nl-NL", { dateStyle: "short" }) : t("noValue")}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => openDetail(r)}
                      className="text-sm font-medium"
                      style={{ color: ADM_ACCENT }}
                    >
                      {t("view")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                {[detail.voornaam, detail.achternaam].filter(Boolean).join(" ") || t("adoptantLabel")}
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
                <dt style={{ color: ADM_MUTED }}>{t("currentStep")}</dt>
                <dd>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: (detail.huidige_stap ?? 0) === 4 ? "rgba(61,139,94,.2)" : "rgba(240,192,80,.2)",
                      color: (detail.huidige_stap ?? 0) === 4 ? ADM_GREEN : ADM_YELLOW,
                    }}
                  >
                    {adoptantStapLabels[detail.huidige_stap ?? 1]}
                  </span>
                </dd>
              </div>
              {(detail.dierNaam || detail.dierId) && (
                <div>
                  <dt style={{ color: ADM_MUTED }} className="mb-1">{t("requestedAnimal")}</dt>
                  <dd className="flex items-center gap-3 mt-1">
                    <div
                      className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 bg-stone-100"
                      style={{ borderColor: ADM_BORDER }}
                    >
                      <img
                        src={detailAnimalImage ?? PLACEHOLDER_ANIMAL}
                        alt={detail.dierNaam ?? ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.onerror = null;
                          el.src = PLACEHOLDER_ANIMAL;
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium" style={{ color: ADM_TEXT }}>
                        {detail.dierNaam ?? `ID: ${detail.dierId}`}
                      </p>
                      {detail.dierId && detailAnimalType && (
                        <Link
                          href={`/${locale}/adopt/${detailAnimalType}/${detail.dierId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline"
                          style={{ color: ADM_ACCENT }}
                        >
                          {t("openAnimalPage")}
                        </Link>
                      )}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-4">
              <label className="block text-sm mb-1" style={{ color: ADM_MUTED }}>
                {t("notesEditable")}
              </label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none resize-y"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              />
              <button
                type="button"
                disabled={savingNotes}
                onClick={saveNotes}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ACCENT }}
              >
                {savingNotes ? t("savingNotes") : t("saveNotes")}
              </button>
            </div>
            <div className="mt-6 pt-4 border-t" style={{ borderColor: ADM_BORDER }}>
              <p className="text-sm mb-2" style={{ color: ADM_MUTED }}>
                {t("updateStep")} ({t("updateStepHint")})
              </p>
              <div className="flex flex-wrap gap-2">
                {([1, 2, 3, 4] as const).map((stap) => (
                  <button
                    key={stap}
                    type="button"
                    disabled={savingStep === detail.id || (detail.huidige_stap ?? 0) === stap}
                    onClick={() => updateStep(detail.id, detail, stap)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{
                      background: (detail.huidige_stap ?? 0) === stap ? ADM_ACCENT : "rgba(42,157,143,.2)",
                      color: (detail.huidige_stap ?? 0) === stap ? "#fff" : ADM_ACCENT,
                    }}
                  >
                    {savingStep === detail.id ? t("loading") : `${t("step")} ${stap}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
