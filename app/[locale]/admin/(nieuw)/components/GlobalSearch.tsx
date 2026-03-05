"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";

type SearchResult = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  type: string;
  url: string;
};

export default function GlobalSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const [dierenRes, donateursRes, vrijwilligersRes, ledenRes] = await Promise.all([
        supabase
          .from("dieren")
          .select("id, naam, soort, status")
          .ilike("naam", `%${q}%`)
          .limit(3),
        supabase
          .from("donors")
          .select("id, voornaam, achternaam, email")
          .or(`voornaam.ilike.%${q}%,achternaam.ilike.%${q}%,email.ilike.%${q}%`)
          .limit(3),
        supabase
          .from("volunteer_onboarding")
          .select("id, voornaam, achternaam, email")
          .or(`voornaam.ilike.%${q}%,achternaam.ilike.%${q}%,email.ilike.%${q}%`)
          .limit(3),
        supabase
          .from("members")
          .select("id, voornaam, achternaam, email")
          .or(`voornaam.ilike.%${q}%,achternaam.ilike.%${q}%,email.ilike.%${q}%`)
          .limit(2),
      ]);

      const naam = (v: { voornaam?: string | null; achternaam?: string | null }) =>
        [v.voornaam, v.achternaam].filter(Boolean).join(" ").trim();

      const mapped: SearchResult[] = [
        ...(dierenRes.data ?? []).map((d) => ({
          id: `d-${d.id}`,
          icon: d.soort === "kat" ? "🐱" : "🐕",
          title: d.naam ?? "Naamloos",
          subtitle: `${d.soort ?? "–"} · ${d.status ?? "–"}`,
          type: "Dier",
          url: `/admin/dieren/${d.id}`,
        })),
        ...(donateursRes.data ?? []).map((d) => ({
          id: `don-${d.id}`,
          icon: "💰",
          title: naam(d) || (d as { email?: string | null }).email || "–",
          subtitle: (d as { email?: string | null }).email ?? "",
          type: "Donateur",
          url: `/admin/donateurs/${d.id}`,
        })),
        ...(vrijwilligersRes.data ?? []).map((v) => ({
          id: `v-${v.id}`,
          icon: "🤝",
          title: naam(v) || (v as { email?: string | null }).email || "–",
          subtitle: (v as { email?: string | null }).email ?? "",
          type: "Vrijwilliger",
          url: `/admin/vrijwilligers/${v.id}`,
        })),
        ...(ledenRes.data ?? []).map((l) => ({
          id: `l-${l.id}`,
          icon: "👥",
          title: naam(l) || (l as { email?: string | null }).email || "–",
          subtitle: (l as { email?: string | null }).email ?? "",
          type: "Lid",
          url: `/admin/leden/${l.id}`,
        })),
      ];
      setResults(mapped);
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setLoading(false);
    }
  }

  const shortcuts = [
    { icon: "🐾", label: "Dier toevoegen", url: "/admin/dieren/nieuw" },
    { icon: "📧", label: "Emails beantwoorden", url: "/admin/emails" },
    { icon: "💰", label: "Donateur toevoegen", url: "/admin/donateurs" },
    { icon: "📅", label: "Agenda bekijken", url: "/admin/agenda" },
    { icon: "📝", label: "Blog schrijven", url: "/admin/sociale-media" },
  ];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <span className="text-gray-400">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Zoek dieren, donateurs, vrijwilligers..."
            className="flex-1 text-sm text-gray-900 outline-none placeholder-gray-400 bg-transparent"
          />
          {loading && <span className="text-xs text-gray-400">zoeken...</span>}
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((r) => (
              <Link
                key={r.id}
                href={r.url}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors"
              >
                <span className="text-xl shrink-0">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.subtitle}</div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  {r.type}
                </span>
              </Link>
            ))
          ) : query.length >= 2 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              Geen resultaten voor &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Snelkoppelingen
              </p>
              {shortcuts.map((s) => (
                <Link
                  key={s.url}
                  href={s.url}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm text-gray-700">{s.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-400">
          <span>↑↓ navigeren</span>
          <span>↵ openen</span>
          <span>ESC sluiten</span>
          <span className="ml-auto">⌘K</span>
        </div>
      </div>
    </div>
  );
}
