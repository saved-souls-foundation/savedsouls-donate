import type { Metadata } from "next";
import { seoGuideMetadata } from "@/lib/seo-guide-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seoGuideMetadata("/dog-ate-chocolate", "dogAteChocolate", locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
