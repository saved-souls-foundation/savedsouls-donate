import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import AdminRoosterClient, { type RosterShift } from "./AdminRoosterClient";
import { getWeekStart, toISODate } from "./roosterUtils";

export const metadata = {
  title: "Rooster | Admin",
  robots: { index: false, follow: false },
};

export default async function RoosterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const weekStart = toISODate(getWeekStart(new Date()));

  const [
    { data: shiftsData },
    { data: volunteersData },
  ] = await Promise.all([
    supabase
      .from("roster_shifts")
      .select("*")
      .eq("week_start", weekStart)
      .order("day_of_week"),
    supabase
      .from("volunteers")
      .select("*")
      .eq("is_active", true)
      .order("name"),
  ]);

  const volunteers = volunteersData ?? [];
  const volMap = new Map(volunteers.map((v: { id: string; name?: string | null; color?: string | null }) => [v.id, v]));
  const shifts: RosterShift[] = (shiftsData ?? []).map((r: Record<string, unknown>) => {
    const vol = r.volunteer_id ? volMap.get(r.volunteer_id as string) : null;
    return {
      id: r.id as string,
      volunteer_id: (r.volunteer_id as string) ?? null,
      volunteer_name: vol?.name ?? null,
      volunteer_color: vol?.color ?? null,
      zone: (r.zone as string) ?? null,
      task: (r.task as string) ?? null,
      day_of_week: r.day_of_week as number,
      time_slot: (r.time_slot as string) ?? "ochtend",
      week_start: typeof r.week_start === "string" ? r.week_start : String(r.week_start ?? ""),
      notes: (r.notes as string) ?? null,
    };
  });

  return (
    <AdminRoosterClient
      initialWeekStart={weekStart}
      initialShifts={shifts}
      initialVolunteers={volunteers}
    />
  );
}
