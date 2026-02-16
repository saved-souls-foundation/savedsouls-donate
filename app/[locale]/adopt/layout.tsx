import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adopt a Dog | Saved Souls Foundation",
  description:
    "Adopt a rescued dog from Saved Souls Foundation in Khon Kaen, Thailand. Disabled dogs, wheelchair dogs, and special needs animals looking for loving homes.",
};

export default function AdoptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
