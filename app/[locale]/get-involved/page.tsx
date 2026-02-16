import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getInvolved" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default async function GetInvolvedPage() {
  const t = await getTranslations("getInvolved");
  const tCommon = await getTranslations("common");

  const supportLinks = [
    { href: "/#donate", label: t("donateNow") },
    { href: "/feed-a-year", label: t("feedAYear") },
    { href: "/sponsor", label: t("sponsorAnimal") },
    { href: "/donate/thai", label: t("donateBankTransfer") },
    { href: "/donate", label: t("donateSupplies") },
    { href: "/contact", label: t("donateInMemory") },
  ];

  const volunteerLinks = [
    { href: "/volunteer", label: t("volunteerThailand") },
    { href: "/volunteer", label: t("bookVolunteer") },
  ];

  const visitLinks = [
    { href: "/contact", label: t("visitSanctuary") },
  ];

  const adoptLinks = [
    { href: "/adopt", label: t("adoptDog") },
    { href: "/adopt", label: t("adoptCat") },
  ];

  const actionCards = [
    { href: "/#donate", img: "/hero-hug.png", label: t("donate"), alt: "Donate to Saved Souls Foundation" },
    { href: "/sponsor", img: "/dog-care.webp", label: t("sponsor"), alt: "Sponsor a rescued dog" },
    { href: "/volunteer", img: "/volunteer-hero.png", label: t("volunteer"), alt: "Volunteer at Saved Souls Foundation" },
  ];

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600" style={{ width: 70, height: 70 }}>
            <video
              src="/savedsouls-fondation-logo.mp4"
              width={70}
              height={70}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden">
            <LanguageSwitcher compact />
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {tCommon("backToHome")}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* 4 columns - Support, Volunteer, Visit, Adopt */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 uppercase tracking-wide" style={{ color: ACCENT_GREEN }}>
                {t("supportUs")}
              </h2>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 uppercase tracking-wide" style={{ color: ACCENT_GREEN }}>
                {t("volunteerTitle")}
              </h2>
              <ul className="space-y-2">
                {volunteerLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 uppercase tracking-wide" style={{ color: ACCENT_GREEN }}>
                {t("visitUs")}
              </h2>
              <ul className="space-y-2">
                {visitLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 uppercase tracking-wide" style={{ color: ACCENT_GREEN }}>
                {t("adoptTitle")}
              </h2>
              <ul className="space-y-2">
                {adoptLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3 action cards - Donate, Sponsor, Volunteer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {actionCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl hover:border-[#2aa348]/50 dark:hover:border-[#2aa348]/50 transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-flex items-center gap-2 text-white font-semibold text-lg">
                    {card.label}
                    <span className="text-[#2aa348]">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {tCommon("backToHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
