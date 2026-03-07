"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

type AiStats = {
  spotlightToday: number;
  emailsToday: number;
  blogThisWeek: number;
  costThisMonth: number;
  recentActivity: {
    id: string;
    model: string;
    input_tokens: number;
    output_tokens: number;
    task: string | null;
    estimated_cost_usd: number | null;
    created_at: string;
  }[];
  spotlightPosts: {
    id: string;
    titel: string | null;
    status: string | null;
    gepubliceerd_op: string | null;
    hero_image: string | null;
    slug: string | null;
  }[];
  blogConcepts: {
    id: string;
    titel: string | null;
    inhoud: string | null;
    created_at: string | null;
  }[];
};

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-6 w-32 bg-gray-200 rounded" />
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "zojuist";
  if (mins < 60) return `${mins} min geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} uur geleden`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "gisteren";
  if (days < 7) return `${days} dagen geleden`;
  return `${Math.floor(days / 7)} weken geleden`;
}

function taskIcon(task: string | null): string {
  if (!task) return "📋";
  const t = task.toLowerCase();
  if (t.includes("email") || t.includes("reply") || t.includes("classify")) return "📧";
  if (t.includes("blog") || t.includes("spotlight")) return "📝";
  if (t.includes("test-spotlight") || t.includes("spotlight")) return "🐾";
  if (t.includes("social")) return "📱";
  return "📋";
}

export default function DashboardAiPage() {
  const locale = useLocale();
  const [data, setData] = useState<AiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotlightStopping, setSpotlightStopping] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSectionErrors({});
    try {
      const res = await fetch("/api/dashboard/ai-stats", { credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? res.statusText);
        setData(null);
        return;
      }
      const json: AiStats = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fout bij ophalen");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function handleStopSpotlight() {
    setSpotlightStopping(true);
    try {
      const res = await fetch("/api/ai/test-spotlight/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: "{}",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error ?? res.statusText);
      await fetchStats();
    } catch (e) {
      setSectionErrors((prev) => ({ ...prev, spotlight: e instanceof Error ? e.message : "Fout" }));
    } finally {
      setSpotlightStopping(false);
    }
  }

  async function setPostStatus(postId: string, status: "concept" | "published") {
    const key = `post-${postId}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setSectionErrors((prev) => ({ ...prev, spotlight: "", concepts: "" }));
    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          ...(status === "published" && { gepubliceerd_op: new Date().toISOString() }),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? res.statusText);
      }
      await fetchStats();
    } catch (e) {
      setSectionErrors((prev) => ({
        ...prev,
        [status === "published" ? "concepts" : "spotlight"]: e instanceof Error ? e.message : "Fout",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function deletePost(postId: string) {
    const key = `del-${postId}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setSectionErrors((prev) => ({ ...prev, concepts: "" }));
    try {
      const res = await fetch(`/api/blog/${postId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? res.statusText);
      }
      await fetchStats();
    } catch (e) {
      setSectionErrors((prev) => ({ ...prev, concepts: e instanceof Error ? e.message : "Fout" }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  const base = `/${locale}`;
  const isAdmin = true; // page is only linked from admin; API returns 403 if not admin

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {isAdmin && (
            <Link
              href={`${base}/admin/dashboard`}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 py-2 min-h-[44px] flex items-center"
            >
              ← Terug naar admin
            </Link>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span aria-hidden>✨</span> AI Dashboard
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchStats}
              className="mt-2 py-2 px-4 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-medium min-h-[44px]"
            >
              Probeer opnieuw
            </button>
          </div>
        )}

        {/* Sectie 1: Statuskaarten */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Live status
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link
                href={`/${locale}/dashboard/ai#spotlight-beheer`}
                className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 min-h-[44px] flex flex-col cursor-pointer hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-stone-700">Adoptie Spotlight</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: data.spotlightToday > 0 ? "#22c55e" : "#94a3b8" }}
                    aria-hidden
                  />
                </div>
                <p className="text-sm text-stone-900">
                  {data.spotlightToday} {data.spotlightToday === 1 ? "post" : "posts"} vandaag geplaatst
                </p>
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStopSpotlight();
                    }}
                    disabled={spotlightStopping}
                    className="text-sm font-medium py-3 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 min-h-[44px] disabled:opacity-50"
                  >
                    {spotlightStopping ? "Bezig…" : "Stop 24h test"}
                  </button>
                </div>
                {sectionErrors.spotlight && (
                  <p className="text-xs text-red-600 mt-1">{sectionErrors.spotlight}</p>
                )}
              </Link>

              <Link
                href={`/${locale}/admin/emails`}
                className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 min-h-[44px] flex flex-col cursor-pointer hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-stone-700">Auto Email</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: data.emailsToday > 0 ? "#22c55e" : "#94a3b8" }}
                    aria-hidden
                  />
                </div>
                <p className="text-sm text-stone-900">
                  {data.emailsToday} {data.emailsToday === 1 ? "mail" : "mails"} beantwoord vandaag
                </p>
              </Link>

              <Link
                href={`/${locale}/admin/sociale-media`}
                className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 min-h-[44px] flex flex-col cursor-pointer hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-stone-700">Blog Generator</span>
                </div>
                <p className="text-sm text-stone-900">
                  {data.blogThisWeek} {data.blogThisWeek === 1 ? "post" : "posts"} deze week
                </p>
              </Link>

              <Link
                href={`/${locale}/dashboard/ai#recente-activiteit`}
                className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 min-h-[44px] flex flex-col cursor-pointer hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-stone-700">AI Kosten</span>
                </div>
                <p className="text-sm text-stone-900">
                  € {data.costThisMonth.toFixed(2)} deze maand
                </p>
              </Link>
            </div>
          ) : null}
        </section>

        {/* Sectie 2: Recente activiteit */}
        <section id="recente-activiteit" className="mb-8 scroll-mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Recente AI-activiteit
          </h2>
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                {data.recentActivity.length === 0 ? (
                  <p className="p-4 text-sm text-stone-500">Geen recente activiteit</p>
                ) : (
                  <ul className="divide-y divide-gray-100 min-w-[280px]">
                    {data.recentActivity.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 px-4 py-3 text-sm"
                      >
                        <span className="text-lg shrink-0" aria-hidden>
                          {taskIcon(a.task)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-stone-900 truncate">
                            {a.task ?? a.model}
                          </p>
                          <p className="text-stone-500 text-xs">
                            {a.input_tokens + a.output_tokens} tokens · {timeAgo(a.created_at)}
                            {a.estimated_cost_usd != null && (
                              <> · € {a.estimated_cost_usd.toFixed(4)}</>
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {/* Sectie 3: Spotlight beheer */}
        <section id="spotlight-beheer" className="mb-8 scroll-mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Spotlight beheer
          </h2>
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {data.spotlightPosts.length === 0 ? (
                <p className="p-4 text-sm text-stone-500">Geen spotlight posts</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.spotlightPosts.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                        {p.hero_image ? (
                          <img
                            src={p.hero_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-stone-400 text-lg">🐾</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {p.titel ?? "—"}
                        </p>
                        <p className="text-xs text-stone-500">
                          {p.gepubliceerd_op ? timeAgo(p.gepubliceerd_op) : "—"}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                        style={{
                          background: p.status === "published" ? "#dcfce7" : "#f1f5f9",
                          color: p.status === "published" ? "#166534" : "#475569",
                        }}
                      >
                        {p.status === "published" ? "Gepubliceerd" : "Concept"}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.status === "published" && (
                          <button
                            type="button"
                            onClick={() => setPostStatus(p.id, "concept")}
                            disabled={actionLoading[`post-${p.id}`]}
                            className="text-sm py-3 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 min-h-[44px] disabled:opacity-50"
                          >
                            Verberg
                          </button>
                        )}
                        {p.slug && (
                          <Link
                            href={`${base}/blog/${p.slug}`}
                            className="text-sm font-medium py-3 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 min-h-[44px] flex items-center"
                          >
                            Bekijk
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {sectionErrors.spotlight && (
                <p className="px-4 py-2 text-xs text-red-600">{sectionErrors.spotlight}</p>
              )}
            </div>
          ) : null}
        </section>

        {/* Sectie 4: Wachtrij blog concepten */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Wachtrij – Blog concepten
          </h2>
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {data.blogConcepts.length === 0 ? (
                <p className="p-4 text-sm text-stone-600">Geen concepten in wachtrij ✓</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.blogConcepts.map((c) => {
                    const excerpt =
                      c.inhoud?.replace(/<[^>]+>/g, " ").slice(0, 100).trim() ?? "";
                    return (
                      <li key={c.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-900 truncate">
                            {c.titel ?? "—"}
                          </p>
                          <p className="text-xs text-stone-500 line-clamp-2">
                            {excerpt}
                            {excerpt.length >= 100 ? "…" : ""}
                          </p>
                          {c.created_at && (
                            <p className="text-xs text-stone-400 mt-0.5">
                              {new Date(c.created_at).toLocaleDateString(locale)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPostStatus(c.id, "published")}
                            disabled={actionLoading[`post-${c.id}`]}
                            className="text-sm font-medium py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white min-h-[44px] disabled:opacity-50"
                          >
                            Publiceer
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePost(c.id)}
                            disabled={actionLoading[`del-${c.id}`]}
                            className="text-sm font-medium py-3 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 min-h-[44px] disabled:opacity-50"
                          >
                            Verwijder
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {sectionErrors.concepts && (
                <p className="px-4 py-2 text-xs text-red-600">{sectionErrors.concepts}</p>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
