"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_IDS,
  LAB_RESULT_STATUSES,
  LAB_STATUS_IDS,
  type EventCategory,
  type LabResultStatus,
} from "@/lib/agendaConfig";
import type { CalendarEvent } from "./AgendaClient";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const TEAL = "#2A9D8F";

/** Lokale kalenderdag als yyyy-mm-dd (vereist voor input type="date"; toISOString zou UTC-datum geven). */
function localDateYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function localTimeHm(d: Date): string {
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

type AnimalOption = { id: string; name: string; type: "dog" | "cat"; image?: string };

type Volunteer = { id: string; name: string | null; line_id?: string | null; telefoon?: string | null };

type Props = {
  initialDate?: string;
  initialEvent?: CalendarEvent | null;
  volunteers?: Volunteer[];
  onClose: () => void;
  onSaved: () => void;
};

export default function EventModal({ initialDate, initialEvent, volunteers = [], onClose, onSaved }: Props) {
  const t = useTranslations("admin.agenda");
  const isEdit = !!initialEvent;

  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category ?? "afspraak");
  const [date, setDate] = useState(
    initialDate ??
      (initialEvent?.start_time ? localDateYmd(new Date(initialEvent.start_time)) : localDateYmd(new Date()))
  );
  const [startTime, setStartTime] = useState(
    initialEvent?.start_time ? localTimeHm(new Date(initialEvent.start_time)) : "09:00"
  );
  const [endTime, setEndTime] = useState(
    initialEvent?.end_time ? localTimeHm(new Date(initialEvent.end_time)) : "10:00"
  );
  const [location, setLocation] = useState(initialEvent?.location ?? "");
  const [animalId, setAnimalId] = useState<string | null>(initialEvent?.animal_id ?? null);
  const [animalName, setAnimalName] = useState(initialEvent?.animal_name ?? "");
  const [assignedTo, setAssignedTo] = useState(initialEvent?.assigned_to ?? "");
  const [description, setDescription] = useState(initialEvent?.description ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(initialEvent?.attachment_url ?? "");
  const [labResultAvailable, setLabResultAvailable] = useState(!!initialEvent?.lab_result_status);
  const [labResultStatus, setLabResultStatus] = useState<LabResultStatus | "">((initialEvent?.lab_result_status as LabResultStatus) ?? "normaal");
  const [labResultNotes, setLabResultNotes] = useState(initialEvent?.lab_result_notes ?? "");
  const [animals, setAnimals] = useState<AnimalOption[]>([]);
  const [animalSearch, setAnimalSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/agenda/animals")
      .then((r) => r.json())
      .then((data) => {
        const list: AnimalOption[] = [];
        (data.dogs ?? []).forEach((d: { id: string; name: string; image?: string }) =>
          list.push({ id: String(d.id), name: d.name, type: "dog", image: d.image })
        );
        (data.cats ?? []).forEach((c: { id: string; name: string; image?: string }) =>
          list.push({ id: String(c.id), name: c.name, type: "cat", image: c.image })
        );
        setAnimals(list);
      })
      .catch(() => {});
  }, []);

  const filteredAnimals = useMemo(() => {
    const q = animalSearch.trim().toLowerCase();
    if (q.length < 2) return [];
    return animals.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 20);
  }, [animals, animalSearch]);

  const isLaboratorium = category === "laboratorium";

  async function handleSave() {
    console.log("EventModal handleSave called");
    setErrorMessage("");
    if (!title.trim()) {
      setErrorMessage("Vul een titel in.");
      return;
    }
    setSaving(true);
    try {
      const start = `${date}T${startTime}:00`;
      const end = endTime ? `${date}T${endTime}:00` : null;
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        start_time: start,
        end_time: end,
        location: location.trim() || null,
        animal_id: animalId,
        animal_name: animalName.trim() || null,
        assigned_to: assignedTo.trim() || null,
        attachment_url: attachmentUrl || null,
        lab_result_status: isLaboratorium && labResultAvailable ? labResultStatus || null : null,
        lab_result_notes: isLaboratorium && labResultAvailable ? labResultNotes.trim() || null : null,
      };
      const url = isEdit ? `/api/admin/agenda/events/${initialEvent!.id}` : "/api/admin/agenda/events";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data?.error === "string" ? data.error : "Opslaan mislukt";
        console.error("Agenda event save error:", res.status, data);
        throw new Error(msg);
      }
      onSaved();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Opslaan mislukt";
      setErrorMessage(msg);
      console.error("EventModal handleSave error:", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !confirm(t("deleteConfirm"))) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/agenda/events/${initialEvent!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(file: File) {
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/agenda/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.url) setAttachmentUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white border w-full max-w-lg overflow-y-auto my-4 md:my-0 min-h-[100vh] md:min-h-0 md:max-h-[90vh] md:rounded-xl"
        style={{ borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
          <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
            {isEdit ? "Event bewerken" : "Nieuw event"}
          </h2>
          <button type="button" onClick={onClose} className="text-xl leading-none" style={{ color: ADM_MUTED }}>
            ×
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
              Titel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
              Categorie *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: ADM_BORDER }}
            >
              {EVENT_CATEGORY_IDS.map((id) => {
                const c = EVENT_CATEGORIES[id];
                return (
                  <option key={id} value={id}>
                    {c.icon} {c.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                Datum *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ borderColor: ADM_BORDER }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>
                Starttijd
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ borderColor: ADM_BORDER }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Eindtijd
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Locatie / kamer
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optioneel"
              className="w-full px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Dier betrokken
            </label>
            {animalId && animalName ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
                  style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                >
                  {(() => {
                    const a = animals.find((x) => x.id === animalId);
                    const img = a?.image;
                    return (
                      <>
                        {img && (
                          <img
                            src={img.startsWith("http") ? img : `https://db.savedsouls-foundation.org${img.startsWith("/") ? "" : "/"}${img}`}
                            alt=""
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <span>{animalName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAnimalId(null);
                            setAnimalName("");
                            setAnimalSearch("");
                          }}
                          className="ml-1 leading-none text-lg font-bold hover:opacity-80"
                          style={{ color: ADM_MUTED }}
                          aria-label="Verwijderen"
                        >
                          ×
                        </button>
                      </>
                    );
                  })()}
                </span>
              </div>
            ) : null}
            <input
              type="text"
              value={animalSearch}
              onChange={(e) => {
                setAnimalSearch(e.target.value);
                if (!e.target.value.trim()) setAnimalId(null);
              }}
              placeholder="Min. 2 letters om te zoeken…"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: ADM_BORDER }}
            />
            {animalSearch.trim().length >= 2 && filteredAnimals.length > 0 && (
              <ul className="mt-1 border rounded-lg overflow-hidden max-h-40 overflow-y-auto" style={{ borderColor: ADM_BORDER }}>
                {filteredAnimals.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setAnimalId(a.id);
                        setAnimalName(a.name);
                        setAnimalSearch("");
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-stone-50 text-sm"
                      style={{ color: ADM_TEXT }}
                    >
                      {a.image && (
                        <img
                          src={a.image.startsWith("http") ? a.image : `https://db.savedsouls-foundation.org${a.image.startsWith("/") ? "" : "/"}${a.image}`}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span>{a.name}</span>
                      <span className="text-xs" style={{ color: ADM_MUTED }}>{a.type === "cat" ? "kat" : "hond"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Toegewezen aan
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Optioneel"
                className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border bg-transparent"
                style={{ borderColor: ADM_BORDER }}
              />
              {(() => {
                const vol = volunteers.find((v) => v.name === assignedTo.trim());
                return vol && (vol.line_id || vol.telefoon) ? (
                  <a
                    href={vol.line_id ? `https://line.me/ti/p/~${vol.line_id}` : `https://line.me/ti/p/${(vol.telefoon ?? "").replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#06C755] text-white text-xs font-bold rounded-lg hover:bg-[#05a847] transition-colors"
                  >
                    💬 LINE
                  </a>
                ) : null;
              })()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Notities / beschrijving
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-transparent resize-y"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>
              Bijlage (PDF, JPG, PNG)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              id="agenda-file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
                e.target.value = "";
              }}
            />
            <label htmlFor="agenda-file" className="block border-2 border-dashed rounded-lg p-4 text-center text-sm cursor-pointer" style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}>
              {uploading ? "Uploaden…" : "Klik of sleep bestand"}
            </label>
            {attachmentUrl && (
              <p className="mt-1 text-sm">
                <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: ADM_ACCENT }}>
                  Bijlage bekijken
                </a>
                <button type="button" onClick={() => setAttachmentUrl("")} className="ml-2 text-red-600 text-xs">
                  Verwijderen
                </button>
              </p>
            )}
          </div>

          {isLaboratorium && (
            <>
              <div className="pt-2 border-t" style={{ borderColor: ADM_BORDER }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={labResultAvailable} onChange={(e) => setLabResultAvailable(e.target.checked)} />
                  <span className="text-sm" style={{ color: ADM_TEXT }}>Uitslag beschikbaar?</span>
                </label>
              </div>
              {labResultAvailable && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: ADM_TEXT }}>Uitslag status</label>
                    <select
                      value={labResultStatus}
                      onChange={(e) => setLabResultStatus(e.target.value as LabResultStatus)}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{ borderColor: ADM_BORDER }}
                    >
                      {LAB_STATUS_IDS.map((id) => {
                        const s = LAB_RESULT_STATUSES[id];
                        return (
                          <option key={id} value={id}>
                            {s.icon} {s.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: ADM_MUTED }}>Uitslag samenvatting</label>
                    <textarea
                      value={labResultNotes}
                      onChange={(e) => setLabResultNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent"
                      style={{ borderColor: ADM_BORDER }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="p-4 border-t flex flex-wrap gap-2 justify-end" style={{ borderColor: ADM_BORDER }}>
          {errorMessage && (
            <p className="w-full text-sm text-red-600 mb-2" role="alert">
              {errorMessage}
            </p>
          )}
          {isEdit && (
            <button type="button" onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-lg text-sm text-red-600 border border-red-300 hover:bg-red-50">
              {t("delete")}
            </button>
          )}
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: ADM_BORDER }}>
            {t("cancel")}
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TEAL }}>
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
