"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BANK_ACCOUNTS } from "@/lib/bankAccounts";

function CopyButton({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard may be blocked */
        }
      }}
      className="inline-flex min-h-[36px] items-center rounded-md border border-stone-300 bg-transparent px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100/80 hover:text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

function DetailField({ label, value, monoBold }: { label: string; value: string; monoBold?: boolean }) {
  return (
    <div className="py-1.5">
      <dt className="text-xs text-stone-500 mb-0.5">{label}</dt>
      <dd
        className={`text-sm text-stone-800 break-words ${
          monoBold ? "font-mono font-bold tracking-tight" : "font-normal"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function BankTransferSection() {
  const t = useTranslations("donate.bank");
  const eu = BANK_ACCOUNTS.europe;
  const th = BANK_ACCOUNTS.thailand;

  return (
    <section id="bank-transfer" className="scroll-mt-24">
      <div className="rounded-xl bg-white px-5 py-5 md:px-6 md:py-6">
        <h2 className="text-base font-semibold text-stone-700 mb-1">{t("title")}</h2>
        <p className="text-sm text-stone-600 mb-5 leading-relaxed">{t("intro")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:divide-x md:divide-stone-400/60">
          {/* Europe */}
          <div className="flex flex-col pb-6 md:pb-0">
            <p className="text-sm font-medium text-stone-700 mb-4">{t("eu.title")}</p>
            <dl className="flex-1">
              <DetailField label={t("holder")} value={eu.holder} />
              <DetailField label={t("bank")} value={eu.bank} />
              <DetailField label={t("iban")} value={eu.ibanDisplay} monoBold />
              <DetailField label={t("bic")} value={eu.bic} />
            </dl>
            <div className="mt-auto pt-4">
              <CopyButton text={eu.ibanCopy} label={t("copyIban")} copiedLabel={t("copied")} />
            </div>
          </div>

          {/* Thailand — mobile: line + py-6; desktop: vertical divide + pl-12 */}
          <div className="flex flex-col border-t border-stone-400/60 py-6 md:border-t-0 md:py-0 md:pl-12">
            <p className="text-sm font-medium text-stone-700 mb-4">{t("th.title")}</p>
            <dl className="flex-1">
              <DetailField label={t("holder")} value={th.holder} />
              <DetailField label={t("bank")} value={th.bank} />
              <DetailField label={t("account")} value={th.account} monoBold />
              <DetailField label={t("bic")} value={th.bic} />
            </dl>
            <div className="mt-auto pt-4">
              <CopyButton text={th.account} label={t("copyAccount")} copiedLabel={t("copied")} />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-400/60 pt-6 space-y-1.5 text-xs leading-relaxed text-stone-500">
          <p>{t("reference")}</p>
          <p>{t("fraud")}</p>
          <p>{t("registration")}</p>
        </div>
      </div>
    </section>
  );
}
