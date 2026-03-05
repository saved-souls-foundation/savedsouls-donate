"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ZONES, ZONE_IDS, TIME_SLOTS, TIME_SLOT_IDS, getTasksForZone } from "@/lib/roosterConfig";
import type { ZoneId } from "@/lib/roosterConfig";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

export type RosterShift = {
  id: string;
  volunteer_id: string | null;
  volunteer_name: string | null;
  volunteer_color: string | null;
  zone: string;
  task: string;
  day_of_week: number;
  time_slot: string;
  week_start: string;
  notes: string | null;
};

export type ShiftFormData = {
  volunteer_id: string | null;
  volunteer_name: string;
  volunteer_color: string;
  zone: string;
  task: string;
  day_of_week: number;
  time_slot: string;
  week_start: string;
  notes: string;
};

type VolunteerOption = { id: string; name: string; color: string };

type ShiftModalProps = {
  open: boolean;
  onClose: () => void;
  shift?: RosterShift | null;
  prefilled?: { zone: string; dayOfWeek: number; timeSlot: string };
  prefilledVolunteer?: { id: string; name: string; color: string };
  weekStart: string;
  volunteers: VolunteerOption[];
  onSaved?: (data: ShiftFormData) => void;
  onDeleted?: (shiftId: string) => void;
};

export default function ShiftModal({
  open,
  onClose,
  shift,
  prefilled,
  prefilledVolunteer,
  weekStart,
  volunteers,
  onSaved,
  onDeleted,
}: ShiftModalProps) {
  const t = useTranslations("admin.rooster");
  const [volunteerId, setVolunteerId] = useState<string>("");
  const [zone, setZone] = useState<string>(ZONE_IDS[0]);
  const [task, setTask] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [timeSlot, setTimeSlot] = useState<string>("ochtend");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (shift) {
      setVolunteerId(shift.volunteer_id ?? "");
      setZone(shift.zone);
      setTask(shift.task);
      setDayOfWeek(shift.day_of_week);
      setTimeSlot(shift.time_slot);
      setNotes(shift.notes ?? "");
    } else {
      setVolunteerId(prefilledVolunteer?.id ?? "");
      setZone(prefilled?.zone ?? ZONE_IDS[0]);
      setTask("");
      setDayOfWeek(prefilled?.dayOfWeek ?? 0);
      setTimeSlot(prefilled?.timeSlot ?? "ochtend");
      setNotes("");
    }
  }, [open, shift, prefilled, prefilledVolunteer]);

  useEffect(() => {
    const tasks = getTasksForZone(zone as ZoneId);
    const taskIds = Object.keys(tasks);
    if (!taskIds.includes(task)) setTask(taskIds[0] ?? "");
  }, [zone, task]);

  const tasksForZone = getTasksForZone(zone as ZoneId);
  const selectedVolunteer = volunteers.find((v) => v.id === volunteerId);
  const volunteerName = selectedVolunteer?.name ?? "";
  const volunteerColor = selectedVolunteer?.color ?? ADM_ACCENT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.({
      volunteer_id: volunteerId || null,
      volunteer_name: volunteerName,
      volunteer_color: volunteerColor,
      zone,
      task,
      day_of_week: dayOfWeek,
      time_slot: timeSlot,
      week_start: weekStart,
      notes,
    });
    onClose();
  };

  const handleDelete = () => {
    if (shift && onDeleted) {
      onDeleted(shift.id);
      onClose();
    }
  };

  if (!open) return null;
  const isEdit = !!shift;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto p-4 pb-28"
        style={{ borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold mb-4" style={{ color: ADM_TEXT }}>
          {isEdit ? t("editShift") : t("addShift")}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("volunteers")}</label>
            <select
              value={volunteerId}
              onChange={(e) => setVolunteerId(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            >
              <option value="">— {t("volunteers")} —</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            {volunteers.length === 0 && (
              <p className="mt-1 text-xs" style={{ color: ADM_MUTED }}>
                {t("noVolunteers")}. Voeg eerst vrijwilligers toe via het zijpaneel (knop «{t("addVolunteer")}»).
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("zone")}</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            >
              {ZONE_IDS.map((id) => {
                const z = ZONES[id];
                return (
                  <option key={id} value={id}>{z.icon} {z.label}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("task")}</label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            >
              {Object.entries(tasksForZone).map(([taskId, { label, icon }]) => (
                <option key={taskId} value={taskId}>{icon} {label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("timeSlot")}</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            >
              {TIME_SLOT_IDS.map((id) => (
                <option key={id} value={id}>{TIME_SLOTS[id].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("day")}</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            >
              {(t.raw("daysShort") as string[]).map((day, i) => (
                <option key={i} value={i}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("notes")}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm resize-none"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg text-white text-sm bg-red-500 hover:bg-red-600"
                >
                  {t("delete")}
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER }}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-white text-sm"
                style={{ backgroundColor: ADM_ACCENT }}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
