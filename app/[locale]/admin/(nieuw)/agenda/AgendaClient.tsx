"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_IDS,
  LAB_RESULT_STATUSES,
  type EventCategory,
} from "@/lib/agendaConfig";
import EventModal from "./EventModal";
import ImportModal from "./ImportModal";
import { createClient } from "@/lib/supabase/client";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const TEAL = "#2A9D8F";
const WEEKEND_BG = "#F8F9FA";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
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
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00 - 22:00
/** Vaste datum voor eerste render (geen Date() in render → voorkomt hydration mismatch). */
const FALLBACK_DATE = new Date(2000, 0, 1);

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const days: { date: Date; isCurrentMonth: boolean; iso: string }[] = [];
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    days.push({ date: d, isCurrentMonth: false, iso: d.toISOString().slice(0, 10) });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({ date, isCurrentMonth: true, iso: date.toISOString().slice(0, 10) });
  }
  const remain = 42 - days.length;
  for (let i = 0; i < remain; i++) {
    const d = new Date(year, month + 1, i + 1);
    days.push({ date: d, isCurrentMonth: false, iso: d.toISOString().slice(0, 10) });
  }
  return days.slice(0, 42);
}

function getWeekDays(anchor: Date) {
  const day = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const HOUR_ROW_PX = 48;

/** Zelfde datum-sleutel als eventsByDate (start_time.slice(0, 10) op ISO-string). */
function isoDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Verticale layout t.o.v. lokale dag 07:00–23:00 (16 rijen). */
function layoutEventBlock(ev: CalendarEvent, columnDate: Date): { top: number; height: number } | null {
  const start = new Date(ev.start_time);
  let end: Date;
  if (ev.end_time) {
    end = new Date(ev.end_time);
    if (end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
  } else {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }
  const y = columnDate.getFullYear();
  const mo = columnDate.getMonth();
  const da = columnDate.getDate();
  const gridStart = new Date(y, mo, da, HOURS[0], 0, 0, 0);
  const gridHeightPx = HOURS.length * HOUR_ROW_PX;
  const rawTop = ((start.getTime() - gridStart.getTime()) / 3600000) * HOUR_ROW_PX;
  const rawBottom = ((end.getTime() - gridStart.getTime()) / 3600000) * HOUR_ROW_PX;
  if (rawBottom <= 0 || rawTop >= gridHeightPx) return null;
  const top = Math.max(0, rawTop);
  const bottom = Math.min(gridHeightPx, rawBottom);
  const height = Math.max(20, bottom - top);
  return { top, height };
}

export default function AgendaClient() {
  const t = useTranslations("admin.agenda");
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [current, setCurrent] = useState<Date | null>(null);
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [todayStart, setTodayStart] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventModal, setEventModal] = useState<{ open: true; date?: string; event?: CalendarEvent } | { open: false }>({ open: false });
  const [importOpen, setImportOpen] = useState(false);
  const [sideFilter, setSideFilter] = useState<"all" | "medical" | "volunteers" | "deadlines">("all");
  const [mobileDayPanel, setMobileDayPanel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sideTab, setSideTab] = useState<"upcoming" | "lab">("upcoming");
  const [volunteers, setVolunteers] = useState<{ id: string; name: string | null; line_id?: string | null; telefoon?: string | null }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("volunteers")
      .select("id, name, line_id, telefoon")
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) setVolunteers(data);
      });
  }, []);

  const year = current ? current.getFullYear() : FALLBACK_DATE.getFullYear();
  const month = current ? current.getMonth() : FALLBACK_DATE.getMonth();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    setIsMobile(mq.matches);
    if (mq.matches) setView("day");
    const fn = () => {
      const now = window.matchMedia("(max-width: 480px)").matches;
      setIsMobile(now);
      if (now) setView("day");
    };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  const [hiddenCategories, setHiddenCategories] = useState<Set<EventCategory>>(new Set());

  useEffect(() => {
    const now = new Date();
    setCurrent(now);
    setTodayIso(now.toISOString().slice(0, 10));
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    setTodayStart(start);
    try {
      const s = localStorage.getItem("agenda_hidden_categories");
      const arr = s ? JSON.parse(s) : [];
      setHiddenCategories(new Set(Array.isArray(arr) ? arr : []));
    } catch {
      setHiddenCategories(new Set());
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 2, 0);
      const res = await fetch(`/api/admin/agenda/events?start=${from.toISOString()}&end=${to.toISOString()}`);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.data ?? []);
      } else {
        setError("Kon data niet laden");
        setEvents([]);
      }
    } catch {
      setError("Kon data niet laden");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("calendar_events_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendar_events" },
        () => { fetchEvents(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  const monthLabel = current ? current.toLocaleDateString("nl-NL", { month: "long", year: "numeric" }) : "";
  const todayIsoStr = todayIso ?? "";

  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);
  const weekDays = useMemo(() => getWeekDays(current ?? FALLBACK_DATE), [current]);

  const visibleEvents = useMemo(
    () => events.filter((e) => !hiddenCategories.has(e.category as EventCategory)),
    [events, hiddenCategories]
  );

  const eventsByDate = useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    visibleEvents.forEach((ev) => {
      const key = ev.start_time.slice(0, 10);
      if (!m[key]) m[key] = [];
      m[key].push(ev);
    });
    Object.keys(m).forEach((k) => m[k].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
    return m;
  }, [visibleEvents]);

  function toggleCategory(cat: EventCategory) {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      try {
        localStorage.setItem("agenda_hidden_categories", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const MEDICAL_CATEGORIES: EventCategory[] = ["dierenarts", "laboratorium", "medisch_followup"];
  const VOLUNTEER_CATEGORIES: EventCategory[] = ["vrijwilligers", "adoptanten", "evenement"];

  const upcomingEventsAll = useMemo(() => {
    if (!todayStart) return [];
    const from = todayStart;
    const to = new Date(from);
    to.setDate(to.getDate() + 14);
    return visibleEvents
      .filter((e) => {
        const t = new Date(e.start_time).getTime();
        return t >= from.getTime() && t < to.getTime();
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [visibleEvents, todayStart]);

  const upcomingEvents = useMemo(() => {
    let list = upcomingEventsAll;
    if (sideFilter === "medical") list = list.filter((e) => MEDICAL_CATEGORIES.includes(e.category as EventCategory));
    else if (sideFilter === "volunteers") list = list.filter((e) => VOLUNTEER_CATEGORIES.includes(e.category as EventCategory));
    else if (sideFilter === "deadlines") list = list.filter((e) => e.category === "deadline");
    return list.slice(0, 10);
  }, [upcomingEventsAll, sideFilter]);

  const labEvents = useMemo(
    () => visibleEvents.filter((e) => e.category === "laboratorium").sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).slice(0, 10),
    [visibleEvents]
  );

  function goPrev() {
    if (!current) return;
    if (view === "month") setCurrent(new Date(year, month - 1));
    else setCurrent(new Date(current.getTime() - (view === "week" ? 7 : 1) * 86400000));
  }
  function goNext() {
    if (!current) return;
    if (view === "month") setCurrent(new Date(year, month + 1));
    else setCurrent(new Date(current.getTime() + (view === "week" ? 7 : 1) * 86400000));
  }
  function goToday() {
    setCurrent(new Date());
  }

  // Eerste render (server + eerste client): geen kalender tonen tot current gezet is (voorkomt hydration mismatch)
  if (current === null) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8" style={{ color: ADM_MUTED }}>
        {t("month")}…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
          {error}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Links: kalender (70%) */}
        <div className="lg:w-[70%] space-y-3">
          <div
            className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-2"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <h1 className="text-lg font-semibold" style={{ color: ADM_TEXT }}>
              {monthLabel}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={goPrev}
                className="p-2 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER }}
              >
                ←
              </button>
              <button
                type="button"
                onClick={goToday}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "rgba(42,157,143,.15)", color: TEAL }}
              >
                {t("today")}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="p-2 rounded-lg border text-sm"
                style={{ borderColor: ADM_BORDER }}
              >
                →
              </button>
              <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: ADM_BORDER }}>
                {(["month", "week", "day"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className="px-3 py-1.5 text-sm"
                    style={{
                      background: view === v ? ADM_ACCENT : "transparent",
                      color: view === v ? "#fff" : ADM_MUTED,
                    }}
                  >
                    {v === "month" ? t("month") : v === "week" ? t("week") : t("day")}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setEventModal({ open: true })}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                style={{ background: ADM_ACCENT }}
              >
                ➕ {t("newEvent")}
              </button>
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                📥 {t("import")}
              </button>
            </div>
          </div>

          {/* Maandweergave */}
          {view === "month" && (
            <div
              className="rounded-xl border overflow-hidden"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              {loading ? (
                <>
                  <div className="grid grid-cols-7 text-center text-xs font-medium border-b" style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}>
                    {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
                      <div key={d} className="p-2">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 grid-rows-6 gap-px" style={{ background: ADM_BORDER }}>
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div key={i} className="min-h-[80px] animate-pulse bg-gray-100 rounded-none" style={{ background: "rgba(0,0,0,.06)" }} />
                    ))}
                  </div>
                </>
              ) : (
                <>
              <div className="grid grid-cols-7 text-center text-xs font-medium border-b" style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}>
                {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
                  <div key={d} className="p-2">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-6 gap-px" style={{ background: ADM_BORDER }}>
                {monthDays.map(({ date, isCurrentMonth, iso }) => {
                  const dayEvents = eventsByDate[iso] ?? [];
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = iso === todayIsoStr;
                  const isCompact = isMobile;
                  return (
                    <div
                      key={iso}
                      className={`flex flex-col ${isCompact ? "min-h-[44px]" : "min-h-[80px]"}`}
                      style={{
                        background: isWeekend ? WEEKEND_BG : ADM_CARD,
                        borderLeft: isToday ? `3px solid ${TEAL}` : undefined,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => (isCompact ? setMobileDayPanel(iso) : setEventModal({ open: true, date: iso }))}
                        className="text-left p-1.5 text-sm font-medium hover:bg-stone-100 rounded flex items-center justify-center gap-1"
                        style={{
                          color: isCurrentMonth ? ADM_TEXT : ADM_MUTED,
                          opacity: isCurrentMonth ? 1 : 0.6,
                        }}
                      >
                        {date.getDate()}
                        {isCompact && dayEvents.length > 0 && (
                          <span className="flex gap-0.5">
                            {dayEvents.slice(0, 3).map((ev) => {
                              const cat = EVENT_CATEGORIES[ev.category as EventCategory];
                              const color = cat?.color ?? "#6b7280";
                              return <span key={ev.id} className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />;
                            })}
                            {dayEvents.length > 3 && <span className="text-xs" style={{ color: ADM_MUTED }}>+{dayEvents.length - 3}</span>}
                          </span>
                        )}
                      </button>
                      {!isCompact && (
                        <div className="flex-1 flex flex-col gap-0.5 p-1 overflow-hidden">
                          {dayEvents.slice(0, 3).map((ev) => {
                            const cfg = EVENT_CATEGORIES[ev.category as EventCategory];
                            const color = cfg?.color ?? "#6b7280";
                            const icon = cfg?.icon ?? "📌";
                            const vol = volunteers.find((v) => v.name === ev.assigned_to);
                            const showLine = vol && (vol.line_id || vol.telefoon);
                            return (
                              <div key={ev.id} className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEventModal({ open: true, event: ev })}
                                  className="text-left flex-1 min-w-0 px-1.5 py-0.5 rounded text-xs truncate border-l-2"
                                  style={{
                                    background: `${color}30`,
                                    borderLeftColor: color,
                                    color: ADM_TEXT,
                                  }}
                                >
                                  {icon} {ev.title.slice(0, 20)}{ev.title.length > 20 ? "…" : ""}
                                </button>
                                {showLine && (
                                  <a
                                    href={vol.line_id ? `https://line.me/ti/p/~${vol.line_id}` : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#06C755] text-white text-[10px] font-bold rounded hover:bg-[#05a847]"
                                  >
                                    LINE
                                  </a>
                                )}
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <button
                              type="button"
                              className="text-xs text-stone-500 hover:underline"
                              onClick={() => setEventModal({ open: true, date: iso })}
                            >
                              +{dayEvents.length - 3} meer
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
                </>
              )}
            </div>
          )}

          {/* Mobiel: slide-up panel met events van gekozen dag */}
          {isMobile && mobileDayPanel && (
            <div
              className="fixed inset-x-0 bottom-0 z-40 rounded-t-xl border-t max-h-[70vh] overflow-y-auto lg:hidden"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              <div className="sticky top-0 p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER, background: ADM_CARD }}>
                <h3 className="font-semibold" style={{ color: ADM_TEXT }}>
                  {new Date(mobileDayPanel).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
                </h3>
                <button type="button" onClick={() => setMobileDayPanel(null)} className="text-xl" style={{ color: ADM_MUTED }}>×</button>
              </div>
              <div className="p-4 space-y-2">
                {(eventsByDate[mobileDayPanel] ?? []).map((ev) => {
                  const cfg = EVENT_CATEGORIES[ev.category as EventCategory];
                  const color = cfg?.color ?? "#6b7280";
                  const icon = cfg?.icon ?? "📌";
                  const vol = volunteers.find((v) => v.name === ev.assigned_to);
                  const showLine = vol && (vol.line_id || vol.telefoon);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => { setEventModal({ open: true, event: ev }); setMobileDayPanel(null); }}
                      className="w-full text-left p-3 rounded-lg border-l-4"
                      style={{ borderColor: color, background: `${color}15` }}
                    >
                      <span>{icon} {ev.title}</span>
                      <span className="text-xs block mt-1 flex items-center gap-2 flex-wrap" style={{ color: ADM_MUTED }}>
                        {new Date(ev.start_time).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        {showLine && (
                          <a
                            href={vol.line_id ? `https://line.me/ti/p/~${vol.line_id}` : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#06C755] text-white text-xs font-bold rounded-lg hover:bg-[#05a847] transition-colors"
                          >
                            💬 LINE
                          </a>
                        )}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => { setEventModal({ open: true, date: mobileDayPanel }); setMobileDayPanel(null); }}
                  className="w-full py-2 rounded-lg border border-dashed text-sm"
                  style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
                >
                  + Nieuw event
                </button>
              </div>
            </div>
          )}

          {/* Weekweergave */}
          {view === "week" && (
            <div
              className="rounded-xl border overflow-x-auto"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                  <div className="grid grid-cols-8 gap-2 min-w-[400px]">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded" style={{ background: "rgba(0,0,0,.06)" }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-w-[600px]">
                  <div
                    className="grid gap-px border-b"
                    style={{
                      gridTemplateColumns: `60px repeat(7, 1fr)`,
                      borderColor: ADM_BORDER,
                    }}
                  >
                    <div className="border-r p-1" style={{ borderColor: ADM_BORDER }} />
                    {weekDays.map((d) => (
                      <div
                        key={d.toISOString()}
                        className="border-r p-1 text-center text-xs font-medium"
                        style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}
                      >
                        {d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric" })}
                      </div>
                    ))}
                  </div>
                  <div className="flex" style={{ borderColor: ADM_BORDER }}>
                    <div className="w-[60px] shrink-0 border-r" style={{ borderColor: ADM_BORDER }}>
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="text-xs px-1 flex items-start pt-0.5"
                          style={{ height: HOUR_ROW_PX, borderColor: ADM_BORDER, color: ADM_MUTED }}
                        >
                          {h}:00
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7 min-w-0">
                      {weekDays.map((d) => {
                        const iso = isoDayKey(d);
                        const dayEvents = eventsByDate[iso] ?? [];
                        return (
                          <div
                            key={iso}
                            className="relative border-r last:border-r-0 shrink-0"
                            style={{
                              width: "100%",
                              minHeight: HOURS.length * HOUR_ROW_PX,
                              borderColor: ADM_BORDER,
                            }}
                          >
                            {HOURS.map((h) => (
                              <div
                                key={h}
                                className="border-b"
                                style={{ height: HOUR_ROW_PX, borderColor: ADM_BORDER }}
                              />
                            ))}
                            <div className="absolute inset-0 pointer-events-none z-[1]">
                              {dayEvents.map((ev) => {
                                const layout = layoutEventBlock(ev, d);
                                if (!layout) return null;
                                const cfg = EVENT_CATEGORIES[ev.category as EventCategory];
                                const color = cfg?.color ?? "#6b7280";
                                const icon = cfg?.icon ?? "📌";
                                return (
                                  <button
                                    key={ev.id}
                                    type="button"
                                    onClick={() => setEventModal({ open: true, event: ev })}
                                    className="absolute left-0.5 right-0.5 text-left px-1 py-0.5 rounded text-[10px] leading-tight truncate border-l-2 shadow-sm pointer-events-auto overflow-hidden"
                                    style={{
                                      top: layout.top,
                                      height: layout.height,
                                      background: `${color}30`,
                                      borderLeftColor: color,
                                      color: ADM_TEXT,
                                    }}
                                    title={ev.title}
                                  >
                                    <span className="font-medium">
                                      {icon}{" "}
                                      {ev.title.length > 24 ? `${ev.title.slice(0, 24)}…` : ev.title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dagweergave */}
          {view === "day" && (
            <div
              className="rounded-xl border overflow-auto"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              {loading ? (
                <div className="min-h-[480px] p-4 space-y-2">
                  <div className="h-6 w-48 animate-pulse rounded mx-auto" style={{ background: "rgba(0,0,0,.06)" }} />
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded" style={{ background: "rgba(0,0,0,.06)" }} />
                  ))}
                </div>
              ) : (
                <>
              <div className="p-2 border-b text-center font-medium" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>
                {current ? current.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
              </div>
              <div className="flex">
                <div className="w-14 shrink-0 border-r" style={{ borderColor: ADM_BORDER }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="text-xs px-1 flex items-start pt-0.5"
                      style={{ height: HOUR_ROW_PX, color: ADM_MUTED }}
                    >
                      {h}:00
                    </div>
                  ))}
                </div>
                <div
                  className="flex-1 relative min-w-0"
                  style={{ minHeight: HOURS.length * HOUR_ROW_PX }}
                >
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="border-b"
                      style={{ height: HOUR_ROW_PX, borderColor: ADM_BORDER }}
                    />
                  ))}
                  {current && (
                    <div className="absolute inset-0 pointer-events-none z-[1]">
                      {(eventsByDate[isoDayKey(current)] ?? []).map((ev) => {
                        const layout = layoutEventBlock(ev, current);
                        if (!layout) return null;
                        const cfg = EVENT_CATEGORIES[ev.category as EventCategory];
                        const color = cfg?.color ?? "#6b7280";
                        const icon = cfg?.icon ?? "📌";
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => setEventModal({ open: true, event: ev })}
                            className="absolute left-1 right-1 text-left px-1.5 py-1 rounded text-xs leading-snug border-l-2 shadow-sm pointer-events-auto overflow-hidden"
                            style={{
                              top: layout.top,
                              height: layout.height,
                              background: `${color}30`,
                              borderLeftColor: color,
                              color: ADM_TEXT,
                            }}
                            title={ev.title}
                          >
                            <span className="font-semibold block truncate">
                              {icon} {ev.title}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {new Date(ev.start_time).toLocaleTimeString("nl-NL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {ev.end_time
                                ? ` – ${new Date(ev.end_time).toLocaleTimeString("nl-NL", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}`
                                : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Kleurlegenda */}
          <div className="flex flex-wrap items-center gap-2 pt-2" style={{ color: ADM_MUTED }}>
            <span className="text-xs font-medium">Legenda:</span>
            {EVENT_CATEGORY_IDS.map((id) => {
              const cfg = EVENT_CATEGORIES[id];
              const color = cfg?.color ?? "#6b7280";
              const icon = cfg?.icon ?? "📌";
              const label = cfg?.label ?? "Overig";
              const hidden = hiddenCategories.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleCategory(id)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs border transition-opacity"
                  style={{
                    borderColor: hidden ? ADM_BORDER : color,
                    background: hidden ? "#f1f5f9" : `${color}20`,
                    opacity: hidden ? 0.6 : 1,
                    textDecoration: hidden ? "line-through" : "none",
                    color: hidden ? ADM_MUTED : ADM_TEXT,
                  }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rechts: zijpaneel (30%) — op mobiel tabbladen */}
        <div className="lg:w-[30%] space-y-4">
          {isMobile && (
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: ADM_BORDER }}>
              <button
                type="button"
                onClick={() => setSideTab("upcoming")}
                className="flex-1 py-2 text-sm font-medium"
                style={{
                  background: sideTab === "upcoming" ? "rgba(13,148,136,.15)" : "transparent",
                  color: sideTab === "upcoming" ? ADM_ACCENT : ADM_MUTED,
                }}
              >
                {t("upcomingEvents")}
              </button>
              <button
                type="button"
                onClick={() => setSideTab("lab")}
                className="flex-1 py-2 text-sm font-medium"
                style={{
                  background: sideTab === "lab" ? "rgba(13,148,136,.15)" : "transparent",
                  color: sideTab === "lab" ? ADM_ACCENT : ADM_MUTED,
                }}
              >
                {t("recentLabResults")}
              </button>
            </div>
          )}
          <div
            className={`rounded-xl border p-4 ${isMobile && sideTab !== "upcoming" ? "hidden" : ""}`}
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <h2 className="font-semibold mb-2" style={{ color: ADM_TEXT }}>
              {t("upcomingEvents")}
            </h2>
            <div className="flex gap-1 mb-3">
              {(["all", "medical", "volunteers", "deadlines"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSideFilter(f)}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    background: sideFilter === f ? "rgba(13,148,136,.2)" : "transparent",
                    color: sideFilter === f ? ADM_ACCENT : ADM_MUTED,
                  }}
                >
                  {f === "all" ? t("filterAll") : f === "medical" ? t("filterMedical") : f === "volunteers" ? t("filterVolunteers") : t("filterDeadlines")}
                </button>
              ))}
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm" style={{ color: ADM_MUTED }}>
                Geen aankomende events
              </p>
            ) : (
              <ul className="space-y-2">
                {upcomingEvents.map((ev) => {
                  const cfg = EVENT_CATEGORIES[ev.category as EventCategory];
                  const color = cfg?.color ?? "#6b7280";
                  const icon = cfg?.icon ?? "📌";
                  const vol = volunteers.find((v) => v.name === ev.assigned_to);
                  const showLine = vol && (vol.line_id || vol.telefoon);
                  return (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => setEventModal({ open: true, event: ev })}
                        className="w-full text-left flex items-center gap-2 p-2 rounded-lg border hover:bg-stone-50"
                        style={{ borderColor: ADM_BORDER }}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm truncate flex-1" style={{ color: ADM_TEXT }}>
                          {ev.title}
                        </span>
                        <span className="text-xs shrink-0 flex items-center gap-1" style={{ color: ADM_MUTED }}>
                          {new Date(ev.start_time).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })} {new Date(ev.start_time).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                          {showLine && (
                            <a
                              href={vol.line_id ? `https://line.me/ti/p/~${vol.line_id}` : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#06C755] text-white text-xs font-bold rounded-lg hover:bg-[#05a847] transition-colors"
                            >
                              💬 LINE
                            </a>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {upcomingEventsAll.length > 10 && (
              <button
                type="button"
                onClick={() => setEventModal({ open: true })}
                className="mt-2 text-sm font-medium"
                style={{ color: ADM_ACCENT }}
              >
                {t("showMore")} →
              </button>
            )}
          </div>
          <div
            className={`rounded-xl border p-4 ${isMobile && sideTab !== "lab" ? "hidden" : ""}`}
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <h2 className="font-semibold mb-2" style={{ color: ADM_TEXT }}>
              {t("recentLabResults")}
            </h2>
            {labEvents.length === 0 ? (
              <p className="text-sm" style={{ color: ADM_MUTED }}>
                {t("noLabResults")}
              </p>
            ) : (
              <ul className="space-y-2">
                {labEvents.map((ev) => {
                  const status = ev.lab_result_status;
                  const statusCfg = status && (status === "normaal" || status === "afwijkend" || status === "kritiek")
                    ? LAB_RESULT_STATUSES[status]
                    : null;
                  const vol = volunteers.find((v) => v.name === ev.assigned_to);
                  const showLine = vol && (vol.line_id || vol.telefoon);
                  return (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => setEventModal({ open: true, event: ev })}
                        className="w-full text-left p-2 rounded-lg border hover:bg-stone-50 text-sm"
                        style={{ borderColor: ADM_BORDER }}
                      >
                        <span style={{ color: ADM_TEXT }}>{ev.animal_name ?? ev.title}</span>
                        <span className="text-xs block mt-0.5 flex items-center gap-1 flex-wrap" style={{ color: ADM_MUTED }}>
                          {new Date(ev.start_time).toLocaleDateString("nl-NL")}
                          {statusCfg && (
                            <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${statusCfg.color}30`, color: statusCfg.color }}>
                              {statusCfg.icon} {statusCfg.label}
                            </span>
                          )}
                          {showLine && (
                            <a
                              href={vol.line_id ? `https://line.me/ti/p/~${vol.line_id}` : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#06C755] text-white text-xs font-bold rounded-lg hover:bg-[#05a847] transition-colors"
                            >
                              💬 LINE
                            </a>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {eventModal.open && (
        <EventModal
          initialDate={eventModal.date}
          initialEvent={eventModal.event ?? null}
          volunteers={volunteers}
          onClose={() => setEventModal({ open: false })}
          onSaved={() => fetchEvents()}
        />
      )}
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImported={() => fetchEvents()}
        />
      )}
    </div>
  );
}
