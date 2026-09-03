import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import BankTransferSection from "../../components/BankTransferSection";
import DonateForm from "../../components/DonateForm";
import MollieBlock from "../../components/MollieBlock";
import DonateHelpPoints from "../../components/DonateHelpPoints";
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

  const costRows = [
    { emoji: "🍖", title: tFin("cost1Title"), detail: tFin("cost1Detail") },
    { emoji: "🏥", title: tFin("cost2Title"), detail: tFin("cost2Detail") },
    { emoji: "👷", title: tFin("cost3Title"), detail: tFin("cost3Detail") },
    { emoji: "🔧", title: tFin("cost4Title"), detail: tFin("cost4Detail") },
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
            bullets={[t("hero.points.feed"), t("hero.points.rescue"), t("hero.points.vet")]}
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

          {/* ── WHERE DOES YOUR MONEY GO (same plain list as /financial-overview) ── */}
          <section className="mb-8 rounded-xl bg-white px-5 py-5">
            <h2 className="text-lg font-bold text-stone-800 mb-1">{tFin("title")}</h2>
            <p className="text-sm text-stone-500 mb-5">{tFin("subtitle")}</p>

            <div className="mb-5 rounded-xl p-4 bg-emerald-50 border border-emerald-100">
              <h3 className="text-sm font-bold mb-1" style={{ color: GREEN_MID }}>
                {tFin("monthlyNeedTitle")}
              </h3>
              <p className="text-2xl font-black" style={{ color: GREEN_MID }}>
                ฿500.000
              </p>
              <p className="text-sm text-stone-600">{tFin("perMonth")}</p>
              <p className="text-sm text-stone-500 mb-3">{tFin("approxEuro")}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{tFin("gapText")}</p>
            </div>

            <h3 className="text-sm font-bold mb-3" style={{ color: GREEN_MID }}>
              {tFin("breakdownTitle")}
            </h3>
            <div className="space-y-3">
              {costRows.map((row) => (
                <div
                  key={row.title}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50"
                >
                  <p className="font-semibold text-stone-800 text-sm">
                    {row.emoji} {row.title}
                  </p>
                  <p className="text-stone-600 text-sm mt-1 leading-relaxed">{row.detail}</p>
                </div>
              ))}
            </div>
          </section>

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
