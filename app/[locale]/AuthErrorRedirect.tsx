"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

function getParamsFromHash(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  const hash = window.location.hash.replace(/^#/, "");
  return new URLSearchParams(hash);
}

/**
 * Als Supabase doorverwijst met o.a. otp_expired (ongeldige/verlopen wachtwoord-reset link),
 * stuur dan door naar de loginpagina met een duidelijke melding.
 * Supabase kan de fout in query (?error=...) of in hash (#error=...) zetten.
 */
export default function AuthErrorRedirect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fromQuery = (p: URLSearchParams) => ({
      error: p.get("error"),
      errorCode: p.get("error_code"),
      desc: p.get("error_description") ?? "",
    });
    const q = fromQuery(searchParams);
    const h = fromQuery(getParamsFromHash());

    const check = (error: string | null, errorCode: string | null, desc: string) =>
      error === "access_denied" &&
      (errorCode === "otp_expired" || /invalid|expired/i.test(desc));

    const isResetExpired =
      check(q.error, q.errorCode, q.desc) || check(h.error, h.errorCode, h.desc);

    if (isResetExpired && pathname === "/") {
      router.replace("/dashboard/login?reset_expired=1");
    }
  }, [pathname, searchParams, router]);

  return null;
}
