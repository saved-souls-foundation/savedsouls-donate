"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatCard, EmptyState, QuickActions } from "../components/ui/design-system";

const TIME_SLOTS = {
  ochtend: {
    label: "Ochtend",
    tijd: "07:00–12:00",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    dot: "bg-blue-500",
  },
  middag: {
    label: "Middag",
    tijd: "12:00–17:00",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    dot: "bg-green-500",
  },
  avond: {
    label: "Avond",
    tijd: "17:00–22:00",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  nacht: {
    label: "Nacht",
    tijd: "22:00–07:00",
    bg: "bg-violet-100",
    text: "text-violet-800",
    border: "border-violet-300",
    dot: "bg-violet-500",
  },
} as const;

const DAG_NAMEN = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const WEEK_DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0];

export type RosterShift = {
  id: string;
  volunteer_id: string | null;
  volunteer_name: string | null;
  volunteer_color: string | null;
  zone: string | null;
  task: string | null;
  day_of_week: number;
  time_slot: string;
  week_start: string;
  notes: string | null;
};

type Volunteer = {
  id: string;
  name: string | null;
  email: string | null;
  color: string | null;
  is_active?: boolean;
  telefoon?: string | null;
  line_id?: string | null;
};

function getMonday(d: Date): string {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday.toISOString().split("T")[0];
}

type Props = {
  initialWeekStart: string;
  initialShifts: RosterShift[];
  initialVolunteers: Volunteer[];
};

export default function AdminRoosterClient({
  initialWeekStart,
  initialShifts,
  initialVolunteers,
}: Props) {
  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);
  const [shifts, setShifts] = useState<RosterShift[]>(initialShifts);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [view, setView] = useState<"rooster" | "lijst">("rooster");
  const [selectedShift, setSelectedShift] = useState<RosterShift | null>(null);
  const [addingShift, setAddingShift] = useState(false);
  const [newShift, setNewShift] = useState({
    volunteer_id: "",
    volunteer_name: "",
    time_slot: "ochtend",
    day_of_week: 1,
    zone: "",
    task: "",
    notes: "",
  });

  const fetchShiftsForWeek = useCallback(async (weekStart: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("roster_shifts")
      .select("*")
      .eq("week_start", weekStart)
      .order("day_of_week");
    setShifts((data ?? []) as RosterShift[]);
  }, []);

  useEffect(() => {
    if (currentWeekStart !== initialWeekStart) {
      fetchShiftsForWeek(currentWeekStart);
    }
  }, [currentWeekStart, initialWeekStart, fetchShiftsForWeek]);

  function prevWeek() {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(getMonday(d));
  }

  function nextWeek() {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(getMonday(d));
  }

  const weekDates = WEEK_DAYS_ORDER.map((dow) => {
    const base = new Date(currentWeekStart);
    const offset = dow === 0 ? 6 : dow - 1;
    base.setDate(base.getDate() + offset);
    return {
      dow,
      date: base,
      label: DAG_NAMEN[dow === 0 ? 6 : dow - 1],
    };
  });

  const reloadShifts = useCallback(() => {
    fetchShiftsForWeek(currentWeekStart);
  }, [currentWeekStart, fetchShiftsForWeek]);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">📅 Rooster</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Week van{" "}
            {new Date(currentWeekStart).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={prevWeek}
              className="px-4 py-2 rounded-lg hover:bg-white text-gray-700 text-sm font-semibold transition-colors"
              aria-label="Vorige week"
            >
              ← Vorige week
            </button>
            <button
              type="button"
              onClick={() => setCurrentWeekStart(getMonday(new Date()))}
              className="px-3 py-2 rounded-lg hover:bg-white text-gray-600 text-xs font-semibold"
            >
              Vandaag
            </button>
            <button
              type="button"
              onClick={nextWeek}
              className="px-4 py-2 rounded-lg hover:bg-white text-gray-700 text-sm font-semibold transition-colors"
              aria-label="Volgende week"
            >
              Volgende week →
            </button>
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {([
              ["rooster", "⊞ Rooster"],
              ["lijst", "☰ Lijst"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  view === id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAddingShift(true)}
            className="px-4 py-2 rounded-xl bg-[#2aa348] text-white text-sm font-bold hover:bg-[#166534] transition-colors"
          >
            + Dienst toevoegen
          </button>
        </div>
      </div>

      {/* STAT BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon="🤝"
          label="Vrijwilligers ingepland"
          value={new Set(shifts?.map((s) => s.volunteer_id) ?? []).size}
        />
        <StatCard
          icon="📅"
          label="Diensten deze week"
          value={shifts?.length ?? 0}
          accentColor="blue"
        />
        <StatCard
          icon="⚠️"
          label="Open slots"
          value={(volunteers?.length ?? 0) * 7 - (shifts?.length ?? 0)}
          accentColor="red"
        />
        <StatCard
          icon="✅"
          label="Bezettingsgraad"
          value={
            shifts?.length
              ? Math.round((shifts.length / ((volunteers?.length ?? 1) * 7)) * 100) + "%"
              : "0%"
          }
          accentColor="green"
        />
      </div>

      {/* LEGENDA */}
      <div className="flex flex-wrap gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-200">
        {Object.entries(TIME_SLOTS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${s.dot}`} />
            <span className="text-xs font-semibold text-gray-700">{s.label}</span>
            <span className="text-xs text-gray-400">{s.tijd}</span>
          </div>
        ))}
      </div>

      {/* ROOSTER VIEW */}
      {view === "rooster" && (
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[800px]">
            <div
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
            >
              <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Vrijwilliger
              </div>
              {weekDates.map(({ dow, date, label }) => {
                const isToday = date.toDateString() === new Date().toDateString();
                const dagShifts =
                  shifts?.filter(
                    (s) => s.day_of_week === dow && s.week_start === currentWeekStart
                  ) ?? [];
                return (
                  <div
                    key={dow}
                    className={`text-center py-2 rounded-xl ${
                      isToday ? "bg-[#2aa348] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-xs font-semibold">{label}</div>
                    <div className="text-lg font-extrabold">{date.getDate()}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isToday ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {dagShifts.length} dienst{dagShifts.length !== 1 ? "en" : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {volunteers?.map((volunteer) => (
              <div
                key={volunteer.id}
                className="grid gap-1 mb-1.5 group"
                style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: volunteer.color ?? "#2aa348" }}
                  >
                    {(volunteer.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {volunteer.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {volunteer.email}
                    </div>
                  </div>
                  {(volunteer.line_id || volunteer.telefoon) && (
                    <a
                      href={
                        volunteer.line_id
                          ? `https://line.me/ti/p/~${volunteer.line_id}`
                          : `https://line.me/ti/p/${(volunteer.telefoon ?? "").replace(/\s/g, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`LINE ${volunteer.name}`}
                      className="shrink-0 w-7 h-7 rounded-lg bg-[#06C755] flex items-center justify-center text-white hover:bg-[#05a847] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                      </svg>
                    </a>
                  )}
                </div>

                {weekDates.map(({ dow, date }) => {
                  const dagShifts =
                    shifts?.filter(
                      (s) =>
                        s.volunteer_id === volunteer.id &&
                        s.day_of_week === dow &&
                        s.week_start === currentWeekStart
                    ) ?? [];
                  const isToday = date.toDateString() === new Date().toDateString();
                  const slot =
                    TIME_SLOTS[dagShifts[0]?.time_slot as keyof typeof TIME_SLOTS] ??
                    TIME_SLOTS.ochtend;
                  return (
                    <div
                      key={dow}
                      className={`min-h-[72px] rounded-xl border-2 p-1 transition-all ${
                        isToday ? "ring-1 ring-[#2aa348]/30" : ""
                      } ${
                        dagShifts.length > 0
                          ? "border-gray-200 bg-white"
                          : "border-dashed border-gray-200 bg-gray-50/50 hover:border-gray-300"
                      }`}
                    >
                      {dagShifts.length > 0 ? (
                        <div className="space-y-1">
                          {dagShifts.map((shift) => {
                            const s =
                              TIME_SLOTS[shift.time_slot as keyof typeof TIME_SLOTS] ??
                              TIME_SLOTS.ochtend;
                            return (
                              <div
                                key={shift.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedShift(shift)}
                                className={`px-2 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity border ${s.bg} ${s.border}`}
                              >
                                <div className={`text-[10px] font-bold ${s.text}`}>
                                  {s.label}
                                </div>
                                {shift.zone && (
                                  <div className="text-[10px] text-gray-500 truncate mt-0.5">
                                    📍 {shift.zone}
                                  </div>
                                )}
                                {shift.task && (
                                  <div className="text-[10px] text-gray-500 truncate">
                                    {shift.task}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              setNewShift((p) => ({
                                ...p,
                                volunteer_id: volunteer.id,
                                volunteer_name: volunteer.name ?? "",
                                day_of_week: dow,
                              }));
                              setAddingShift(true);
                            }}
                            className="w-full text-[10px] text-gray-400 hover:text-[#2aa348] py-0.5 rounded transition-colors"
                          >
                            + toevoegen
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setNewShift((p) => ({
                              ...p,
                              volunteer_id: volunteer.id,
                              volunteer_name: volunteer.name ?? "",
                              day_of_week: dow,
                            }));
                            setAddingShift(true);
                          }}
                          className="w-full h-full flex items-center justify-center text-gray-200 hover:text-[#2aa348] text-lg transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {(!volunteers || volunteers.length === 0) && (
              <EmptyState
                icon="🤝"
                title="Geen actieve vrijwilligers"
                description="Voeg vrijwilligers toe om het rooster te vullen"
              />
            )}
          </div>
        </div>
      )}

      {/* LIJST VIEW */}
      {view === "lijst" && (
        <div className="space-y-3">
          {weekDates.map(({ dow, date, label }) => {
            const dagShifts = (shifts?.filter(
              (s) =>
                s.day_of_week === dow && s.week_start === currentWeekStart
            ) ?? []).sort((a, b) => {
              const order = ["ochtend", "middag", "avond", "nacht"];
              return order.indexOf(a.time_slot) - order.indexOf(b.time_slot);
            });
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={dow}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isToday ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        isToday ? "text-[#2aa348]" : "text-gray-700"
                      }`}
                    >
                      {label}{" "}
                      {date.toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    {isToday && (
                      <span className="text-[10px] bg-[#2aa348] text-white px-2 py-0.5 rounded-full font-bold">
                        Vandaag
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {dagShifts.length} dienst{dagShifts.length !== 1 ? "en" : ""}
                  </span>
                </div>
                {dagShifts.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {dagShifts.map((shift) => {
                      const slot =
                        TIME_SLOTS[shift.time_slot as keyof typeof TIME_SLOTS] ??
                        TIME_SLOTS.ochtend;
                      const vol = volunteers?.find((v) => v.id === shift.volunteer_id);
                      return (
                        <div
                          key={shift.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedShift(shift)}
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-1 h-12 rounded-full ${slot.dot} shrink-0`}
                          />
                          <div
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${slot.bg} ${slot.text}`}
                          >
                            {slot.label}
                            <br />
                            <span className="font-normal opacity-70">{slot.tijd}</span>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{
                              backgroundColor: shift.volunteer_color ?? "#2aa348",
                            }}
                          >
                            {(shift.volunteer_name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-900">
                              {shift.volunteer_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {shift.zone && `📍 ${shift.zone}`}
                              {shift.zone && shift.task && " · "}
                              {shift.task}
                            </div>
                          </div>
                          {vol && (vol.line_id || vol.telefoon) && (
                            <a
                              href={
                                vol.line_id
                                  ? `https://line.me/ti/p/~${vol.line_id}`
                                  : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 w-8 h-8 rounded-lg bg-[#06C755] flex items-center justify-center text-white hover:bg-[#05a847] transition-colors"
                              title={`LINE ${shift.volunteer_name}`}
                            >
                              LINE
                            </a>
                          )}
                          <QuickActions
                            actions={[
                              {
                                icon: "✏️",
                                label: "Bewerken",
                                onClick: () => setSelectedShift(shift),
                              },
                              {
                                icon: "🗑️",
                                label: "Verwijderen",
                                onClick: async () => {
                                  if (!confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) return;
                                  const supabase = createClient();
                                  await supabase
                                    .from("roster_shifts")
                                    .delete()
                                    .eq("id", shift.id);
                                  reloadShifts();
                                },
                              },
                            ]}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-gray-400">
                    Geen diensten gepland ·{" "}
                    <button
                      type="button"
                      onClick={() => setAddingShift(true)}
                      className="text-[#2aa348] font-semibold hover:underline"
                    >
                      toevoegen
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SHIFT DETAIL MODAL */}
      {selectedShift &&
        (() => {
          const slot =
            TIME_SLOTS[selectedShift.time_slot as keyof typeof TIME_SLOTS] ??
            TIME_SLOTS.ochtend;
          const vol = volunteers?.find((v) => v.id === selectedShift.volunteer_id);
          return (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedShift(null)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`p-5 ${slot.bg} border-b ${slot.border} rounded-t-2xl`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-extrabold text-lg ${slot.text}`}>
                        {slot.label} · {slot.tijd}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {DAG_NAMEN[selectedShift.day_of_week === 0 ? 6 : selectedShift.day_of_week - 1]}{" "}
                        — week van {selectedShift.week_start}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedShift(null)}
                      className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{
                        backgroundColor: selectedShift.volunteer_color ?? "#2aa348",
                      }}
                    >
                      {(selectedShift.volunteer_name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {selectedShift.volunteer_name}
                      </div>
                      {vol && (vol.line_id || vol.telefoon) && (
                        <a
                          href={
                            vol.line_id
                              ? `https://line.me/ti/p/~${vol.line_id}`
                              : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-[#06C755] text-white text-xs font-bold rounded-lg hover:bg-[#05a847]"
                        >
                          💬 Stuur LINE bericht
                        </a>
                      )}
                    </div>
                  </div>
                  {selectedShift.zone && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">
                        Zone
                      </div>
                      <div className="text-sm font-semibold">
                        📍 {selectedShift.zone}
                      </div>
                    </div>
                  )}
                  {selectedShift.task && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">
                        Taken
                      </div>
                      <div className="text-sm text-gray-700">{selectedShift.task}</div>
                    </div>
                  )}
                  {selectedShift.notes && (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <div className="text-xs text-amber-600 uppercase tracking-wide mb-1 font-semibold">
                        Notities
                      </div>
                      <div className="text-sm text-gray-700">{selectedShift.notes}</div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => setSelectedShift(null)}
                    className="flex-1 min-w-[80px] py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Sluiten
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) return;
                      const supabase = createClient();
                      await supabase.from("roster_shifts").delete().eq("id", selectedShift.id);
                      setSelectedShift(null);
                      reloadShifts();
                    }}
                    className="py-2 px-4 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    🗑️ Verwijderen
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#2aa348] text-white text-sm font-semibold hover:bg-[#166534]"
                  >
                    ✏️ Bewerken
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* DIENST TOEVOEGEN MODAL */}
      {addingShift && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAddingShift(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
              <h2 className="font-extrabold text-gray-900">Dienst toevoegen</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Week van {currentWeekStart}
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Vrijwilliger
                </label>
                <select
                  value={newShift.volunteer_id}
                  onChange={(e) => {
                    const vol = volunteers?.find((v) => v.id === e.target.value);
                    setNewShift((p) => ({
                      ...p,
                      volunteer_id: e.target.value,
                      volunteer_name: vol?.name ?? "",
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
                >
                  <option value="">Selecteer vrijwilliger...</option>
                  {volunteers?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Dag
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {weekDates.map(({ dow, label, date }) => (
                    <button
                      key={dow}
                      type="button"
                      onClick={() => setNewShift((p) => ({ ...p, day_of_week: dow }))}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors text-center ${
                        newShift.day_of_week === dow
                          ? "bg-[#2aa348] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                      <br />
                      <span className="font-normal">{date.getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Dienst type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TIME_SLOTS).map(([key, s]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewShift((p) => ({ ...p, time_slot: key }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                        newShift.time_slot === key
                          ? `${s.bg} ${s.text} ${s.border}`
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${s.dot} shrink-0`} />
                      <div>
                        <div>{s.label}</div>
                        <div className="text-xs font-normal opacity-70">{s.tijd}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Zone / Locatie
                </label>
                <input
                  value={newShift.zone}
                  onChange={(e) => setNewShift((p) => ({ ...p, zone: e.target.value }))}
                  placeholder="Bijv: Kennels, Kliniek, Quarantaine..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Taken
                </label>
                <textarea
                  rows={2}
                  value={newShift.task}
                  onChange={(e) => setNewShift((p) => ({ ...p, task: e.target.value }))}
                  placeholder="Bijv: Honden voeren, medicatie geven, kennels schoonmaken..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Notities
                </label>
                <textarea
                  rows={1}
                  value={newShift.notes}
                  onChange={(e) => setNewShift((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Extra opmerkingen..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setAddingShift(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={!newShift.volunteer_id}
                onClick={async () => {
                  const supabase = createClient();
                  const vol = volunteers?.find((v) => v.id === newShift.volunteer_id);
                  await supabase.from("roster_shifts").insert({
                    volunteer_id: newShift.volunteer_id,
                    volunteer_name: newShift.volunteer_name,
                    volunteer_color: vol?.color ?? "#2aa348",
                    day_of_week: newShift.day_of_week,
                    time_slot: newShift.time_slot,
                    week_start: currentWeekStart,
                    zone: newShift.zone || "—",
                    task: newShift.task || "—",
                    notes: newShift.notes || null,
                  });
                  setAddingShift(false);
                  reloadShifts();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2aa348] text-white text-sm font-bold hover:bg-[#166534] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                💾 Dienst opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
