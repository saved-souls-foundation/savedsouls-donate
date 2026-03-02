"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Calendar, Copy, Trash2, FileDown, X, GripVertical } from "lucide-react";
import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import * as roosterService from "@/lib/roosterService";
import { getWeekStart, formatWeekRange, addWeeks, toISODate } from "./roosterUtils";
import { generateRosterPdf } from "./roosterPdf";
import { ZONE_IDS, ZONES, TIME_SLOT_IDS, TIME_SLOTS, TASKS_BY_ZONE, VOLUNTEER_COLORS } from "@/lib/roosterConfig";
import type { ZoneId } from "@/lib/roosterConfig";
import ShiftModal, { type RosterShift, type ShiftFormData } from "./ShiftModal";
import VolunteerModal, { type Volunteer } from "./VolunteerModal";

function rowToShift(r: roosterService.RosterShiftRow): RosterShift {
  return {
    id: r.id,
    volunteer_id: r.volunteer_id,
    volunteer_name: r.volunteer_name,
    volunteer_color: r.volunteer_color,
    zone: r.zone,
    task: r.task,
    day_of_week: r.day_of_week,
    time_slot: r.time_slot,
    week_start: String(r.week_start),
    notes: r.notes,
  };
}

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

function getShiftsInCell(
  shifts: RosterShift[],
  weekStart: string,
  zone: string,
  dayOfWeek: number,
  timeSlot: string
): RosterShift[] {
  return shifts.filter(
    (s) =>
      s.week_start === weekStart &&
      s.zone === zone &&
      s.day_of_week === dayOfWeek &&
      s.time_slot === timeSlot
  );
}

function cellId(zone: string, dayOfWeek: number, timeSlot: string) {
  return `cell|${zone}|${dayOfWeek}|${timeSlot}`;
}

function DraggableVolunteerItem({
  volunteer,
  shiftCount,
  children,
}: {
  volunteer: Volunteer;
  shiftCount: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: volunteer.id,
    data: { volunteer },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 p-2 rounded-lg border cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
      style={{ borderColor: ADM_BORDER }}
    >
      <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: ADM_MUTED }} />
      {children}
    </div>
  );
}

function DroppableCell({
  id,
  isHighlight,
  children,
}: {
  id: string;
  isHighlight: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const highlight = isOver || isHighlight;
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[44px] h-full rounded ${highlight ? "ring-2 ring-offset-1 ring-teal-500" : ""}`}
    >
      {children}
    </div>
  );
}

export default function RoosterClient() {
  const t = useTranslations("admin.rooster");
  const locale = useLocale();
  const daysShort = t.raw("daysShort") as string[];

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [mobileDayIndex, setMobileDayIndex] = useState(() => {
    const today = new Date();
    const ws = getWeekStart(today);
    const diff = Math.floor((today.getTime() - ws.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(0, Math.min(6, diff));
  });
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [shifts, setShifts] = useState<RosterShift[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [activeVolunteerId, setActiveVolunteerId] = useState<string | null>(null);
  const [hiddenZones, setHiddenZones] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const TOAST_MS = 3000;
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), TOAST_MS);
  }, []);
  const [shiftModal, setShiftModal] = useState<
    {
      open: true;
      shift?: RosterShift | null;
      prefilled?: { zone: string; dayOfWeek: number; timeSlot: string };
      prefilledVolunteer?: { id: string; name: string; color: string };
    } | { open: false }
  >({ open: false });

  const goPrevWeek = useCallback(() => setWeekStart((w) => addWeeks(w, -1)), []);
  const goNextWeek = useCallback(() => setWeekStart((w) => addWeeks(w, 1)), []);
  const goToday = useCallback(() => {
    const today = getWeekStart(new Date());
    setWeekStart(today);
    const diff = Math.floor((Date.now() - today.getTime()) / (24 * 60 * 60 * 1000));
    setMobileDayIndex(Math.max(0, Math.min(6, diff)));
  }, []);

  const fetchShifts = useCallback(async () => {
    const ws = toISODate(weekStart);
    try {
      const data = await roosterService.getShifts(ws);
      setShifts(data.map(rowToShift));
    } catch {
      setShifts([]);
    }
  }, [weekStart]);

  const fetchVolunteers = useCallback(async () => {
    try {
      const data = await roosterService.getVolunteers();
      setVolunteers(data as Volunteer[]);
    } catch {
      setVolunteers([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchShifts(), fetchVolunteers()]).finally(() => setLoading(false));
  }, [fetchShifts, fetchVolunteers]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("roster_shifts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "roster_shifts" }, () => fetchShifts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchShifts]);

  const handleCopyPreviousWeek = useCallback(async () => {
    setCopyDialogOpen(false);
    try {
      await roosterService.copyPreviousWeek(toISODate(weekStart));
      await fetchShifts();
      showToast(t("toastWeekCopied"));
    } catch {
      // ignore
    }
  }, [weekStart, fetchShifts, showToast, t]);
  const handleClearWeek = useCallback(async () => {
    setClearDialogOpen(false);
    try {
      await roosterService.clearWeek(toISODate(weekStart));
      await fetchShifts();
      showToast(t("toastWeekCleared"));
    } catch {
      // ignore
    }
  }, [weekStart, fetchShifts, showToast, t]);

  const weekLabel = formatWeekRange(weekStart, locale === "nl" ? "nl-NL" : "en-GB");
  const weekStartISO = toISODate(weekStart);
  const visibleZoneIds = ZONE_IDS.filter((z) => !hiddenZones.has(z));
  const toggleZone = useCallback((zoneId: string) => {
    setHiddenZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  }, []);

  const openAddShift = useCallback((zone: string, dayOfWeek: number, timeSlot: string) => {
    setShiftModal({ open: true, prefilled: { zone, dayOfWeek, timeSlot } });
  }, []);
  const openEditShift = useCallback((shift: RosterShift) => {
    setShiftModal({ open: true, shift });
  }, []);
  const closeShiftModal = useCallback(() => setShiftModal({ open: false }), []);
  const handleShiftDeleted = useCallback(async (shiftId: string) => {
    try {
      await roosterService.deleteShift(shiftId);
      await fetchShifts();
      showToast(t("toastDeleted"));
      closeShiftModal();
    } catch {
      closeShiftModal();
    }
  }, [closeShiftModal, fetchShifts, showToast, t]);
  const handleShiftSaved = useCallback(async (data: ShiftFormData) => {
    const shift = shiftModal.open && "shift" in shiftModal ? shiftModal.shift : null;
    try {
      if (shift) {
        await roosterService.updateShift(shift.id, {
          volunteer_id: data.volunteer_id,
          volunteer_name: data.volunteer_name,
          volunteer_color: data.volunteer_color,
          zone: data.zone,
          task: data.task,
          day_of_week: data.day_of_week,
          time_slot: data.time_slot,
          week_start: data.week_start,
          notes: data.notes || null,
        });
      } else {
        await roosterService.createShift({
          volunteer_id: data.volunteer_id,
          volunteer_name: data.volunteer_name,
          volunteer_color: data.volunteer_color,
          zone: data.zone,
          task: data.task,
          day_of_week: data.day_of_week,
          time_slot: data.time_slot,
          week_start: data.week_start,
          notes: data.notes || undefined,
        });
      }
      await fetchShifts();
      showToast(t("toastSaved"));
      closeShiftModal();
    } catch {
      closeShiftModal();
    }
  }, [closeShiftModal, fetchShifts, shiftModal, showToast, t]);

  const shiftCountByVolunteer = useCallback(
    (volunteerId: string) => shifts.filter((s) => s.volunteer_id === volunteerId).length,
    [shifts]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveVolunteerId(null);
      if (!over || !active) return;
      const volunteerId = String(active.id);
      const overId = String(over.id);
      if (!overId.startsWith("cell|")) return;
      const parts = overId.split("|");
      const zone = parts[1];
      const dayOfWeek = parseInt(parts[2], 10);
      const timeSlot = parts[3] ?? "ochtend";
      const vol = volunteers.find((v) => v.id === volunteerId);
      setShiftModal({
        open: true,
        prefilled: { zone, dayOfWeek, timeSlot },
        prefilledVolunteer: vol ? { id: vol.id, name: vol.name, color: vol.color } : undefined,
      });
    },
    [volunteers]
  );

  const handleVolunteerSaved = useCallback(async (data: { name: string; email: string; color: string }) => {
    try {
      await roosterService.createVolunteer({ name: data.name, email: data.email || undefined, color: data.color });
      await fetchVolunteers();
      setVolunteerModalOpen(false);
    } catch {
      setVolunteerModalOpen(false);
    }
  }, [fetchVolunteers]);

  return (
    <DndContext
      onDragStart={({ active }) => setActiveVolunteerId(String(active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveVolunteerId(null)}
    >
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[400px]">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Sidebar: alleen desktop */}
        <aside
          className="hidden lg:flex flex-col w-[220px] flex-shrink-0 border-r bg-white rounded-xl overflow-hidden"
          style={{ borderColor: ADM_BORDER }}
        >
          <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-medium text-sm" style={{ color: ADM_TEXT }}>
              {t("volunteers")}
            </h2>
            <button
              type="button"
              onClick={() => setVolunteerModalOpen(true)}
              className="p-1.5 rounded-lg text-sm font-medium hover:opacity-90"
              style={{ color: ADM_ACCENT }}
            >
              ➕ {t("addVolunteer")}
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {volunteers.length === 0 ? (
              <p className="text-sm" style={{ color: ADM_MUTED }}>{t("noVolunteers")}</p>
            ) : (
              volunteers.map((v) => (
                <DraggableVolunteerItem key={v.id} volunteer={v} shiftCount={shiftCountByVolunteer(v.id)}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: v.color }}>
                    {(v.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate" style={{ color: ADM_TEXT }}>{v.name}</div>
                    <div className="text-xs" style={{ color: ADM_MUTED }}>{shiftCountByVolunteer(v.id)} {t("servicesThisWeek")}</div>
                  </div>
                </DraggableVolunteerItem>
              ))
            )}
          </div>
        </aside>

        {/* Hoofdgebied: weeknavigatie + grid */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Weeknavigatie */}
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 border-b rounded-t-xl"
            style={{ borderColor: ADM_BORDER, backgroundColor: ADM_CARD }}
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrevWeek}
                className="p-2 rounded-lg hover:bg-stone-100"
                aria-label={t("weekNavPrev")}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: ADM_TEXT }} />
              </button>
              <span className="min-w-[180px] text-center text-sm font-medium" style={{ color: ADM_TEXT }}>
                {weekLabel}
              </span>
              <button
                type="button"
                onClick={goNextWeek}
                className="p-2 rounded-lg hover:bg-stone-100"
                aria-label={t("weekNavNext")}
              >
                <ChevronRight className="w-5 h-5" style={{ color: ADM_TEXT }} />
              </button>
            </div>
            <button
              type="button"
              onClick={goToday}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: ADM_ACCENT, color: "#fff" }}
            >
              <Calendar className="w-4 h-4" />
              {t("today")}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setCopyDialogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">{t("copyPreviousWeek")}</span>
              </button>
              <button
                type="button"
                onClick={() => setClearDialogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("clearWeek")}</span>
              </button>
              <button
                type="button"
                onClick={() => { generateRosterPdf(weekStartISO, weekLabel, shifts); showToast(t("toastPdfExported")); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">{t("exportPdf")}</span>
              </button>
            </div>
          </div>

          {/* Mobiel: dagtabs */}
          <div className="lg:hidden flex border-b overflow-x-auto" style={{ borderColor: ADM_BORDER }}>
            {daysShort.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMobileDayIndex(i)}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderBottomColor: mobileDayIndex === i ? ADM_ACCENT : "transparent",
                  color: mobileDayIndex === i ? ADM_ACCENT : ADM_MUTED,
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Grid-gebied: desktop = volledig grid, mobiel = per-dag zones */}
          <div className="flex-1 overflow-auto p-3 bg-stone-50 rounded-b-xl">
            {loading && (
              <p className="text-sm py-2" style={{ color: ADM_MUTED }}>{t("loading")}</p>
            )}
            {/* Desktop: rooster grid */}
            <div className="hidden lg:block overflow-auto">
              <table className="w-full border-collapse min-w-[800px]" style={{ borderColor: ADM_BORDER }}>
                <thead>
                  <tr style={{ backgroundColor: ADM_CARD }}>
                    <th className="text-left p-2 border text-sm font-medium w-[140px]" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>Zone / Tijdslot</th>
                    {daysShort.map((day, i) => (
                      <th key={i} className="p-2 border text-sm font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleZoneIds.map((zoneId) =>
                    TIME_SLOT_IDS.map((slotId) => {
                      const z = ZONES[zoneId as ZoneId];
                      const slot = TIME_SLOTS[slotId];
                      return (
                        <tr key={`${zoneId}-${slotId}`} style={{ backgroundColor: ADM_CARD }}>
                          <td
                            className="border p-1.5 text-xs font-medium"
                            style={{ borderColor: ADM_BORDER, color: ADM_TEXT, borderLeftWidth: 4, borderLeftColor: z.color, backgroundColor: `${z.color}18` }}
                          >
                            {z.icon} {z.label} — {slot.label}
                          </td>
                          {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                            const cellShifts = getShiftsInCell(shifts, weekStartISO, zoneId, dayOfWeek, slotId);
                            const isEmpty = cellShifts.length === 0;
                            return (
                              <td
                                key={dayOfWeek}
                                className="border p-1 align-top min-w-[100px]"
                                style={{ borderColor: ADM_BORDER, backgroundColor: `${z.color}10`, borderLeftWidth: 4, borderLeftColor: z.color }}
                              >
                                <DroppableCell id={cellId(zoneId, dayOfWeek, slotId)} isHighlight={!!activeVolunteerId}>
                                  <div className="text-[10px] text-stone-500 mb-0.5">{slot.label}</div>
                                  {isEmpty ? (
                                    <button
                                      type="button"
                                      onClick={() => openAddShift(zoneId, dayOfWeek, slotId)}
                                      className="w-full min-h-[44px] rounded border-2 border-dashed text-xs flex items-center justify-center hover:bg-white/60 transition-colors"
                                      style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
                                    >
                                      + {t("addShift")}
                                    </button>
                                  ) : (
                                    <div className="space-y-1">
                                      {cellShifts.map((s) => (
                                        <div
                                          key={s.id}
                                          onClick={() => openEditShift(s)}
                                          className="rounded p-1.5 text-xs cursor-pointer hover:opacity-90 flex items-start gap-1.5 group"
                                          style={{ backgroundColor: "#fff", borderLeft: `3px solid ${s.volunteer_color ?? ADM_ACCENT}` }}
                                        >
                                          <span className="font-medium truncate" style={{ color: ADM_TEXT }}>{s.volunteer_name ?? "—"}</span>
                                          <span className="truncate" style={{ color: ADM_MUTED }}>
                                            {(TASKS_BY_ZONE[zoneId as ZoneId]?.[s.task]?.icon ?? "")} {TASKS_BY_ZONE[zoneId as ZoneId]?.[s.task]?.label ?? s.task}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleShiftDeleted(s.id); }}
                                            className="ml-auto p-0.5 rounded opacity-70 hover:opacity-100 text-red-500"
                                            aria-label={t("delete")}
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </DroppableCell>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobiel: zones per gekozen dag */}
            <div className="lg:hidden space-y-3">
              {visibleZoneIds.map((zoneId) => {
                const z = ZONES[zoneId as ZoneId];
                return (
                  <div
                    key={zoneId}
                    className="rounded-lg border p-3"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: z.color,
                      borderColor: ADM_BORDER,
                      backgroundColor: `${z.color}10`,
                    }}
                  >
                    <div className="font-medium text-sm mb-2" style={{ color: ADM_TEXT }}>{z.icon} {z.label}</div>
                    {TIME_SLOT_IDS.map((slotId) => {
                      const slot = TIME_SLOTS[slotId];
                      const cellShifts = getShiftsInCell(shifts, weekStartISO, zoneId, mobileDayIndex, slotId);
                      const isEmpty = cellShifts.length === 0;
                      return (
                        <div key={slotId} className="mb-2 last:mb-0">
                          <div className="text-xs font-medium mb-1" style={{ color: ADM_MUTED }}>{slot.label}</div>
                          {isEmpty ? (
                            <button
                              type="button"
                              onClick={() => openAddShift(zoneId, mobileDayIndex, slotId)}
                              className="w-full py-2 rounded border-2 border-dashed text-xs"
                              style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
                            >
                              + {t("addShift")}
                            </button>
                          ) : (
                            <div className="space-y-1">
                              {cellShifts.map((s) => (
                                <div
                                  key={s.id}
                                  onClick={() => openEditShift(s)}
                                  className="rounded p-2 text-xs flex items-center gap-2"
                                  style={{ backgroundColor: "#fff", borderLeft: `3px solid ${s.volunteer_color ?? ADM_ACCENT}` }}
                                >
                                  <span className="font-medium">{s.volunteer_name ?? "—"}</span>
                                  <span style={{ color: ADM_MUTED }}>{(TASKS_BY_ZONE[zoneId as ZoneId]?.[s.task]?.icon ?? "")} {TASKS_BY_ZONE[zoneId as ZoneId]?.[s.task]?.label ?? s.task}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legenda: zones, klikbaar om te filteren */}
            <div className="mt-4 pt-3 border-t flex flex-wrap gap-2 items-center" style={{ borderColor: ADM_BORDER }}>
              <span className="text-xs font-medium mr-1" style={{ color: ADM_MUTED }}>{t("legend")}</span>
              {ZONE_IDS.map((zoneId) => {
                const z = ZONES[zoneId as ZoneId];
                const hidden = hiddenZones.has(zoneId);
                return (
                  <button
                    key={zoneId}
                    type="button"
                    onClick={() => toggleZone(zoneId)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-opacity"
                    style={{
                      backgroundColor: z.color,
                      color: hidden ? "rgba(255,255,255,0.5)" : "#fff",
                      opacity: hidden ? 0.5 : 1,
                    }}
                  >
                    <span>{z.icon}</span>
                    <span>{z.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobiel: FAB voor shift toevoegen */}
          <button
            type="button"
            onClick={() => setShiftModal({ open: true })}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-40"
            style={{ backgroundColor: ADM_ACCENT, color: "#fff" }}
            aria-label={t("addShift")}
          >
            ➕
          </button>

          {/* Toast */}
          {toast && (
            <div
              className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm z-50 max-w-[90vw]"
              style={{ backgroundColor: ADM_TEXT, color: "#fff" }}
            >
              {toast}
            </div>
          )}
        </main>
      </div>

      {/* Shift modal */}
      <ShiftModal
        open={shiftModal.open}
        onClose={closeShiftModal}
        shift={shiftModal.open ? shiftModal.shift ?? null : null}
        prefilled={shiftModal.open ? shiftModal.prefilled : undefined}
        prefilledVolunteer={shiftModal.open ? shiftModal.prefilledVolunteer : undefined}
        weekStart={weekStartISO}
        volunteers={volunteers.map((v) => ({ id: v.id, name: v.name, color: v.color }))}
        onSaved={handleShiftSaved}
        onDeleted={handleShiftDeleted}
      />

      {/* Dialogen */}
      {copyDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCopyDialogOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-4"
            style={{ borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("copyConfirm")}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCopyDialogOpen(false)} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER }}>
                {t("cancel")}
              </button>
              <button type="button" onClick={handleCopyPreviousWeek} className="px-3 py-1.5 rounded-lg text-white text-sm" style={{ backgroundColor: ADM_ACCENT }}>
                {t("copyPreviousWeek")}
              </button>
            </div>
          </div>
        </div>
      )}
      {clearDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setClearDialogOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-4"
            style={{ borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>{t("clearConfirm")}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setClearDialogOpen(false)} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER }}>
                {t("cancel")}
              </button>
              <button type="button" onClick={handleClearWeek} className="px-3 py-1.5 rounded-lg text-white text-sm bg-red-500">
                {t("clearWeek")}
              </button>
            </div>
          </div>
        </div>
      )}
      <VolunteerModal
        open={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        onSaved={handleVolunteerSaved}
        nextColor={VOLUNTEER_COLORS[volunteers.length % VOLUNTEER_COLORS.length]}
      />
      </div>
    </DndContext>
  );
}
