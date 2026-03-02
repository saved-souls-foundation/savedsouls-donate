/**
 * Rooster API: shifts en volunteers (admin).
 */
export type RosterShiftRow = {
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
  created_at?: string;
};

export type VolunteerRow = {
  id: string;
  name: string;
  email: string | null;
  color: string;
  is_active: boolean;
  created_at?: string;
};

export async function getShifts(weekStart: string): Promise<RosterShiftRow[]> {
  const res = await fetch(`/api/admin/rooster/shifts?week_start=${encodeURIComponent(weekStart)}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to fetch shifts"));
  const json = await res.json();
  return json.data ?? [];
}

export async function getVolunteers(): Promise<VolunteerRow[]> {
  const res = await fetch("/api/admin/rooster/volunteers");
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to fetch volunteers"));
  const json = await res.json();
  return (json.data ?? []).filter((v: VolunteerRow) => v.is_active !== false);
}

export async function createShift(data: {
  volunteer_id: string | null;
  volunteer_name: string;
  volunteer_color: string;
  zone: string;
  task: string;
  day_of_week: number;
  time_slot: string;
  week_start: string;
  notes?: string;
}): Promise<RosterShiftRow> {
  const res = await fetch("/api/admin/rooster/shifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create shift"));
  const json = await res.json();
  return json.data;
}

export async function updateShift(
  id: string,
  data: Partial<{
    volunteer_id: string | null;
    volunteer_name: string;
    volunteer_color: string;
    zone: string;
    task: string;
    day_of_week: number;
    time_slot: string;
    week_start: string;
    notes: string | null;
  }>
): Promise<RosterShiftRow> {
  const res = await fetch(`/api/admin/rooster/shifts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update shift"));
  const json = await res.json();
  return json.data;
}

export async function deleteShift(id: string): Promise<void> {
  const res = await fetch(`/api/admin/rooster/shifts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to delete shift"));
}

export async function copyPreviousWeek(weekStart: string): Promise<void> {
  const res = await fetch("/api/admin/rooster/week/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week_start: weekStart }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to copy week"));
}

export async function clearWeek(weekStart: string): Promise<void> {
  const res = await fetch("/api/admin/rooster/week/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week_start: weekStart }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to clear week"));
}

export async function createVolunteer(data: {
  name: string;
  email?: string;
  color: string;
}): Promise<VolunteerRow> {
  const res = await fetch("/api/admin/rooster/volunteers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create volunteer"));
  const json = await res.json();
  return json.data;
}
