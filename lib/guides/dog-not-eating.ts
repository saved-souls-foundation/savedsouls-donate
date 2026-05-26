import type { GuideContent } from "@/lib/guides/types";

export const DOG_NOT_EATING_GUIDE: GuideContent = {
  badgeEmoji: "🍽️",
  intro:
    "A healthy dog skipping one meal is usually nothing to worry about — dogs are not always as food-driven as cartoons suggest, and a missed breakfast after a big dinner or a hot day is common. But when a dog refuses food for more than 24 to 48 hours, eats noticeably less for several days, or stops eating alongside other symptoms, something meaningful is going on. Loss of appetite (anorexia) can signal anything from stress and picky eating to dental pain, pancreatitis, or life-threatening illness in puppies. This guide helps you decide how urgent the situation is, understand the most common causes, know what to try safely at home, and recognize when only a veterinarian can help.",
  sections: [
    {
      id: "how-long",
      emoji: "⏱️",
      title: "How long is too long without food?",
      paragraphs: [
        "Duration matters as much as the fact that your dog is not eating. Adult dogs can often tolerate a short fast better than puppies or very small breeds, but prolonged refusal always deserves attention.",
        "Use the timelines below as general guidelines — when in doubt, call your vet. It is always better to call early and learn the situation is mild than to wait until dehydration or organ stress has developed.",
      ],
      items: [
        "Skipping one meal: usually fine in an otherwise bright, active adult dog — monitor closely",
        "24 hours with no food (healthy adult): watch closely; call vet if any other symptoms or if refusal continues",
        "48 hours with no food: contact your veterinarian — investigation is needed",
        "Puppy not eating for 12 hours: call vet immediately — hypoglycemia (low blood sugar) is dangerous",
        "Senior dog not eating for 24 hours: call vet — higher risk of serious underlying disease",
        "Any dog not eating AND vomiting, lethargy, or pain: treat as urgent regardless of duration",
      ],
    },
    {
      id: "causes",
      emoji: "🔍",
      title: "Most common causes of loss of appetite",
      paragraphs: [
        "Appetite is controlled by smell, taste, stomach comfort, overall health, and emotional state. When a dog stops eating, veterinarians think in three broad categories: behavioural or environmental, medical, and psychological. Many cases involve more than one factor — for example, dental pain plus anxiety after a move.",
      ],
      subsections: [
        {
          title: "Behavioural and environmental causes",
          paragraphs: [
            "These are among the most common reasons an otherwise healthy dog skips meals. They are often reversible once the trigger is identified.",
          ],
          items: [
            "Stress from a new home, new pet, construction, fireworks, or owner absence",
            "Change in routine, feeding location, or household members",
            "Dislikes the food — formula change, stale kibble, or bowl placement",
            "Too many treats or table scraps — dog is simply not hungry at mealtime",
            "Competition or intimidation from another pet at the food bowl",
            "Hot weather — some dogs eat less in summer",
            "Recent vaccination — mild reduced appetite for 24 hours can be normal",
          ],
        },
        {
          title: "Medical causes",
          paragraphs: [
            "Medical anorexia often comes with other clues: bad breath, drooling, vomiting, weight loss, or lethargy. Pain anywhere in the body can suppress appetite — not only mouth pain.",
          ],
          items: [
            "Dental disease, fractured tooth, or oral infection",
            "Nausea from gastritis, dietary indiscretion, or pancreatitis",
            "Intestinal obstruction from swallowed foreign material",
            "Kidney disease, liver disease, or heart failure",
            "Parvovirus in unvaccinated puppies — emergency",
            "Pain from arthritis, injury, or abdominal conditions",
            "Medication side effects (antibiotics, NSAIDs, chemotherapy)",
            "Cancer and other chronic systemic illness",
            "Fever from any infection",
          ],
        },
        {
          title: "Psychological causes",
          paragraphs: [
            "Dogs experience stress and grief. Appetite often returns when environment and predictability improve, but prolonged refusal still needs a vet check to rule out physical disease.",
          ],
          items: [
            "Separation anxiety when left alone or after schedule changes",
            "Depression-like behaviour after loss of an owner or companion animal",
            "Trauma or fear associated with feeding area or past abuse",
          ],
        },
      ],
    },
    {
      id: "when-vet",
      emoji: "🚨",
      title: "When to go to the vet immediately",
      variant: "urgent",
      paragraphs: [
        "Some combinations of signs indicate an emergency. Do not try home remedies first — go to your vet or emergency clinic.",
      ],
      items: [
        "Not eating AND repeated vomiting or diarrhoea",
        "Not eating AND marked lethargy, weakness, or collapse",
        "Not eating AND distended, painful, or hard abdomen — bloat risk",
        "Puppy not eating for 12+ hours or becoming weak or wobbly",
        "Dog may have eaten something toxic, foreign, or spoiled recently",
        "Any clear sign of pain (whining, hunched posture, reluctance to move)",
        "Yellow gums, pale gums, or known liver or kidney disease",
        "Weight loss you can see or feel over days to weeks",
      ],
    },
    {
      id: "home-tips",
      emoji: "✅",
      title: "Things to try at home (if no emergency signs)",
      paragraphs: [
        "Only use these strategies when your dog is otherwise bright, drinking normally, and has been refusing food for less than 24 hours without vomiting or abdominal pain. If there is no improvement within 24 hours, call your vet.",
        "Never force-feed without veterinary guidance. Never starve a puppy, diabetic dog, or dog on prescription medication without speaking to your vet. Appetite stimulants exist but are prescribed only after diagnosis.",
      ],
      numberedItems: [
        "Offer a different food — sometimes a fresh batch of the usual diet, a wet version of the same brand, or a small amount of plain boiled chicken (no seasoning) tempts a picky eater. Slightly warming wet food releases aroma.",
        "Hand-feed small amounts in a quiet room away from other pets. Stress and competition are common hidden causes.",
        "Remove treats and table scraps completely for 24–48 hours so hunger can return. Many \"not eating\" dogs are simply full.",
        "Check the mouth gently for red gums, broken teeth, swelling, or foul odour — if you find anything abnormal, book a vet appointment rather than continuing home trials.",
        "Rule out stress triggers: new visitors, loud noises, changed walk times. Restore predictable routine.",
        "Skip one scheduled meal entirely (with vet approval for puppies, seniors, or diabetic dogs) — a healthy adult may eat enthusiastically at the next meal.",
        "Add a small amount of low-sodium chicken broth to dry food — avoid onion or garlic in ingredients.",
      ],
    },
    {
      id: "specific-situations",
      emoji: "📋",
      title: "Specific situations",
      subsections: [
        {
          title: "Puppy not eating",
          paragraphs: [
            "Puppies have small energy reserves and can develop hypoglycemia quickly when they do not eat. A puppy that refuses food for more than a few meals, becomes lethargic, or has vomiting or diarrhoea needs veterinary attention within hours, not days.",
            "Common causes include stress from leaving the litter, intestinal parasites, infection, or parvovirus in unvaccinated pups. Parvo is life-threatening — bloody diarrhoea, vomiting, and lethargy are emergency signs. Always keep vaccinations on schedule and avoid high-risk areas until the series is complete.",
          ],
        },
        {
          title: "Senior dog not eating",
          paragraphs: [
            "Older dogs commonly stop eating due to dental disease, chronic kidney disease, cancer, cognitive dysfunction, or arthritis pain that makes standing at the bowl uncomfortable. Senior dogs dehydrate faster and lose muscle mass quickly when anorexia persists.",
            "Contact your vet within 24 hours of noticeable appetite loss in a senior dog, even without other symptoms. Blood work and a thorough mouth examination often reveal treatable causes.",
          ],
        },
        {
          title: "Dog not eating after surgery",
          paragraphs: [
            "Reduced appetite for 12 to 24 hours after anaesthesia and surgery is common. Nausea, grogginess, and unfamiliar medications all play a role. Offer small, bland meals if your vet approves.",
            "If your dog has not eaten for more than 24 hours after surgery, or is vomiting, contact the surgical clinic. Prolonged post-operative anorexia can delay healing and may indicate complications or pain inadequately controlled.",
          ],
        },
        {
          title: "Dog not eating but drinking water",
          paragraphs: [
            "Drinking while refusing solid food suggests nausea, mouth pain, or systemic illness rather than simple pickiness. Kidney disease, diabetes, liver disease, and stomach upset can all present this way.",
            "Monitor urine output and energy level. Increased drinking with decreased eating warrants blood work. Do not assume water intake alone is enough long term — dogs need nutrients and can still become depleted.",
          ],
        },
        {
          title: "Dog not eating and vomiting",
          paragraphs: [
            "This combination should be treated as potentially serious until a vet says otherwise. Causes include dietary indiscretion, pancreatitis, obstruction, poisoning, and infection.",
            "Withhold food only if your vet advises it for a short period; puppies should not be fasted without professional guidance. Seek same-day veterinary care, especially if vomiting is repeated or contains blood.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is it normal for dogs to skip meals occasionally?",
      a: "Yes, for many adult dogs. A single skipped meal after excitement, travel, or heat is often harmless if energy and hydration are normal. Patterns matter: skipping regularly, losing weight, or showing other symptoms is not normal. Track how many meals are refused and whether your dog is still enthusiastic about treats — dogs that refuse dinner but beg for cheese may be holding out for better offers rather than truly ill.",
    },
    {
      q: "Should I add something to the food to make it more appealing?",
      a: "Short-term temptations like a spoon of wet food, plain chicken, or vet-approved appetite enhancers can help during recovery or mild stomach upset. Long-term, adding rich toppings to dry kibble often creates a picky eater who refuses plain food. If you need toppings permanently, discuss a balanced strategy with your vet — some prescription diets and wet formulations are designed for palatability without unbalancing nutrition.",
    },
    {
      q: "Can stress cause a dog to stop eating?",
      a: "Absolutely. Moving house, new pets, visitors, loud storms, or owner absence commonly reduce appetite for 24–48 hours. Stress-related anorexia improves when routine returns and the dog feels safe. If appetite does not rebound within two days, or if your dog hides, trembles, or vomits, schedule a vet visit to rule out concurrent illness — stress and disease often overlap.",
    },
    {
      q: "My dog only eats when I hand feed — why?",
      a: "Hand feeding builds attention and bonding; some dogs learn it is more rewarding than eating alone. It can also signal anxiety, neck or back pain (standing at a bowl is uncomfortable), or competition with other pets. Try raising the bowl, feeding in a quiet space, and stopping hand feeding gradually while offering normal meals at fixed times. If your dog still refuses the bowl entirely, a vet should check for pain or nausea.",
    },
    {
      q: "When does not eating become an emergency?",
      a: "Immediately for puppies without food for 12 hours, any dog with repeated vomiting and an empty stomach, distended abdomen, collapse, suspected toxin ingestion, or known serious disease. For healthy adults, 48 hours without food or 24 hours with other symptoms warrants urgent care. When unsure, call your vet — describing behaviour and duration takes minutes and can prevent serious complications.",
    },
  ],
  faqTitle: "Frequently asked questions",
  relatedTitle: "Related guides",
  relatedLinks: [
    { href: "/health", label: "Dog and cat health" },
    { href: "/nutrition", label: "Pet nutrition" },
    { href: "/dog-vomiting-diarrhea", label: "Dog vomiting and diarrhoea" },
    { href: "/dog-ate-chocolate", label: "Dog ate chocolate" },
    { href: "/puppy-schedule", label: "Puppy schedule" },
  ],
};
