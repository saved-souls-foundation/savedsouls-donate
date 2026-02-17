import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Saved Souls Foundation",
  description:
    "Frequently asked questions about Saved Souls Foundation: adoption, donations, volunteering, visiting our sanctuary in Khon Kaen, Thailand.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
