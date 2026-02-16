import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export const metadata: Metadata = {
  title: "Disclaimer | Saved Souls Foundation",
  description: "Disclaimer and legal information for Saved Souls Foundation website.",
};

export default function DisclaimerPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">
          Disclaimer
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-10 text-sm">
          Saved Souls Foundation
        </p>

        <section className="space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              General
            </h2>
            <p>
              The information on this website is for general purposes only. Saved Souls Foundation (the &quot;Foundation&quot;) strives to keep the content accurate and up to date but makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, or availability of the website or the information contained on it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Donations
            </h2>
            <p>
              Donations are voluntary and support the Foundation&apos;s work. The Foundation is a registered non-profit organization. Donation-related tax or legal effects depend on your jurisdiction; we recommend consulting your own advisor where relevant.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              External links
            </h2>
            <p>
              This site may contain links to external websites. We have no control over their content or privacy practices and are not responsible for them. The inclusion of any link does not imply endorsement by the Foundation.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Cookies
            </h2>
            <p>
              This website may use cookies for essential functionality and to improve your experience. By using the site and accepting our cookie notice, you agree to such use. You can change browser settings to limit or block cookies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, the Foundation shall not be liable for any direct, indirect, or consequential loss or damage arising from the use of this website or reliance on its content.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: ACCENT_GREEN }}>
              Contact
            </h2>
            <p>
              For questions about this disclaimer or the Foundation, please contact us at{" "}
              <a href="mailto:info@savedsouls-foundation.org" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
                info@savedsouls-foundation.org
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
