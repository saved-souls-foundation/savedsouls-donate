import { Link } from "@/i18n/navigation";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

export default function SponsorPage() {
  return (
    <ParallaxPage>
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center">
        Sponsor a dog
      </h1>
      <p className="text-stone-600 dark:text-stone-400 text-center mb-8 max-w-md">
        This page is under construction. Soon you will be able to choose a dog to sponsor and support monthly.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-semibold border-2 hover:opacity-90"
        style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
      >
        Back to home
      </Link>
    </div>
    <Footer />
    </ParallaxPage>
  );
}
