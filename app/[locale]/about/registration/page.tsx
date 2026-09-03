import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Foundation registration | Saved Souls Foundation`,
    description: "Official registration details of Saved Souls Foundation in Thailand.",
    robots: { index: false, follow: true },
  };
}

export default async function RegistrationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("donate.trust");

  return (
    <ParallaxPage overlayClassName="bg-white/[0.99] dark:bg-stone-950/[0.99]">
      <div className="max-w-lg mx-auto px-5 py-16">
        {/* TODO: replace placeholder with official registration document / certificate details */}
        <h1 className="text-2xl font-semibold text-stone-800 mb-4">
          {t("registration")}
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          Saved Souls Foundation is a registered non-profit foundation in Thailand
          (registration no. 1/2560). Full documentation will be published here.
        </p>
        <Link href="/donate" className="text-sm font-medium underline underline-offset-2 text-stone-700">
          ← Donate
        </Link>
      </div>
      <Footer />
    </ParallaxPage>
  );
}
