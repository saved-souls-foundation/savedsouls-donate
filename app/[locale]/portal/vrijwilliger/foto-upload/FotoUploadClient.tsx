"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Dier = { id: string; naam: string | null };

export default function FotoUploadClient() {
  const router = useRouter();
  const [dieren, setDieren] = useState<Dier[]>([]);
  const [dierId, setDierId] = useState("");
  const [notitie, setNotitie] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/portal/dieren")
      .then(async (r) => {
        const data = r.ok ? await r.json() : null;
        if (data?.dieren) setDieren(data.dieren);
        if (!r.ok) setError("Geen toegang of niet ingelogd.");
        return data;
      })
      .catch(() => setError("Kon lijst niet laden."));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dierId || !file?.size) {
      setError("Kies een dier en een foto.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const form = new FormData();
      form.set("dier_id", dierId);
      form.set("notitie", notitie);
      form.set("file", file);
      const res = await fetch("/api/portal/dier-foto", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Upload mislukt.");
        return;
      }
      setSuccess(true);
      setFile(null);
      setNotitie("");
    } catch {
      setError("Upload mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/portal/vrijwilliger" className="text-[#2aa348] font-semibold text-sm">
          ← Terug naar portaal
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">📷 Foto uploaden</h1>
        <p className="text-sm text-gray-600 mt-1">
          Kies een dier, voeg een foto en optioneel een notitie toe. De foto wordt aan het dierprofiel gekoppeld.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dier</label>
          <select
            value={dierId}
            onChange={(e) => setDierId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
            required
          >
            <option value="">— Kies een dier —</option>
            {dieren.map((d) => (
              <option key={d.id} value={d.id}>{d.naam ?? "Naamloos"}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2aa348] file:text-white file:font-semibold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notitie (optioneel)</label>
          <textarea
            value={notitie}
            onChange={(e) => setNotitie(e.target.value)}
            rows={2}
            placeholder="Korte notitie bij de foto..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348] resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Foto is geüpload en gekoppeld aan het dier.</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#2aa348] text-white font-bold text-sm hover:bg-[#166534] disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Verstuur"}
        </button>
      </form>
    </div>
  );
}
