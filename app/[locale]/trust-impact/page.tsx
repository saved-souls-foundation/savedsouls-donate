import { setRequestLocale } from "next-intl/server";
import SiteHeader from "@/app/components/SiteHeader";
import Footer from "@/app/components/Footer";
import { trustImpactFontClasses } from "@/lib/fonts";
import Hero from "@/components/trust-impact/Hero";
import StampStrip from "@/components/trust-impact/StampStrip";
import QuickAnswers from "@/components/trust-impact/QuickAnswers";
import PhotoBreak from "@/components/trust-impact/PhotoBreak";
import Programs from "@/components/trust-impact/Programs";
import ImpactCounters from "@/components/trust-impact/ImpactCounters";
import Faq from "@/components/trust-impact/Faq";
import Cta from "@/components/trust-impact/Cta";

type Props = { params: Promise<{ locale: string }> };

export default async function TrustImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={`trust-impact ${trustImpactFontClasses}`}>
      <SiteHeader />
      <main>
        <Hero />
        <StampStrip />
        <QuickAnswers />
        <PhotoBreak />
        <Programs />
        <ImpactCounters />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
