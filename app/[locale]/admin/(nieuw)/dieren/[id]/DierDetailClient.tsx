"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DierRow } from "../page";

type GezondheidItem = {
  id: string;
  dier_id: string;
  datum: string | null;
  type: string | null;
  omschrijving: string | null;
  gewicht: number | null;
  dierenarts: string | null;
  kosten: number | null;
  bijlagen: unknown;
  created_at: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  vaccinatie: "Vaccinatie",
  behandeling: "Behandeling",
  controle: "Controle",
  gewicht: "Gewicht",
  operatie: "Operatie",
  overig: "Overig",
};

const VACCINATIE_VALIDITEIT_DAGEN = 365;

export default function DierDetailClient({ dier }: { dier: DierRow }) {
  const router = useRouter();
  const [tab, setTab] = useState<"info" | "gezondheid">("info");
  const [gezondheid, setGezondheid] = useState<GezondheidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ datum: "", type: "controle", omschrijving: "", gewicht: "", dierenarts: "", kosten: "" });

  const fetchGezondheid = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/dieren/${dier.id}/gezondheid`);
      if (res.ok) {
        const data = await res.json();
        setGezondheid(data.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [dier.id]);

  useEffect(() => {
    if (tab === "gezondheid") fetchGezondheid();
  }, [tab, fetchGezondheid]);

  async function handleAddGezondheid(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/dieren/${dier.id}/gezondheid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datum: form.datum || null,
          type: form.type,
          omschrijving: form.omschrijving || null,
          gewicht: form.gewicht ? parseFloat(form.gewicht) : null,
          dierenarts: form.dierenarts || null,
          kosten: form.kosten ? parseFloat(form.kosten) : null,
        }),
      });
      if (res.ok) {
        setForm({ datum: "", type: "controle", omschrijving: "", gewicht: "", dierenarts: "", kosten: "" });
        fetchGezondheid();
      }
    } finally {
      setSaving(false);
    }
  }

  const vaccinaties = gezondheid.filter((g) => g.type === "vaccinatie" && g.datum);
  const nu = new Date();
  const verlopenVaccinatie = vaccinaties.some((v) => {
    const d = new Date(v.datum!);
    d.setDate(d.getDate() + VACCINATIE_VALIDITEIT_DAGEN);
    return d < nu;
  });

  function exportPdf() {
    const { jsPDF } = require("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Gezondheidskaart: ${dier.naam ?? "Onbekend"}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Soort: ${dier.soort ?? "–"} | Ras: ${dier.ras ?? "–"} | Export: ${new Date().toLocaleDateString("nl-NL")}`, 14, 28);
    let y = 38;
    gezondheid.forEach((g) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const typeLabel = TYPE_LABELS[g.type ?? ""] ?? g.type ?? "–";
      const datumStr = g.datum ? new Date(g.datum).toLocaleDateString("nl-NL") : "–";
      doc.text(`${datumStr} — ${typeLabel}`, 14, y);
      if (g.omschrijving) doc.text(g.omschrijving.slice(0, 80) + (g.omschrijving.length > 80 ? "…" : ""), 20, y + 5);
      if (g.dierenarts) doc.text(`Dierenarts: ${g.dierenarts}`, 20, y + 10);
      y += 18;
    });
    doc.save(`gezondheidskaart-${dier.naam ?? dier.id}.pdf`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/dieren" className="text-[#2aa348] font-semibold hover:underline">
            ← Dieren
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900">
            {dier.naam ?? "Naamloos"} {dier.medisch_urgent && <span className="text-red-600" title="Medisch urgent">⚠️</span>}
          </h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {(["info", "gezondheid"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
              tab === t ? "border-[#2aa348] text-[#2aa348]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "info" ? "Info" : "Gezondheid"}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Naam", value: dier.naam ?? "–" },
            { label: "Soort", value: dier.soort ?? "–" },
            { label: "Ras", value: dier.ras ?? "–" },
            { label: "Leeftijd", value: dier.leeftijd ?? "–" },
            { label: "Status", value: dier.status ?? "–" },
            { label: "Locatie", value: dier.locatie ?? "–" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-gray-400 uppercase">{item.label}</div>
              <div className="text-sm font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
          {dier.beschrijving && (
            <div className="col-span-2 bg-gray-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-gray-400 uppercase">Beschrijving</div>
              <div className="text-sm text-gray-700 mt-1">{dier.beschrijving}</div>
            </div>
          )}
        </div>
      )}

      {tab === "gezondheid" && (
        <div className="space-y-6">
          {verlopenVaccinatie && (
            <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <div className="font-semibold text-red-800">Vaccinatie verlopen</div>
                <div className="text-sm text-red-700">Minimaal één vaccinatie is meer dan 12 maanden geleden. Plan een nieuwe vaccinatie.</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Tijdlijn</h2>
            <button
              type="button"
              onClick={exportPdf}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              📄 Exporteer PDF
            </button>
          </div>

          <form onSubmit={handleAddGezondheid} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Nieuwe entry</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Datum</label>
                <input
                  type="date"
                  value={form.datum}
                  onChange={(e) => setForm((f) => ({ ...f, datum: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Omschrijving</label>
              <textarea
                value={form.omschrijving}
                onChange={(e) => setForm((f) => ({ ...f, omschrijving: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Gewicht (kg)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.gewicht}
                  onChange={(e) => setForm((f) => ({ ...f, gewicht: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dierenarts</label>
                <input
                  type="text"
                  value={form.dierenarts}
                  onChange={(e) => setForm((f) => ({ ...f, dierenarts: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kosten (€)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.kosten}
                  onChange={(e) => setForm((f) => ({ ...f, kosten: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#2aa348] text-white text-sm font-semibold hover:bg-[#166534] disabled:opacity-50"
            >
              {saving ? "Opslaan…" : "Toevoegen"}
            </button>
          </form>

          {loading ? (
            <p className="text-gray-500 text-sm">Laden…</p>
          ) : gezondheid.length === 0 ? (
            <p className="text-gray-500 text-sm">Nog geen gezondheidsentries. Voeg hierboven een entry toe.</p>
          ) : (
            <div className="space-y-3">
              {gezondheid.map((g) => {
                const isVaccinatieVerlopen = g.type === "vaccinatie" && g.datum && (() => {
                  const d = new Date(g.datum);
                  d.setDate(d.getDate() + VACCINATIE_VALIDITEIT_DAGEN);
                  return d < new Date();
                })();
                return (
                  <div
                    key={g.id}
                    className={`flex gap-3 p-4 rounded-xl border ${
                      isVaccinatieVerlopen ? "border-red-300 bg-red-50/50" : "border-gray-200 bg-white"
                    }`}
                  >
                    {isVaccinatieVerlopen && <span className="text-red-600 shrink-0" title="Vaccinatie verlopen">🔴</span>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {g.datum ? new Date(g.datum).toLocaleDateString("nl-NL") : "–"}
                        </span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {TYPE_LABELS[g.type ?? ""] ?? g.type ?? "–"}
                        </span>
                      </div>
                      {g.omschrijving && <p className="text-sm text-gray-700 mt-1">{g.omschrijving}</p>}
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        {g.gewicht != null && <span>Gewicht: {g.gewicht} kg</span>}
                        {g.dierenarts && <span>Dierenarts: {g.dierenarts}</span>}
                        {g.kosten != null && <span>Kosten: €{g.kosten}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
