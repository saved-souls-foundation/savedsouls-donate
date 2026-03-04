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
import { StatusBadge, QuickActions, EmptyState } from "../components/ui/design-system";

const PLATFORMS_COMPOSE = [
  { id: "facebook", name: "Facebook", icon: "📘", color: "#1877f2" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "#e1306c" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "#000000" },
  { id: "blog", name: "Website Blog", icon: "📝", color: "#2aa348" },
] as const;

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

type TabId = "compose" | "platforms" | "calendar" | "blog";

interface BlogPost {
  id: string;
  title: string | null;
  body: string | null;
  body_en: string | null;
  body_th: string | null;
  status: string | null;
  category: string | null;
  source: string | null;
  slug: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  facebook_post_id: string | null;
}

export default function SocialeMediaClient() {
  const t = useTranslations("admin.socialeMedia");
  const [activeTab, setActiveTab] = useState<TabId>("compose");
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

  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    tiktok: false,
    blog: true,
  });
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiWriting, setAiWriting] = useState(false);
  const [postLang, setPostLang] = useState<"nl" | "en" | "th">("nl");

  const [calendarWeek, setCalendarWeek] = useState(new Date());

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogView, setBlogView] = useState<"list" | "editor">("list");
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const [blogBodyEn, setBlogBodyEn] = useState("");
  const [blogBodyTh, setBlogBodyTh] = useState("");
  const [blogCategory, setBlogCategory] = useState("nieuws");
  const [blogStatus, setBlogStatus] = useState("concept");
  const [blogLang, setBlogLang] = useState<"nl" | "en" | "th">("nl");
  const [blogAiPrompt, setBlogAiPrompt] = useState("");
  const [blogAiWriting, setBlogAiWriting] = useState(false);
  const [blogAiTranslating, setBlogAiTranslating] = useState(false);

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

  function getWeekDays(date: Date) {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  async function loadBlogPosts() {
    setBlogLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setBlogPosts(data.posts ?? []);
    } catch (e) {
      console.error("Blog load error:", e);
    } finally {
      setBlogLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "blog") loadBlogPosts();
  }, [activeTab]);

  async function handleAiWrite() {
    if (!aiPrompt) return;
    setAiWriting(true);
    try {
      const res = await fetch("/api/ai/write-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          language: postLang,
          platforms: Object.keys(selectedPlatforms).filter((k) =>
            selectedPlatforms[k as keyof typeof selectedPlatforms]
          ),
        }),
      });
      const data = await res.json();
      setPostText(data.text ?? "");
    } catch (e) {
      console.error("AI write error:", e);
    } finally {
      setAiWriting(false);
    }
  }

  async function handlePublish() {
    const activePlatforms = Object.keys(selectedPlatforms).filter((k) =>
      selectedPlatforms[k as keyof typeof selectedPlatforms]
    );
    if (activePlatforms.includes("blog")) {
      try {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: postText.slice(0, 60) + (postText.length > 60 ? "..." : ""),
            body: postText,
            status: scheduleMode === "now" ? "published" : "scheduled",
            source: "manual",
            published_at:
              scheduleMode === "now" ? new Date().toISOString() : scheduleDate || new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } catch (e) {
        console.error("Blog publish error:", e);
      }
    }
    showToast(
      `Bericht ${scheduleMode === "now" ? "gepubliceerd" : "ingepland"}! ${activePlatforms.join(", ")}`
    );
    setPostText("");
    setPostImage(null);
    setAiPrompt("");
  }

  async function handleBlogAiWrite() {
    if (!blogAiPrompt) return;
    setBlogAiWriting(true);
    try {
      const res = await fetch("/api/ai/write-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: blogAiPrompt,
          language: blogLang,
          platforms: ["blog"],
        }),
      });
      const data = await res.json();
      const text = data.text ?? "";
      if (blogLang === "nl") setBlogBody(text);
      else if (blogLang === "en") setBlogBodyEn(text);
      else setBlogBodyTh(text);
    } catch (e) {
      console.error("Blog AI write error:", e);
    } finally {
      setBlogAiWriting(false);
    }
  }

  async function handleBlogTranslate() {
    if (!blogBody) return;
    setBlogAiTranslating(true);
    try {
      const [enRes, thRes] = await Promise.all([
        fetch("/api/ai/write-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Vertaal deze tekst naar vloeiend Engels. Behoud de emotionele toon en structuur. Tekst: ${blogBody}`,
            language: "en",
            platforms: ["blog"],
          }),
        }),
        fetch("/api/ai/write-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Vertaal deze tekst naar vloeiend Thai. Behoud de emotionele toon en structuur. Tekst: ${blogBody}`,
            language: "th",
            platforms: ["blog"],
          }),
        }),
      ]);
      const [enData, thData] = await Promise.all([enRes.json(), thRes.json()]);
      setBlogBodyEn(enData.text ?? "");
      setBlogBodyTh(thData.text ?? "");
      showToast("Vertaling naar Engels en Thai voltooid.");
    } catch (e) {
      console.error("Translate error:", e);
    } finally {
      setBlogAiTranslating(false);
    }
  }

  async function handleBlogSave() {
    const payload = {
      title: blogTitle,
      body: blogBody,
      body_en: blogBodyEn || null,
      body_th: blogBodyTh || null,
      category: blogCategory,
      status: blogStatus,
      source: "manual",
      slug: blogTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60),
      published_at: blogStatus === "published" ? new Date().toISOString() : null,
    };
    try {
      const url = editingBlogPost ? `/api/blog/${editingBlogPost.id}` : "/api/blog";
      const method = editingBlogPost ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast("Bericht opgeslagen!");
        setBlogView("list");
        loadBlogPosts();
      }
    } catch (e) {
      console.error("Blog save error:", e);
    }
  }

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
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {(
          [
            { id: "compose", label: "✍️ Nieuw bericht" },
            { id: "platforms", label: "📱 Platforms" },
            { id: "calendar", label: "📅 Contentkalender" },
            { id: "blog", label: "📝 Blog" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-[#2aa348] text-[#2aa348]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "compose" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 mb-5">
            {PLATFORMS_COMPOSE.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setSelectedPlatforms((prev) => ({
                    ...prev,
                    [p.id]: !prev[p.id as keyof typeof prev],
                  }))
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-semibold ${
                  selectedPlatforms[p.id as keyof typeof selectedPlatforms]
                    ? "text-white"
                    : "border-gray-200 text-gray-400 hover:border-gray-300 bg-white"
                }`}
                style={
                  selectedPlatforms[p.id as keyof typeof selectedPlatforms]
                    ? { borderColor: p.color, backgroundColor: p.color }
                    : {}
                }
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                {selectedPlatforms[p.id as keyof typeof selectedPlatforms] && <span>✓</span>}
              </button>
            ))}
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-[#2aa348]/20 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span>✨</span>
              <span className="text-sm font-bold text-gray-700">AI Schrijfassistent</span>
              <span className="text-xs text-gray-400">powered by Claude</span>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='Bijv: "Adoptieverhaal Luna, herder mix 3 jaar, gevonden Chiang Mai"'
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348] bg-white"
              />
              <div className="flex gap-1">
                {(["nl", "en", "th"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPostLang(lang)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold uppercase ${
                      postLang === lang ? "bg-[#2aa348] text-white" : "bg-white border border-gray-200 text-gray-500"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                {
                  label: "🐾 Adoptieverhaal",
                  prompt:
                    "Schrijf een emotioneel adoptieverhaal over een hond die een thuis gevonden heeft",
                },
                {
                  label: "📢 Doneeroproep",
                  prompt: "Schrijf een urgente maar positieve doneeroproep voor de shelter",
                },
                {
                  label: "🎉 Succesnieuws",
                  prompt: "Schrijf een vrolijk succesbericht over een geslaagde adoptie",
                },
                {
                  label: "🏠 Zoekt thuis",
                  prompt: "Schrijf een bericht voor een hond die dringend een thuis zoekt",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setAiPrompt(item.prompt)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-[#2aa348] hover:text-[#2aa348] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAiWrite}
              disabled={!aiPrompt || aiWriting}
              className="w-full py-2 rounded-lg bg-[#2aa348] text-white text-sm font-semibold hover:bg-[#166534] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {aiWriting ? "⏳ Schrijven..." : "✨ Schrijf bericht met AI"}
            </button>
          </div>
          <div className="relative">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Schrijf je bericht, of laat AI het schrijven..."
              className="w-full h-40 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348]"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">{postText.length} tekens</div>
          </div>
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              id="post-image"
              className="hidden"
              onChange={(e) => setPostImage(e.target.files?.[0] ?? null)}
            />
            <label
              htmlFor="post-image"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-[#2aa348] hover:text-[#2aa348] cursor-pointer transition-colors w-fit"
            >
              📎 {postImage ? postImage.name : "Afbeelding toevoegen"}
            </label>
            {postImage && (
              <button
                type="button"
                onClick={() => setPostImage(null)}
                className="ml-2 text-xs text-red-400 hover:text-red-600"
              >
                ✕ verwijderen
              </button>
            )}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={scheduleMode === "now"}
                  onChange={() => setScheduleMode("now")}
                  className="accent-[#2aa348]"
                />
                <span className="text-sm font-medium text-gray-700">Nu publiceren</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={scheduleMode === "later"}
                  onChange={() => setScheduleMode("later")}
                  className="accent-[#2aa348]"
                />
                <span className="text-sm font-medium text-gray-700">Inplannen</span>
              </label>
            </div>
            {scheduleMode === "later" && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
            >
              👁️ Preview
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                💾 Concept opslaan
              </button>
              <button
                type="button"
                disabled={!postText.trim()}
                onClick={handlePublish}
                className="px-6 py-2 rounded-xl bg-[#2aa348] text-white text-sm font-bold hover:bg-[#166534] transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                🚀 {scheduleMode === "now" ? "Publiceer nu" : "Inplannen"}{" "}
                <span className="text-xs opacity-75">
                  ({Object.values(selectedPlatforms).filter(Boolean).length} platforms)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "platforms" && (
        <>
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
                  <StatusBadge
                    label={isConnected ? "Verbonden" : "Niet verbonden"}
                    type={isConnected ? "success" : "warning"}
                  />
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
                  <p className="mb-1">👥 – volgers · 📅 Laatste post: – · 📊 Bereik: –</p>
                </div>
              </div>
            );
          })
          )}
        </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-sm text-blue-800 mb-2">
            📘 Facebook → Blog Synchronisatie
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-blue-700 font-medium">
              Webhook status: Niet geconfigureerd
            </span>
          </div>
          <p className="text-xs text-blue-600 mb-3">
            Wanneer je een bericht op Facebook plaatst, verschijnt het automatisch op de website
            blog. Hiervoor heb je een Facebook App nodig (gratis via developers.facebook.com).
          </p>
          <div className="bg-white rounded-lg p-3 text-xs font-mono text-gray-600 border border-blue-200 break-all">
            Webhook URL: {typeof window !== "undefined" ? window.location.origin : ""}
            /api/webhooks/facebook
          </div>
          <div className="mt-3 text-xs text-blue-600 space-y-1">
            <div>1. Ga naar developers.facebook.com → Maak App aan</div>
            <div>2. Voeg Webhooks product toe → Subscribe op &quot;feed&quot;</div>
            <div>3. Plak bovenstaande URL + token: savedsouls_webhook_2026</div>
          </div>
        </div>
        </>
      )}

      {activeTab === "calendar" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                const d = new Date(calendarWeek);
                d.setDate(d.getDate() - 7);
                setCalendarWeek(d);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Week van {getWeekDays(calendarWeek)[0].toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
            </span>
            <button
              type="button"
              onClick={() => {
                const d = new Date(calendarWeek);
                d.setDate(d.getDate() + 7);
                setCalendarWeek(d);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getWeekDays(calendarWeek).map((day, i) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-2 min-h-[120px] ${
                    isToday ? "border-[#2aa348] bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-bold mb-2 text-center ${
                      isToday ? "text-[#2aa348]" : "text-gray-500"
                    }`}
                  >
                    {day.toLocaleDateString("nl-NL", { weekday: "short" })}
                    <br />
                    <span className={`text-base ${isToday ? "text-[#2aa348]" : "text-gray-900"}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("compose");
                      setScheduleMode("later");
                      setScheduleDate(day.toISOString().slice(0, 16));
                    }}
                    className="w-full py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs hover:border-[#2aa348] hover:text-[#2aa348] transition-colors"
                  >
                    + Post
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Klik op "+ Post" om een bericht voor die dag in te plannen
          </p>
        </div>
      )}

      {activeTab === "blog" && (
        <>
          {blogView === "list" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">Blog beheer</h2>
                  <p className="text-sm text-gray-500">Berichten worden gesynchroniseerd met de website</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlogPost(null);
                    setBlogTitle("");
                    setBlogBody("");
                    setBlogBodyEn("");
                    setBlogBodyTh("");
                    setBlogCategory("nieuws");
                    setBlogStatus("concept");
                    setBlogView("editor");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2aa348] text-white font-semibold text-sm hover:bg-[#166534] transition-colors"
                >
                  + Nieuw bericht
                </button>
              </div>
              {blogLoading ? (
                <p className="text-gray-500">Berichten laden...</p>
              ) : blogPosts.length === 0 ? (
                <EmptyState
                  icon="📝"
                  title="Geen blogberichten"
                  description="Schrijf je eerste bericht of koppel Facebook"
                  actionLabel="+ Nieuw bericht"
                  onAction={() => setBlogView("editor")}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Titel", "Status", "Talen", "Datum", "Bron", "Acties"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post: BlogPost) => (
                        <tr
                          key={String(post.id)}
                          className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
                              {String(post.title ?? "–")}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {(post.meta_description as string)?.slice(0, 50) || "–"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              label={
                                post.status === "published"
                                  ? "Gepubliceerd"
                                  : post.status === "concept"
                                    ? "Concept"
                                    : post.status === "scheduled"
                                      ? "Ingepland"
                                      : String(post.status ?? "")
                              }
                              type={
                                post.status === "published"
                                  ? "success"
                                  : post.status === "concept"
                                    ? "warning"
                                    : "info"
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {post.body && <span title="Nederlands">🇳🇱</span>}
                              {post.body_en && <span title="Engels">🇬🇧</span>}
                              {post.body_th && <span title="Thai">🇹🇭</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {post.published_at
                              ? new Date(post.published_at as string).toLocaleDateString("nl-NL")
                              : "–"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500">
                              {post.source === "facebook" ? "📘 Facebook" : "✍️ Handmatig"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <QuickActions
                              actions={[
                                {
                                  icon: "✏️",
                                  label: "Bewerken",
                                  onClick: () => {
                                    setEditingBlogPost(post);
                                    setBlogTitle(String(post.title ?? ""));
                                    setBlogBody(String(post.body ?? ""));
                                    setBlogBodyEn(String(post.body_en ?? ""));
                                    setBlogBodyTh(String(post.body_th ?? ""));
                                    setBlogCategory(String(post.category ?? "nieuws"));
                                    setBlogStatus(String(post.status ?? "concept"));
                                    setBlogView("editor");
                                  },
                                },
                                {
                                  icon: "🌐",
                                  label: "Op site",
                                  onClick: () =>
                                    window.open(`/blog/${post.slug ?? post.id}`, "_blank"),
                                },
                                {
                                  icon: "🗑️",
                                  label: "Verwijderen",
                                  onClick: async () => {
                                    if (!confirm("Bericht verwijderen?")) return;
                                    await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
                                    loadBlogPosts();
                                  },
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setBlogView("list")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5"
              >
                ← Terug naar overzicht
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-4">
                  <div className="flex gap-1 border-b border-gray-200 pb-0">
                    {(["nl", "en", "th"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setBlogLang(l)}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                          blogLang === l
                            ? "border-[#2aa348] text-[#2aa348]"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {l === "nl" ? "🇳🇱 NL" : l === "en" ? "🇬🇧 EN" : "🇹🇭 TH"}
                      </button>
                    ))}
                  </div>
                  <input
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Blogtitel..."
                    className="w-full text-2xl font-extrabold border-none outline-none text-gray-900 placeholder-gray-300 bg-transparent focus:ring-0 p-0"
                  />
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-[#2aa348]/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span>✨</span>
                      <span className="text-sm font-bold text-gray-700">AI Schrijfassistent</span>
                      <span className="text-xs text-gray-400">schrijft volledige blogpost</span>
                    </div>
                    <input
                      value={blogAiPrompt}
                      onChange={(e) => setBlogAiPrompt(e.target.value)}
                      placeholder='Bijv: "Adoptieverhaal Luna, herder mix 3 jaar"'
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348] mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBlogAiWrite}
                        disabled={!blogAiPrompt || blogAiWriting}
                        className="flex-1 py-2 rounded-lg bg-[#2aa348] text-white text-xs font-semibold hover:bg-[#166534] transition-colors disabled:opacity-40"
                      >
                        {blogAiWriting ? "⏳ Schrijven..." : `✨ Schrijf in ${blogLang.toUpperCase()}`}
                      </button>
                      {(blogBody || blogBodyEn || blogBodyTh) && (
                        <button
                          type="button"
                          onClick={handleBlogTranslate}
                          disabled={blogAiTranslating}
                          className="flex-1 py-2 rounded-lg border border-[#2aa348] text-[#2aa348] text-xs font-semibold hover:bg-green-50 transition-colors disabled:opacity-40"
                        >
                          {blogAiTranslating ? "⏳ Vertalen..." : "🌐 Vertaal naar EN + TH"}
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={blogLang === "nl" ? blogBody : blogLang === "en" ? blogBodyEn : blogBodyTh}
                    onChange={(e) => {
                      if (blogLang === "nl") setBlogBody(e.target.value);
                      else if (blogLang === "en") setBlogBodyEn(e.target.value);
                      else setBlogBodyTh(e.target.value);
                    }}
                    placeholder={
                      blogLang === "nl"
                        ? "Schrijf je blogbericht in het Nederlands..."
                        : blogLang === "en"
                          ? "Write your blog post in English..."
                          : "เขียนบล็อกโพสต์ของคุณเป็นภาษาไทย..."
                    }
                    className="w-full min-h-[300px] p-4 rounded-xl border border-gray-200 text-sm text-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30 focus:border-[#2aa348] leading-relaxed"
                  />
                  <div className="text-xs text-gray-400 text-right">
                    {(blogLang === "nl" ? blogBody : blogLang === "en" ? blogBodyEn : blogBodyTh).length}{" "}
                    tekens
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Status
                    </label>
                    <select
                      value={blogStatus}
                      onChange={(e) => setBlogStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aa348]/30"
                    >
                      <option value="concept">📝 Concept</option>
                      <option value="published">✅ Gepubliceerd</option>
                      <option value="scheduled">📅 Ingepland</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Categorie
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "adoptieverhaal", label: "🐾 Adoptieverhaal" },
                        { value: "nieuws", label: "📢 Nieuws" },
                        { value: "tips", label: "💡 Tips" },
                        { value: "update", label: "📊 Update" },
                        { value: "evenement", label: "🎉 Evenement" },
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setBlogCategory(c.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            blogCategory === c.value
                              ? "bg-[#2aa348] text-white border-[#2aa348]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleBlogSave}
                    disabled={!blogTitle.trim() || !blogBody.trim()}
                    className="w-full py-3 rounded-xl bg-[#2aa348] text-white font-bold text-sm hover:bg-[#166534] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {editingBlogPost ? "💾 Wijzigingen opslaan" : "🚀 Bericht publiceren"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
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
