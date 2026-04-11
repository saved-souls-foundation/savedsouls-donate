"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import { gtagReportConversion, resolveDonationNavigationUrl } from "@/lib/gtag";

const BTN_DONATE = "#7B1010";

type DonateButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  /** sm = py-2.5 px-5, md = py-3 px-6, lg = py-4 px-8 */
  size?: "sm" | "md" | "lg";
};

export default function DonateButton({
  href = "/#donate",
  children,
  className = "",
  size = "md",
}: DonateButtonProps) {
  const locale = useLocale();
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2",
  };
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        gtagReportConversion(resolveDonationNavigationUrl(href, locale));
      }}
      className={`inline-flex items-center justify-center font-semibold text-white rounded-xl hover:opacity-90 transition-opacity ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: BTN_DONATE }}
    >
      <Heart className={`${iconSizes[size]} shrink-0 fill-white stroke-white`} aria-hidden />
      {children}
    </Link>
  );
}
