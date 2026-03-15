"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

function CopyButton({
  text,
  label,
  copiedLabel = "Copied!",
}: {
  text: string;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      style={{ color: ACCENT_GREEN }}>
      {copied ? copiedLabel : label}
    </button>
  );
}

type BankTransferSectionProps = {
  defaultOpen?: boolean;
};

export default function BankTransferSection({ defaultOpen = false }: BankTransferSectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <details open={defaultOpen} className="group rounded-xl border border-stone-200 dark:border-stone-600 overflow-hidden">
      <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
        <span className="font-semibold text-stone-800 dark:text-stone-200">
          {t("bankTransfer")}
        </span>
        <span className="text-stone-400 group-open:rotate-180 transition-transform">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      <div className="p-6 pt-0 space-y-4">
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-600">
          <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">Thai Bank Account</p>
          <dl className="space-y-1.5 text-sm md:text-base">
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Account holder</dt>
              <dd className="font-medium text-stone-800 dark:text-stone-200">Saved-Souls Foundation</dd>
              <dd className="text-stone-600 dark:text-stone-300">Ban Fang, Khon Kaen</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Bank</dt>
              <dd className="font-medium text-stone-800 dark:text-stone-200">Kasikorn Bank</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Account</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300 break-all">033-8-13623-4</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">BIC/SWIFT</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300">KASITHBK</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Bank Code</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300">004</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text="033-8-13623-4" label={t("copyAccount")} copiedLabel={tCommon("copied")} />
            <CopyButton text="KASITHBK" label={t("copySwift")} copiedLabel={tCommon("copied")} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-600">
          <p className="font-semibold text-stone-800 dark:text-stone-200 mb-3">Swiss Bank Account</p>
          <dl className="space-y-1.5 text-sm md:text-base">
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Account holder</dt>
              <dd className="font-medium text-stone-800 dark:text-stone-200">Saved Souls Animal Sanctuary / Tierheim Ban Fang</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Bank</dt>
              <dd className="font-medium text-stone-800 dark:text-stone-200">PostFinance AG</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">Account</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300">80-271722-9</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">IBAN</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300 break-all">CH17 0900 0000 8027 1722 9</dd>
            </div>
            <div>
              <dt className="text-stone-500 dark:text-stone-400">BIC/SWIFT</dt>
              <dd className="font-mono text-stone-700 dark:text-stone-300">POFICHBEXXX</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text="CH17 0900 0000 8027 1722 9" label={t("copyIban")} copiedLabel={tCommon("copied")} />
            <CopyButton text="POFICHBEXXX" label={t("copySwift")} copiedLabel={tCommon("copied")} />
          </div>
        </div>
      </div>
    </details>
  );
}
