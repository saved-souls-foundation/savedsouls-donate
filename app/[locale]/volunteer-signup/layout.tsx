import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Sign-up | Saved Souls Foundation",
  description:
    "Sign up as a volunteer at Saved Souls Foundation in Khon Kaen, Thailand. Fill out our form and join our team helping rescued dogs and cats.",
};

export default function VolunteerSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
