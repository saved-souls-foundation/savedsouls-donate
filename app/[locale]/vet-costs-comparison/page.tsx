"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export default function VetCostsComparisonPage() {
  const t = useTranslations("vetCosts");
  const tCommon = useTranslations("common");

  const tableRows = [
    { key: "consult", nl: "Consultatie", th: "ตรวจทั่วไป", nlPrice: "€45–75", thPrice: "฿300–800" },
    { key: "vaccPuppy", nl: "Puppy vaccinatie (reeks)", th: "วัคซีนลูกสุนัข (ชุด)", nlPrice: "€80–150", thPrice: "฿800–2000" },
    { key: "vaccCat", nl: "Kitten vaccinatie (reeks)", th: "วัคซีนลูกแมว (ชุด)", nlPrice: "€60–120", thPrice: "฿600–1500" },
    { key: "rabies", nl: "Rabiës vaccinatie", th: "วัคซีนพิษสุนัขบ้า", nlPrice: "€25–45", thPrice: "฿150–400" },
    { key: "sterilizeDog", nl: "Sterilisatie hond", th: "ทำหมันสุนัข", nlPrice: "€150–350", thPrice: "฿2000–5000" },
    { key: "sterilizeCat", nl: "Sterilisatie kat", th: "ทำหมันแมว", nlPrice: "€80–200", thPrice: "฿1000–8000" },
    { key: "deworm", nl: "Ontworming (kuur)", th: "ถ่ายพยาธิ", nlPrice: "€15–35", thPrice: "฿100–300" },
    { key: "fleaTick", nl: "Vlooien/teken middel (maand)", th: "ยาหมัดเห็บ (เดือน)", nlPrice: "€12–25", thPrice: "฿150–400" },
    { key: "antibiotics", nl: "Antibiotica (kuur)", th: "ยาปฏิชีวนะ", nlPrice: "€25–60", thPrice: "฿200–800" },
    { key: "xray", nl: "Röntgenfoto", th: "เอ็กซเรย์", nlPrice: "€45–120", thPrice: "฿500–2000" },
    { key: "bloodTest", nl: "Bloedonderzoek", th: "ตรวจเลือด", nlPrice: "€50–150", thPrice: "฿800–2500" },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero – vrolijk en spannend */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border-2 border-amber-300 dark:border-amber-600 mb-6 text-sm font-semibold text-amber-800 dark:text-amber-200">
            🌍 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </header>

        {/* Spannende intro */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 border-2 border-amber-200 dark:border-amber-600 shadow-xl">
          <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed text-center">
            {t("intro")}
          </p>
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 text-center italic">
            {t("disclaimer")}
          </p>
        </section>

        {/* Medicijnkosten per aandoening */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            💊 {t("medsTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("medsIntro")}
          </p>
          <div className="overflow-x-auto rounded-2xl border-2 border-stone-200 dark:border-stone-600 shadow-xl">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-800">
                  <th className="px-4 py-3 text-left font-bold text-stone-800 dark:text-stone-100 border-b border-stone-200 dark:border-stone-600">
                    {t("medsCondition")}
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-blue-700 dark:text-blue-300 border-b border-l border-stone-200 dark:border-stone-600">
                    🇳🇱 NL
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-rose-700 dark:text-rose-300 border-b border-l border-stone-200 dark:border-stone-600">
                    🇹🇭 TH
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: "ear", nl: "€40–90", th: "฿300–800" },
                  { key: "skin", nl: "€50–120", th: "฿400–1200" },
                  { key: "diarrhea", nl: "€30–80", th: "฿200–600" },
                  { key: "dental", nl: "€80–250", th: "฿500–3000" },
                  { key: "allergy", nl: "€40–100", th: "฿300–900" },
                ].map((row, i) => (
                  <tr
                    key={row.key}
                    className={`${i % 2 === 0 ? "bg-white dark:bg-stone-900" : "bg-stone-50 dark:bg-stone-800/50"} border-b border-stone-200 dark:border-stone-600`}
                  >
                    <td className="px-4 py-3 text-stone-700 dark:text-stone-300">{t(`meds_${row.key}`)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-700 dark:text-blue-300 border-l border-stone-200 dark:border-stone-600">{row.nl}</td>
                    <td className="px-4 py-3 text-center font-semibold text-rose-700 dark:text-rose-300 border-l border-stone-200 dark:border-stone-600">{row.th}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 italic">
            {t("medsNote")}
          </p>
        </section>

        {/* Bangkok vs Khon Kaen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            🏙️ {t("bangkokTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("bangkokIntro")}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">🇹🇭 Bangkok</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
                <li>• {t("bangkokBkk1")}</li>
                <li>• {t("bangkokBkk2")}</li>
                <li>• {t("bangkokBkk3")}</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3">🇹🇭 Khon Kaen</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400 text-sm">
                <li>• {t("bangkokKk1")}</li>
                <li>• {t("bangkokKk2")}</li>
                <li>• {t("bangkokKk3")}</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-stone-600 dark:text-stone-400 text-sm">
            {t("bangkokSavedSouls")}
          </p>
        </section>

        {/* Verzekeringen */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            📋 {t("insuranceTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {t("insuranceIntro")}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3">🇳🇱 Nederland</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-3">
                {t("insuranceNl")}
              </p>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                <li>• {t("insuranceNl1")}</li>
                <li>• {t("insuranceNl2")}</li>
                <li>• {t("insuranceNl3")}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-rose-700 dark:text-rose-300 mb-3">🇹🇭 Thailand</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-3">
                {t("insuranceTh")}
              </p>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
                <li>• {t("insuranceTh1")}</li>
                <li>• {t("insuranceTh2")}</li>
                <li>• {t("insuranceTh3")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Hoofdtabel */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: ACCENT_GREEN }}>
            📊 {t("tableTitle")}
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-stone-200 dark:border-stone-600 shadow-xl">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-800">
                  <th className="px-4 py-4 text-left font-bold text-stone-800 dark:text-stone-100 border-b border-stone-200 dark:border-stone-600">
                    {t("tableService")}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-blue-700 dark:text-blue-300 border-b border-l border-stone-200 dark:border-stone-600" style={{ minWidth: 140 }}>
                    🇳🇱 {t("tableCountry")} Nederland
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-rose-700 dark:text-rose-300 border-b border-l border-stone-200 dark:border-stone-600" style={{ minWidth: 140 }}>
                    🇹🇭 {t("tableCountry")} Thailand
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.key}
                    className={`${
                      i % 2 === 0 ? "bg-white dark:bg-stone-900" : "bg-stone-50 dark:bg-stone-800/50"
                    } hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors`}
                  >
                    <td className="px-4 py-3 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-600">
                      <span className="font-medium">{t(`table_${row.key}`)}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-700 dark:text-blue-300 border-b border-l border-stone-200 dark:border-stone-600">
                      {row.nlPrice}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-rose-700 dark:text-rose-300 border-b border-l border-stone-200 dark:border-stone-600">
                      {row.thPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 text-center">
            {t("tableNote")} {t("tableCurrency")}
          </p>
        </section>

        {/* Vaccinaties vergelijking */}
        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
            💉 {t("vaccTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">🇳🇱 Nederland</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li>• DHPP – {t("vaccNlDhpp")}</li>
                <li>• Rabiës – {t("vaccNlRabies")}</li>
                <li>• Leptospirosis – {t("vaccNlLepto")}</li>
                <li>• Kennelhoest (optioneel)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-3">🇹🇭 Thailand</h3>
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li>• DHPP – {t("vaccThDhpp")}</li>
                <li>• Rabiës – {t("vaccThRabies")}</li>
                <li>• Leptospirosis – {t("vaccThLepto")}</li>
                <li>• Hartworm – {t("vaccThHeartworm")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-8 md:p-12 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-6">
            {t("ctaText")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: BUTTON_ORANGE }}
            >
              {t("ctaDonate")}
            </Link>
            <Link
              href="/health"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              {t("ctaHealth")}
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </ParallaxPage>
  );
}
