import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import NewsletterSignup from "@/components/NewsletterSignup";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "Contact | Saved Souls Foundation",
  description: "Contact Saved Souls Foundation in Khon Kaen, Thailand. Email, phone, address and opening hours.",
};

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tContact = await getTranslations("contactPage");
  return (
    <ParallaxPage>
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">
          {tContact("title")}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-10">
          {tContact("subtitle")}
        </p>

        <section className="space-y-8 text-stone-700 dark:text-stone-300">
          {/* Logo + Name + Address + Google Map */}
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800">
                <video
                  src="/savedsouls-foundation-logo.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  title="Saved Souls Foundation logo"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
                  Saved Souls Foundation
                </h2>
                <p className="leading-relaxed font-medium mt-1">
                  133, Ban Khok Ngam, Ban Fang District, Khon Kaen 40270, Thailand
                </p>
                <p className="text-base text-stone-500 dark:text-stone-400 mt-1">
                  {tContact("openingHours")}
                </p>
              </div>
            </div>
            <div className="mt-4 w-full relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 aspect-video min-h-[280px]">
              <iframe
                src="https://www.google.com/maps?q=133,+Ban+Khok+Ngam,+Ban+Fang+District,+Khon+Kaen+40270,+Thailand&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Saved Souls Foundation – 133, Ban Khok Ngam, Ban Fang District, Khon Kaen"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=133,+Ban+Khok+Ngam,+Ban+Fang+District,+Khon+Kaen+40270,+Thailand"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-medium underline"
              style={{ color: ACCENT_GREEN }}
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {tContact("emailHeading")}
            </h2>
            <a
              href="mailto:info@savedsouls-foundation.org"
              className="text-lg font-medium underline hover:opacity-80"
              style={{ color: ACCENT_GREEN }}
            >
              info@savedsouls-foundation.org
            </a>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-1">
              {tContact("emailLinkBefore")}
              <Link href="/#contact" className="underline" style={{ color: ACCENT_GREEN }}>{tContact("emailLinkLabel")}</Link>
              {tContact("emailLinkAfter")}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              {tContact("phoneHeading")}
            </h2>
            <p className="font-medium">
              <a href="tel:+66623698246" className="inline-block py-2 pr-1 -ml-1 min-h-[44px] min-w-[44px] hover:underline underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded" style={{ color: "inherit" }}>
                +66 62 369 8246
              </a>
            </p>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-2">
              {tContact("officeHours")}
            </p>
          </div>

          {/* Bank details */}
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              {tContact("bankHeading")}
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">{tContact("thaiBankAccount")}</p>
                <dl className="space-y-1.5 text-sm md:text-base">
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("accountHolder")}</dt>
                    <dd className="font-medium text-stone-800 dark:text-stone-200">Saved-Souls Foundation</dd>
                    <dd className="text-stone-600 dark:text-stone-300">Ban Fang, Khon Kaen</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("bank")}</dt>
                    <dd className="font-medium text-stone-800 dark:text-stone-200">Kasikorn Bank</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("account")}</dt>
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
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">{tContact("swissBankAccount")}</p>
                <dl className="space-y-1.5 text-sm md:text-base">
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("accountHolder")}</dt>
                    <dd className="font-medium text-stone-800 dark:text-stone-200">Saved Souls Animal Sanctuary / Tierheim Ban Fang</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("bank")}</dt>
                    <dd className="font-medium text-stone-800 dark:text-stone-200">PostFinance AG</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">{tContact("account")}</dt>
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
            <p className="text-base text-stone-500 dark:text-stone-400 mt-3">
              {tContact("orDonateViaBefore")}
              <Link href="/#donate" className="underline" style={{ color: ACCENT_GREEN }}>{tContact("orDonateViaLink")}</Link>
              {tContact("orDonateViaAfter")}
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <DonateButton size="md">{t("donate")}</DonateButton>
          <a
            href="mailto:info@savedsouls-foundation.org"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            {tContact("sendEmail")}
          </a>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            {tContact("contactFormHomepage")}
          </Link>
        </div>

        {/* Contact form */}
        <div className="mt-16 pt-12 border-t border-stone-200 dark:border-stone-700">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center" style={{ color: ACCENT_GREEN }}>
            {tContact("sendMessageHeading")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-8 max-w-xl mx-auto">
            {tContact("sendMessageSubtitle")}
          </p>
          <ContactForm idPrefix="contact-page" showTitle={false} className="py-12" locale={locale} />
        </div>

        <section className="mt-16 pt-12 border-t border-stone-200 dark:border-stone-700">
          <NewsletterSignup variant="expanded" />
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
