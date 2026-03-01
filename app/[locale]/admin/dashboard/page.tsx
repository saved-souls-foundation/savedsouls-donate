"use client";

import { useState, useEffect } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import Thermometer, { VRIJWILLIGER_STEPS, ADOPTANT_STEPS } from "@/app/components/Thermometer";
import type { ThermometerStep } from "@/app/components/Thermometer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const BRAND_GREEN = "#2d5a27";

type ProfileRow = {
  id: string;
  email: string | null;
  voornaam: string | null;
  achternaam: string | null;
  role: string | null;
  huidige_stap: number;
  notities: string | null;
  aangemeld_op: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"vrijwilliger" | "adoptant">("vrijwilliger");
  const [search, setSearch] = useState("");
  const [savingStep, setSavingStep] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/dashboard/login");
        return;
      }
      supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
        if (data?.role !== "admin") {
          router.replace("/dashboard/login");
          return;
        }
        loadProfiles(supabase);
      });
    });
  }, [hasSupabase, router]);

  function loadProfiles(supabase: ReturnType<typeof createClient>) {
    supabase
      .from("profiles")
      .select("id, email, voornaam, achternaam, role, huidige_stap, notities, aangemeld_op")
      .not("role", "is", null)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setProfiles([]);
        } else {
          setProfiles((data ?? []).map((r) => ({
            ...r,
            huidige_stap: Math.max(1, Number(r.huidige_stap) || 1),
          })));
        }
        setLoading(false);
      });
  }

  const filtered = profiles.filter((p) => {
    if (p.role !== tab) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    const naam = [p.voornaam, p.achternaam].filter(Boolean).join(" ") || "";
    return naam.toLowerCase().includes(q) || (p.email ?? "").toLowerCase().includes(q);
  });

  const steps: ThermometerStep[] = tab === "vrijwilliger" ? VRIJWILLIGER_STEPS : ADOPTANT_STEPS;
  const totalV = profiles.filter((p) => p.role === "vrijwilliger").length;
  const totalA = profiles.filter((p) => p.role === "adoptant").length;
  const thisMonth = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return profiles.filter((p) => {
      const d = p.aangemeld_op ? new Date(p.aangemeld_op) : null;
      return d && d >= start;
    }).length;
  })();

  async function updateStep(profileId: string, newStep: number, profile: ProfileRow) {
    setSavingStep(profileId);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ huidige_stap: newStep, updated_at: new Date().toISOString() })
      .eq("id", profileId);
    setSavingStep(null);
    if (error) {
      console.error(error);
      return;
    }
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, huidige_stap: newStep } : p))
    );
    const stepLabel = steps[newStep - 1]?.label ?? `Stap ${newStep}`;
    const email = profile.email;
    if (email) {
      try {
        await fetch("/api/portal/notify-step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            naam: profile.voornaam || profile.achternaam || "daar",
            stepLabel,
            role: profile.role,
          }),
        });
      } catch (e) {
        console.error("Notify step email failed", e);
      }
    }
  }

  async function saveNotes(profileId: string) {
    setSavingNotes(profileId);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ notities: notesDraft, updated_at: new Date().toISOString() })
      .eq("id", profileId);
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, notities: notesDraft } : p))
    );
    setEditingNotes(null);
    setSavingNotes(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
        <p className="text-stone-500">Laden…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <nav className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
        <Link href="/admin" className="font-bold" style={{ color: BRAND_GREEN }}>
          Saved Souls Admin
        </Link>
        <Link href="/dashboard/login" className="text-sm text-stone-500">
          Uitloggen
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
          Portal – Gebruikersbeheer
        </h1>

        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">Totaal vrijwilligers</p>
            <p className="text-2xl font-bold" style={{ color: BRAND_GREEN }}>{totalV}</p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">Totaal adoptanten</p>
            <p className="text-2xl font-bold" style={{ color: BRAND_GREEN }}>{totalA}</p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">Nieuwe aanmeldingen deze maand</p>
            <p className="text-2xl font-bold" style={{ color: BRAND_GREEN }}>{thisMonth}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["vrijwilliger", "adoptant"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: tab === t ? BRAND_GREEN : undefined,
                color: tab === t ? "#fff" : undefined,
              }}
            >
              {t === "vrijwilliger" ? "Vrijwilligers" : "Adoptanten"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            placeholder="Zoeken op naam of e-mail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                  <th className="text-left p-3 font-semibold">Naam</th>
                  <th className="text-left p-3 font-semibold">E-mail</th>
                  <th className="text-left p-3 font-semibold">Aangemeld op</th>
                  <th className="text-left p-3 font-semibold">Huidige stap</th>
                  <th className="text-left p-3 font-semibold">Acties / Notities</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100 dark:border-stone-700/50">
                    <td className="p-3">
                      {[row.voornaam, row.achternaam].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="p-3">{row.email ?? "—"}</td>
                    <td className="p-3">
                      {row.aangemeld_op
                        ? new Date(row.aangemeld_op).toLocaleDateString("nl-NL")
                        : "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Mini step circles */}
                        <div className="flex items-center gap-0.5">
                          {steps.map((_, idx) => {
                            const stepNum = idx + 1;
                            const isCompleted = stepNum < row.huidige_stap;
                            const isCurrent = stepNum === row.huidige_stap;
                            const isDisabled = savingStep === row.id;
                            return (
                              <button
                                key={stepNum}
                                type="button"
                                disabled={isDisabled}
                                title={steps[idx].label}
                                onClick={() => updateStep(row.id, stepNum, row)}
                                className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-opacity disabled:opacity-50"
                                style={{
                                  backgroundColor: isCompleted || isCurrent ? BRAND_GREEN : undefined,
                                  borderColor: isCompleted || isCurrent ? BRAND_GREEN : "#d6d3d1",
                                  color: isCompleted || isCurrent ? "#fff" : "#a8a29e",
                                }}
                              >
                                {isCompleted ? "✓" : stepNum}
                              </button>
                            );
                          })}
                        </div>
                        <select
                          value={row.huidige_stap}
                          onChange={(e) => updateStep(row.id, Number(e.target.value), row)}
                          disabled={savingStep === row.id}
                          className="ml-2 px-2 py-1 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
                        >
                          {steps.map((s, i) => (
                            <option key={i} value={i + 1}>
                              Stap {i + 1} – {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-3">
                      {editingNotes === row.id ? (
                        <div className="flex flex-col gap-1">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            rows={2}
                            className="w-full max-w-md px-2 py-1 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveNotes(row.id)}
                              disabled={savingNotes === row.id}
                              className="px-2 py-1 rounded text-sm font-medium text-white"
                              style={{ backgroundColor: BRAND_GREEN }}
                            >
                              {savingNotes === row.id ? "..." : "Opslaan"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNotes(null);
                                setNotesDraft("");
                              }}
                              className="px-2 py-1 rounded text-sm border border-stone-300"
                            >
                              Annuleren
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-stone-600 dark:text-stone-400 max-w-[200px] truncate">
                            {row.notities || "—"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotes(row.id);
                              setNotesDraft(row.notities ?? "");
                            }}
                            className="text-stone-500 hover:text-stone-700 text-xs"
                            title="Notities bewerken"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="p-6 text-center text-stone-500">Geen gebruikers in deze tab.</p>
          )}
        </div>
      </main>
    </div>
  );
}
