import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export const metadata: Metadata = {
  title: "Free Home Visit | Saved Souls Foundation",
  description: "We offer free home visits before adoption. Learn how we help you prepare your home for a rescued dog or cat from Saved Souls Foundation.",
};

export default function FreeHomeVisitPage() {
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
            Free Home Visit
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            We come to you—at no cost—to help you and your new companion get off to the best start.
          </p>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">What is a home visit?</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Before you adopt, a member of our team will visit your home—either in person or via video call. This is not a test or inspection. It&apos;s a chance for us to meet you, answer your questions, and help you prepare your space for a rescued animal. We want every adoption to succeed, and a home visit helps us support you from day one.
            </p>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">What we look at</h2>
            <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-2">
              <li>Safe outdoor space (if applicable) for dogs</li>
              <li>Where your new pet will sleep and eat</li>
              <li>Any other animals in the household</li>
              <li>Your lifestyle and schedule</li>
              <li>Questions you have about care, feeding, or special needs</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Why it&apos;s free</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              We believe adoption should be accessible. A home visit is part of our commitment to you and to every rescued soul. We don&apos;t charge for this service—we just want to make sure you and your new family member are set up for a lifetime of love.
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
