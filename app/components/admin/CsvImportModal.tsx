"use client";

import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 1000;
const PREVIEW_ROWS = 5;

export type CsvColumn = { key: string; label: string };

const SKIP_KEY = "__skip__";

type Props = {
  title: string;
  columns: CsvColumn[];
  exampleCsvContent: string;
  exampleFilename: string;
  apiEndpoint: string;
  onClose: () => void;
  onImported: () => void;
  /** Validate row: return error string or null. Required: naam + email (or email-only for newsletter). */
  validateRow?: (row: Record<string, string>) => string | null;
  /** Keys that are required (shown with * in mapping dropdown). */
  requiredKeys?: string[];
};

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const header = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function normalizeHeader(h: string): string {
  return (h ?? "").toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
}

function suggestMapping(fileHeader: string, columns: CsvColumn[]): string {
  const n = normalizeHeader(fileHeader);
  if (!n) return SKIP_KEY;
  for (const c of columns) {
    if (normalizeHeader(c.key) === n || normalizeHeader(c.label) === n) return c.key;
    if (n.includes(normalizeHeader(c.key)) || normalizeHeader(c.key).includes(n)) return c.key;
  }
  return SKIP_KEY;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let val = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          i++;
          if (line[i] === '"') {
            val += '"';
            i++;
          } else break;
        } else {
          val += line[i];
          i++;
        }
      }
      out.push(val);
    } else {
      let val = "";
      while (i < line.length && line[i] !== ",") {
        val += line[i];
        i++;
      }
      out.push(val.trim());
      if (line[i] === ",") i++;
    }
  }
  return out;
}

export default function CsvImportModal({
  title,
  columns,
  exampleCsvContent,
  exampleFilename,
  apiEndpoint,
  onClose,
  onImported,
  validateRow,
  requiredKeys = [],
}: Props) {
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "result">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number; details?: string[] } | null>(null);

  const fileHeaders = rows.length > 0 ? Object.keys(rows[0]) : [];

  const getMappedRows = useCallback((): Record<string, string>[] => {
    return rows.map((row) => {
      const out: Record<string, string> = {};
      for (const [fileCol, targetKey] of Object.entries(columnMapping)) {
        if (targetKey && targetKey !== SKIP_KEY) {
          const normalizedKey =
            targetKey.toLowerCase() === "e-mail" || targetKey.toLowerCase() === "email" ? "email" : targetKey;
          out[normalizedKey] = (row[fileCol] ?? "").trim();
        }
      }
      return out;
    });
  }, [rows, columnMapping]);

  const mappedRows = step === "preview" || step === "result" ? getMappedRows() : [];
  const previewHeaderKeys = [...new Set(Object.values(columnMapping).filter((k) => k && k !== SKIP_KEY))];

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setParseError(`Bestand te groot (max ${MAX_FILE_SIZE / 1024 / 1024} MB)`);
      setFile(null);
      setRows([]);
      return;
    }
    setParseError(null);
    setFile(f);
    const name = (f.name ?? "").toLowerCase();
    const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls");

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as (string | number)[][];
          if (rawRows.length < 2) {
            setParseError("Excel-bestand heeft geen data (minimaal header + 1 rij)");
            setRows([]);
            return;
          }
          const header = rawRows[0].map((c) => String(c ?? "").trim());
          const parsed: Record<string, string>[] = [];
          for (let i = 1; i < rawRows.length; i++) {
            const row: Record<string, string> = {};
            header.forEach((h, idx) => {
              const val = rawRows[i][idx];
              row[h] = val != null ? String(val).trim() : "";
            });
            parsed.push(row);
          }
          if (parsed.length > MAX_ROWS) {
            setParseError(`Maximaal ${MAX_ROWS} rijen toegestaan. Gevonden: ${parsed.length}`);
            setRows([]);
          } else {
            setRows(parsed);
            const headers = parsed.length > 0 ? Object.keys(parsed[0]) : [];
            const initial: Record<string, string> = {};
            headers.forEach((h) => { initial[h] = suggestMapping(h, columns); });
            setColumnMapping(initial);
            setStep("mapping");
          }
        } catch (err) {
          setParseError(err instanceof Error ? err.message : "Excel kon niet worden gelezen");
          setRows([]);
        }
      };
      reader.readAsArrayBuffer(f);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result ?? "");
          const parsed = parseCsv(text);
          if (parsed.length > MAX_ROWS) {
            setParseError(`Maximaal ${MAX_ROWS} rijen toegestaan. Gevonden: ${parsed.length}`);
            setRows([]);
          } else {
            setRows(parsed);
            const headers = parsed.length > 0 ? Object.keys(parsed[0]) : [];
            const initial: Record<string, string> = {};
            headers.forEach((h) => { initial[h] = suggestMapping(h, columns); });
            setColumnMapping(initial);
            setStep("mapping");
          }
        } catch (err) {
          setParseError(err instanceof Error ? err.message : "CSV kon niet worden gelezen");
          setRows([]);
        }
      };
      reader.readAsText(f, "utf-8");
    }
  }, [columns]);

  const handleDownloadExample = useCallback(() => {
    const blob = new Blob([exampleCsvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exampleFilename;
    a.click();
    URL.revokeObjectURL(url);
  }, [exampleCsvContent, exampleFilename]);

  const defaultValidate = useCallback((row: Record<string, string>) => {
    const email = (row.email ?? "").trim().toLowerCase();
    const naam = (row.naam ?? "").trim();
    if (!email) return "E-mail is verplicht";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ongeldig e-mailadres";
    if (!naam) return "Naam is verplicht";
    return null;
  }, []);

  const validate = validateRow ?? defaultValidate;

  const handleConfirmImport = useCallback(async () => {
    const toSend = getMappedRows();
    const invalid = toSend
      .map((r, i) => {
        console.log("validating row:", r);
        return { row: i + 2, err: validate(r) };
      })
      .filter((x) => x.err != null);
    if (invalid.length > 0) {
      setParseError(`Rij ${invalid[0].row}: ${invalid[0].err}. Pas de koppeling of gegevens aan.`);
      return;
    }
    setParseError(null);
    setImporting(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: toSend }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ success: 0, errors: toSend.length, details: [data.error ?? "Import mislukt"] });
      } else {
        setResult({
          success: data.success ?? 0,
          errors: data.errors ?? 0,
          details: data.details,
        });
        if ((data.success ?? 0) > 0) {
          onImported();
        }
      }
      setStep("result");
    } catch (err) {
      setResult({
        success: 0,
        errors: toSend.length,
        details: [err instanceof Error ? err.message : "Netwerkfout"],
      });
      setStep("result");
    } finally {
      setImporting(false);
    }
  }, [getMappedRows, apiEndpoint, validate, onImported]);

  const resetToUpload = useCallback(() => {
    setStep("upload");
    setFile(null);
    setRows([]);
    setColumnMapping({});
    setParseError(null);
  }, []);

  const dropdownOptions = [
    { value: SKIP_KEY, label: "Overslaan" },
    ...columns.map((c) => ({
      value: c.key,
      label: c.label + (requiredKeys.includes(c.key) ? " *" : ""),
    })),
  ];
  const previewRows = mappedRows.slice(0, PREVIEW_ROWS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border p-6 shadow-lg"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: ADM_TEXT }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none p-1"
            style={{ color: ADM_MUTED }}
            aria-label="Sluiten"
          >
            ×
          </button>
        </div>

        {step === "upload" && (
          <>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownloadExample}
                className="w-full py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                📥 Download voorbeeld-CSV
              </button>
              <p className="text-xs" style={{ color: ADM_MUTED }}>
                Vereiste kolommen: {columns.map((c) => c.label).join(", ")}
              </p>
              <label className="block">
                <span className="sr-only">CSV kiezen</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFile}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                  style={{ color: ADM_TEXT }}
                />
              </label>
            </div>
          </>
        )}

        {step === "mapping" && (
          <>
            <p className="text-sm mb-3" style={{ color: ADM_MUTED }}>
              Koppel de kolommen uit je bestand aan de velden. Niet relevante kolommen kun je overslaan.
            </p>
            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
              {fileHeaders.map((fileCol) => (
                <div key={fileCol} className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm shrink-0 min-w-[100px] truncate" style={{ color: ADM_TEXT }} title={fileCol}>
                    {fileCol}
                  </span>
                  <span className="text-xs" style={{ color: ADM_MUTED }}>→</span>
                  <select
                    value={columnMapping[fileCol] ?? SKIP_KEY}
                    onChange={(e) => setColumnMapping((prev) => ({ ...prev, [fileCol]: e.target.value }))}
                    className="flex-1 min-w-[140px] px-2 py-1.5 rounded border text-sm"
                    style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                  >
                    {dropdownOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetToUpload}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                Ander bestand
              </button>
              <button
                type="button"
                onClick={() => setStep("preview")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: ADM_ACCENT }}
              >
                Volgende
              </button>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            {parseError && (
              <p className="text-sm mb-3" style={{ color: "#dc2626" }}>
                {parseError}
              </p>
            )}
            <p className="text-sm mb-2" style={{ color: ADM_MUTED }}>
              Eerste {PREVIEW_ROWS} rijen ({mappedRows.length} totaal, gemapte kolommen):
            </p>
            <div className="overflow-x-auto border rounded-lg mb-4 max-h-48 overflow-y-auto" style={{ borderColor: ADM_BORDER }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ color: ADM_MUTED }}>
                    {previewHeaderKeys.map((k) => (
                      <th key={k} className="text-left p-2 whitespace-nowrap">
                        {columns.find((c) => c.key === k)?.label ?? k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: ADM_BORDER }}>
                      {previewHeaderKeys.map((k) => (
                        <td key={k} className="p-2 truncate max-w-[120px]" style={{ color: ADM_TEXT }}>
                          {row[k] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("mapping")}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                Terug
              </button>
              <button
                type="button"
                onClick={resetToUpload}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                Ander bestand
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importing}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ACCENT }}
              >
                {importing ? "Bezig…" : "Bevestig import"}
              </button>
            </div>
          </>
        )}

        {step === "result" && result && (
          <>
            <p className="text-sm mb-2" style={{ color: ADM_TEXT }}>
              <strong>{result.success}</strong> succesvol geïmporteerd, <strong>{result.errors}</strong> fouten.
            </p>
            {result.details && result.details.length > 0 && (
              <ul className="text-xs mb-4 list-disc pl-4 max-h-32 overflow-y-auto" style={{ color: ADM_MUTED }}>
                {result.details.slice(0, 20).map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
                {result.details.length > 20 && <li>… en {result.details.length - 20} meer</li>}
              </ul>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: ADM_ACCENT }}
            >
              Sluiten
            </button>
          </>
        )}
      </div>
    </div>
  );
}
