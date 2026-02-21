import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import PressBanner from "../../components/PressBanner";
import PressBanners from "../../components/PressBanners";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "Press | Saved Souls Foundation",
  description:
    "Press and media information for Saved Souls Foundation. Contact for interviews, photos, and press inquiries. Thailand's only shelter for disabled and special needs dogs.",
};

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let bannerTitle = "Download banner";
  let bannerSubtitle = "Kies een formaat voor social media, websites of presentaties. PNG, JPG of SVG.";
  let bannerDisclaimer = "Gebruik niet zonder toestemming a.u.b.";
  let webBannersTitle = "Web banners";
  let webBannersSubtitle = "Embed these HTML banners on your website. Available in English and Dutch. Click to open full size.";
  try {
    const t = await getTranslations("press");
    bannerTitle = t("bannerTitle");
    bannerSubtitle = t("bannerSubtitle");
    bannerDisclaimer = t("bannerDisclaimer");
    webBannersTitle = t("webBannersTitle");
    webBannersSubtitle = t("webBannersSubtitle");
  } catch {
    // fallback bij ontbrekende vertalingen
  }
  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Press & Media
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            For journalists, bloggers, and media inquiries
          </p>
        </header>

        <section className="space-y-8">
          {/* Banner download - prominent bovenaan */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              Logo &amp; media assets
            </h2>
            <PressBanner
              title={bannerTitle}
              subtitle={bannerSubtitle}
              disclaimer={bannerDisclaimer}
            />
          </div>

          {/* Web banners */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {webBannersTitle}
            </h2>
            <PressBanners locale={locale} subtitle={webBannersSubtitle} />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              Media contact
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              For press inquiries, interview requests, or high-resolution photos and video, please contact us via our contact page.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              Contact us
            </Link>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              About Saved Souls Foundation
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Saved Souls Foundation is Thailand&apos;s only shelter dedicated to disabled and special needs animals. Founded in 2010 by Gabriela Leonhard in Khon Kaen, we rescue dogs from the illegal meat trade, stray animals from the streets, and animals that others have given up on. We provide swimming therapy, wheelchairs, and lifelong care for paralyzed dogs, and never turn away a soul in need.
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Registered as a non-profit in 2017 (registration number 1/2560), we are located in Ban Khok Ngam, Ban Fang District, Khon Kaen Province, Thailand.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              Key facts
            </h2>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400">
              <li>• <strong>Founded:</strong> 2010</li>
              <li>• <strong>Registered non-profit:</strong> 2017</li>
              <li>• <strong>Location:</strong> Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand</li>
              <li>• <strong>Focus:</strong> Disabled dogs, wheelchair dogs, paralyzed dogs, special needs animals</li>
              <li>• <strong>Services:</strong> Rescue, adoption, sponsorship, swimming therapy, sterilization</li>
            </ul>
          </div>
        </section>

        <div className="mt-12 text-center">
          <a
            href="https://paypal.me/savedsoulsfoundation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            Donate to support our work
          </a>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
