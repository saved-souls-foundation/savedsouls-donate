import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export const metadata: Metadata = {
  title: "Gallery | Saved Souls Foundation",
  description: "Photos from Saved Souls Foundation sanctuary in Khon Kaen, Thailand. Rescued dogs, wheelchair dogs, volunteers and our shelter.",
};

const GALLERY_IMAGES = [
  { src: "/dog-puppy-affection.png", alt: "Puppy showing affection to an adult rescued dog" },
  { src: "/person-hug-brindle-dog.png", alt: "Volunteer hugging a rescued brindle dog in nature" },
  { src: "/dog-vet-care.png", alt: "Rescued dog receiving veterinary care at the sanctuary" },
  { src: "/woman-hug-dog.webp", alt: "Volunteer hugging a rescued dog" },
  { src: "/woman-dog-wheelchair.webp", alt: "Volunteer with a dog in a wheelchair" },
  { src: "/dog-wheelchair-small.webp", alt: "Rescued dog with wheelchair" },
  { src: "/team-dogs.webp", alt: "Team and volunteers with rescued dogs" },
  { src: "/two-dogs-platform.webp", alt: "Two rescued dogs at the sanctuary" },
  { src: "/dog-sand-happy.webp", alt: "Happy rescued dog on the sand" },
  { src: "/dog-grass-walking.webp", alt: "Rescued dog walking on grass" },
  { src: "/dog-reaching.webp", alt: "Rescued dog waiting for a home" },
  { src: "/dog-white-brown-resting.webp", alt: "Rescued dog resting" },
  { src: "/dog-tan-sand.webp", alt: "Rescued dog at the sanctuary" },
  { src: "/dog-care.webp", alt: "Care for a rescued dog" },
  { src: "/dog-swimming.webp", alt: "Swimming therapy for a rescued dog" },
  { src: "/woman-dog-stump.webp", alt: "Volunteer with a rescued dog in nature" },
  { src: "/dog-fluffy-white.webp", alt: "Fluffy rescued dog at the sanctuary" },
  { src: "/dog-tricolor.webp", alt: "Rescued dog portrait" },
  { src: "/woman-dog-leash.webp", alt: "Volunteer with a rescued dog on a walk" },
  { src: "/dog-black.webp", alt: "Black rescued dog" },
  { src: "/dog-red-leash.webp", alt: "Rescued dog on a walk" },
];

export default function GalleryPage() {
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

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Gallery
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            Life at Saved Souls Foundation, Khon Kaen
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img) => (
            <div key={img.src} className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2aa348" }}
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
