import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import BankTransferSection from "../../components/BankTransferSection";
import DonateForm from "../../components/DonateForm";
import MollieBlock from "../../components/MollieBlock";
import DonateHelpPoints from "../../components/DonateHelpPoints";
import DonateFinancialStory from "../../components/DonateFinancialStory";
import { Link } from "@/i18n/navigation";

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
    {
      emoji: "🍖",
      title: tFin("cost1Title"),
      detail: tFin("cost1Detail"),
      percent: 45,
      color: "#f59e0b",
    },
    {
      emoji: "🏥",
      title: tFin("cost2Title"),
      detail: tFin("cost2Detail"),
      percent: 25,
      color: "#fb7185",
    },
    {
      emoji: "👷",
      title: tFin("cost3Title"),
      detail: tFin("cost3Detail"),
      percent: 20,
      color: "#38bdf8",
    },
    {
      emoji: "🔧",
      title: tFin("cost4Title"),
      detail: tFin("cost4Detail"),
      percent: 10,
      color: "#a78bfa",
    },
  ];

  return (
    <ParallaxPage overlayClassName="bg-white/[0.99] dark:bg-stone-950/[0.99]">
      {/* ── HERO ── text above clear zone; form overlaps photo bottom ~40px only */}
      <div
        className="relative w-full overflow-hidden md:max-h-[60vh]"
        style={{
          height: "56vh",
          minHeight: 420,
          maxHeight: 560,
          borderRadius: "0 0 32px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        <img
          src="/woman-dog-wheelchair.webp"
          alt={tP("heroTitle")}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Soft dark gradient for text contrast (≥ 4.5:1) — no card */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.72) 100%)",
          }}
        />
        {/* pb-16 / md:pb-20 lifts text ~48px+ above photo edge; -mt-10 form never covers it */}
        <div className="absolute left-0 right-0 bottom-0 px-6 md:px-12 pb-16 md:pb-20 pt-12">
          <h1
            className="text-[1.75rem] leading-snug sm:text-3xl md:text-5xl md:leading-tight font-semibold text-white mb-3 italic line-clamp-3"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {tP("heroTitle")}
          </h1>
          <DonateHelpPoints
            intro={tP("helpIntro")}
            points={[t("hero.points.feed"), t("hero.points.rescue"), t("hero.points.vet")]}
          />
        </div>
      </div>

      {/* ── MAIN CONTENT ── centered, max-w-lg */}
      <div style={{ background: BEIGE }} className="min-h-screen">
        <div className="max-w-lg mx-auto px-5 py-8">
          {isMollieFirst ? (
            <>
              <div className="-mt-10 relative z-10 px-4 md:px-8">
                <MollieBlock locale={locale} showTrust />
              </div>
              {/* TODO: merge with primary donation form */}
              <div className="mb-8 px-4 md:px-8" style={{ marginTop: "1rem" }}>
                <DonateForm />
              </div>
            </>
          ) : (
            <>
              {/* TODO: merge with primary donation form */}
              <div className="-mt-10 relative z-10 px-4 md:px-8">
                <DonateForm showTrust />
              </div>
              <div className="mb-8 px-4 md:px-8">
                <MollieBlock locale={locale} />
              </div>
            </>
          )}

          {/* ── BANK DETAILS ── */}
          <div className="mb-8">
            <BankTransferSection />
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

          {/* ── FINANCIAL STORY (interactief) ── */}
          <DonateFinancialStory
            badge={tFin("badge")}
            title={tFin("title")}
            subtitle={tFin("subtitle")}
            monthlyNeedTitle={tFin("monthlyNeedTitle")}
            perMonth={tFin("perMonth")}
            approxEuro={tFin("approxEuro")}
            gapText={tP("friendlyGapText")}
            breakdownTitle={tFin("breakdownTitle")}
            costs={costItems}
            sponsorStatsTitle={tFin("sponsorStatsTitle")}
            sponsorStatsText={tFin("sponsorStatsText")}
            sponsorStatsConclusion={tFin("sponsorStatsConclusion")}
            goalTitle={tFin("goalTitle")}
            goalText={tFin("goalText")}
            moreLinkLabel={t("linkToFinancialOverview")}
            labels={{
              togetherWeCover: tP("togetherWeCover"),
              yourHelpCloses: tP("yourHelpCloses"),
              watchAddUp: tP("watchAddUp"),
              tapHint: tP("tapHint"),
              runningTotal: tP("runningTotal"),
              ofBudget: tP("ofBudget"),
              replay: tP("replay"),
            }}
          />

          <p className="text-xs text-stone-400 text-center pb-8">
            <Link
              href="/about/registration"
              className="underline-offset-2 hover:underline"
            >
              {t("trust.registration")}
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </ParallaxPage>
  );
}
