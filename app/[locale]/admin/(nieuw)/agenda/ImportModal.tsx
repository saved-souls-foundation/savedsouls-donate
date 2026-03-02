"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { EVENT_CATEGORY_IDS, EVENT_CATEGORIES, type EventCategory } from "@/lib/agendaConfig";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

type Props = {
  onClose: () => void;
  onImported: () => void;
};

type ColumnKey = "title" | "date" | "time" | "category" | "animal" | "person" | "notes" | "_skip";
const COLUMN_OPTIONS: { value: ColumnKey; label: string }[] = [
  { value: "_skip", label: "— Niet gebruiken" },
  { value: "title", label: "Titel" },
  { value: "date", label: "Datum" },
  { value: "time", label: "Tijd" },
  { value: "category", label: "Categorie" },
  { value: "animal", label: "Dier" },
  { value: "person", label: "Persoon" },
  { value: "notes", label: "Notities" },
];

function parseFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      try {
        if (file.name.toLowerCase().endsWith(".json")) {
          const data = JSON.parse(text);
          const rows = Array.isArray(data) ? data : Array.isArray(data.events) ? data.events : [data];
          resolve(rows.map((r: Record<string, unknown>) => {
            const row: Record<string, string> = {};
            Object.entries(r).forEach(([k, v]) => { row[k] = String(v ?? ""); });
            return row;
          }));
        } else {
          const lines = text.split(/\r?\n/).filter(Boolean);
          const header = lines[0].split(/[,;\t]/).map((h) => h.trim());
          const rows = lines.slice(1).map((line) => {
            const values = line.split(/[,;\t]/).map((v) => v.trim());
            const row: Record<string, string> = {};
            header.forEach((h, i) => { row[h] = values[i] ?? ""; });
            return row;
          });
          resolve(rows);
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}

function parseDate(s: string): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(s.trim());
  return isNaN(d.getTime()) ? null : d;
}

export default function ImportModal({ onClose, onImported }: Props) {
  const t = useTranslations("admin.agenda");
  const [step, setStep] = useState(1);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<Record<string, ColumnKey>>({});
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);

  const sourceKeys = useMemo(() => (rawRows[0] ? Object.keys(rawRows[0]) : []), [rawRows]);

  const mapping = useMemo(() => {
    const m: Record<ColumnKey, string | null> = {
      title: null,
      date: null,
      time: null,
      category: null,
      animal: null,
      person: null,
      notes: null,
      _skip: null,
    };
    sourceKeys.forEach((key) => {
      const choice = columns[key];
      if (choice && choice !== "_skip") m[choice] = key;
    });
    return m;
  }, [sourceKeys, columns]);

  const parsed = useMemo(() => {
    return rawRows.map((row, idx) => {
      const title = (mapping.title ? row[mapping.title] : "")?.trim() || "";
      const dateStr = (mapping.date ? row[mapping.date] : "")?.trim() || "";
      const timeStr = (mapping.time ? row[mapping.time] : "")?.trim() || "";
      const category = (mapping.category ? row[mapping.category] : "")?.trim() || "afspraak";
      const date = parseDate(dateStr);
      const valid = title.length > 0 && date !== null;
      let categoryKey: EventCategory = "afspraak";
      if (EVENT_CATEGORY_IDS.includes(category as EventCategory)) categoryKey = category as EventCategory;
      else if (category) {
        const found = EVENT_CATEGORY_IDS.find((id) => EVENT_CATEGORIES[id].label.toLowerCase().includes(category.toLowerCase()));
        if (found) categoryKey = found;
      }
      const start = date ? `${date.toISOString().slice(0, 10)}T${timeStr.slice(0, 5) || "09:00"}:00` : "";
      return {
        idx,
        valid,
        title,
        start_time: start,
        category: categoryKey,
        animal_name: (mapping.animal ? row[mapping.animal] : "")?.trim() || null,
        assigned_to: (mapping.person ? row[mapping.person] : "")?.trim() || null,
        description: (mapping.notes ? row[mapping.notes] : "")?.trim() || null,
      };
    });
  }, [rawRows, mapping]);

  const validCount = parsed.filter((p) => p.valid).length;
  const errorCount = parsed.length - validCount;

  function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const ok = file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".json");
    if (!ok) return;
    parseFile(file)
      .then((rows) => {
        setRawRows(rows);
        setColumns({});
        setStep(2);
      })
      .catch(() => setStep(1));
  }

  async function doImport() {
    const toCreate = parsed.filter((p) => p.valid);
    if (toCreate.length === 0) return;
    setImporting(true);
    try {
      for (const p of toCreate) {
        await fetch("/api/admin/agenda/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: p.title,
            start_time: p.start_time,
            end_time: null,
            category: p.category,
            animal_name: p.animal_name,
            assigned_to: p.assigned_to,
            description: p.description,
          }),
        });
      }
      onImported();
      onClose();
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white border w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4 md:rounded-xl md:my-4 min-h-[90vh] md:min-h-0"
        style={{ borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
          <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
            📥 {t("import")}
          </h2>
          <button type="button" onClick={onClose} className="text-xl leading-none" style={{ color: ADM_MUTED }}>
            ×
          </button>
        </div>
        <div className="p-4 space-y-4">
          {step === 1 && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${dragOver ? "opacity-80" : ""}`}
              style={{ borderColor: ADM_BORDER }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}
              onClick={() => document.getElementById("import-file")?.click()}
            >
              <input
                id="import-file"
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={(e) => handleFile(e.target.files)}
              />
              <p className="text-sm" style={{ color: ADM_MUTED }}>{t("importStep1")}</p>
              <p className="text-xs mt-1" style={{ color: ADM_MUTED }}>CSV of JSON</p>
            </div>
          )}

          {step === 2 && sourceKeys.length > 0 && (
            <>
              <p className="text-sm font-medium" style={{ color: ADM_TEXT }}>{t("importStep2")}</p>
              <table className="w-full text-sm border rounded-lg overflow-hidden" style={{ borderColor: ADM_BORDER }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th className="text-left p-2" style={{ color: ADM_MUTED }}>Kolom in bestand</th>
                    <th className="text-left p-2" style={{ color: ADM_MUTED }}>Koppelen aan</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceKeys.map((key) => (
                    <tr key={key} className="border-t" style={{ borderColor: ADM_BORDER }}>
                      <td className="p-2 font-mono text-xs" style={{ color: ADM_TEXT }}>{key}</td>
                      <td className="p-2">
                        <select
                          value={columns[key] ?? "_skip"}
                          onChange={(e) => setColumns((c) => ({ ...c, [key]: e.target.value as ColumnKey }))}
                          className="w-full px-2 py-1 rounded border text-sm"
                          style={{ borderColor: ADM_BORDER }}
                        >
                          {COLUMN_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: ADM_ACCENT }}
              >
                Volgende → Preview
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm font-medium" style={{ color: ADM_TEXT }}>{t("importStep3")}</p>
              <p className="text-xs" style={{ color: ADM_MUTED }}>
                {t("rowsValid", { valid: validCount })} {errorCount > 0 && `, ${t("rowsErrors", { errors: errorCount })}`}
              </p>
              <div className="max-h-60 overflow-y-auto border rounded-lg" style={{ borderColor: ADM_BORDER }}>
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr style={{ borderBottom: `1px solid ${ADM_BORDER}` }}>
                      <th className="text-left p-2">Titel</th>
                      <th className="text-left p-2">Datum</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, 10).map((p) => (
                      <tr key={p.idx} className="border-t" style={{ borderColor: ADM_BORDER }}>
                        <td className="p-2" style={{ color: p.valid ? ADM_TEXT : "#dc2626" }}>{p.title || "—"}</td>
                        <td className="p-2 text-xs" style={{ color: ADM_MUTED }}>{p.start_time?.slice(0, 10) ?? "—"}</td>
                        <td className="p-2">{p.valid ? "✓" : "✗"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsed.length > 10 && <p className="text-xs" style={{ color: ADM_MUTED }}>… en {parsed.length - 10} meer</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: ADM_BORDER }}>
                  ← Terug
                </button>
                <button
                  type="button"
                  onClick={doImport}
                  disabled={validCount === 0 || importing}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: ADM_ACCENT }}
                >
                  {importing ? "Bezig…" : t("importEvents", { count: validCount })}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
