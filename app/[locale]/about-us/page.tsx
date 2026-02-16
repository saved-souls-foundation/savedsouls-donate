import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

export const metadata: Metadata = {
  title: "About us | Saved Souls Foundation",
  description:
    "Saved Souls Foundation was founded in 2010 by Gabriela Leonhard. Registered non-profit in Khon Kaen, Thailand. We provide care, swimming therapy and sterilization for rescued animals.",
};

export default async function AboutUsPage() {
  const t = await getTranslations("common");
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
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("aboutUs")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            Saved Souls Foundation
          </p>
        </header>

        <section className="space-y-8 text-stone-700 dark:text-stone-300 font-bold">
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Our foundation
            </h2>
            <p className="leading-relaxed">
              Saved Souls Animal Sanctuary was founded in 2010 by Gabriela Leonhard. The shelter is located in Ban Khok Ngam, Ban Fang District, Khon Kaen province, northeastern Thailand, and sits on a 6-rai (9,600 m²) plot of land.
            </p>
            <p className="leading-relaxed mt-4">
              On October 9th, 2017, we officially became a registered non-profit organization under the name <strong>Saved Souls Foundation</strong> (registration number 1/2560).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Our care
            </h2>
            <p className="leading-relaxed">
              We are dedicated to providing the highest quality of life for all our animals. Fresh meals are cooked daily, and swimming therapy plays an important role—especially for our disabled dogs.
            </p>
          </div>

          {/* Video – sanctuary MP4 */}
          <div className="pt-2">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center" style={{ color: ACCENT_GREEN }}>
              See our sanctuary
            </h2>
            <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 shadow-lg" style={{ paddingBottom: "56.25%" }}>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/sanctuary.mp4"
                controls
                playsInline
                autoPlay
                muted
                loop
                title="Saved Souls Foundation – sanctuary"
              >
                Your browser does not support video. <a href="/sanctuary.mp4">Download the video</a>.
              </video>
            </div>
          </div>

          {/* Team photo */}
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center" style={{ color: ACCENT_GREEN }}>
              Our team & volunteers
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg relative aspect-[4/3]">
              <Image
                src="/team-dogs.webp"
                alt="Saved Souls Foundation team and volunteers with rescued dogs"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Disabled dogs: wheelchairs & outdoor time
            </h2>
            <p className="leading-relaxed">
              For our disabled dogs, we provide wheelchairs and access to a large dog park where they can play, explore, and enjoy the fresh air. The other dogs are taken for relaxing walks in the peaceful surroundings of our foundation.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <Image src="/woman-dog-wheelchair.webp" alt="Volunteer with a dog in a wheelchair" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <Image src="/dog-wheelchair-small.webp" alt="Rescued dog with wheelchair" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Every animal deserves love & a safe home
            </h2>
            <p className="leading-relaxed">
              At Saved Souls Foundation, we believe every animal deserves love, care, and a safe place to call home. Our dedicated staff and volunteers make sure our dogs and cats receive the affection and attention they need—from daily walks with as many dogs as possible to bonding time with our cats in our cozy cat shelter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Sterilization & health
            </h2>
            <p className="leading-relaxed">
              All of our dogs are sterilized and vaccinated. In addition, we organize sterilization campaigns for street dogs and cats to help prevent unwanted litters and reduce suffering in the long term.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Adoption
            </h2>
            <p className="leading-relaxed">
              We help dogs find loving homes both locally and across the country. With dedicated care, love, and training, we make sure every dog is leash-trained before joining their new family. We also host adoption events where potential owners can meet their future companions in person.
            </p>
            <p className="leading-relaxed mt-4">
              Want to join one? Subscribe to our newsletter or follow us on Facebook and Instagram for the latest updates!
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3" style={{ color: ACCENT_GREEN }}>
              Visit us
            </h2>
            <p className="leading-relaxed">
              Looking to adopt a dog or cat? You&apos;re always welcome to visit our shelter—just contact us to schedule an appointment. Send us an email at{" "}
              <a href="mailto:info@savedsouls-foundation.org" className="underline font-medium" style={{ color: ACCENT_GREEN }}>
                info@savedsouls-foundation.org
              </a>{" "}
              for general enquiries or fill in the contact form on our homepage.
            </p>
            <p className="leading-relaxed mt-4">
              You can also reach us by phone: <strong>+66 62 369 8246</strong> (Thai) or <strong>+98 000 5406</strong> (English). Office hours: 8:00 AM – 4:00 PM.
            </p>
            <p className="leading-relaxed mt-4">
              Visit us at 133, Ban Khok Ngam, Ban Fang District, Khon Kaen 40270, Thailand. Opening hours: 1:30 – 3:30 p.m. daily.
            </p>
          </div>
        </section>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BUTTON_ORANGE }}
          >
            Back to home
          </Link>
          <Link
            href="/#donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 transition-opacity hover:opacity-90 text-center"
            style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
          >
            Donate
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
