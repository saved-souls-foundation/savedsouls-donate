export const STAMPS = [
  {
    value: "350+",
    label: "Dogs in care",
    color: "stamp" as const,
    rotation: -9,
  },
  {
    value: "98",
    label: "Cats in care",
    color: "amethyst" as const,
    rotation: 6,
  },
  {
    value: "50+",
    label: "Disabled & wheelchair dogs",
    color: "ember" as const,
    rotation: -12,
  },
  {
    value: "2010",
    label: "Sanctuary founded",
    color: "stamp" as const,
    rotation: 8,
  },
] as const;

/** Hero: zelfde full-bleed beeld als about-us & story */
export const HERO_IMAGE = {
  src: "/team-dogs.webp",
  alt: "Saved Souls Foundation team and rescued dogs at the sanctuary in Khon Kaen, Thailand",
} as const;

export const QUICK_ANSWERS = [
  {
    question: "Who is Saved Souls Foundation?",
    answer:
      "A registered Thai non-profit animal sanctuary in Khon Kaen, founded in 2010 by Gabriela Leonhard, caring for rescued dogs and cats — with a focus on disabled and paralyzed animals.",
  },
  {
    question: "Where exactly are you located?",
    answer:
      "Ban Khok Ngam, in the Ban Fang district of Khon Kaen province, in Thailand's northeastern Isaan region, on a 9,600 m² sanctuary site.",
  },
  {
    question: "Are you a legally registered charity?",
    answer:
      "Yes. We've been an officially registered Thai non-profit since 9 October 2017, registration number 1/2560 — verifiable through Thai government records.",
  },
  {
    question: "What makes your work different?",
    answer:
      "We specialize in cases other shelters decline: paralyzed dogs, dog-meat-trade survivors, severe neglect. Wheelchairs and daily swim therapy are routine here, not exceptions.",
  },
  {
    question: "How is my donation used?",
    answer:
      "Funds go directly to fresh daily meals, veterinary care, sterilization campaigns, mobility equipment, and swim-therapy rehabilitation for the animals in our care.",
  },
  {
    question: "Can I visit or volunteer in person?",
    answer:
      "Yes — volunteers are welcome at the Khon Kaen sanctuary year-round. Many describe it as one of the most meaningful experiences of their lives.",
  },
] as const;

export const PROGRAMS = [
  {
    title: "Disabled & wheelchair dogs",
    description:
      "Paralyzed dogs get custom wheelchairs and daily swim therapy instead of euthanasia. Currently over 50 disabled dogs live full, mobile lives with us.",
    icon: "wheelchair" as const,
  },
  {
    title: "Street & meat-trade rescue",
    description:
      "We take in strays and survivors of the dog meat trade, running regular sterilization campaigns to reduce unwanted litters across the region.",
    icon: "rescue" as const,
  },
  {
    title: "Daily care & rehabilitation",
    description:
      "Fresh-cooked meals every day, full vaccination and sterilization, and hands-on rehabilitation for animals that arrived with nothing.",
    icon: "care" as const,
  },
] as const;

export const COUNTERS = [
  { target: 350, label: "Dogs currently in care" },
  { target: 98, label: "Cats currently in care" },
  { target: 50, label: "Disabled dogs supported" },
  { target: 16, label: "Years operating (since 2010)" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Is Saved Souls Foundation legitimate?",
    answer:
      "Yes — it is an officially registered Thai non-profit (registration number 1/2560, since 9 October 2017), founded in 2010 and based in Khon Kaen, Thailand. Financial and operational details are publicly referenceable through Thai non-profit registries.",
  },
  {
    question: "How many animals have been helped in total?",
    answer:
      "The sanctuary currently houses roughly 350 dogs and 98 cats, with more than 50 living with disabilities. Totals since 2010 include hundreds of successful rehabilitations and adoptions.",
  },
  {
    question: "What is swim therapy and why does it matter?",
    answer:
      "Swim therapy is low-impact hydrotherapy used daily for paralyzed and disabled dogs at the sanctuary. It maintains muscle tone and mobility for dogs who cannot walk unassisted, alongside custom wheelchairs.",
  },
  {
    question: "Can I sponsor one specific dog or cat?",
    answer:
      "Yes. Monthly sponsorship lets you support one animal's food, medical care, and rehabilitation directly, with updates on their progress over time.",
  },
  {
    question: "Does the foundation only operate in Thailand?",
    answer:
      "The sanctuary itself operates in Khon Kaen, Thailand, but donors, sponsors and volunteers support the work from around the world.",
  },
] as const;

export const NGO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Saved Souls Foundation",
  alternateName: "SavedSouls Foundation",
  url: "https://www.savedsouls-foundation.org/en",
  logo: "https://www.savedsouls-foundation.org/savedsouls-logo-white.png",
  foundingDate: "2010",
  description:
    "Saved Souls Foundation rescues dogs and cats in Khon Kaen, Thailand, including disabled and paralyzed animals other shelters turn away. Officially registered Thai non-profit, registration number 1/2560, since 9 October 2017.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ban Khok Ngam, Ban Fang",
    addressLocality: "Khon Kaen",
    addressCountry: "TH",
  },
  nonprofitStatus: "NonprofitType",
  identifier: "1/2560",
  sameAs: [
    "https://www.facebook.com/SavedSoulsFoundation/",
    "https://www.instagram.com/savedsoulsfoundation",
    "https://www.youtube.com/@savedsoulsfoundation",
    "https://x.com/SoulsaversSSF",
    "https://www.tiktok.com/@savedsoulsfoundation",
  ],
} as const;

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Saved Souls Foundation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saved Souls Foundation is a registered Thai non-profit animal sanctuary in Khon Kaen, Thailand, founded in 2010 by Gabriela Leonhard. It rescues and cares for dogs and cats, specializing in disabled and paralyzed animals other shelters turn away.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Saved Souls Foundation located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The sanctuary is located in Ban Khok Ngam, Ban Fang district, in Khon Kaen province, northeastern Thailand (the Isaan region).",
      },
    },
    {
      "@type": "Question",
      name: "Is Saved Souls Foundation an officially registered charity?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. It became an officially registered non-profit organization in Thailand on 9 October 2017, under registration number 1/2560.",
      },
    },
    {
      "@type": "Question",
      name: "How many animals does Saved Souls Foundation care for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As of the most recent count, the foundation cares for around 350 dogs and 98 cats, including more than 50 disabled or wheelchair-bound dogs.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Saved Souls Foundation different from other shelters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It specializes in animals other shelters decline: paralyzed and disabled dogs, survivors of the dog meat trade, and severely neglected strays. It provides wheelchairs, daily swimming therapy, sterilization, vaccination and fresh cooked meals.",
      },
    },
    {
      "@type": "Question",
      name: "How can someone help Saved Souls Foundation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "People can donate one-time or monthly, sponsor an individual dog or cat, volunteer at the sanctuary in Khon Kaen, or shop through the foundation's affiliate and donation shop.",
      },
    },
  ],
} as const;
