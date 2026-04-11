"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { gtagReportConversion, resolveDonationNavigationUrl } from "@/lib/gtag";
import type { ComponentProps, MouseEvent } from "react";

type TrackedDonateLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  href: string;
  /** Bijv. mobiel menu sluiten; wordt vóór conversion aangeroepen. */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Interne doneer-links (next-intl) met Google Ads conversion vóór navigatie.
 */
export default function TrackedDonateLink({ href, children, onClick: onClickProp, ...rest }: TrackedDonateLinkProps) {
  const locale = useLocale();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClickProp?.(e);
        e.preventDefault();
        gtagReportConversion(resolveDonationNavigationUrl(href, locale));
      }}
    >
      {children}
    </Link>
  );
}
