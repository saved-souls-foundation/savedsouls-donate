"use client";

import { useMemo, useState } from "react";

const GREEN_DARK = "#1a5c2e";
const PRESET_AMOUNTS = [5, 10, 25, 50];

type Props = {
  locale: string;
};

export default function MollieBlock({ locale }: Props) {
  const t: Record<string, Record<string, string>> = {
    nl: {
      title: "Doneer veilig via Mollie",
      subtitle: "iDEAL · Wero · PayPal · creditcard · Bancontact en meer",
      disclaimer:
        "Betalingen worden tijdelijk verwerkt door Allesis.nl namens Saved Souls Foundation. Zodra SSF een eigen betaalrekening heeft, worden donaties rechtstreeks ontvangen door de stichting. Alle donaties gaan 100% naar de dieren.",
      chooseAmount: "Kies een bedrag",
      customAmount: "Of vul zelf een bedrag in",
      frequency: "Frequentie",
      oneTime: "Eenmalig",
      monthly: "Maandelijks",
      name: "Naam",
      email: "E-mail",
      donateButton: "Doneer nu",
      loading: "Bezig met doorsturen...",
      nameRequired: "Naam is verplicht voor maandelijkse donaties",
      emailRequired: "E-mail is verplicht voor maandelijkse donaties",
    },
    en: {
      title: "Donate safely via Mollie",
      subtitle: "iDEAL · Wero · PayPal · credit card · Bancontact and more",
      disclaimer:
        "Payments are temporarily processed by Allesis.nl on behalf of Saved Souls Foundation. Once SSF has its own payment account, donations will be received directly by the foundation. All donations go 100% to the animals.",
      chooseAmount: "Choose an amount",
      customAmount: "Or enter your own amount",
      frequency: "Frequency",
      oneTime: "One-time",
      monthly: "Monthly",
      name: "Name",
      email: "Email",
      donateButton: "Donate now",
      loading: "Redirecting...",
      nameRequired: "Name is required for monthly donations",
      emailRequired: "Email is required for monthly donations",
    },
    de: {
      title: "Sicher spenden via Mollie",
      subtitle: "iDEAL · Wero · PayPal · Kreditkarte · Bancontact und mehr",
      disclaimer:
        "Zahlungen werden vorübergehend von Allesis.nl im Namen der Saved Souls Foundation verarbeitet. Sobald SSF ein eigenes Konto hat, werden Spenden direkt von der Stiftung empfangen. Alle Spenden gehen 100% an die Tiere.",
      chooseAmount: "Betrag wählen",
      customAmount: "Oder eigenen Betrag eingeben",
      frequency: "Häufigkeit",
      oneTime: "Einmalig",
      monthly: "Monatlich",
      name: "Name",
      email: "E-Mail",
      donateButton: "Jetzt spenden",
      loading: "Weiterleiten...",
      nameRequired: "Name ist für monatliche Spenden erforderlich",
      emailRequired: "E-Mail ist für monatliche Spenden erforderlich",
    },
    es: {
      title: "Dona de forma segura via Mollie",
      subtitle: "iDEAL · Wero · PayPal · tarjeta de crédito · Bancontact y más",
      disclaimer:
        "Los pagos son procesados temporalmente por Allesis.nl en nombre de Saved Souls Foundation. Una vez que SSF tenga su propia cuenta, las donaciones serán recibidas directamente por la fundación. El 100% va a los animales.",
      chooseAmount: "Elige un importe",
      customAmount: "O introduce tu propio importe",
      frequency: "Frecuencia",
      oneTime: "Una vez",
      monthly: "Mensual",
      name: "Nombre",
      email: "Correo electrónico",
      donateButton: "Donar ahora",
      loading: "Redirigiendo...",
      nameRequired: "El nombre es obligatorio para donaciones mensuales",
      emailRequired: "El correo es obligatorio para donaciones mensuales",
    },
    fr: {
      title: "Donnez en toute sécurité via Mollie",
      subtitle: "iDEAL · Wero · PayPal · carte de crédit · Bancontact et plus",
      disclaimer:
        "Les paiements sont temporairement traités par Allesis.nl au nom de Saved Souls Foundation. Dès que SSF aura son propre compte, les dons seront reçus directement par la fondation. 100% des dons vont aux animaux.",
      chooseAmount: "Choisissez un montant",
      customAmount: "Ou entrez votre propre montant",
      frequency: "Fréquence",
      oneTime: "Une fois",
      monthly: "Mensuel",
      name: "Nom",
      email: "E-mail",
      donateButton: "Faire un don",
      loading: "Redirection...",
      nameRequired: "Le nom est requis pour les dons mensuels",
      emailRequired: "L'e-mail est requis pour les dons mensuels",
    },
    ru: {
      title: "Безопасное пожертвование через Mollie",
      subtitle: "iDEAL · Wero · PayPal · кредитная карта · Bancontact и другие",
      disclaimer:
        "Платежи временно обрабатываются Allesis.nl от имени Saved Souls Foundation. Как только SSF получит собственный счёт, пожертвования будут поступать напрямую в фонд. 100% идёт животным.",
      chooseAmount: "Выберите сумму",
      customAmount: "Или введите свою сумму",
      frequency: "Периодичность",
      oneTime: "Разово",
      monthly: "Ежемесячно",
      name: "Имя",
      email: "Эл. почта",
      donateButton: "Пожертвовать",
      loading: "Перенаправление...",
      nameRequired: "Имя обязательно для ежемесячных пожертвований",
      emailRequired: "Эл. почта обязательна для ежемесячных пожертвований",
    },
    th: {
      title: "บริจาคอย่างปลอดภัยผ่าน Mollie",
      subtitle: "iDEAL · Wero · PayPal · บัตรเครดิต · Bancontact และอื่นๆ",
      disclaimer:
        "การชำระเงินได้รับการดำเนินการชั่วคราวโดย Allesis.nl ในนามของ Saved Souls Foundation เมื่อ SSF มีบัญชีของตนเอง เงินบริจาคจะถูกรับโดยมูลนิธิโดยตรง 100% ไปที่สัตว์",
      chooseAmount: "เลือกจำนวนเงิน",
      customAmount: "หรือกรอกจำนวนเงินของคุณเอง",
      frequency: "ความถี่",
      oneTime: "ครั้งเดียว",
      monthly: "รายเดือน",
      name: "ชื่อ",
      email: "อีเมล",
      donateButton: "บริจาคเลย",
      loading: "กำลังเปลี่ยนเส้นทาง...",
      nameRequired: "ต้องระบุชื่อสำหรับการบริจาครายเดือน",
      emailRequired: "ต้องระบุอีเมลสำหรับการบริจาครายเดือน",
    },
  };

  const lang = t[locale] ?? t["en"];
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
      const missingMessages = [];
      if (!name.trim()) {
        missingMessages.push(lang.nameRequired);
      }
      if (!email.trim()) {
        missingMessages.push(lang.emailRequired);
      }
      setValidationError(missingMessages.join(" "));
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
        {lang.title}
      </h2>
      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1rem" }}>
        {lang.subtitle}
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
        {lang.disclaimer}
      </p>

      <div className="mb-5">
        <p className="text-sm font-medium text-stone-700 mb-2">{lang.chooseAmount}</p>
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
          {lang.customAmount}
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
        <p className="text-sm font-medium text-stone-700 mb-2">{lang.frequency}</p>
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
            {lang.oneTime}
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
            {lang.monthly}
          </button>
        </div>
      </div>

      {frequency === "maandelijks" && (
        <div className="mb-6 space-y-3">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block" htmlFor="donor-name">
              {lang.name}
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
              {lang.email}
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
        {isLoading ? lang.loading : lang.donateButton}
      </button>
    </section>
  );
}
