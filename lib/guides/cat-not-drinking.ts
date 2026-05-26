import type { GuideContent } from "@/lib/guides/types";

export const CAT_NOT_DRINKING_GUIDE: GuideContent = {
  badgeEmoji: "💧",
  intro:
    "Cats are notoriously bad drinkers. In the wild, they get most of their moisture from prey — mice and birds are roughly 70–80% water. A domestic cat on dry kibble, however, needs to drink from a bowl, and many simply do not drink nearly enough. That gap between instinct and modern feeding is one of the most common reasons cats end up chronically under-hydrated. Some cats refuse the bowl entirely, others sip only a few times a day, and many owners only notice a problem when illness strikes. Understanding what is normal, what is dangerous, and how to encourage healthy drinking habits can protect your cat from dehydration, urinary blockages, and kidney disease — three of the most serious health issues cats face.",
  sections: [
    {
      id: "how-much",
      emoji: "📏",
      title: "How much should a cat drink per day?",
      paragraphs: [
        "Water needs vary with diet, age, activity level, and environment. A useful starting point is 60–80 ml of total moisture per kilogram of body weight per day. That total includes water from food as well as from the bowl — not just what you see them lap up.",
        "A cat on dry food must drink significantly more from a bowl because kibble contains only about 10% moisture. A 4 kg adult cat on dry food typically needs around 200 ml of water from drinking alone, on top of whatever moisture is in any wet food or treats. On wet food alone, the same cat may already receive 70–80% of daily water needs from meals, which is why wet-fed cats often seem to ignore their water bowl entirely — and that can be perfectly normal.",
        "Outdoor cats in hot weather, nursing queens, and cats recovering from illness may need more. Senior cats sometimes drink less because of dental pain, nausea, or cognitive changes — but they may also drink more if kidney disease or diabetes is developing. Tracking approximate intake for a few days (refilling the bowl to the same level and noting how much disappears) gives you a baseline worth knowing.",
      ],
      items: [
        "General rule: 60–80 ml per kg body weight per day (food + water combined)",
        "Dry food only: add roughly 200–250 ml drinking water daily for an average adult cat",
        "Wet food: covers most hydration needs; bowl drinking becomes supplementary",
        "A 4 kg cat on dry food: aim for ~200 ml from the water bowl each day",
        "Kittens and active cats: often at the higher end of the range",
      ],
    },
    {
      id: "why-avoid",
      emoji: "🔍",
      title: "Why cats avoid water bowls",
      paragraphs: [
        "If your cat walks past the water bowl without drinking, the reason is rarely stubbornness. Cats evolved as desert-adapted hunters who obtained moisture from prey and drank from moving sources when available. Standing water in a plastic bowl next to the litter tray goes against several of those instincts at once.",
      ],
      subsections: [
        {
          title: "Natural reasons",
          items: [
            "Wild cats prefer running water — stagnant bowls can trigger an instinct to avoid contamination",
            "Whisker fatigue: narrow or deep bowls press sensitive whiskers against the sides, causing discomfort",
            "Bowl placed too close to food or litter — cats instinctively avoid drinking where they eat or eliminate",
            "Water may taste of chlorine, detergent residue, or plastic from the bowl material",
            "Some cats dislike the temperature or freshness of water that has sat out for hours",
          ],
        },
        {
          title: "Practical fixes",
          items: [
            "Use a water fountain — running water satisfies the instinct for fresh, moving water",
            "Place multiple water stations in quiet locations around the house",
            "Choose wide, shallow ceramic or glass bowls so whiskers do not touch the rim",
            "Keep bowls well away from food dishes and litter boxes (several metres if possible)",
            "Try filtered, bottled, or slightly chilled water; refresh at least twice daily",
            "Switch to or supplement with wet food to reduce reliance on bowl drinking",
          ],
        },
      ],
    },
    {
      id: "dehydration-signs",
      emoji: "⚠️",
      title: "Signs of dehydration in cats",
      paragraphs: [
        "Cats are masters at hiding illness. By the time obvious dehydration appears, they may already be significantly fluid-depleted. Learning to spot early signs helps you act before kidney strain or urinary crisis develops.",
        "The skin tent test is a simple home check: gently pinch the skin on the back of the neck or between the shoulder blades and release. In a well-hydrated cat, the skin snaps back immediately. If it stays tented or returns slowly, dehydration is likely. This test is less reliable in very young kittens, obese cats, or elderly cats with loose skin — but a marked delay still warrants a vet call.",
        "Monitor litter box habits too. Concentrated, dark urine or noticeably reduced urination can indicate insufficient fluid intake or underlying urinary disease. A cat that visits the tray frequently but produces little, strains, or cries while urinating needs emergency assessment — especially males, who are at high risk of life-threatening urethral blockage.",
      ],
      items: [
        "Skin tent test: scruff should spring back instantly when released",
        "Dry, sticky, or pale gums (healthy gums are moist and pink)",
        "Sunken eyes or loss of skin elasticity",
        "Lethargy, weakness, or reduced responsiveness",
        "Loss of appetite or refusal to eat",
        "Dark, strong-smelling urine or reduced urine output",
        "Panting in cats is rare and often indicates serious distress — treat as urgent",
      ],
    },
    {
      id: "when-vet",
      emoji: "🚨",
      title: "When to call the vet",
      variant: "urgent",
      paragraphs: [
        "Not every cat that drinks little needs an emergency visit, but several combinations of signs should never wait. Dehydration progresses quickly in small animals, and urinary obstruction in male cats can become fatal within hours.",
      ],
      items: [
        "No noticeable drinking for 24 hours or more — especially if on dry food only",
        "Any clear signs of dehydration listed above",
        "Cat is not eating, or eating much less than usual",
        "Straining to urinate, crying in the litter box, or going in unusual places (male cats: emergency)",
        "Vomiting combined with reduced drinking — rapid fluid loss",
        "Sudden increase in drinking AND urination — may indicate diabetes, kidney disease, or hyperthyroidism",
        "Lethargy, hiding, or obvious pain when touched around the abdomen",
      ],
    },
    {
      id: "medical-causes",
      emoji: "🏥",
      title: "Medical causes of not drinking",
      paragraphs: [
        "When a previously good drinker stops entirely, or a cat shows illness alongside reduced intake, a medical cause should be investigated. Behavioural fixes help reluctant drinkers; they do not replace veterinary care when something is wrong.",
        "Feline lower urinary tract disease (FLUTD) can make urination painful, causing cats to associate the litter box — and sometimes all fluid intake — with discomfort. They may drink less while also visiting the tray more often with little result. Kidney disease is paradoxical: many cats with chronic kidney disease (CKD) actually drink more as the kidneys fail to concentrate urine — but advanced CKD can also cause nausea that reduces both eating and drinking.",
        "Diabetes mellitus and hyperthyroidism typically increase thirst, not decrease it — but any metabolic illness can cause nausea or mouth pain that puts a cat off food and water. Dental disease is an under-recognised cause: abscesses, resorptive lesions, and gingivitis make eating and drinking painful. A cat that eats wet food but avoids the bowl may simply be avoiding the pain of cold water on sore teeth.",
      ],
      items: [
        "FLUTD / bladder inflammation or crystals — pain on urination",
        "Kidney disease — often increased drinking early on; nausea later",
        "Diabetes — usually increased thirst; monitor if drinking pattern changes",
        "Hyperthyroidism — increased appetite and thirst common",
        "Nausea from gastrointestinal disease, pancreatitis, or toxins",
        "Dental pain — reluctance to drink cold water or chew dry food",
        "Fever or systemic infection — general malaise reduces intake",
      ],
    },
    {
      id: "proven-tips",
      emoji: "💡",
      title: "Proven ways to get cats to drink more",
      paragraphs: [
        "The good news is that most under-drinking cats can be helped with environmental changes — no medication required. The single biggest improvement most owners report is switching from a static bowl to a fountain. Cats hear and see moving water, which triggers investigation and repeated visits throughout the day.",
        "Combining dietary moisture with improved bowl setup covers both sides of the equation. Even adding a tablespoon of warm water to wet food, or soaking dry kibble briefly, increases total intake without relying on voluntary drinking. Multiple stations prevent one cat from guarding a single bowl in multi-cat homes.",
      ],
      numberedItems: [
        "Install a water fountain — ceramic or stainless steel models are easy to clean and avoid plastic taste",
        "Switch fully or partly to wet food, or add water/broth to meals (low-sodium only, no onion or garlic)",
        "Place several bowls in different rooms — quiet spots away from litter and food",
        "Use wide, shallow ceramic or glass bowls to prevent whisker fatigue",
        "Offer slightly cooled water in summer; refresh bowls at least twice daily",
        "Add ice cubes to the bowl as enrichment — some cats enjoy batting and licking them",
        "Try a tiny amount of liquid from tuna packed in water (not oil or brine) as an occasional enticement",
      ],
    },
  ],
  faq: [
    {
      q: "My cat only drinks from the tap — is that okay?",
      a: "Many cats prefer running water, and tap drinking is usually fine as long as they drink enough overall. Letting the tap run occasionally is wasteful but harmless for short periods. A fountain often satisfies the same preference more sustainably. If tap-only drinking means they drink rarely or you cannot provide access when you are out, supplement with wet food and additional bowls or a fountain elsewhere in the home.",
    },
    {
      q: "Is wet food enough, or does my cat still need a water bowl?",
      a: "For many cats on high-quality wet food, bowl drinking is supplementary rather than essential — total moisture from food may meet daily needs. Still keep fresh water available; cats should always have the choice. Cats on dry food or a mixed diet absolutely need reliable access to drinking water and often benefit from extra encouragement.",
    },
    {
      q: "How do I know if my cat is dehydrated?",
      a: "Check the skin tent test (scruff should snap back immediately), gum moisture (sticky or dry gums are concerning), energy level, and urine output. Dark, scant urine or no urination in 24 hours is serious. When in doubt, call your vet — dehydration is easier to treat early than after it has affected the kidneys or caused a urinary crisis.",
    },
    {
      q: "Can cats get kidney disease from not drinking enough?",
      a: "Chronic under-hydration is a risk factor for concentrated urine, which may contribute to crystal formation and kidney stress over time. It does not guarantee kidney disease, but keeping cats well hydrated — especially on dry food — is one of the best preventive steps you can take. Regular vet checks and blood work from middle age onward catch kidney changes early.",
    },
    {
      q: "My cat suddenly started drinking a lot more — should I worry?",
      a: "Increased thirst (polydipsia) often signals diabetes, kidney disease, hyperthyroidism, or uterine infection in unspayed females. It is the opposite problem from not drinking, but equally important. Note how much they drink, whether urination has increased, and any weight or appetite changes, then book a vet appointment promptly. Blood and urine tests usually identify the cause quickly.",
    },
  ],
  faqTitle: "Frequently asked questions",
  relatedTitle: "Related guides",
  relatedLinks: [
    { href: "/health", label: "Dog and cat health overview" },
    { href: "/nutrition", label: "Pet nutrition guide" },
    { href: "/cat-hairball", label: "Cat hairballs — causes and prevention" },
    { href: "/general-health", label: "General health checks for pets" },
  ],
};
