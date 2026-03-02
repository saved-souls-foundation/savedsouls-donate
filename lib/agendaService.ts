/**
 * Agenda-module: API-aanroepen voor calendar_events.
 * Gebruikt de admin API-routes; aanroepen vanaf de client.
 */
export type CalendarEventRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  animal_id: string | null;
  animal_name: string | null;
  assigned_to: string | null;
  attachment_url: string | null;
  lab_result_status: string | null;
  lab_result_notes: string | null;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
};

export async function getEvents(startDate: Date, endDate: Date): Promise<CalendarEventRow[]> {
  const res = await fetch(
    `/api/admin/agenda/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
  );
  if (!res.ok) throw new Error((await res.json()).error);
  const data = await res.json();
  return data.data ?? [];
}

export async function getUpcomingEvents(days: number): Promise<CalendarEventRow[]> {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + days);
  const rows = await getEvents(from, to);
  return rows.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
}

export async function getLabResults(): Promise<CalendarEventRow[]> {
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  const to = new Date();
  const rows = await getEvents(from, to);
  return rows
    .filter((r) => r.category === "laboratorium")
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
}

export async function createEvent(data: Partial<CalendarEventRow>): Promise<CalendarEventRow> {
  const res = await fetch("/api/admin/agenda/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const out = await res.json();
  return out.data;
}

export async function updateEvent(
  id: string,
  data: Partial<CalendarEventRow>
): Promise<CalendarEventRow> {
  const res = await fetch(`/api/admin/agenda/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const out = await res.json();
  return out.data;
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`/api/admin/agenda/events/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error);
}
