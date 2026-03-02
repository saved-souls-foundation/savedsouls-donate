"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  PLATFORM_IDS,
  PLATFORM_CONFIG,
  POST_STATUS_CONFIG,
  rowToPost,
  type PlatformId,
  type ScheduledPost,
  type PostStatus,
} from "./platformConfig";
import PlatformIcon from "./PlatformIcon";
import { createClient } from "@/lib/supabase/client";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const TOAST_DURATION_MS = 4000;

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(s: string, len: number): string {
  if (s.length <= len) return s;
  return s.slice(0, len) + "…";
}

export default function SocialeMediaClient() {
  const t = useTranslations("admin.socialeMedia");
  const [activeTab, setActiveTab] = useState<"platforms" | "calendar">("platforms");
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [calendarPlatformFilter, setCalendarPlatformFilter] = useState<PlatformId | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scheduled-posts");
      if (!res.ok) throw new Error("Fetch failed");
      const { data } = await res.json();
      setPosts((data ?? []).map(rowToPost));
    } catch {
      setToast({ message: t("fetchError") });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("scheduled_posts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scheduled_posts" },
        () => { fetchPosts(); }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const showToast = useCallback((message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const postsByPlatform = useMemo(() => {
    const m: Record<PlatformId, ScheduledPost[]> = {} as Record<PlatformId, ScheduledPost[]>;
    PLATFORM_IDS.forEach((id) => (m[id] = []));
    posts.forEach((p) => m[p.platformId].push(p));
    PLATFORM_IDS.forEach((id) => m[id].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
    return m;
  }, [posts]);

  const postsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return posts.filter((p) => p.scheduledAt.startsWith(selectedDate));
  }, [posts, selectedDate]);

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const days: { date: string; day: number; isCurrentMonth: boolean; postCount: number }[] = [];
    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1);
      const dateStr = d.toISOString().slice(0, 10);
      const count = posts.filter((p) => p.scheduledAt.startsWith(dateStr)).length;
      days.push({ date: dateStr, day: d.getDate(), isCurrentMonth: false, postCount: count });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const count = posts.filter((p) => p.scheduledAt.startsWith(dateStr)).length;
      days.push({ date: dateStr, day: d, isCurrentMonth: true, postCount: count });
    }
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) {
      const d = new Date(year, month + 1, i + 1);
      const dateStr = d.toISOString().slice(0, 10);
      const count = posts.filter((p) => p.scheduledAt.startsWith(dateStr)).length;
      days.push({ date: dateStr, day: d.getDate(), isCurrentMonth: false, postCount: count });
    }
    return days.slice(0, 42);
  }, [calendarMonth, posts]);

  const connectedPlatforms = new Set<PlatformId>(); // placeholder: none connected

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in"
          style={{ background: ADM_ACCENT }}
          role="status"
        >
          {toast.message}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: ADM_BORDER }}>
        <h1 className="text-xl font-semibold" style={{ color: ADM_TEXT }}>
          {t("title")}
        </h1>
        <div className="flex gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab("platforms")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              background: activeTab === "platforms" ? "rgba(13,148,136,.15)" : "transparent",
              color: activeTab === "platforms" ? ADM_ACCENT : ADM_MUTED,
            }}
          >
            Platforms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              background: activeTab === "calendar" ? "rgba(13,148,136,.15)" : "transparent",
              color: activeTab === "calendar" ? ADM_ACCENT : ADM_MUTED,
            }}
          >
            📅 {t("contentCalendar")}
          </button>
        </div>
      </div>

      {activeTab === "platforms" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden flex flex-col"
                  style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
                >
                  <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: ADM_BORDER }}>
                    <div className="w-6 h-6 rounded bg-stone-200 animate-pulse" />
                    <div className="h-5 w-24 bg-stone-200 rounded animate-pulse" />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </>
          ) : (
          PLATFORM_IDS.map((platformId) => {
            const config = PLATFORM_CONFIG[platformId];
            const platformPosts = postsByPlatform[platformId];
            const isConnected = connectedPlatforms.has(platformId);
            return (
              <div
                key={platformId}
                className="rounded-xl border overflow-hidden flex flex-col"
                style={{
                  background: ADM_CARD,
                  borderColor: ADM_BORDER,
                  borderLeftWidth: "4px",
                  borderLeftColor: config.color,
                }}
              >
                <div className="p-4 border-b flex items-center justify-between gap-2" style={{ borderColor: ADM_BORDER }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ color: config.color }} className="flex-shrink-0">
                      <PlatformIcon platformId={platformId} />
                    </span>
                    <span className="font-semibold truncate" style={{ color: ADM_TEXT }}>
                      {config.name}
                    </span>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs px-2 py-0.5 rounded"
                    style={{
                      background: isConnected ? "rgba(42,157,143,.2)" : "rgba(233,196,106,.2)",
                      color: isConnected ? "#2A9D8F" : "#B45309",
                    }}
                  >
                    {isConnected ? "🟢 " + t("connected") : "🟡 " + t("notConnected")}
                  </span>
                </div>
                <div className="p-3 flex flex-wrap gap-2" style={{ borderColor: ADM_BORDER }}>
                  <button
                    type="button"
                    onClick={() => setComposeOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                    style={{ background: ADM_ACCENT }}
                  >
                    ✏️ {t("newPost")}
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                    style={{ background: ADM_BORDER, color: ADM_MUTED }}
                  >
                    🔗 {t("connectAccount")}
                  </button>
                </div>
                <div className="p-3 flex-1 min-h-0">
                  <p className="text-xs font-medium mb-2" style={{ color: ADM_MUTED }}>
                    Berichten
                  </p>
                  {platformPosts.length === 0 ? (
                    <p className="text-sm" style={{ color: ADM_MUTED }}>
                      {t("noPosts")}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {platformPosts.slice(0, 3).map((post) => {
                        const statusCfg = POST_STATUS_CONFIG[post.status];
                        return (
                          <li key={post.id}>
                            <button
                              type="button"
                              onClick={() => setEditingPost(post)}
                              className="w-full text-left p-2 rounded-lg border hover:bg-stone-50 transition-colors"
                              style={{ borderColor: ADM_BORDER }}
                            >
                              <p className="text-sm line-clamp-2" style={{ color: ADM_TEXT }}>
                                {truncate(post.text, 60)}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded"
                                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                                >
                                  {statusCfg.label}
                                </span>
                                <span className="text-xs" style={{ color: ADM_MUTED }}>
                                  {formatDateTime(post.scheduledAt)}
                                </span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {platformPosts.length > 3 && (
                    <button
                      type="button"
                      className="mt-2 text-sm font-medium"
                      style={{ color: ADM_ACCENT }}
                    >
                      {t("showAll")} →
                    </button>
                  )}
                </div>
                <div className="p-3 border-t text-xs" style={{ borderColor: ADM_BORDER, color: ADM_MUTED }}>
                  <p className="mb-1">📊 {t("statsPlaceholder")}</p>
                  <p>
                    {t("followers")}: — | {t("postsThisMonth")}: — | {t("reach")}: —
                  </p>
                </div>
              </div>
            );
          })
          )}
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div
            className="rounded-xl border p-4"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth((m) =>
                      m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }
                    )
                  }
                  className="p-2 rounded-lg border"
                  style={{ borderColor: ADM_BORDER }}
                >
                  ←
                </button>
                <span className="font-semibold py-2" style={{ color: ADM_TEXT }}>
                  {new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString("nl-NL", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth((m) =>
                      m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }
                    )
                  }
                  className="p-2 rounded-lg border"
                  style={{ borderColor: ADM_BORDER }}
                >
                  →
                </button>
              </div>
              <select
                value={calendarPlatformFilter}
                onChange={(e) => setCalendarPlatformFilter(e.target.value as PlatformId | "all")}
                className="text-sm rounded-lg border px-2 py-1.5"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                <option value="all">Alle platforms</option>
                {PLATFORM_IDS.map((id) => (
                  <option key={id} value={id}>
                    {PLATFORM_CONFIG[id].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs" style={{ color: ADM_MUTED }}>
              {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                <div key={day} className="py-1 font-medium">
                  {day}
                </div>
              ))}
              {calendarDays.map((cell) => {
                const isSelected = selectedDate === cell.date;
                const hasPosts = cell.postCount > 0;
                return (
                  <button
                    key={cell.date}
                    type="button"
                    onClick={() => setSelectedDate(cell.date)}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center text-sm"
                    style={{
                      background: isSelected ? "rgba(13,148,136,.2)" : "transparent",
                      color: cell.isCurrentMonth ? ADM_TEXT : ADM_MUTED,
                      opacity: cell.isCurrentMonth ? 1 : 0.5,
                    }}
                  >
                    <span>{cell.day}</span>
                    {hasPosts && (
                      <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: ADM_ACCENT }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {selectedDate && (
            <div
              className="rounded-xl border p-4"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              <h3 className="font-semibold mb-3" style={{ color: ADM_TEXT }}>
                {t("postsOnDate", {
                  date: new Date(selectedDate).toLocaleDateString("nl-NL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                })}
              </h3>
              {postsOnSelectedDate.length === 0 ? (
                <p className="text-sm" style={{ color: ADM_MUTED }}>
                  {t("noPosts")}
                </p>
              ) : (
                <ul className="space-y-2">
                  {postsOnSelectedDate.map((post) => {
                    const statusCfg = POST_STATUS_CONFIG[post.status];
                    const platformName = PLATFORM_CONFIG[post.platformId].name;
                    return (
                      <li key={post.id}>
                        <button
                          type="button"
                          onClick={() => setEditingPost(post)}
                          className="w-full text-left p-3 rounded-lg border"
                          style={{ borderColor: ADM_BORDER }}
                        >
                          <p className="text-sm" style={{ color: ADM_TEXT }}>
                            {truncate(post.text, 80)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs" style={{ color: ADM_MUTED }}>
                              {platformName}
                            </span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: statusCfg.bg, color: statusCfg.color }}
                            >
                              {statusCfg.label}
                            </span>
                            <span className="text-xs" style={{ color: ADM_MUTED }}>
                              {formatDateTime(post.scheduledAt)}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {composeOpen && (
        <ComposeModal
          onClose={() => setComposeOpen(false)}
          initialPost={null}
          t={t}
          onSaved={showToast}
          refreshPosts={fetchPosts}
        />
      )}
      {editingPost && (
        <ComposeModal
          onClose={() => setEditingPost(null)}
          initialPost={editingPost}
          t={t}
          onSaved={showToast}
          refreshPosts={fetchPosts}
        />
      )}
    </div>
  );
}

function ComposeModal({
  onClose,
  initialPost,
  t,
  onSaved,
  refreshPosts,
}: {
  onClose: () => void;
  initialPost: ScheduledPost | null;
  t: (key: string) => string;
  onSaved: (message: string) => void;
  refreshPosts: () => Promise<void>;
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformId>>(
    initialPost ? new Set([initialPost.platformId]) : new Set()
  );
  const [text, setText] = useState(initialPost?.text ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    initialPost?.scheduledAt
      ? new Date(initialPost.scheduledAt).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [campaignLabel, setCampaignLabel] = useState(initialPost?.campaignLabel ?? "");
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialPost?.mediaUrls ?? []);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEdit = !!initialPost;

  const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
  const MAX_FILE_MB = 50;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    if (!ALLOWED_MIMES.includes(file.type)) {
      onSaved("Alleen jpg, png, gif, mp4, mov toegestaan.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      onSaved(`Bestand te groot (max ${MAX_FILE_MB} MB).`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/social-media/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt");
      setMediaUrls((prev) => [...prev, data.url]);
    } catch (e) {
      onSaved(e instanceof Error ? e.message : "Upload mislukt");
    } finally {
      setUploading(false);
    }
  }

  const maxChars = useMemo(() => {
    if (selectedPlatforms.size === 0) return 63206;
    return Math.min(...Array.from(selectedPlatforms).map((id) => PLATFORM_CONFIG[id].charLimit));
  }, [selectedPlatforms]);

  const isOverLimit = text.length > maxChars;

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function saveDraft() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/admin/scheduled-posts/${initialPost!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text.trim(),
            campaign_label: campaignLabel.trim() || null,
            media_urls: mediaUrls,
            status: "concept",
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        onSaved("Concept opgeslagen");
      } else {
        const platforms = Array.from(selectedPlatforms);
        if (platforms.length === 0) return;
        const res = await fetch("/api/admin/scheduled-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text.trim(),
            platforms,
            campaign_label: campaignLabel.trim() || null,
            media_urls: mediaUrls,
            status: "concept",
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        onSaved("Concept opgeslagen");
      }
      await refreshPosts();
      onClose();
    } catch (e) {
      onSaved(e instanceof Error ? e.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function schedule() {
    if (!text.trim()) return;
    const platforms = Array.from(selectedPlatforms);
    if (!isEdit && platforms.length === 0) return;
    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/admin/scheduled-posts/${initialPost!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text.trim(),
            campaign_label: campaignLabel.trim() || null,
            media_urls: mediaUrls,
            scheduled_at: new Date(scheduledAt).toISOString(),
            status: "gepland",
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        onSaved("Bericht ingepland");
      } else {
        const res = await fetch("/api/admin/scheduled-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text.trim(),
            platforms,
            campaign_label: campaignLabel.trim() || null,
            media_urls: mediaUrls,
            scheduled_at: new Date(scheduledAt).toISOString(),
            status: "gepland",
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        onSaved("Bericht ingepland");
      }
      await refreshPosts();
      onClose();
    } catch (e) {
      onSaved(e instanceof Error ? e.message : "Inplannen mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!isEdit || !initialPost) return;
    if (!confirm("Bericht verwijderen?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/scheduled-posts/${initialPost.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      onSaved("Bericht verwijderd");
      await refreshPosts();
      onClose();
    } catch (e) {
      onSaved(e instanceof Error ? e.message : "Verwijderen mislukt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-y-auto rounded-none md:rounded-xl border-0 md:border flex flex-col absolute inset-0 md:relative md:max-h-[90vh]"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
          <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
            {initialPost ? "Bewerk bericht" : "Nieuw bericht"}
          </h2>
          <button type="button" onClick={onClose} className="text-xl leading-none" style={{ color: ADM_MUTED }}>
            ×
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: ADM_TEXT }}>
              {t("platforms")}
            </p>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_IDS.map((id) => {
                const config = PLATFORM_CONFIG[id];
                const checked = selectedPlatforms.has(id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer"
                    style={{
                      borderColor: checked ? config.color : ADM_BORDER,
                      background: checked ? `${config.color}15` : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlatform(id)}
                      className="sr-only"
                    />
                    <span style={{ color: config.color }}>
                      <PlatformIcon platformId={id} />
                    </span>
                    <span className="text-sm" style={{ color: ADM_TEXT }}>
                      {config.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium" style={{ color: ADM_TEXT }}>
                Berichttekst
              </label>
              <span
                className="text-xs"
                style={{ color: isOverLimit ? "#dc2626" : ADM_MUTED }}
              >
                {text.length} / {maxChars.toLocaleString()}
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none resize-y"
              style={{
                borderColor: isOverLimit ? "#dc2626" : ADM_BORDER,
                color: ADM_TEXT,
              }}
              placeholder="Typ je bericht… (bij # verschijnen hashtag-suggesties)"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: ADM_TEXT }}>
              {t("uploadMedia")}
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
              className="hidden"
              id="social-media-file"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${dragOver ? "opacity-80" : ""} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
              style={{
                borderColor: ADM_BORDER,
                background: dragOver ? "rgba(13,148,136,.05)" : "transparent",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById("social-media-file")?.click()}
            >
              <p className="text-sm" style={{ color: ADM_MUTED }}>
                📷 {uploading ? "Uploaden…" : "Sleep bestand hierheen of klik (max 50 MB, jpg, png, gif, mp4, mov)"}
              </p>
            </div>
            {mediaUrls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {mediaUrls.map((url) => (
                  <div
                    key={url}
                    className="relative rounded-lg overflow-hidden border flex-shrink-0"
                    style={{ borderColor: ADM_BORDER, width: 80, height: 80 }}
                  >
                    {/\.(jpg|jpeg|png|gif)(\?|$)/i.test(url) ? (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100" style={{ color: ADM_MUTED }}>
                        <span className="text-2xl">🎬</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMediaUrls((prev) => prev.filter((u) => u !== url));
                      }}
                      className="absolute top-0.5 right-0.5 w-6 h-6 rounded-full bg-red-500 text-white text-sm leading-none flex items-center justify-center hover:bg-red-600"
                      aria-label="Verwijderen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: ADM_TEXT }}>
              {t("scheduleDateTime")}
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: ADM_MUTED }}>
              {t("campaignLabel")} (optioneel)
            </label>
            <input
              type="text"
              value={campaignLabel}
              onChange={(e) => setCampaignLabel(e.target.value)}
              placeholder="bijv. Voorjaar 2025"
              className="w-full px-3 py-2 rounded-lg border bg-transparent"
              style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
            />
          </div>
        </div>
        <div className="p-4 border-t flex flex-wrap gap-2 justify-end" style={{ borderColor: ADM_BORDER }}>
          {isEdit && (
            <button
              type="button"
              onClick={deletePost}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 disabled:opacity-50"
            >
              Verwijderen
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: ADM_BORDER, color: ADM_TEXT }}
          >
            ❌ {t("cancel")}
          </button>
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "rgba(233,196,106,.3)", color: "#B45309" }}
          >
            💾 {t("saveDraft")}
          </button>
          <button
            type="button"
            onClick={schedule}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: ADM_ACCENT }}
          >
            📅 {t("schedule")}
          </button>
        </div>
      </div>
    </div>
  );
}
