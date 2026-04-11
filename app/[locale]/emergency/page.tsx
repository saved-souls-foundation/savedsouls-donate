import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Heart } from "lucide-react";
import DonationLoop from "@/app/components/DonationLoop";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import TrackedGoFundMeAnchor from "@/app/components/TrackedGoFundMeAnchor";
import { GOFUNDME_CAMPAIGN_URL } from "@/lib/gtag";

const GOFUNDME_URL = GOFUNDME_CAMPAIGN_URL;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.savedsouls-foundation.org";

type Props = { params: Promise<{ locale: string }> };

async function getCampaignStats() {
  const base = BASE_URL.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/api/campaign-stats`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { raised: 0, goal: 120_000, donations: [] as { name: string; amount: number; currency: string }[] };
    const data = await res.json();
    return {
      raised: Number(data.raised) || 0,
      goal: Number(data.goal) || 120_000,
      donations: Array.isArray(data.donations) ? data.donations : [],
    };
  } catch {
    return { raised: 0, goal: 120_000, donations: [] as { name: string; amount: number; currency: string }[] };
  }
}

export default async function EmergencyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("emergency");
  const { raised, goal, donations } = await getCampaignStats();

  const shareUrl = `${BASE_URL}/${locale}/emergency`;
  const shareText = t("shareText");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappShare = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

  return (
    <ParallaxPage overlayClassName="bg-transparent" noOverlay>
      <div className="min-h-screen bg-white dark:bg-stone-900">

        {/* ─── HERO ─── */}
        <div
          style={{
            backgroundImage: "url('/dog-red-leash.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "70vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 px-6 py-24 text-white text-center w-full max-w-3xl mx-auto">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/60 mb-6">
              Emergency appeal · Saved Souls Foundation
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <TrackedGoFundMeAnchor
              href={GOFUNDME_URL}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-all hover:scale-[1.02] hover:opacity-95"
              style={{ backgroundColor: "#7B1010" }}
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0 animate-pulse" />
              <svg width="36" height="14" viewBox="0 0 36 14" aria-hidden style={{ overflow: "visible" }}>
                <polyline
                  points="0,7 4,7 6,2 8,12 10,2 12,7 16,7 20,7 22,2 24,12 26,2 28,7 36,7"
                  fill="none" stroke="white" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="60" strokeDashoffset="0"
                  style={{ animation: "ecg-scroll 1.8s linear infinite" }}
                />
              </svg>
              <Heart className="w-4 h-4 shrink-0 fill-white stroke-white" aria-hidden />
              {t("heroDonateCta") ?? "Donate now"}
            </TrackedGoFundMeAnchor>
          </div>
        </div>

        {/* ─── DONATION LOOP ─── */}
        <DonationLoop raisedEur={raised} goalEur={goal} />

        {/* ─── LAATSTE DONATIES ─── */}
        {donations.length > 0 && (
          <section className="max-w-lg mx-auto px-6 py-8">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-stone-400 text-center mb-4">
              Recent donations
            </p>
            <ul className="space-y-2">
              {donations.map((d: { name: string; amount: number; currency: string }, i: number) => (
                <li
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800 last:border-0 text-sm"
                >
                  <span className="text-stone-700 dark:text-stone-300">{d.name}</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    €{d.amount.toLocaleString("en-GB")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ─── TWO GOALS ─── */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-stone-400 text-center mb-10">
            Where your money goes
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-8 rounded-3xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center mb-5 shadow-sm">
                <span className="text-lg" aria-hidden>🏠</span>
              </div>
              <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                {t("goalLandTitle")}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {t("goalLandDesc")}
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center mb-5 shadow-sm">
                <span className="text-lg" aria-hidden>🍖</span>
              </div>
              <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                {t("goalFundTitle")}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {t("goalFundDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* ─── PHOTO STORY ─── */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-3 rounded-3xl overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src="/dog-wheelchair-small.webp"
                alt={t("photoGridAlt1")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src="/dog-wheelchair.webp"
                alt={t("photoGridAlt2")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="mt-6 text-center max-w-xl mx-auto">
            <p className="text-sm text-stone-400 dark:text-stone-500 leading-relaxed italic">
              50 of our dogs are disabled and cannot survive without daily care.
              Without this land, they have nowhere to go.
            </p>
          </div>
        </section>

        {/* ─── SHARE + QR ─── */}
        <section className="border-t border-stone-100 dark:border-stone-800 py-16 px-6">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">

            {/* Share */}
            <div className="text-center">
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-stone-400 mb-5">
                {t("shareTitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { href: facebookShare,   label: "Facebook",  bg: "#1877F2" },
                  { href: whatsappShare,   label: "WhatsApp",  bg: "#25D366" },
                  { href: twitterShare,    label: "X",         bg: "#000000" },
                  { href: "https://www.instagram.com/savedsoulsfoundation", label: "Instagram", bg: "#E1306C" },
                  { href: "https://www.tiktok.com/@savedsoulsfoundation",   label: "TikTok",    bg: "#010101" },
                ].map(({ href, label, bg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: bg }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs tracking-[0.15em] uppercase text-stone-400">
                Scan to donate
              </p>
              <div className="p-5 bg-white rounded-2xl border border-stone-100 dark:border-stone-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(GOFUNDME_URL)}&color=7B1010&bgcolor=ffffff`}
                  alt="QR code — donate via GoFundMe"
                  width={160}
                  height={160}
                  className="block"
                />
              </div>
              <p className="text-xs text-stone-400">gofundme.com/f/300-dogs-fighting...</p>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <TrackedGoFundMeAnchor
                href={GOFUNDME_URL}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium text-white transition-all hover:scale-[1.02] hover:opacity-95"
                style={{ backgroundColor: "#7B1010" }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                Donate now — save their home
              </TrackedGoFundMeAnchor>
              <p className="text-xs text-stone-400 mt-3">
                Secure · Takes 30 seconds · Every euro counts
              </p>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </ParallaxPage>
  );
}
