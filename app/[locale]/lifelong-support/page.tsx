import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export const metadata: Metadata = {
  title: "Lifelong Support | Saved Souls Foundation",
  description: "Adoption doesn't end when you take your pet home. We offer lifelong support for every adopted animal from Saved Souls Foundation.",
};

export default function LifelongSupportPage() {
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
            Lifelong Support
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Once you adopt, you&apos;re part of our family. We&apos;re here for you—for life.
          </p>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">What we mean by lifelong</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Adoption is a commitment—and so are we. When you adopt from Saved Souls Foundation, you don&apos;t just take home a pet. You join a community. We stay in touch, answer your questions, and help you through any challenges. Whether it&apos;s advice on diet, behaviour, or medical care, we&apos;re only a message away.
            </p>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">How we support you</h2>
            <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-2">
              <li>Advice on feeding, training, and care</li>
              <li>Help with behavioural issues</li>
              <li>Guidance on medical follow-ups</li>
              <li>Support for disabled or special-needs animals</li>
              <li>Rehoming assistance if circumstances change</li>
              <li>Updates and community with other adopters</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-lg border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">No one left behind</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Life can change. If you ever find yourself unable to care for your adopted animal, we will take them back—no questions asked, no judgment. We want every rescued soul to have a safe place, always. That&apos;s our promise.
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
