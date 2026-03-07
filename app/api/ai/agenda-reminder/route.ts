import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";

type CalendarEvent = {
  id: string;
  title: string | null;
  start_time: string;
  end_time: string | null;
  assigned_to: string | null;
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const nowStr = now.toISOString();
  const in48hStr = in48h.toISOString();

  const admin = createAdminClient();
  const { data: events, error: fetchErr } = await admin
    .from("calendar_events")
    .select("id, title, start_time, end_time, assigned_to")
    .gte("start_time", nowStr)
    .lte("start_time", in48hStr)
    .order("start_time", { ascending: true });

  if (fetchErr) {
    return NextResponse.json(
      { error: fetchErr.message },
      { status: 500 }
    );
  }

  const list = (events ?? []) as CalendarEvent[];
  const reminders: { titel: string; recipient: string; scheduled_for: string }[] = [];

  for (const ev of list) {
    const titel = ev.title ?? "Activiteit";
    const datum = new Date(ev.start_time).toLocaleString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const deelnemer = ev.assigned_to ?? "deelnemer";
    const taal = "nl";

    const prompt = `Schrijf een korte vriendelijke reminder (max 80 woorden) voor:
Activiteit: ${titel}
Datum/tijd: ${datum}
Deelnemer: ${deelnemer}
Schrijf in ${taal}. Warm en praktisch. Geen aanhef nodig.`;

    let reminderText: string;
    try {
      reminderText = await callClaude(prompt, {
        model: "haiku",
        maxTokens: 200,
        taskName: "agenda-reminder",
      });
    } catch (e) {
      console.error("[agenda-reminder] Claude error:", e);
      reminderText = `Herinnering: ${titel} op ${datum}.`;
    }

    const recipientEmail =
      typeof ev.assigned_to === "string" && ev.assigned_to.includes("@")
        ? ev.assigned_to
        : null;

    const { data: inserted, error: insertErr } = await admin
      .from("agenda_reminders")
      .insert({
        agenda_item_id: ev.id,
        recipient_email: recipientEmail,
        reminder_text: reminderText,
        taal,
        status: "concept",
        scheduled_for: ev.start_time,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("[agenda-reminder] insert error:", insertErr);
      continue;
    }

    reminders.push({
      titel,
      recipient: ev.assigned_to ?? "",
      scheduled_for: ev.start_time,
    });
  }

  return NextResponse.json({
    generated: reminders.length,
    reminders,
  });
}
