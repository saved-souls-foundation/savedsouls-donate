import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  setRequestLocale(locale);
  const t = await getTranslations("press");
  const bannerTitle = t("bannerTitle");
  const bannerSubtitle = t("bannerSubtitle");
  const bannerDisclaimer = t("bannerDisclaimer");
  const webBannersTitle = t("webBannersTitle");
  const webBannersSubtitle = t("webBannersSubtitle");
  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
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
          {/* Press release - prominent bovenaan */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-stone-200 dark:border-stone-600 bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2aa348]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative p-6 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-600 mb-6 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                {t("pressReleaseBadge")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 leading-tight">
                {t("pressReleaseTitle")}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                {t("pressReleaseDate")}
              </p>

              {/* Volledige persbericht in document-stijl */}
              <article className="mb-8 p-6 md:p-8 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600 shadow-inner">
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  <strong>THAILAND</strong> — Saved Souls Foundation, a dedicated animal rescue and welfare organization based in Thailand, is proud to announce the official launch of its new website — a central hub for animal lovers, supporters, and potential adopters to connect with the foundation&apos;s life-saving mission.
                </p>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  As the foundation grows and the number of rescued animals in its care increases, Saved Souls Foundation is putting out an urgent call to the public for support across four critical areas: vehicle donations, volunteers, financial contributions, and adoptions.
                </p>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">New Website Coming Soon</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Saved Souls Foundation is currently building a brand-new website that will serve as a central hub for animal lovers, supporters, and potential adopters. The platform is currently under construction and will soon offer a streamlined experience to learn about the foundation&apos;s work, browse animals available for adoption, sign up as a volunteer, and make secure donations. The launch is expected in the near future — stay tuned for the official announcement.
                </p>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">Urgently Needed: A Vehicle to Save More Lives</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  One of the foundation&apos;s most pressing needs is a reliable vehicle. With animals requiring emergency rescues, veterinary visits, and transport to foster homes, the lack of dedicated transportation is one of the biggest barriers to helping more animals. Saved Souls Foundation is actively seeking a donated or sponsored vehicle to expand its rescue capacity across the region.
                </p>
                <blockquote className="border-l-4 pl-4 my-4 italic text-stone-600 dark:text-stone-400" style={{ borderColor: ACCENT_GREEN }}>
                  &quot;A car means the difference between life and death for the animals we rescue. With proper transportation, we can respond faster to calls and reach more animals in need,&quot; a spokesperson for the foundation stated.
                </blockquote>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">Volunteers Wanted: Make a Hands-On Difference</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Saved Souls Foundation is actively recruiting volunteers to assist with the daily care of rescued animals, community outreach, fundraising events, and administrative support. Whether you are a local resident or a traveler visiting Thailand, your time and energy can directly save lives. No prior experience is required — just a love for animals and a willingness to help.
                </p>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Volunteers are needed for roles including animal feeding and socialization, foster care coordination, social media and photography, event organization, and veterinary support assistance.
                </p>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">Every Donation Saves a Life</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Running an animal rescue foundation requires continuous funding. Saved Souls Foundation relies entirely on the generosity of donors to cover veterinary care, food, shelter, sterilization programs, and medicine. Donations of any size make a meaningful impact — from covering a single meal to funding a life-saving surgery.
                </p>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  The foundation also welcomes in-kind donations such as pet food, blankets, crates, and veterinary supplies. All contributions go directly towards the animals in the foundation&apos;s care.
                </p>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">Give a Rescued Animal a Forever Home</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Saved Souls Foundation currently has a number of dogs and cats available for adoption. Each animal has been rescued from difficult circumstances, received veterinary care, and is ready to find a loving forever home. The foundation facilitates both local adoptions within Thailand and international adoptions for verified adopters abroad.
                </p>
                <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Adopting from Saved Souls Foundation not only gives an animal a second chance — it also frees up a space to rescue the next animal in need.
                </p>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mt-6 mb-2">Get Involved Today</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  To learn more, adopt, volunteer, or donate, visit the Saved Souls Foundation website or reach out directly via social media. Together, we can save more souls.
                </p>
              </article>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/press/SavedSoulsFoundation_PressRelease.pdf"
                  download="SavedSoulsFoundation_PressRelease.pdf"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: ACCENT_GREEN }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("downloadPdf")}
                </a>
                <a
                  href="/press/SavedSoulsFoundation_PressRelease.docx"
                  download="SavedSoulsFoundation_PressRelease.docx"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 transition-all hover:scale-105 hover:shadow-lg hover:bg-stone-300 dark:hover:bg-stone-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("downloadWord")}
                </a>
              </div>
            </div>
          </div>

          {/* Banner download */}
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
