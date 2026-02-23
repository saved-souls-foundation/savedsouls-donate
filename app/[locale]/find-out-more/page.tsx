import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";
import HeroPolaroidCarousel from "../../components/HeroPolaroidCarousel";

const ACCENT_GREEN = "#2aa348";
const HERO_GREEN = "#2aa348";
const DARK_GREEN = "#1a6b2e";

export const metadata: Metadata = {
  title: "Find out more | Saved Souls Foundation",
  description: "How we rescue and care for dogs in Thailand. Donate, transfer, sponsor a dog or get in touch.",
};

export default async function FindOutMorePage() {
  const t = await getTranslations("common");
  const tHome = await getTranslations("home");
  const tSoulSaver = await getTranslations("soulSaver");
  return (
    <ParallaxPage>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: ACCENT_GREEN }}
        >
          Saved Souls
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← Back to home
        </Link>
      </nav>

      {/* Hero banner – groen met tekst en polaroid foto */}
      <section
        className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 px-6 md:px-12 lg:px-16 py-12 md:py-16"
        style={{ backgroundColor: HERO_GREEN }}
      >
        <div className="flex-1 text-white text-center md:text-left order-2 md:order-1">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic mb-2 md:mb-3">
            {tHome("findOutMoreHeroTagline")}
          </p>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide opacity-90 mb-4 md:mb-6" style={{ color: "rgba(255,255,255,0.95)" }}>
            SAVED SOULS FOUNDATION
          </h1>
          <p className="font-serif text-lg md:text-xl lg:text-2xl italic mb-6 md:mb-8">
            {tHome("findOutMoreHeroCta")}
          </p>
          <div
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: DARK_GREEN }}
          >
            {tHome("findOutMoreHeroLocation")}
          </div>
        </div>
        <HeroPolaroidCarousel />
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Where Broken Souls Learn to Love Again
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto">
            They came to us broken. They leave us whole. We rescue dogs from the illegal meat trade, cats from the streets, and animals the world has turned its back on. Many arrive so traumatized they&apos;ve forgotten what kindness feels like. But here? Here they remember.
          </p>
        </header>

        {/* Foundation history */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center" style={{ color: ACCENT_GREEN }}>
            Our story
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-center">
            Saved Souls Foundation was founded in 2010 by Gabriela Leonhard. The sanctuary is located in Ban Khok Ngam, Ban Fang District, Khon Kaen province, northeastern Thailand. On October 9, 2017, we officially became a registered non-profit organization under the name Saved Souls Foundation, registration number 1/2560.
          </p>
        </section>

        {/* Gabriela Leonhard – Founder */}
        <section className="mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
              <img
                src="/founder-hug.webp"
                alt="Gabriela Leonhard with a rescued dog at the sanctuary"
                className="rounded-2xl w-full aspect-[4/3] object-cover shadow-lg"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
                Gabriela Leonhard – Founder
              </h2>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
                &quot;The Sound That Changed Everything&quot;
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-3">
                I can still hear it. Two pickup trucks, a microphone crackling through the streets: <em>&quot;Trade your dog for plastic containers.&quot;</em> That sound haunts me. It&apos;s why I left Switzerland in 2007. Why I built this sanctuary from nothing. Why I won&apos;t stop until every soul is safe.
              </p>
              <p className="text-stone-600 dark:text-stone-400 mb-3">
                Thailand is beautiful—but for its animals, it can be brutal. Dogs traded like garbage. Disabled puppies left to die. Pregnant mothers with nowhere to turn. <strong>In 2010, we said: Not anymore.</strong>
              </p>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                With 100 rescued dogs and a patch of land in Khon Kaen, Saved Souls Foundation was born. Today, we&apos;re a registered non-profit fighting the battles others won&apos;t touch—the paralyzed, the traumatized, the &quot;lost causes.&quot;
              </p>
              <p className="text-stone-700 dark:text-stone-300 font-medium">
                Because there&apos;s no such thing as a lost cause. Just a soul waiting for someone to care.
              </p>
            </div>
          </div>
        </section>

        {/* 6 photos from the sanctuary */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center" style={{ color: ACCENT_GREEN }}>
            Our shelter in pictures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <img
              src="/woman-dog-wheelchair.webp"
              alt="Volunteer with a rescued dog in a wheelchair at the sanctuary"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
            <img
              src="/dog-wheelchair-small.webp"
              alt="A rescued dog in a wheelchair at the sanctuary"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
            <img
              src="/dog-swimming.webp"
              alt="Hydrotherapy and care for a rescued dog"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
            <img
              src="/two-dogs-platform.webp"
              alt="Two rescued dogs at the sanctuary"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
            <img
              src="/shelter-food.webp"
              alt="Staff preparing food for the animals"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
            <img
              src="/dog-sand-happy.webp"
              alt="A happy rescued dog at the sanctuary"
              className="rounded-xl w-full aspect-[4/3] object-cover shadow-md"
              loading="lazy"
            />
          </div>
        </section>

        {/* Donate CTA – midden op de pagina */}
        <section className="mb-14 md:mb-20 text-center">
          <DonateButton size="lg" className="shadow-lg hover:shadow-xl">
            {t("donateNow")}
          </DonateButton>
        </section>

        {/* Call to action buttons */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center" style={{ color: ACCENT_GREEN }}>
            How you can help
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-4 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              Get in touch
            </Link>
            <Link
              href="/sponsor"
              className="inline-flex items-center justify-center px-6 py-4 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
              style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
            >
              Sponsor a dog
            </Link>
          </div>
        </section>

        {/* Bank transfer section */}
        <section className="mb-14 md:mb-20">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center" style={{ color: ACCENT_GREEN }}>
            Bank transfer
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-6 max-w-xl mx-auto">
            Prefer to transfer directly? Use the details below. Every amount helps.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
              <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">Thai Bank Account</p>
              <dl className="space-y-1.5 text-sm">
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Account holder</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200">Saved-Souls Foundation</dd>
                  <dd className="text-stone-600 dark:text-stone-300">Ban Fang, Khon Kaen</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Bank</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200">Kasikorn Bank</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Account</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300 break-all">033-8-13623-4</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">BIC/SWIFT</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300">KASITHBK</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Bank Code</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300">004</dd>
                </div>
              </dl>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
              <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">Swiss Bank Account</p>
              <dl className="space-y-1.5 text-sm">
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Account holder</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200">Saved Souls Animal Sanctuary / Tierheim Ban Fang</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Bank</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200">PostFinance AG</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Account</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300">80-271722-9</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">IBAN</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300 break-all">CH17 0900 0000 8027 1722 9</dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">BIC/SWIFT</dt>
                  <dd className="font-mono text-stone-700 dark:text-stone-300">POFICHBEXXX</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Secondary CTAs */}
        <section className="text-center border-t border-stone-200 dark:border-stone-700 pt-10">
          <p className="text-stone-600 dark:text-stone-400 mb-6">Want to adopt or support us in another way?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#adopt"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("adopt")}
            </Link>
            <DonateButton href="/#donate" size="md" className="!px-6 !py-3">
              {tSoulSaver("moreWays")}
            </DonateButton>
          </div>
        </section>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
