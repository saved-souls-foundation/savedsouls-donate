import type { Metadata } from "next";
import { seoGuideMetadata } from "@/lib/seo-guide-metadata";
import { setRequestLocale } from "next-intl/server";

const DOG_NOT_EATING_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long can a dog go without eating?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most healthy adult dogs can go 3 to 5 days without food before serious health consequences develop, but this does not mean you should wait that long. A dog not eating for more than 48 hours needs a veterinary examination. Puppies should be seen within 12 hours of refusing food due to hypoglycemia risk.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my dog not eating but acting normal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A dog that refuses food but remains playful, bright, and active is usually experiencing a behavioural or mild cause — stress, food boredom, too many treats, or a recent vaccination. Monitor closely for 24 hours. If refusal continues or any other symptoms develop, contact your vet.",
      },
    },
    {
      "@type": "Question",
      name: "What can I feed a dog that won't eat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Try plain boiled chicken breast with white rice (no seasoning), slightly warmed wet dog food, or low-sodium chicken broth added to kibble. Small portions offered by hand in a quiet room often help. If the dog still refuses after 24 hours, see your vet.",
      },
    },
    {
      "@type": "Question",
      name: "Should I be worried if my dog skipped one meal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Skipping one meal in an otherwise healthy adult dog is usually not an emergency. Watch for other symptoms. If the dog skips a second consecutive meal or shows any sign of illness, contact your veterinarian.",
      },
    },
    {
      "@type": "Question",
      name: "My dog is not eating and vomiting — what should I do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not eating combined with vomiting is a reason to contact your vet the same day. If vomiting is repeated, the dog is weak or lethargic, the abdomen looks swollen, or there is blood in the vomit, treat it as an emergency immediately.",
      },
    },
    {
      "@type": "Question",
      name: "Why won't my puppy eat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puppies commonly stop eating due to stress, intestinal parasites, infections, or parvovirus. A puppy refusing food for more than 12 hours, or one that is lethargic, vomiting, or has diarrhoea, needs veterinary attention urgently.",
      },
    },
    {
      "@type": "Question",
      name: "Can a dog not eat due to stress?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — stress is one of the most common reasons dogs refuse food. Moving, a new pet, loud noises, or a change in routine can all suppress appetite. Appetite usually returns within 24 to 48 hours once stress reduces.",
      },
    },
    {
      "@type": "Question",
      name: "My dog is not eating but drinking water — is that serious?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Drinking normally while refusing food often points to nausea, mouth pain, or an underlying condition like kidney disease or diabetes. If food refusal continues beyond 24 hours or you notice increased drinking, weight loss, or lethargy, book a vet appointment.",
      },
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seoGuideMetadata("/dog-not-eating", "dogNotEating", locale);
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DOG_NOT_EATING_FAQ_SCHEMA) }}
      />
      {children}
    </>
  );
}
