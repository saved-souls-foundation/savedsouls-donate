"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Status = "loading" | "success" | "already" | "error";

export default function UnsubscribeClient() {
  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token?.trim()) {
      setStatus("already");
      return;
    }
    let cancelled = false;
    fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const s = data?.status;
        if (s === "success") {
          setStatus("success");
          if (data.maskedEmail) setMaskedEmail(data.maskedEmail);
        } else if (s === "already") {
          setStatus("already");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const emailDisplay = maskedEmail ?? "";

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <p className="text-lg text-stone-600 dark:text-stone-400">
            {t("unsubscribeLoading")}
          </p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
              {t("unsubscribedMessage")}
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              {t("unsubscribeSuccess", { email: emailDisplay })}
            </p>
          </>
        )}
        {status === "already" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
              {t("unsubscribedMessage")}
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              {t("unsubscribeAlready")}
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
              {t("unsubscribeError")}
            </h1>
          </>
        )}
        {(status === "success" || status === "already" || status === "error") && (
          <p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline font-medium"
            >
              {t("backToHome")}
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
