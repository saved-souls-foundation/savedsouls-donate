import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adoption Inquiry | Saved Souls Foundation",
  description:
    "Start your adoption journey. Fill out our adoption inquiry form and give a rescued dog or cat a second chance at a loving home.",
};

export default function AdoptInquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
