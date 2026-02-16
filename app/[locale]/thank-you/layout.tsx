import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Saved Souls Foundation",
  description:
    "A big thank you to all sponsors, donors, adopters, volunteers and founders of Saved Souls Foundation. Your support makes a difference.",
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
