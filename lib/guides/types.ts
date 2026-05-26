export type GuideSection = {
  id: string;
  emoji: string;
  title: string;
  variant?: "default" | "urgent" | "muted";
  paragraphs?: string[];
  items?: string[];
  numberedItems?: string[];
  subsections?: {
    title: string;
    paragraphs?: string[];
    items?: string[];
  }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type GuideContent = {
  badgeEmoji: string;
  intro: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  faqTitle?: string;
  relatedTitle?: string;
  relatedLinks?: { href: string; label: string }[];
};
