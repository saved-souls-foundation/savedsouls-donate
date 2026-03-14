import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import BankTransferAutoOpen from "../../components/BankTransferAutoOpen";
import DonateForm from "../../components/DonateForm";

const ORANGE = "#e8622a";
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

  const isThai = locale === "th";

  const impactCards = isThai
    ? [
        { amount: "฿100", textKey: "impactCardA" },
        { amount: "฿500", textKey: "impactCardB" },
        { amount: "฿1,000", textKey: "impactCardC" },
        { amount: "฿2,500", textKey: "impactCardD" },
      ]
    : [
        { amount: "€5", textKey: "impactCardA" },
        { amount: "€25", textKey: "impactCardB" },
        { amount: "€55", textKey: "impactCardC" },
        { amount: "€100", textKey: "impactCardD" },
      ];

  return (
    <ParallaxPage overlayClassName="bg-white/[0.99] dark:bg-stone-950/[0.99]">
      {/* ── HERO ── full width, no max-w constraint */}
      <div className="relative w-full overflow-hidden" style={{ height: "65vh", minHeight: 340, maxHeight: 600 }}>
        <img
          src="/woman-dog-wheelchair.webp"
          alt={tP("heroTitle")}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)" }} />
        {/* Text bottom-left */}
        <div className="absolute bottom-8 left-0 right-0 px-6 pb-4 md:px-12">
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-3" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            {tP("heroTitle")}
          </h1>
          <p className="text-sm md:text-base text-white/80">{tP("heroSub")}</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── centered, max-w-lg */}
      <div style={{ background: BEIGE }} className="min-h-screen">
        <div className="max-w-lg mx-auto px-5 py-8">
          {/* ── DONATION FORM ── overlaps hero */}
          <div className="-mt-8 relative z-10">
            <DonateForm />
          </div>

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

          {/* ── STATS ── */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: "350+", label: tP("statAnimals") },
              { num: "50", label: tP("statDisabled") },
              { num: "€2", label: tP("statFood") },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-xl font-semibold mb-1" style={{ color: GREEN_MID }}>{s.num}</div>
                <div className="text-[10px] text-stone-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── IMPACT CARDS ── */}
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">{tP("impactSectionLabel")}</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {impactCards.map((card) => (
              <div key={card.amount} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-lg font-semibold mb-1" style={{ color: ORANGE }}>{card.amount}</div>
                <div className="text-xs text-stone-600 leading-snug">{tP(card.textKey as "impactCardA" | "impactCardB" | "impactCardC" | "impactCardD")}</div>
              </div>
            ))}
          </div>

          {/* ── OTHER WAYS ── */}
          <p className="text-sm font-semibold text-stone-700 mb-3">{tP("otherWaysTitle")}</p>
          <div className="flex flex-col gap-2 mb-8">
            {[
              { icon: "🏦", title: tP("wayBank"), sub: tP("wayBankSub"), href: "/donate#bank-transfer" },
              { icon: "🇹🇭", title: tP("wayThai"), sub: tP("wayThaiSub"), href: "/donate/thai" },
              { icon: "🎯", title: tP("wayCauses"), sub: tP("wayCausesSub"), href: "/donate/causes" },
            ].map((way) => (
              <Link
                key={way.href}
                href={way.href}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:bg-stone-50 transition-colors"
              >
                <span className="text-xl flex-shrink-0">{way.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800">{way.title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{way.sub}</div>
                </div>
                <span className="text-stone-400">›</span>
              </Link>
            ))}
          </div>

          {/* ── BANK TRANSFER ── existing component */}
          <div id="bank-transfer" className="scroll-mt-24 mb-8">
            <BankTransferAutoOpen />
          </div>

          {/* ── FOOTER LINKS ── */}
          <div className="flex flex-col items-center gap-3 text-center pb-8">
            <Link href="/support" className="text-xs text-stone-500 underline underline-offset-2">
              {t("linkToSupport")}
            </Link>
            <Link href="/financial-overview" className="text-xs text-stone-500 underline underline-offset-2">
              {t("linkToFinancialOverview")}
            </Link>
            <Link href="/donate/causes" className="text-xs text-stone-500 underline underline-offset-2">
              {t("linkToCauses")}
            </Link>
            <p className="text-xs text-stone-400">{tP("footerReg")}</p>
          </div>
        </div>
      </div>

      <Footer />
    </ParallaxPage>
  );
}
