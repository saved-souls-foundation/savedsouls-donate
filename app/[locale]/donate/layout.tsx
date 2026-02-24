import type { Metadata } from "next";

const BASE_URL = "https://savedsouls-foundation.org";

const donateActionSchema = {
  "@context": "https://schema.org",
  "@type": "DonateAction",
  name: "Donate to Saved Souls Foundation",
  description: "Donate to support rescued dogs and cats in Thailand. Every euro goes directly to animal care.",
  url: `${BASE_URL}/donate`,
  recipient: {
    "@type": "NGO",
    name: "Saved Souls Foundation",
    url: BASE_URL,
    description: "Animal rescue sanctuary in Khon Kaen, Thailand",
    foundingDate: "2010",
    founder: { "@type": "Person", name: "Gabriela Leonhard" },
    employee: { "@type": "Person", name: "Melanie de Wit", jobTitle: "Manager" },
    areaServed: "Thailand",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donateActionSchema) }}
      />
      {children}
    </>
  );
}
