import type { GuideContent } from "@/lib/guides/types";

export const DOG_ATE_CHOCOLATE_GUIDE: GuideContent = {
  badgeEmoji: "🍫",
  intro:
    "Don't panic — but act fast. Whether your dog grabbed a chocolate bar from the counter, licked brownie batter, or found cocoa powder in the pantry, chocolate is genuinely toxic to dogs. The danger depends on three things: the type of chocolate, how much was eaten, and your dog's body weight. Small dogs and dark chocolate are the most dangerous combination. Symptoms can take hours to appear, so waiting to see if your dog \"seems fine\" is risky. This guide explains exactly what to do in the first minutes, how to judge severity, what symptoms to watch for, and when emergency veterinary care is essential.",
  sections: [
    {
      id: "immediate-steps",
      emoji: "⚡",
      title: "Immediate steps — first 5 minutes",
      variant: "urgent",
      numberedItems: [
        "Stay calm and act quickly. Panic wastes time; your dog needs you to gather information and call for professional advice right away.",
        "Find out exactly what happened: what type of chocolate (milk, dark, baking, cocoa powder), approximately how much was eaten, and when ingestion occurred. Check wrappers, crumbs, or empty packaging.",
        "Call your veterinarian, an emergency vet clinic, or an animal poison helpline immediately. Do not wait for symptoms to appear — treatment is far more effective when started early.",
        "Have this information ready before you call: your dog's current weight, chocolate type, estimated amount eaten (grams or ounces if possible), time of ingestion, and any symptoms already present.",
        "Follow professional advice exactly. Do not induce vomiting at home unless your vet or poison helpline specifically instructs you to — it can be dangerous with certain products or if your dog is already showing neurological signs.",
      ],
      paragraphs: [
        "If your dog ate chocolate within the last two hours and your vet advises it, they may ask you to bring your dog in immediately for induced vomiting. Never use hydrogen peroxide or other home remedies without explicit veterinary guidance, as incorrect dosing or timing can cause serious complications.",
      ],
    },
    {
      id: "emergency-numbers",
      emoji: "📞",
      title: "Emergency poison helplines",
      variant: "urgent",
      paragraphs: [
        "These helplines can help calculate toxicity risk and tell you whether to go to an emergency clinic. Fees may apply; keep your credit card ready for some US services.",
      ],
      items: [
        "United States — ASPCA Animal Poison Control: (888) 426-4435 (fee may apply)",
        "United Kingdom — Animal PoisonLine: 01202 509000",
        "Netherlands — Nationaal Vergiftigingen Informatie Centrum (NVIC): 030 274 8888",
        "Australia — Animal Poisons Helpline: 1300 869 738",
        "If your dog is already vomiting, trembling, seizuring, or collapsing — go to the nearest emergency vet immediately; do not wait on hold for a helpline.",
      ],
    },
    {
      id: "why-toxic",
      emoji: "☠️",
      title: "Why is chocolate toxic to dogs?",
      paragraphs: [
        "Chocolate contains theobromine and caffeine, both methylxanthines. Dogs metabolize theobromine far more slowly than humans. In people, theobromine has a half-life of roughly 6–10 hours; in dogs it is approximately 17 hours, meaning the toxin stays in the bloodstream much longer and reaches higher concentrations.",
        "Theobromine affects the central nervous system, cardiovascular system, and kidneys. It acts as a stimulant — increasing heart rate, causing restlessness, and in severe cases triggering muscle tremors, seizures, and dangerous arrhythmias. Dogs also cannot efficiently clear theobromine through their liver and kidneys the way humans can, so repeated small exposures or a single large dose can overwhelm their system.",
        "Caffeine contributes additional stimulant effects but is present in smaller amounts than theobromine in most chocolate products. Dark chocolate, baking chocolate, and cocoa powder contain the highest theobromine concentrations, which is why a small amount of dark chocolate can be more dangerous than a larger amount of milk chocolate for the same-sized dog.",
        "White chocolate contains negligible theobromine but is still high in fat and sugar, which can cause pancreatitis or gastrointestinal upset. Never assume white chocolate is a safe treat — it is not toxic in the same way, but it is still unhealthy and can encourage dangerous scavenging behaviour.",
      ],
    },
    {
      id: "toxicity-table",
      emoji: "📊",
      title: "How dangerous is it? Chocolate toxicity by type",
      paragraphs: [
        "The table below shows approximate theobromine content per 100 grams. Actual values vary by brand and cocoa percentage — always assume the higher end of the range when estimating risk.",
        "Veterinary toxicology uses milligrams of theobromine per kilogram of body weight (mg/kg) to assess risk. Mild signs often appear around 20 mg/kg; severe signs at 40–50 mg/kg; potentially fatal doses at 60 mg/kg and above. Individual sensitivity varies — some dogs show serious signs at lower doses.",
        "Example calculation: A 10 kg (22 lb) dog eats 100 g of 70% dark chocolate containing roughly 200 mg theobromine per 100 g. Total theobromine ≈ 200 mg, dose = 200 ÷ 10 = 20 mg/kg — mild to moderate symptoms are likely. Always call your vet for confirmation; do not rely on home math alone.",
      ],
      table: {
        headers: ["Chocolate type", "Theobromine per 100g", "Danger level"],
        rows: [
          ["White chocolate", "0.25 mg", "Very low"],
          ["Milk chocolate", "44–60 mg", "Medium"],
          ["Dark chocolate (50%)", "160 mg", "High"],
          ["Dark chocolate (70%+)", "200–450 mg", "Very high"],
          ["Baking / cooking chocolate", "400–450 mg", "Extremely high"],
          ["Cocoa powder", "400–737 mg", "Extremely high"],
          ["Cocoa mulch (garden)", "Very high", "Extremely high"],
        ],
      },
      items: [
        "Mild symptoms threshold: approximately 20 mg theobromine per kg body weight",
        "Severe symptoms threshold: approximately 40–50 mg per kg",
        "Potentially fatal: approximately 60+ mg per kg (always seek emergency care well before this level)",
      ],
    },
    {
      id: "symptoms",
      emoji: "🤒",
      title: "Symptoms of chocolate poisoning in dogs",
      paragraphs: [
        "Symptoms typically begin within 30 minutes to 12 hours after ingestion, depending on the amount eaten, chocolate type, and whether the dog ate food at the same time (which can delay absorption). A dog that seems completely normal four hours after eating dark chocolate is not necessarily safe — continue monitoring and follow veterinary advice.",
      ],
      subsections: [
        {
          title: "Mild signs (often within 1–2 hours)",
          items: [
            "Vomiting and diarrhoea",
            "Restlessness, hyperactivity, or pacing",
            "Excessive thirst and urination",
            "Panting and rapid breathing",
          ],
        },
        {
          title: "Moderate signs",
          paragraphs: [
            "As toxicity progresses, cardiovascular and neuromuscular effects become more pronounced. These signs warrant urgent veterinary care even if they developed gradually.",
          ],
          items: [
            "Muscle tremors or twitching",
            "Increased heart rate (tachycardia)",
            "Elevated blood pressure",
            "Hyperthermia (elevated body temperature)",
          ],
        },
        {
          title: "Severe signs (larger doses or small dogs)",
          paragraphs: [
            "Severe chocolate poisoning is a medical emergency. Death is rare with prompt treatment but possible with very large ingestions, especially of baking chocolate, cocoa powder, or cocoa mulch.",
          ],
          items: [
            "Seizures",
            "Heart arrhythmias",
            "Collapse or inability to stand",
            "Loss of consciousness",
            "Death (possible with untreated severe poisoning)",
          ],
        },
      ],
    },
    {
      id: "vet-treatment",
      emoji: "🏥",
      title: "What will the vet do?",
      paragraphs: [
        "Veterinary treatment depends on how much chocolate was eaten, when it happened, and what symptoms are present. The goal is to reduce absorption, speed elimination, control symptoms, and protect the heart and nervous system.",
        "If ingestion was recent (typically within two hours) and your dog is stable, the vet may induce vomiting to remove chocolate still in the stomach. Activated charcoal is often given afterward to bind remaining toxins in the gastrointestinal tract and reduce further absorption.",
        "Dogs with moderate to severe signs usually receive intravenous fluids to support kidney function, correct dehydration from vomiting, and help flush theobromine. Heart rate and rhythm are monitored continuously. Medications may be used to control tremors, seizures, or dangerous arrhythmias.",
        "Hospitalization for 12–24 hours (sometimes longer) is common with significant ingestions. Blood work may be performed to check organ function. Most dogs recover fully with timely treatment — delayed care is the main factor that worsens outcomes.",
      ],
      items: [
        "Induced vomiting (if within approximately 2 hours and clinically appropriate)",
        "Activated charcoal to absorb remaining toxins",
        "Intravenous fluid therapy",
        "Anti-seizure or anti-arrhythmia medications as needed",
        "Continuous monitoring for 12–24 hours or more",
      ],
    },
    {
      id: "foods-toxic",
      emoji: "🚫",
      title: "Other foods toxic to dogs",
      variant: "muted",
      paragraphs: [
        "Chocolate is one of several common human foods that are dangerous for dogs. Others include grapes and raisins (kidney failure), xylitol sweetener (life-threatening hypoglycemia and liver damage), onions and garlic (red blood cell damage), macadamia nuts, alcohol, and raw yeast dough. Many dogs are opportunistic eaters — keep hazardous foods secured and educate everyone in the household.",
        "For a full overview of household dangers, toxic plants, and emergency planning, see our dangers guide. Prevention is always easier than treatment after an accidental ingestion.",
      ],
      items: [
        "Grapes and raisins — can cause acute kidney failure",
        "Xylitol (sugar-free gum, some peanut butters) — extremely dangerous",
        "Onions, garlic, leeks, chives — damage red blood cells",
        "Alcohol and raw bread dough — ethanol poisoning risk",
      ],
    },
  ],
  faq: [
    {
      q: "My dog ate just a small piece — should I still call the vet?",
      a: "Yes. Even a small amount of dark chocolate or cocoa can be dangerous for toy breeds and puppies. Milk chocolate is less toxic per gram but large quantities still pose risk. A quick phone call lets your vet or poison helpline calculate the dose based on weight and chocolate type. Many clinics prefer you call rather than wait — early advice prevents serious illness and is often less expensive than emergency treatment after symptoms develop.",
    },
    {
      q: "Can dogs eat white chocolate?",
      a: "White chocolate contains very little theobromine and is unlikely to cause classic chocolate poisoning. However, it is high in fat and sugar, which can trigger vomiting, diarrhoea, or pancreatitis. It also teaches dogs that sweet human food is available, increasing the risk they will eat more dangerous chocolate later. White chocolate should not be given as a treat — if your dog ate a large quantity, still contact your vet because of fat content and possible gastrointestinal upset.",
    },
    {
      q: "What about chocolate cake, hot cocoa, or cocoa powder?",
      a: "Chocolate cake and brownies often contain dark chocolate, cocoa powder, or frosting with high theobromine levels — treat them as seriously as plain chocolate. Hot cocoa mix and drinking chocolate vary widely; pure cocoa powder is among the most concentrated sources and is extremely dangerous even in small amounts. Cocoa mulch used in gardens has caused fatal poisonings in dogs that find it outdoors. Always identify every ingredient and estimate total chocolate content when speaking to your vet.",
    },
    {
      q: "My dog ate chocolate 4 hours ago and seems fine — is he safe?",
      a: "Not necessarily. Symptoms can be delayed up to 12 hours, especially after a large meal slowed stomach emptying or if only a moderate dose was consumed. Theobromine continues to circulate for many hours. Continue monitoring for vomiting, restlessness, tremors, or increased thirst, and follow any advice given when you first called. If you have not yet contacted a vet, call now — do not assume silence means safety.",
    },
    {
      q: "Can dogs recover from chocolate poisoning?",
      a: "Most dogs recover fully with prompt veterinary care, including dogs who needed hospitalization. Prognosis is best when treatment starts before severe neurological or cardiac signs develop. Dogs that seize, collapse, or develop arrhythmias need intensive care but often still recover. Fatal outcomes are uncommon with treatment but more likely with very large ingestions of baking chocolate or cocoa powder, delayed care, or very small dogs. Speed matters — treat every chocolate ingestion as potentially serious until a professional says otherwise.",
    },
  ],
  faqTitle: "Frequently asked questions",
  relatedTitle: "Related guides",
  relatedLinks: [
    { href: "/dangers", label: "Dangers for dogs and cats" },
    { href: "/health", label: "Dog and cat health" },
    { href: "/dog-not-eating", label: "Dog not eating" },
    { href: "/dog-vomiting-diarrhea", label: "Dog vomiting and diarrhoea" },
  ],
};
