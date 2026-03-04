"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { StatCard, EmptyState, StatusBadge, QuickActions, TableWrapper } from "../components/ui/design-system";
import type { DierRow } from "./page";

function verblijfsduur(date: string | null): string {
  if (!date) return "–";
  const d = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (d < 30) return `${d}d`;
  if (d < 365) return `${Math.floor(d / 30)}mnd`;
  return `${Math.floor(d / 365)}jr`;
}

const statusKleur: Record<string, "success" | "warning" | "danger" | "info" | "gray"> = {
  in_opvang: "info",
  foster: "warning",
  geadopteerd: "success",
  overleden: "gray",
};

const statusLabel: Record<string, string> = {
  in_opvang: "In opvang",
  foster: "Foster",
  geadopteerd: "Geadopteerd",
  overleden: "Overleden",
};

function DierKaart({
  dier,
  onClick,
}: {
  dier: DierRow;
  onClick: () => void;
}) {
  const type = (dier.status && statusKleur[dier.status]) ?? "info";
  const label = (dier.status && statusLabel[dier.status]) ?? dier.status ?? "–";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
    >
      <div className="relative aspect-square bg-gray-100">
        {dier.foto_url ? (
          <img
            src={dier.foto_url}
            alt={dier.naam ?? ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <span className="text-5xl">{dier.soort === "kat" ? "🐱" : "🐕"}</span>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              type === "info"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : type === "warning"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {label}
          </span>
        </div>

        {dier.medisch_urgent && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            !
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-800">
            👁️ Bekijken
          </span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm truncate">{dier.naam ?? "Naamloos"}</h3>
          <span className="text-xs text-gray-400 shrink-0">
            {dier.geslacht === "M" || dier.geslacht === "male" ? "♂" : "♀"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {dier.ras ?? dier.soort ?? "–"}
          {dier.leeftijd ? ` · ${dier.leeftijd}` : ""}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] text-gray-400">
            📅 {verblijfsduur(dier.aangemeld_op ?? dier.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdminDierenClient({ dieren }: { dieren: DierRow[] }) {
  const router = useRouter();
  const [view, setView] = useState<"kaarten" | "lijst">("kaarten");
  const [zoekterm, setZoekterm] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [soortFilter, setSoortFilter] = useState("alle");
  const [selectedDier, setSelectedDier] = useState<DierRow | null>(null);
  const [modalTab, setModalTab] = useState<"Info" | "Medisch" | "Notities">("Info");

  const gefilterd = dieren.filter((d) => {
    const matchZoek =
      !zoekterm ||
      (d.naam ?? "").toLowerCase().includes(zoekterm.toLowerCase()) ||
      (d.ras ?? "").toLowerCase().includes(zoekterm.toLowerCase());
    const matchStatus = statusFilter === "alle" || d.status === statusFilter;
    const matchSoort = soortFilter === "alle" || d.soort === soortFilter;
    return matchZoek && matchStatus && matchSoort;
  });

  const inOpvang = dieren.filter((d) => d.status === "in_opvang").length;
  const inFoster = dieren.filter((d) => d.status === "foster").length;
  const geadopteerdDitJaar = dieren.filter((d) => {
    if (d.status !== "geadopteerd") return false;
    const jaar = new Date(d.updated_at ?? d.created_at ?? 0).getFullYear();
    return jaar === new Date().getFullYear();
  }).length;
  const medischUrgent = dieren.filter((d) => d.medisch_urgent === true).length;

  if (dieren.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="🐾"
          title="Nog geen dieren geregistreerd"
          description="Voeg het eerste dier toe aan de opvang"
          actionLabel="+ Dier toevoegen"
          onAction={() => router.push("/admin/dieren/nieuw")}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🐾" label="In opvang" value={inOpvang} sub="actief in shelter" />
        <StatCard icon="🏠" label="In foster" value={inFoster} sub="" accentColor="blue" />
        <StatCard
          icon="✅"
          label="Geadopteerd (dit jaar)"
          value={geadopteerdDitJaar}
          sub=""
          accentColor="green"
        />
        <StatCard
          icon="⚠️"
          label="Medische aandacht"
          value={medischUrgent}
          sub=""
          accentColor="red"
        />
      </div>

      {/* Filter bar + view toggle */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          placeholder="Zoek op naam of ras..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
        />
        {[
          { value: "alle", label: "Alle" },
          { value: "in_opvang", label: "🏠 In opvang" },
          { value: "foster", label: "🤝 Foster" },
          { value: "geadopteerd", label: "✅ Geadopteerd" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              statusFilter === s.value
                ? "bg-[#2aa348] text-white border-[#2aa348]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}
        <select
          value={soortFilter}
          onChange={(e) => setSoortFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 bg-white"
        >
          <option value="alle">Alle soorten</option>
          <option value="hond">🐕 Honden</option>
          <option value="kat">🐱 Katten</option>
          <option value="overig">Overig</option>
        </select>
        <div className="ml-auto flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {[
            { id: "kaarten" as const, icon: "⊞", label: "Kaarten" },
            { id: "lijst" as const, icon: "☰", label: "Lijst" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === v.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kaarten view */}
      {view === "kaarten" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {gefilterd.map((dier) => (
            <DierKaart key={dier.id} dier={dier} onClick={() => setSelectedDier(dier)} />
          ))}
        </div>
      )}

      {/* Lijst view */}
      {view === "lijst" && (
        <TableWrapper>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 font-semibold">
                <th className="pb-3 pr-2">Foto</th>
                <th className="pb-3 pr-2">Naam / Ras</th>
                <th className="pb-3 pr-2">Soort</th>
                <th className="pb-3 pr-2">Status</th>
                <th className="pb-3 pr-2">Verblijfsduur</th>
                <th className="pb-3 pr-2">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((dier) => (
                <tr
                  key={dier.id}
                  className="border-b border-gray-100 group hover:bg-gray-50/80 align-middle"
                >
                  <td className="py-3 pr-2">
                    {dier.foto_url ? (
                      <img
                        src={dier.foto_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{dier.soort === "kat" ? "🐱" : "🐕"}</span>
                    )}
                  </td>
                  <td className="py-3 pr-2">
                    <div className="font-semibold text-gray-900">{dier.naam ?? "Naamloos"}</div>
                    <div className="text-xs text-gray-500">{dier.ras ?? "–"}</div>
                  </td>
                  <td className="py-3 pr-2 text-gray-600">{dier.soort ?? "–"}</td>
                  <td className="py-3 pr-2">
                    <StatusBadge
                      label={(dier.status && statusLabel[dier.status]) ?? dier.status ?? "–"}
                      type={(statusKleur[dier.status] || "gray") as "gray" | "success" | "warning" | "danger" | "info"}
                    />
                  </td>
                  <td className="py-3 pr-2 text-gray-500">
                    {verblijfsduur(dier.aangemeld_op ?? dier.created_at)}
                  </td>
                  <td className="py-3 pr-2">
                    <QuickActions
                      actions={[
                        { icon: "👁️", label: "Bekijken", onClick: () => setSelectedDier(dier) },
                        {
                          icon: "✏️",
                          label: "Bewerken",
                          onClick: () => router.push(`/admin/dieren/${dier.id}`),
                        },
                        {
                          icon: "🗑️",
                          label: "Verwijderen",
                          onClick: () => {},
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      )}

      {/* Detail modal */}
      {selectedDier && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDier(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {selectedDier.soort === "kat" ? "🐱" : "🐕"}
                </span>
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg">
                    {selectedDier.naam ?? "Naamloos"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedDier.ras ?? "–"} · {selectedDier.leeftijd ?? "–"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDier(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              {(["Info", "Medisch", "Notities"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                    modalTab === tab
                      ? "border-[#2aa348] text-[#2aa348]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {modalTab === "Info" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Naam", value: selectedDier.naam ?? "–" },
                    { label: "Soort", value: selectedDier.soort ?? "–" },
                    { label: "Ras", value: selectedDier.ras ?? "–" },
                    { label: "Leeftijd", value: selectedDier.leeftijd ?? "–" },
                    {
                      label: "Geslacht",
                      value:
                        selectedDier.geslacht === "M" || selectedDier.geslacht === "male"
                          ? "Mannelijk"
                          : "Vrouwelijk",
                    },
                    { label: "Status", value: (selectedDier.status && statusLabel[selectedDier.status]) ?? selectedDier.status ?? "–" },
                    {
                      label: "Aangemeld op",
                      value: selectedDier.aangemeld_op
                        ? new Date(selectedDier.aangemeld_op).toLocaleDateString("nl-NL")
                        : "–",
                    },
                    { label: "Locatie", value: selectedDier.locatie ?? "Hoofdshelter" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        {item.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                  {selectedDier.beschrijving && (
                    <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Beschrijving
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {selectedDier.beschrijving}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "Medisch" && (
                <div className="space-y-3">
                  {selectedDier.medisch_urgent && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm font-semibold text-red-700">
                      ⚠️ Medische aandacht vereist
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 text-center">
                      Medisch dossier — koppel aan agenda voor afspraken
                    </p>
                  </div>
                </div>
              )}

              {modalTab === "Notities" && (
                <div className="space-y-3">
                  <textarea
                    placeholder="Voeg een notitie toe over dit dier..."
                    className="w-full h-32 p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#2aa348] text-white text-sm font-semibold hover:bg-[#166534]"
                  >
                    💾 Notitie opslaan
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setSelectedDier(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Sluiten
              </button>
              <Link
                href={`/admin/dieren/${selectedDier.id}`}
                className="px-4 py-2 rounded-xl bg-[#2aa348] text-white text-sm font-semibold hover:bg-[#166534] transition-colors inline-block"
              >
                ✏️ Volledig bewerken
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
