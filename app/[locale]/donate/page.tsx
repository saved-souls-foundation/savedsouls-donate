import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import BankTransferAutoOpen from "../../components/BankTransferAutoOpen";
import DonateForm from "../../components/DonateForm";
import MollieBlock from "../../components/MollieBlock";
import DonateHelpPoints from "../../components/DonateHelpPoints";

const GREEN_MID = "#2aa348";
const BEIGE = "#f5f0e8";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return {
    title: `${t("payTitle")} | Saved Souls Foundation`,
    description: t("paySubtitle"),
  };
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("donate");
  const tP = await getTranslations("donatePage");
  const tFin = await getTranslations("financialOverview");

  const isThai = locale === "th";
  const europeanLocales = ["nl", "de", "fr", "es", "be"];
  const isMollieFirst = europeanLocales.includes(locale);

  const impactAmountsEur = ["5", "25", "55", "100"];
  const impactAmountsTHB = ["100", "500", "1000", "2500"];

  const costItems = [
    { emoji: "🍖", title: tFin("cost1Title"), detail: tFin("cost1Detail") },
    { emoji: "🏥", title: tFin("cost2Title"), detail: tFin("cost2Detail") },
    { emoji: "👷", title: tFin("cost3Title"), detail: tFin("cost3Detail") },
    { emoji: "🔧", title: tFin("cost4Title"), detail: tFin("cost4Detail") },
  ];

  return (
    <ParallaxPage overlayClassName="bg-white/[0.99] dark:bg-stone-950/[0.99]">
      {/* ── HERO ── full width, no max-w constraint */}
      <div className="relative w-full overflow-hidden" style={{
        height: "68vh",
        minHeight: 480,
        maxHeight: 720,
        borderRadius: "0 0 32px 32px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        <img
          src="/woman-dog-wheelchair.webp"
          alt={tP("heroTitle")}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)" }} />
        {/* Text bottom-left */}
        <div className="absolute left-0 right-0 px-6 md:px-12" style={{ bottom: "100px" }}>
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-4 italic" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            {tP("heroTitle")}
          </h1>
          <DonateHelpPoints
            intro={tP("helpIntro")}
            bullets={[tP("helpBullet1"), tP("helpBullet2"), tP("helpBullet3")]}
          />
        </div>
      </div>

      {/* ── MAIN CONTENT ── centered, max-w-lg */}
      <div style={{ background: BEIGE }} className="min-h-screen">
        <div className="max-w-lg mx-auto px-5 py-8">
          {isMollieFirst ? (
            <>
              <div className="-mt-32 relative z-10 px-4 md:px-8">
                <MollieBlock locale={locale} />
              </div>
              <div className="mb-8 px-4 md:px-8" style={{ marginTop: "1rem" }}>
                <DonateForm />
              </div>
            </>
          ) : (
            <>
              <div className="-mt-32 relative z-10 px-4 md:px-8">
                <DonateForm />
              </div>
              <div className="mb-8 px-4 md:px-8">
                <MollieBlock locale={locale} />
              </div>
            </>
          )}

          {/* ── TRUST ROW ── */}
          <div className="flex items-center justify-center gap-5 flex-wrap mb-8">
            {[
              { icon: "🔒", text: tP("trust1") },
              { icon: "🐾", text: tP("trust2") },
              { icon: "📋", text: tP("trust3") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-xs text-stone-500">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* ── BANK TRANSFER ── existing component */}
          <div id="bank-transfer" className="scroll-mt-24 mb-8">
            <BankTransferAutoOpen />
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: "350+", label: tP("statAnimals") },
              { num: "50", label: tP("statDisabled") },
              { num: isThai ? "฿70" : "€2", label: tP("statFood") },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xl font-semibold mb-1" style={{ color: GREEN_MID }}>{s.num}</div>
                <div className="text-[10px] text-stone-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── FINANCIAL OVERVIEW (zelfde tekst als /financial-overview) ── */}
          <section className="mb-8 rounded-2xl bg-white shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-5 py-5 border-b border-stone-100">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: GREEN_MID }}>
                📊 {tFin("badge")}
              </p>
              <h2 className="text-xl font-bold text-stone-800 mb-1">{tFin("title")}</h2>
              <p className="text-sm text-stone-500">{tFin("subtitle")}</p>
            </div>

            <div className="px-5 py-5 bg-emerald-50/80 border-b border-emerald-100">
              <h3 className="text-sm font-bold mb-2" style={{ color: GREEN_MID }}>{tFin("monthlyNeedTitle")}</h3>
              <p className="text-3xl font-black mb-0.5" style={{ color: GREEN_MID }}>฿500.000</p>
              <p className="text-sm text-stone-600 mb-1">{tFin("perMonth")}</p>
              <p className="text-sm text-stone-500 mb-3">{tFin("approxEuro")}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{tFin("gapText")}</p>
            </div>

            <div className="px-5 py-5 border-b border-stone-100">
              <h3 className="text-sm font-bold mb-3" style={{ color: GREEN_MID }}>{tFin("breakdownTitle")}</h3>
              <div className="space-y-3">
                {costItems.map((item) => (
                  <div key={item.title} className="rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-3">
                    <p className="text-sm font-semibold text-stone-800">{item.emoji} {item.title}</p>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-5 bg-amber-50/70 border-b border-amber-100">
              <h3 className="text-sm font-bold mb-2" style={{ color: GREEN_MID }}>{tFin("sponsorStatsTitle")}</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-2">{tFin("sponsorStatsText")}</p>
              <p className="text-sm font-medium text-stone-700">{tFin("sponsorStatsConclusion")}</p>
            </div>

            <div className="px-5 py-5">
              <h3 className="text-sm font-bold mb-2" style={{ color: GREEN_MID }}>{tFin("goalTitle")}</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">{tFin("goalText")}</p>
              <Link
                href="/financial-overview"
                className="inline-flex text-sm font-semibold underline underline-offset-2 hover:opacity-80"
                style={{ color: GREEN_MID }}
              >
                {t("linkToFinancialOverview")} →
              </Link>
            </div>
          </section>

          <p className="text-xs text-stone-400 text-center pb-8">{tP("footerReg")}</p>
        </div>
      </div>

      <Footer />
    </ParallaxPage>
  );
}
