import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";
import { getBlogPost } from "@/lib/blog-posts";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };

  const t = await getTranslations({ locale, namespace: "blog" });
  const title = t(`posts.${slug}.title`);
  const excerpt = t(`posts.${slug}.excerpt`);

  return {
    title: `${title} | Saved Souls Foundation`,
    description: excerpt,
    alternates: alternatesForPath(`/blog/${slug}`, locale),
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
