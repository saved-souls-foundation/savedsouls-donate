"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ACCENT_GREEN = "#2aa348";

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/SavedSoulsFoundation/", icon: "facebook" },
  { name: "Instagram", href: "https://www.instagram.com/savedsoulsfoundation", icon: "instagram" },
  { name: "YouTube", href: "https://www.youtube.com/@savedsoulsfoundation", icon: "youtube" },
  { name: "X", href: "https://x.com/SoulsaversSSF", icon: "x" },
  { name: "TikTok", href: "https://www.tiktok.com/@savedsoulsfoundation", icon: "tiktok" },
  { name: "Reddit", href: "https://www.reddit.com/user/SoulsaversSSF", icon: "reddit" },
];

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const size = 20;
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    reddit: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.88-7.004 4.88-3.874 0-7.004-2.186-7.004-4.88 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  };
  return icons[icon] ?? null;
}

export default function Footer() {
  const t = useTranslations("common");
  return (
    <footer
      className="py-5 md:py-6 text-center text-sm text-white border-t border-white/20 dark:border-stone-600"
      style={{ backgroundColor: ACCENT_GREEN }}
    >
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="shrink-0 rounded overflow-hidden border border-white/30" style={{ width: 50, height: 50 }}>
            <video
              src="/savedsouls-foundation-logo.mp4"
              width={50}
              height={50}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <p className="font-semibold text-center text-sm">Saved Souls Foundation</p>
          <p className="text-white/90 text-center text-sm">Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand</p>
        </div>
        <div className="flex items-center justify-center gap-3 mt-1">
          {SOCIAL_LINKS.map(({ name, href, icon }) => (
            <a
              key={icon}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/20"
              title={name}
              aria-label={name}
            >
              <SocialIcon icon={icon} />
            </a>
          ))}
        </div>
        <a
          href="https://www.facebook.com/SavedSoulsFoundation/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: "#1877F2" }}
          aria-label={t("followUsOnFacebook")}
        >
          <SocialIcon icon="facebook" className="text-white" />
          <span>{t("followUsOnFacebook")}</span>
        </a>
      </div>
      <p className="text-white/80 mt-3 text-sm">
        © {new Date().getFullYear()} Saved Souls Foundation
      </p>
      <nav className="text-white/70 mt-2 text-sm flex flex-wrap justify-center gap-x-4 gap-y-1" style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom, 1rem))" }} aria-label="Footer navigation">
        <Link href="/get-involved" className="hover:underline">{t("getInvolved")}</Link>
        <Link href="/blog" className="hover:underline">{t("blog")}</Link>
        <Link href="/shop" className="hover:underline">{t("shop")}</Link>
        <Link href="/story" className="hover:underline">{t("ourStory")}</Link>
        <Link href="/faq" className="hover:underline">{t("faq")}</Link>
        <Link href="/partners" className="hover:underline">{t("partners")}</Link>
        <Link href="/shelters" className="hover:underline">{t("shelters")}</Link>
        <Link href="/thank-you" className="hover:underline">{t("thankYou")}</Link>
        <Link href="/disclaimer" className="hover:underline">{t("disclaimer")}</Link>
      </nav>
    </footer>
  );
}
