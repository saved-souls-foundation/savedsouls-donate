"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_RED = "#dc2626";
const CATEGORY_ICONS: Record<string, string> = {
  adoptie: "🐕",
  vrijwilliger: "🙋",
  donatie: "💝",
  sponsor: "🤝",
  algemeen: "📧",
};
const CATEGORY_COLORS: Record<string, string> = {
  adoptie: "#16a34a",
  vrijwilliger: "#2563eb",
  donatie: "#ea580c",
  sponsor: "#7c3aed",
  algemeen: "#64748b",
};

const CATEGORIES = ["adoptie", "vrijwilliger", "donatie", "sponsor", "algemeen"] as const;

type Template = {
  id: string;
  naam: string | null;
  categorie: string | null;
  actief: boolean;
  inhoud_nl?: string | null;
  usage_count?: number;
};

export default function AdminEmailTemplatesClient() {
  const t = useTranslations("admin.emails");
  const [list, setList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/email-templates");
    const data = await (res.ok ? res.json() : []);
    setList(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filtered = list.filter((tm) => {
    if (categoryFilter !== "all" && (tm.categorie ?? "") !== categoryFilter) return false;
    const naam = (tm.naam ?? "").toLowerCase();
    if (search.trim() && !naam.includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const countByCategory = list.reduce<Record<string, number>>((acc, tm) => {
    const c = tm.categorie ?? "algemeen";
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  async function toggleActief(tm: Template) {
    setTogglingId(tm.id);
    try {
      const res = await fetch(`/api/admin/email-templates/${tm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actief: !tm.actief }),
      });
      if (res.ok) {
        const updated = await res.json();
        setList((prev) => prev.map((x) => (x.id === tm.id ? { ...x, actief: updated.actief } : x)));
      }
    } finally {
      setTogglingId(null);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((t) => t.id)));
  }

  async function bulkSetActief(actief: boolean) {
    if (selectedIds.size === 0) return;
    setBulkSaving(true);
    try {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        const tm = list.find((x) => x.id === id);
        if (tm && tm.actief !== actief) {
          await fetch(`/api/admin/email-templates/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ actief }),
          });
        }
      }
      await fetchList();
      setSelectedIds(new Set());
    } finally {
      setBulkSaving(false);
    }
  }

  const categoryKeys: Record<string, string> = {
    adoptie: t("categories.adoptie"),
    vrijwilliger: t("categories.vrijwilliger"),
    donatie: t("categories.donatie"),
    sponsor: t("categories.sponsor"),
    algemeen: t("categories.algemeen"),
  };

  function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/admin/emails" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("templatesTitle")}
        </h1>
        <Link
          href="/admin/emails/templates/nieuw"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: ADM_ACCENT }}
        >
          {t("newTemplate")}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border"
          style={{
            borderColor: categoryFilter === "all" ? ADM_ACCENT : ADM_BORDER,
            color: categoryFilter === "all" ? ADM_ACCENT : ADM_TEXT,
            background: categoryFilter === "all" ? "rgba(13,148,136,.1)" : "transparent",
          }}
        >
          {t("filterAll")} ({list.length})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(c)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: categoryFilter === c ? CATEGORY_COLORS[c] : ADM_BORDER,
              color: categoryFilter === c ? CATEGORY_COLORS[c] : ADM_TEXT,
              background: categoryFilter === c ? `${CATEGORY_COLORS[c]}20` : "transparent",
            }}
          >
            {categoryKeys[c] ?? c} ({countByCategory[c] ?? 0})
          </button>
        ))}
        <input
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] max-w-xs px-4 py-2 rounded-lg border bg-transparent outline-none text-sm"
          style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
          <span className="text-sm" style={{ color: ADM_MUTED }}>
            {selectedIds.size} {t("filterAll")}
          </span>
          <button
            type="button"
            onClick={() => bulkSetActief(true)}
            disabled={bulkSaving}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: ADM_ACCENT }}
          >
            {t("bulkActivate")}
          </button>
          <button
            type="button"
            onClick={() => bulkSetActief(false)}
            disabled={bulkSaving}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
          >
            {t("bulkDeactivate")}
          </button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="text-sm" style={{ color: ADM_MUTED }}>
            {t("cancel")}
          </button>
        </div>
      )}

      {loading ? (
        <p className="p-6" style={{ color: ADM_MUTED }}>
          {t("loading")}
        </p>
      ) : filtered.length === 0 ? (
        <p className="p-6 rounded-xl border text-center" style={{ background: ADM_CARD, borderColor: ADM_BORDER, color: ADM_MUTED }}>
          {t("noTemplates")}
        </p>
      ) : (
        <>
          <p className="text-sm" style={{ color: ADM_MUTED }}>
            {t("templateCount", { count: filtered.length })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tm) => {
              const cat = (tm.categorie ?? "algemeen") as keyof typeof CATEGORY_ICONS;
              const icon = CATEGORY_ICONS[cat] ?? "📧";
              const color = CATEGORY_COLORS[cat] ?? ADM_MUTED;
              const preview = stripHtml(tm.inhoud_nl ?? "").slice(0, 100);
              return (
                <div
                  key={tm.id}
                  className="rounded-xl border p-4 flex flex-col"
                  style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tm.id)}
                      onChange={() => toggleSelect(tm.id)}
                      className="mt-1"
                    />
                    <span className="text-2xl" aria-hidden>
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-base truncate" style={{ color: ADM_TEXT }}>
                        {tm.naam ?? tm.id}
                      </h2>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: `${color}20`, color }}
                      >
                        {categoryKeys[cat] ?? tm.categorie}
                      </span>
                    </div>
                  </div>
                  {preview && (
                    <p className="text-sm mt-2 line-clamp-2 flex-1" style={{ color: ADM_MUTED }}>
                      {preview}
                      {(tm.inhoud_nl ?? "").length > 100 ? "…" : ""}
                    </p>
                  )}
                  {tm.usage_count != null && tm.usage_count > 0 && (
                    <p className="text-xs mt-2" style={{ color: ADM_MUTED }}>
                      {t("usageCount", { count: tm.usage_count })}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t" style={{ borderColor: ADM_BORDER }}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tm.actief}
                        disabled={togglingId === tm.id}
                        onChange={() => toggleActief(tm)}
                        className="rounded"
                      />
                      <span className="text-sm" style={{ color: ADM_TEXT }}>
                        {tm.actief ? t("active") : t("inactive")}
                      </span>
                    </label>
                    <Link
                      href={`/admin/emails/templates/${tm.id}`}
                      className="text-sm font-medium"
                      style={{ color: ADM_ACCENT }}
                    >
                      {t("editTemplate")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
