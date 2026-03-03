import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export const metadata: Metadata = {
  title: "Full Medical Check | Saved Souls Foundation",
  description: "Every rescued animal receives a full medical check before adoption. Learn about our veterinary care, vaccinations, and health screening at Saved Souls Foundation.",
};

export default function FullMedicalCheckPage() {
  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ color: ACCENT_GREEN }}>
          Saved Souls
        </Link>
        <Link href="/adopt-inquiry" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
          ← Back to adoption
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">♥</span>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            Full Medical Check
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Every animal leaves our care healthy, vaccinated, and ready for their new home.
          </p>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">What we do</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Before any animal is adopted, they receive a complete veterinary examination. Our team works with local vets in Khon Kaen to ensure every dog and cat is healthy, up to date on vaccinations, and treated for any conditions we find. You&apos;ll receive a full medical history when you adopt.
            </p>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">What&apos;s included</h2>
            <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-2">
              <li>Vaccinations (rabies, distemper, and others as needed)</li>
              <li>Deworming and parasite treatment</li>
              <li>Sterilization (spay/neuter)</li>
              <li>Dental check and treatment if needed</li>
              <li>Blood tests for common diseases</li>
              <li>Treatment for any injuries or illnesses</li>
              <li>Special care for disabled animals (e.g. wheelchair fittings)</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Transparency</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              We believe in full transparency. If an animal has ongoing medical needs—such as medication, physiotherapy, or a wheelchair—we&apos;ll explain everything before you adopt. We want you to feel confident and prepared to give your new companion the care they deserve.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/adopt-inquiry"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            Start your adoption inquiry →
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
