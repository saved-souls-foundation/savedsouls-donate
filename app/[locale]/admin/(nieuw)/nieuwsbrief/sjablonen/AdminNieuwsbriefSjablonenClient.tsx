"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const PAGE_SIZE = 20;

type NewsletterTemplate = {
  id: string;
  titel: string;
  subject_nl?: string | null;
  subject_en?: string | null;
  volgorde?: number | null;
};

type NewsletterSend = {
  id: string;
  subject_nl: string | null;
  subject_en: string | null;
  sent_at: string;
  sent_by: string | null;
  recipient_count: number;
  status: string;
};

type Tab = "sjablonen" | "verzonden" | "wachtrij" | "handmatig";

export default function AdminNieuwsbriefSjablonenClient() {
  const t = useTranslations("admin.newsletter");
  const tAdmin = useTranslations("admin");
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("sjablonen");
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [sends, setSends] = useState<NewsletterSend[]>([]);
  const [sendsTotal, setSendsTotal] = useState(0);
  const [sendsPage, setSendsPage] = useState(1);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingSends, setLoadingSends] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch("/api/admin/newsletter/templates");
      const data = await res.json();
      if (res.ok) setTemplates(data?.templates ?? []);
      else setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  const fetchSends = useCallback(async () => {
    setLoadingSends(true);
    try {
      const res = await fetch(`/api/admin/newsletter/sends?page=${sendsPage}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (res.ok) {
        setSends(data?.data ?? []);
        setSendsTotal(data?.total ?? 0);
      } else {
        setSends([]);
        setSendsTotal(0);
      }
    } finally {
      setLoadingSends(false);
    }
  }, [sendsPage]);

  useEffect(() => {
    if (tab === "sjablonen") fetchTemplates();
  }, [tab, fetchTemplates]);

  useEffect(() => {
    if (tab === "verzonden") fetchSends();
  }, [tab, fetchSends]);

  const totalSendsPages = Math.max(1, Math.ceil(sendsTotal / PAGE_SIZE));

  function formatDate(d: string) {
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function subjectDisplay(s: NewsletterSend) {
    return s.subject_nl || s.subject_en || "—";
  }

  function statusLabel(status: string) {
    if (status === "sent") return t("sendsStatusSent");
    if (status === "failed") return t("sendsStatusFailed");
    if (status === "partial") return t("sendsStatusPartial");
    return status;
  }

  const tabs: { id: Tab; labelKey: string }[] = [
    { id: "sjablonen", labelKey: "sjablonenTab" },
    { id: "verzonden", labelKey: "verzondenTab" },
    { id: "wachtrij", labelKey: "wachtrijTab" },
    { id: "handmatig", labelKey: "handmatigTab" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/nieuwsbrief" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
            ← {t("backToNewsletter")}
          </Link>
          <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
            {t("sjablonenTitle")}
          </h1>
        </div>
      </div>

      <div className="flex border-b gap-2 flex-wrap" style={{ borderColor: ADM_BORDER }}>
        {tabs.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderColor: tab === id ? ADM_ACCENT : "transparent",
              color: tab === id ? ADM_ACCENT : ADM_MUTED,
            }}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {tab === "sjablonen" && (
        <section className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <div className="p-4 border-b" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
              {t("templatesListTitle")}
            </h2>
            <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
              {t("templatesListDescription")}
            </p>
          </div>
          {loadingTemplates ? (
            <div className="p-8 text-center" style={{ color: ADM_MUTED }}>
              {tAdmin("loading")}
            </div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center" style={{ color: ADM_MUTED }}>
              {t("noTemplates")}
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: ADM_BORDER }}>
              {templates.map((tm) => (
                <li key={tm.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium" style={{ color: ADM_TEXT }}>
                      {tm.titel}
                    </p>
                    {(tm.subject_nl || tm.subject_en) && (
                      <p className="text-sm mt-0.5" style={{ color: ADM_MUTED }}>
                        {tm.subject_nl || tm.subject_en}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/admin/nieuwsbrief/versturen?template=${tm.id}`}
                    className="text-sm font-medium"
                    style={{ color: ADM_ACCENT }}
                  >
                    {t("useToSend")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "verzonden" && (
        <section className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <div className="p-4 border-b" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
              {t("sentNewslettersTitle")}
            </h2>
            <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
              {t("sentNewslettersDescription")}
            </p>
          </div>
          {loadingSends ? (
            <div className="p-8 text-center" style={{ color: ADM_MUTED }}>
              {tAdmin("loading")}
            </div>
          ) : sends.length === 0 ? (
            <div className="p-8 text-center" style={{ color: ADM_MUTED }}>
              {t("noSends")}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: ADM_MUTED }}>
                      <th className="text-left p-3">{t("sentAt")}</th>
                      <th className="text-left p-3">{t("subject")}</th>
                      <th className="text-left p-3">{t("recipientCount")}</th>
                      <th className="text-left p-3">{t("status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sends.map((row) => (
                      <tr key={row.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                        <td className="p-3" style={{ color: ADM_TEXT }}>
                          {formatDate(row.sent_at)}
                        </td>
                        <td className="p-3" style={{ color: ADM_TEXT }}>
                          {subjectDisplay(row)}
                        </td>
                        <td className="p-3" style={{ color: ADM_TEXT }}>
                          {row.recipient_count} {t("recipients")}
                        </td>
                        <td className="p-3">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: row.status === "sent" ? "rgba(34,197,94,.15)" : row.status === "failed" ? "rgba(220,38,38,.15)" : "rgba(234,88,12,.15)",
                              color: row.status === "sent" ? "#16a34a" : row.status === "failed" ? "#dc2626" : "#ea580c",
                            }}
                          >
                            {statusLabel(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalSendsPages > 1 && (
                <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
                  <span className="text-sm" style={{ color: ADM_MUTED }}>
                    {sendsTotal} {t("sendsTotal")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={sendsPage <= 1}
                      onClick={() => setSendsPage((p) => p - 1)}
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                    >
                      ←
                    </button>
                    <span className="px-3 py-1 text-sm" style={{ color: ADM_TEXT }}>
                      {sendsPage} / {totalSendsPages}
                    </span>
                    <button
                      type="button"
                      disabled={sendsPage >= totalSendsPages}
                      onClick={() => setSendsPage((p) => p + 1)}
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {tab === "wachtrij" && (
        <section className="rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
            {t("queueTitle")}
          </h2>
          <p className="text-sm mt-2" style={{ color: ADM_MUTED }}>
            {t("queueDescription")}
          </p>
          <Link
            href="/admin/nieuwsbrief/versturen"
            className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: ADM_ACCENT }}
          >
            {t("compose")}
          </Link>
        </section>
      )}

      {tab === "handmatig" && (
        <section className="rounded-xl border p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
            {t("manualSendTitle")}
          </h2>
          <p className="text-sm mt-2" style={{ color: ADM_MUTED }}>
            {t("manualSendDescription")}
          </p>
          <Link
            href="/admin/nieuwsbrief/versturen"
            className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: ADM_ACCENT }}
          >
            {t("compose")}
          </Link>
        </section>
      )}
    </div>
  );
}
