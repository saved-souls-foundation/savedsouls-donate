/**
 * Blog posts metadata. Content is in messages via blog.posts.{slug}
 */
export type BlogPost = {
  slug: string;
  date: string; // ISO YYYY-MM-DD
  heroImage: string;
  listingImage?: string; // optional: used on blog listing page instead of heroImage
  images?: string[]; // optional inline images
  layout?: "default" | "adopt"; // adopt = hero with frost overlay, link to adopt page
  source?: "static";
};

/** Facebook posts (van sync-facebook-blog.mjs) */
export type FacebookPost = {
  slug: string;
  date: string;
  heroImage: string;
  listingImage?: string;
  permalink: string;
  message: string;
  excerpt: string;
  source: "facebook";
};

/** Posts uit Supabase (posts-tabel, kolommen titel, inhoud, gepubliceerd_op) */
export type DbPost = {
  id: string;
  slug: string;
  titel: string | null;
  inhoud: string | null;
  gepubliceerd_op: string | null;
  date: string; // YYYY-MM-DD afgeleid van gepubliceerd_op
  heroImage: string;
  listingImage?: string;
  source: "database";
};

export type BlogPostOrFacebook = BlogPost | FacebookPost | DbPost;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "please-help-us-adopt",
    date: "2026-02-21",
    heroImage: "/woman-dog-wheelchair.webp",
    listingImage: "/woman-dog-wheelchair.webp",
    layout: "adopt",
  },
  {
    slug: "end-of-month-feeding-costs",
    date: "2025-02-19",
    heroImage: "/blog/food-preparation-hero.png",
    images: ["/blog/vet-ultrasound.png", "/blog/puppy-towel.png", "/blog/dog-with-cast.png"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Haalt een post op (static of Facebook) op basis van slug */
export function getPostBySlug(slug: string): BlogPostOrFacebook | undefined {
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);
  if (staticPost) return { ...staticPost, source: "static" as const };
  const fbPost = getFacebookPosts().find((p) => p.slug === slug);
  return fbPost ?? undefined;
}

let _facebookPosts: FacebookPost[] | null = null;

function getFacebookPosts(): FacebookPost[] {
  if (_facebookPosts !== null) return _facebookPosts;
  try {
    // Dynamic import for JSON - works at build/runtime
    const data = require("../data/facebook-posts.json") as unknown;
    _facebookPosts = Array.isArray(data) ? (data as FacebookPost[]) : [];
  } catch {
    _facebookPosts = [];
  }
  return _facebookPosts;
}

export function getAllBlogPosts(): BlogPostOrFacebook[] {
  const staticPosts = BLOG_POSTS.map((p) => ({ ...p, source: "static" as const }));
  const fbPosts = getFacebookPosts();
  const merged = [...staticPosts, ...fbPosts];
  return merged.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function isFacebookPost(post: BlogPostOrFacebook): post is FacebookPost {
  return post.source === "facebook";
}

export function isDbPost(post: BlogPostOrFacebook): post is DbPost {
  return post.source === "database";
}

const DEFAULT_BLOG_IMAGE = "/savedsoul-logo-bg.webp";

/** Maakt een DbPost van een API-response (titel, inhoud, gepubliceerd_op, optioneel hero_image) */
export function toDbPost(row: { id: string; slug: string | null; titel: string | null; inhoud: string | null; gepubliceerd_op: string | null; hero_image?: string | null }): DbPost {
  const iso = row.gepubliceerd_op ?? new Date().toISOString();
  const date = iso.slice(0, 10);
  const hero = row.hero_image?.trim() || DEFAULT_BLOG_IMAGE;
  return {
    id: row.id,
    slug: row.slug ?? row.id,
    titel: row.titel,
    inhoud: row.inhoud,
    gepubliceerd_op: row.gepubliceerd_op,
    date,
    heroImage: hero,
    listingImage: hero,
    source: "database",
  };
}
