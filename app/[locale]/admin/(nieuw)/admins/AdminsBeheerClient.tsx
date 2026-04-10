"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PageHeader, SectionCard } from "../components/ui/design-system";

const BORDER = "#e2e8f0";
const TEXT = "#1e293b";
const MUTED = "#64748b";
const CARD_BG = "#ffffff";

export function AdminsBeheerClient() {
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ voornaam: string; achternaam: string; email: string } | null>(null);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    const v = voornaam.trim();
    const a = achternaam.trim();
    const e = email.trim().toLowerCase();

    if (!v || !a || !e || !password) {
      setError("Alle velden zijn verplicht.");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voornaam: v, achternaam: a, email: e, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
        voornaam?: string;
        achternaam?: string;
        email?: string;
      };

      if (!res.ok) {
        setError(data.error || "Er ging iets mis. Probeer het opnieuw.");
        return;
      }

      if (data.success && data.voornaam && data.achternaam && data.email) {
        setSuccess({ voornaam: data.voornaam, achternaam: data.achternaam, email: data.email });
        setVoornaam("");
        setAchternaam("");
        setEmail("");
        setPassword("");
      } else {
        setError("Onverwacht antwoord van de server.");
      }
    } catch {
      setError("Netwerkfout. Controleer je verbinding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto w-full">
      <PageHeader title="Admins beheren" subtitle="Voeg een nieuwe beheerder toe met een tijdelijk wachtwoord." />

      <div className="px-0 pt-6">
        <SectionCard className="p-6">
          {success ? (
            <div
              className="rounded-xl border p-4 text-sm"
              style={{
                background: "rgba(42, 163, 72, 0.08)",
                borderColor: "var(--color-brand-green-mid, #2aa348)",
                color: TEXT,
              }}
              role="status"
            >
              <p className="font-semibold" style={{ color: "var(--color-brand-green, #1a5c2e)" }}>
                Admin aangemaakt
              </p>
              <p className="mt-2">
                <span className="font-medium">{success.voornaam}</span>{" "}
                <span className="font-medium">{success.achternaam}</span>
              </p>
              <p className="mt-1 text-gray-700">{success.email}</p>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="mt-4 text-sm font-semibold hover:underline"
                style={{ color: "var(--color-brand-green-mid, #2aa348)" }}
              >
                Nog een admin toevoegen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="adm-beheer-voornaam" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                  Voornaam
                </label>
                <input
                  id="adm-beheer-voornaam"
                  type="text"
                  value={voornaam}
                  onChange={(ev) => setVoornaam(ev.target.value)}
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--color-brand-green-mid)] focus:ring-offset-0"
                  style={{ borderColor: BORDER, color: TEXT, background: CARD_BG }}
                />
              </div>
              <div>
                <label htmlFor="adm-beheer-achternaam" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                  Achternaam
                </label>
                <input
                  id="adm-beheer-achternaam"
                  type="text"
                  value={achternaam}
                  onChange={(ev) => setAchternaam(ev.target.value)}
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--color-brand-green-mid)] focus:ring-offset-0"
                  style={{ borderColor: BORDER, color: TEXT, background: CARD_BG }}
                />
              </div>
              <div>
                <label htmlFor="adm-beheer-email" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                  E-mailadres
                </label>
                <input
                  id="adm-beheer-email"
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--color-brand-green-mid)] focus:ring-offset-0"
                  style={{ borderColor: BORDER, color: TEXT, background: CARD_BG }}
                />
              </div>
              <div>
                <label htmlFor="adm-beheer-password" className="block text-sm font-medium mb-1" style={{ color: MUTED }}>
                  Tijdelijk wachtwoord
                </label>
                <div className="relative">
                  <input
                    id="adm-beheer-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-12 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--color-brand-green-mid)] focus:ring-offset-0"
                    style={{ borderColor: BORDER, color: TEXT, background: CARD_BG }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 hover:bg-gray-100"
                    aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: MUTED }}>
                  Minimaal 8 tekens
                </p>
              </div>

              {error && (
                <p
                  className="text-sm rounded-lg px-3 py-2 border"
                  style={{
                    color: "var(--color-brand-red, #7B1010)",
                    borderColor: "rgba(123,16,16,0.25)",
                    background: "rgba(123,16,16,0.06)",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50 transition-opacity bg-[var(--color-brand-green)] hover:opacity-95"
              >
                {loading ? "Bezig…" : "Admin aanmaken"}
              </button>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
