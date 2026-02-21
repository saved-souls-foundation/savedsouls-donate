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
};

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

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (b.date > a.date ? 1 : -1));
}
