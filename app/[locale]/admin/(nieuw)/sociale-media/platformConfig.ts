/**
 * Platformconfiguratie voor sociale media planner.
 * Kleuren en character limits per platform.
 */
export type PlatformId = "facebook" | "instagram" | "tiktok" | "youtube" | "reddit" | "x";

export const PLATFORM_CONFIG: Record<
  PlatformId,
  { name: string; color: string; gradient?: string; charLimit: number }
> = {
  facebook: { name: "Facebook", color: "#1877F2", charLimit: 63206 },
  instagram: {
    name: "Instagram",
    color: "#E1306C",
    gradient: "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)",
    charLimit: 2200,
  },
  tiktok: { name: "TikTok", color: "#EE1D52", charLimit: 2200 },
  youtube: { name: "YouTube", color: "#FF0000", charLimit: 5000 },
  reddit: { name: "Reddit", color: "#FF4500", charLimit: 40000 },
  x: { name: "X (Twitter)", color: "#000000", charLimit: 280 },
};

export const PLATFORM_IDS: PlatformId[] = ["facebook", "instagram", "tiktok", "youtube", "reddit", "x"];

export type PostStatus = "concept" | "gepland" | "geplaatst" | "mislukt";

export const POST_STATUS_CONFIG: Record<
  PostStatus,
  { label: string; color: string; bg: string }
> = {
  concept: { label: "Concept", color: "#E9C46A", bg: "rgba(233,196,106,.2)" },
  gepland: { label: "Gepland", color: "#457B9D", bg: "rgba(69,123,157,.2)" },
  geplaatst: { label: "Geplaatst", color: "#2A9D8F", bg: "rgba(42,157,143,.2)" },
  mislukt: { label: "Mislukt", color: "#E63946", bg: "rgba(230,57,70,.2)" },
};

export interface ScheduledPost {
  id: string;
  platformId: PlatformId;
  text: string;
  status: PostStatus;
  scheduledAt: string;
  campaignLabel?: string;
  mediaUrls?: string[];
}

/** Map Supabase row naar ScheduledPost */
export function rowToPost(row: {
  id: string;
  platform: string;
  content: string;
  media_urls?: string[] | null;
  scheduled_at: string | null;
  campaign_label?: string | null;
  status: string;
}): ScheduledPost {
  return {
    id: row.id,
    platformId: row.platform as PlatformId,
    text: row.content,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at).toISOString() : new Date().toISOString(),
    campaignLabel: row.campaign_label ?? undefined,
    status: row.status as PostStatus,
    mediaUrls: row.media_urls ?? undefined,
  };
}
