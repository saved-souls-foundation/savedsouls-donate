import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "Contact | Saved Souls Foundation",
  description: "Contact Saved Souls Foundation in Khon Kaen, Thailand. Email, phone, address and opening hours.",
};

export default function ContactPage() {
  return (
    <ParallaxPage>
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
          <span className="text-sm font-semibold" style={{ color: ACCENT_GREEN }}>Saved Souls Foundation</span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">
          Contact
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-10">
          General enquiries, visits or adoption? Get in touch.
        </p>

        <section className="space-y-8 text-stone-700 dark:text-stone-300">
          {/* Logo + Name + Address + Google Map */}
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800">
                <video
                  src="/savedsouls-fondation-logo.mp4"
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
                  Opening hours: 1:30 – 3:30 p.m. daily. Please contact us to schedule an appointment.
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
              Email
            </h2>
            <a
              href="mailto:info@savedsouls-foundation.org"
              className="text-lg font-medium underline hover:opacity-80"
              style={{ color: ACCENT_GREEN }}
            >
              info@savedsouls-foundation.org
            </a>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-1">
              For general enquiries or use the <Link href="/#contact" className="underline" style={{ color: ACCENT_GREEN }}>contact form on our homepage</Link>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Phone
            </h2>
            <p className="font-medium">+66 62 369 8246 <span className="text-stone-500 dark:text-stone-400 text-sm">(Thai)</span></p>
            <p className="font-medium mt-1">+98 000 5406 <span className="text-stone-500 dark:text-stone-400 text-sm">(English)</span></p>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-2">
              Office hours: 8:00 AM – 4:00 PM
            </p>
          </div>

          {/* Bank details */}
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
              Bank details (donations)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
                <p className="font-semibold text-stone-800 dark:text-stone-200">Kasikorn Bank (Thailand)</p>
                <p className="text-stone-700 dark:text-stone-300 font-mono text-sm md:text-base break-all mt-1">033-8-13623-4</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">SWIFT: KASITHBK</p>
              </div>
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
                <p className="font-semibold text-stone-800 dark:text-stone-200">PostFinance (Switzerland)</p>
                <p className="text-stone-700 dark:text-stone-300 font-mono text-sm md:text-base break-all mt-1">CH17 0900 0000 8027 1722 9</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">SWIFT: POFICHBEXXX</p>
              </div>
            </div>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-3">
              Or donate directly via <Link href="/#donate" className="underline" style={{ color: ACCENT_GREEN }}>PayPal on our homepage</Link>.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@savedsouls-foundation.org"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            Send email
          </a>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            Contact form on homepage
          </Link>
        </div>

        {/* Contact form */}
        <div className="mt-16 pt-12 border-t border-stone-200 dark:border-stone-700">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center" style={{ color: ACCENT_GREEN }}>
            Send us a message
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-center mb-8 max-w-xl mx-auto">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
          <ContactForm idPrefix="contact-page" showTitle={false} className="py-12" />
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
