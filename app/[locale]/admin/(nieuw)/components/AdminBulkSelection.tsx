"use client";

import { useEffect, useRef } from "react";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";

type AdminBulkSelectAllThProps = {
  pageIds: string[];
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  /** Classes voor het <th> (eerste kolom selectie) */
  className?: string;
};

/** Eerste kolom in <thead>: master-checkbox „Selecteer alles” + omkeren. */
export function AdminBulkSelectAllTh({ pageIds, selectedIds, setSelectedIds, className }: AdminBulkSelectAllThProps) {
  const masterRef = useRef<HTMLInputElement>(null);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const someSelected = pageIds.some((id) => selectedIds.has(id));
  const disabled = pageIds.length === 0;

  useEffect(() => {
    const el = masterRef.current;
    if (el) el.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  return (
    <th
      scope="col"
      className={
        className ??
        "text-left p-3 align-top w-[min(12rem,32vw)] min-w-[8.5rem] max-w-[14rem]"
      }
    >
      <div className="flex flex-col gap-1.5">
        <label
          className={`flex items-start gap-2 text-xs font-medium leading-snug select-none text-inherit ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <input
            ref={masterRef}
            type="checkbox"
            disabled={disabled}
            checked={!disabled && allSelected}
            onChange={() => {
              if (disabled) return;
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (allSelected) pageIds.forEach((id) => next.delete(id));
                else pageIds.forEach((id) => next.add(id));
                return next;
              });
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#2aa348] focus:ring-2 focus:ring-[#2aa348]/30"
            aria-label="Selecteer alles op deze pagina"
          />
          <span className="pt-0.5">Selecteer alles</span>
        </label>
        {!disabled ? (
          <button
            type="button"
            onClick={() =>
              setSelectedIds((prev) => {
                const next = new Set(prev);
                pageIds.forEach((id) => {
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                });
                return next;
              })
            }
            className="w-max text-[11px] font-medium px-1.5 py-0.5 rounded border border-gray-200 hover:bg-gray-50"
            style={{ color: ADM_MUTED }}
          >
            Selectie omkeren
          </button>
        ) : null}
      </div>
    </th>
  );
}

type AdminBulkActionBarProps = {
  selectedCount: number;
  onEmail: () => void;
  onDelete: () => void;
  onClear?: () => void;
  /** Verberg bulk-verwijderen (bijv. tab zonder delete-API). */
  hideDelete?: boolean;
};

export function AdminBulkActionBar({ selectedCount, onEmail, onDelete, onClear, hideDelete }: AdminBulkActionBarProps) {
  if (selectedCount < 1) return null;
  return (
    <div
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b shadow-sm mb-4 rounded-t-xl"
      style={{ background: "#f0fdf4", borderColor: ADM_BORDER }}
    >
      <span className="text-sm font-semibold" style={{ color: ADM_TEXT }}>
        {selectedCount} geselecteerd
      </span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEmail}
          className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-[#2aa348] hover:bg-[#166534]"
        >
          E-mail sturen
        </button>
        {!hideDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "#7B1010" }}
        >
          Verwijderen
        </button>
        ) : null}
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-2 rounded-lg text-sm border"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            Wis selectie
          </button>
        ) : null}
      </div>
    </div>
  );
}

type AdminBulkUndoToastProps = {
  open: boolean;
  deletedCount: number;
  onUndo: () => void | Promise<void>;
  onExpired: () => void;
};

export function AdminBulkUndoToast({ open, deletedCount, onUndo, onExpired }: AdminBulkUndoToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => onExpired(), 10000);
    return () => clearTimeout(t);
  }, [open, onExpired]);

  if (!open) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] flex max-w-[95vw] -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 shadow-lg"
      style={{ background: "#ffffff", borderColor: ADM_BORDER }}
    >
      <span className="text-sm" style={{ color: ADM_TEXT }}>
        {deletedCount} {deletedCount === 1 ? "item verwijderd" : "items verwijderd"} —{" "}
        <button type="button" onClick={() => void onUndo()} className="font-semibold text-[#0d9488] underline">
          Ongedaan maken
        </button>
      </span>
    </div>
  );
}
