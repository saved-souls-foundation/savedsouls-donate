"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function DierNieuwForm() {
  const router = useRouter();
  const [naam, setNaam] = useState("");
  const [soort, setSoort] = useState<"hond" | "kat" | "overig">("hond");
  const [ras, setRas] = useState("");
  const [leeftijd, setLeeftijd] = useState("");
  const [geslacht, setGeslacht] = useState<"M" | "V" | "">("");
  const [status, setStatus] = useState<"in_opvang" | "foster" | "geadopteerd" | "overleden">("in_opvang");
  const [fotoUrl, setFotoUrl] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [locatie, setLocatie] = useState("");
  const [medischUrgent, setMedischUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dieren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: naam.trim() || null,
          soort,
          ras: ras.trim() || null,
          leeftijd: leeftijd.trim() || null,
          geslacht: geslacht || null,
          status,
          foto_url: fotoUrl.trim() || null,
          beschrijving: beschrijving.trim() || null,
          locatie: locatie.trim() || null,
          medisch_urgent: medischUrgent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Opslaan mislukt");
        return;
      }
      if (data.id) router.push(`/admin/dieren?id=${encodeURIComponent(data.id)}`);
      else router.push("/admin/dieren");
    } catch {
      setError("Netwerkfout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
        <input
          type="text"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
          placeholder="Bijv. Luna"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Soort</label>
        <select
          value={soort}
          onChange={(e) => setSoort(e.target.value as "hond" | "kat" | "overig")}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
        >
          <option value="hond">Hond</option>
          <option value="kat">Kat</option>
          <option value="overig">Overig</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ras</label>
        <input
          type="text"
          value={ras}
          onChange={(e) => setRas(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
          placeholder="Optioneel"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Leeftijd</label>
          <input
            type="text"
            value={leeftijd}
            onChange={(e) => setLeeftijd(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
            placeholder="Bijv. 2 jaar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Geslacht</label>
          <select
            value={geslacht}
            onChange={(e) => setGeslacht(e.target.value as "M" | "V" | "")}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
          >
            <option value="">—</option>
            <option value="M">M (reuen)</option>
            <option value="V">V (teefjes)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
        >
          <option value="in_opvang">In opvang</option>
          <option value="foster">Foster</option>
          <option value="geadopteerd">Geadopteerd</option>
          <option value="overleden">Overleden</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
        <input
          type="url"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Locatie</label>
        <input
          type="text"
          value={locatie}
          onChange={(e) => setLocatie(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
          placeholder="Optioneel"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
        <textarea
          value={beschrijving}
          onChange={(e) => setBeschrijving(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
          placeholder="Korte omschrijving..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="medisch"
          checked={medischUrgent}
          onChange={(e) => setMedischUrgent(e.target.checked)}
          className="rounded border-gray-300 text-[#2aa348] focus:ring-[#2aa348]"
        />
        <label htmlFor="medisch" className="text-sm font-medium text-gray-700">
          Medisch urgent
        </label>
      </div>
      <div className="flex flex-wrap gap-2 pt-4 pb-8">
        <Link
          href="/admin/dieren"
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          ← Terug naar dieren
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#2aa348] text-white text-sm font-bold hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Dier opslaan"}
        </button>
      </div>
    </form>
  );
}
