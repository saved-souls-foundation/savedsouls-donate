"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const PAGE_SIZE = 20;

type SentRow = {
  id: string;
  type: string;
  to_email: string;
  subject: string;
  body_preview: string | null;
  sent_at: string;
  reference_id: string | null;
  meta: Record<string, unknown> | null;
};

export default function AdminSentEmailsClient() {
  const t = useTranslations("admin.emails");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const [typeFilter, setTypeFilter] = useState(() =>
    typeFromUrl === "email_assistant" || typeFromUrl === "step_notify" ? typeFromUrl : "all"
  );
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const res = await fetch(`/api/admin/sent-emails?${params}`);
    if (!res.ok) {
      setData([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const json = await res.json();
    setData(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [typeFilter, page]);

  useEffect(() => {
    if (typeFromUrl === "email_assistant" || typeFromUrl === "step_notify") {
      setTypeFilter(typeFromUrl);
      setPage(1);
    }
  }, [typeFromUrl]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function formatDate(d: string) {
    return locale === "en"
      ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : new Date(d).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function typeLabel(ty: string) {
    if (ty === "step_notify") return t("typeStepNotify");
    if (ty === "email_assistant") return t("typeEmailAssistant");
    return ty;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>{t("sentEmailsTitle")}</h1>
        <Link href="/admin/emails" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>← {t("backToList")}</Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border bg-transparent outline-none"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        >
          <option value="all">{t("all")}</option>
          <option value="step_notify">{t("typeStepNotify")}</option>
          <option value="email_assistant">{t("typeEmailAssistant")}</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: ADM_MUTED }}>
                <th className="text-left p-3">{t("sentAt")}</th>
                <th className="text-left p-3">{t("to")}</th>
                <th className="text-left p-3">{t("subject")}</th>
                <th className="text-left p-3">{t("typeColumn")}</th>
                <th className="text-left p-3">{t("bodyPreview")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("loading")}</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center" style={{ color: ADM_MUTED }}>{t("noSentEmails")}</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3 whitespace-nowrap" style={{ color: ADM_MUTED }}>{formatDate(row.sent_at)}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{row.to_email}</td>
                    <td className="p-3 max-w-[200px] truncate" style={{ color: ADM_TEXT }} title={row.subject}>{row.subject}</td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>{typeLabel(row.type)}</td>
                    <td className="p-3 max-w-[280px] truncate" style={{ color: ADM_MUTED }} title={row.body_preview ?? ""}>{row.body_preview ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
            <span className="text-sm" style={{ color: ADM_MUTED }}>{total}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>←</button>
              <span className="px-3 py-1 text-sm" style={{ color: ADM_TEXT }}>{page} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50" style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
