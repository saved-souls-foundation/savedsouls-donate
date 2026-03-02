import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import UnsubscribeClient from "./UnsubscribeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribed | Saved Souls Foundation",
  description: "Newsletter unsubscribe – Saved Souls Foundation",
};

export default async function UnsubscribePage() {
  const t = await getTranslations("common");
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center">
            <p className="text-lg text-stone-600 dark:text-stone-400">
              {t("unsubscribeLoading")}
            </p>
          </div>
        </main>
      }
    >
      <UnsubscribeClient />
    </Suspense>
  );
}
