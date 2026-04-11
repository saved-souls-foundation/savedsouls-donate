"use client";

import { GOFUNDME_CAMPAIGN_URL, gtagReportConversion } from "@/lib/gtag";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  href?: string;
  children: ReactNode;
};

/**
 * Externe GoFundMe/doneer-URL met conversion tracking.
 */
export default function TrackedGoFundMeAnchor({
  href = GOFUNDME_CAMPAIGN_URL,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        gtagReportConversion(href);
      }}
    >
      {children}
    </a>
  );
}
