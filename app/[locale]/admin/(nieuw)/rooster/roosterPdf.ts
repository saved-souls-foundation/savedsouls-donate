/**
 * Weekrooster PDF-export (A4 staand).
 */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ZONES, ZONE_IDS, TIME_SLOT_IDS, TIME_SLOTS, TASKS_BY_ZONE } from "@/lib/roosterConfig";
import type { RosterShift } from "./ShiftModal";

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

function cellText(shifts: RosterShift[], zone: string): string {
  if (shifts.length === 0) return "";
  return shifts
    .map((s) => {
      const task = TASKS_BY_ZONE[zone as keyof typeof TASKS_BY_ZONE]?.[s.task];
      const icon = task?.icon ?? "";
      return `${s.volunteer_name ?? "—"} ${icon}`.trim();
    })
    .join("\n");
}

export function generateRosterPdf(
  weekStart: string,
  weekLabel: string,
  shifts: RosterShift[]
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFontSize(14);
  doc.text("Weekrooster Saved Souls Foundation", 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(weekLabel, 14, 22);
  doc.setTextColor(0, 0, 0);

  const daysShort = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  const head = ["Zone / Tijdslot", ...daysShort];
  const body: string[][] = [];

  for (const zoneId of ZONE_IDS) {
    const z = ZONES[zoneId];
    for (const slotId of TIME_SLOT_IDS) {
      const slot = TIME_SLOTS[slotId];
      const row: string[] = [`${z.icon} ${z.label} — ${slot.label}`];
      for (let d = 0; d < 7; d++) {
        const cellShifts = getShiftsInCell(shifts, weekStart, zoneId, d, slotId);
        row.push(cellText(cellShifts, zoneId));
      }
      body.push(row);
    }
  }

  autoTable(doc, {
    startY: 28,
    head: [head],
    body,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [45, 55, 72], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 38 },
    },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      const zoneIndex = Math.floor(data.row.index / 3);
      const zoneId = ZONE_IDS[zoneIndex];
      const z = ZONES[zoneId];
      const hex = z.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      if (data.column.index === 0) {
        data.cell.styles.fillColor = [r, g, b];
        data.cell.styles.textColor = [255, 255, 255];
        if (r + g + b > 380) data.cell.styles.textColor = [30, 41, 59];
      } else {
        data.cell.styles.fillColor = [
          Math.min(255, Math.round(r * 0.15 + 230)),
          Math.min(255, Math.round(g * 0.15 + 230)),
          Math.min(255, Math.round(b * 0.15 + 230)),
        ];
      }
    },
  });

  const generated = new Date().toLocaleString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gegenereerd op ${generated}`, 14, doc.internal.pageSize.getHeight() - 10);
  doc.save(`weekrooster-${weekStart}.pdf`);
}
