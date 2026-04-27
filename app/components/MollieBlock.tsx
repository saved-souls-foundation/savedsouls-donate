"use client";

import { useMemo, useState } from "react";

const GREEN_DARK = "#1a5c2e";
const PRESET_AMOUNTS = [5, 10, 25, 50];

type Props = {
  locale: string;
};

export default function MollieBlock({ locale }: Props) {
  const [selected, setSelected] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"eenmalig" | "maandelijks">("eenmalig");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const amount = useMemo(() => {
    if (customAmount.trim() !== "") {
      return Number(customAmount);
    }
    return selected;
  }, [customAmount, selected]);

  async function handleDonate() {
    if (!Number.isFinite(amount) || amount < 1) {
      alert("Vul een geldig bedrag van minimaal EUR 1,00 in.");
      return;
    }

    if (frequency === "maandelijks" && (!name.trim() || !email.trim())) {
      setValidationError("Naam en e-mailadres zijn verplicht voor maandelijkse donaties.");
      return;
    }

    setValidationError("");
    setIsLoading(true);
    try {
      const endpoint = frequency === "maandelijks" ? "/api/donate/recurring" : "/api/donate/mollie";
      const payload =
        frequency === "maandelijks"
          ? { amount, locale, name: name.trim(), email: email.trim() }
          : { amount, locale };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Onbekende fout");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Start Mollie betaling mislukt:", error);
      alert("Betaling starten mislukt. Probeer het opnieuw.");
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: GREEN_DARK }}>
        Doneer veilig via Mollie
      </h2>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1rem" }}>
        iDEAL · Wero · PayPal · creditcard · Bancontact en meer
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <img src="https://www.mollie.com/external/icons/payment-methods/ideal.svg" alt="iDEAL" height={36} />
        <img src="https://www.mollie.com/external/icons/payment-methods/creditcard.svg" alt="Credit card" height={36} />
        <img src="https://www.mollie.com/external/icons/payment-methods/paypal.svg" alt="PayPal" height={36} />
        <img src="https://www.mollie.com/external/icons/payment-methods/applepay.svg" alt="Apple Pay" height={36} />
        <img src="https://www.mollie.com/external/icons/payment-methods/bancontact.svg" alt="Bancontact" height={36} />
        <img src="https://www.mollie.com/external/icons/payment-methods/sofort.svg" alt="Sofort" height={36} />
      </div>
      <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "0.5rem", marginBottom: "1.5rem", lineHeight: "1.4" }}>
        Betalingen worden tijdelijk verwerkt door <strong style={{ color: "#6b7280" }}>Allesis.nl</strong> namens <strong style={{ color: "#6b7280" }}>Saved Souls Foundation</strong>. 
        Zodra SSF een eigen betaalrekening heeft, worden donaties rechtstreeks ontvangen door de stichting. 
        Alle donaties gaan 100% naar de dieren.
      </p>

      <div className="mb-5">
        <p className="text-sm font-medium text-stone-700 mb-2">Kies een bedrag</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((preset) => {
            const active = customAmount === "" && selected === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSelected(preset);
                  setCustomAmount("");
                }}
                className="rounded-xl px-3 py-2 text-sm font-medium border transition-colors"
                style={{
                  borderColor: active ? GREEN_DARK : "#e7e5e4",
                  backgroundColor: active ? "#f0fdf4" : "#ffffff",
                  color: active ? GREEN_DARK : "#292524",
                }}
              >
                EUR {preset}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-sm font-medium text-stone-700 mb-2 block" htmlFor="custom-amount">
          Of vul zelf een bedrag in
        </label>
        <input
          id="custom-amount"
          type="number"
          min={1}
          step="0.01"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Bijv. 15"
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-stone-700 mb-2">Frequentie</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFrequency("eenmalig")}
            className="rounded-xl px-3 py-2 text-sm font-medium border transition-colors"
            style={{
              borderColor: frequency === "eenmalig" ? GREEN_DARK : "#e7e5e4",
              backgroundColor: frequency === "eenmalig" ? "#f0fdf4" : "#ffffff",
              color: frequency === "eenmalig" ? GREEN_DARK : "#292524",
            }}
          >
            Eenmalig
          </button>
          <button
            type="button"
            onClick={() => setFrequency("maandelijks")}
            className="rounded-xl px-3 py-2 text-sm font-medium border transition-colors"
            style={{
              borderColor: frequency === "maandelijks" ? GREEN_DARK : "#e7e5e4",
              backgroundColor: frequency === "maandelijks" ? "#f0fdf4" : "#ffffff",
              color: frequency === "maandelijks" ? GREEN_DARK : "#292524",
            }}
          >
            Maandelijks
          </button>
        </div>
      </div>

      {frequency === "maandelijks" && (
        <div className="mb-6 space-y-3">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block" htmlFor="donor-name">
              Naam
            </label>
            <input
              id="donor-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Jouw naam"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block" htmlFor="donor-email">
              E-mailadres
            </label>
            <input
              id="donor-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
              placeholder="jij@email.com"
            />
          </div>
          {validationError ? <p className="text-sm text-red-600">{validationError}</p> : null}
        </div>
      )}

      <button
        type="button"
        onClick={handleDonate}
        disabled={isLoading}
        className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: GREEN_DARK }}
      >
        {isLoading ? "Bezig met doorsturen..." : "Doneer nu"}
      </button>
    </section>
  );
}
