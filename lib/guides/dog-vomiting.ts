import type { GuideContent } from "@/lib/guides/types";

export const DOG_VOMITING_GUIDE: GuideContent = {
  badgeEmoji: "🤢",
  intro:
    "Dogs vomit more readily than humans — and that alone can be alarming if you are not used to it. Sometimes a single episode means nothing more than an empty stomach or a mouthful of grass; other times it signals obstruction, poisoning, or a life-threatening condition like gastric dilatation-volvulus (bloat). The colour of what comes up, how often it happens, and what your dog is doing between episodes tell you a great deal. This guide walks through each vomit type, when to monitor at home, when to call the vet today, and when to go straight to emergency — so you can respond with confidence instead of panic.",
  sections: [
    {
      id: "by-colour",
      emoji: "🎨",
      title: "Vomiting by colour — what it means",
      paragraphs: [
        "True vomiting involves active abdominal effort — retching, heaving, and contraction of the stomach muscles. Regurgitation is passive: undigested food simply falls out of the oesophagus with little warning and no abdominal straining. Telling them apart matters because causes and urgency differ. The colour and texture of vomit offer clues, though no single colour proves a diagnosis on its own.",
      ],
      subsections: [
        {
          title: "Yellow or yellow-green (bile)",
          paragraphs: [
            "The most common colour owners see. Bile is produced in the liver and stored in the gall bladder; when the stomach is empty, bile can irritate the lining and trigger vomiting — often first thing in the morning before breakfast. This pattern is called bilious vomiting syndrome and is usually manageable with smaller, more frequent meals or a late-night snack. If bile vomiting happens daily despite feeding changes, or is accompanied by weight loss or diarrhoea, ask your vet to rule out gastritis, reflux, or metabolic disease.",
          ],
        },
        {
          title: "White foam",
          paragraphs: [
            "Typically a mix of saliva and air from retching on an empty stomach. Common after eating grass, during nausea, or when a dog has been coughing and gagging. If white foam appears with repeated unproductive retching and a swollen, hard abdomen, treat as a possible bloat emergency — do not wait.",
          ],
        },
        {
          title: "Clear liquid",
          paragraphs: [
            "Usually water or diluted saliva. Often seen when a nauseous dog drinks heavily and then brings it back up, or when they have eaten too quickly and swallowed air. Monitor unless episodes repeat or other symptoms appear.",
          ],
        },
        {
          title: "Undigested food (shortly after eating)",
          paragraphs: [
            "Food that looks much as it did going in, within minutes of a meal, may be regurgitation rather than true vomiting — think oesophageal issues, eating too fast, or overeating. Slow-feeder bowls and smaller portions help. Persistent regurgitation warrants investigation for megaoesophagus or other structural problems.",
          ],
        },
        {
          title: "Partially digested food (hours after eating)",
          paragraphs: [
            "Suggests delayed gastric emptying, gastroenteritis, pancreatitis, or partial obstruction. If food from breakfast appears in vomit in the evening, call your vet — especially if your dog is also lethargic or in pain.",
          ],
        },
        {
          title: "Brown / smells like faeces",
          paragraphs: [
            "Possible intestinal obstruction or, in severe cases, material refluxing from the lower gut. This is an emergency. Do not offer food or water; go to the vet immediately.",
          ],
        },
        {
          title: "Red / blood",
          paragraphs: [
            "Fresh red blood may come from a torn oesophagus (after prolonged retching), a bleeding ulcer, haemorrhagic gastroenteritis (HGE), or swallowed blood from a mouth injury. Any blood in vomit warrants a vet call the same day — sooner if the amount is significant or your dog is weak.",
          ],
        },
        {
          title: "Black / coffee grounds",
          paragraphs: [
            "Digested blood — often from a stomach ulcer or upper gastrointestinal bleeding. This is an emergency. Dark, granular vomit means blood has been in the stomach long enough to be partially digested. Seek urgent veterinary care.",
          ],
        },
      ],
    },
    {
      id: "frequency",
      emoji: "⏱️",
      title: "Frequency matters too",
      paragraphs: [
        "A single vomit in an otherwise bright, hungry, playful dog is often worth watching rather than rushing to clinic — especially if they immediately want to eat grass or drink water and seem fine afterward. Withholding food briefly and reintroducing bland meals is reasonable.",
        "Repeated vomiting strips fluids and electrolytes quickly. Puppies and small breeds dehydrate faster than large adults. When in doubt, a phone call to your vet with a clear timeline — what was vomited, how many times, and over what period — helps them advise whether you can wait or should come in.",
      ],
      items: [
        "Vomited once, acting normal: monitor; withhold food 2–4 hours, offer small amounts of water",
        "Vomiting 2–3 times in 24 hours: watch closely; call vet if not improving or if other signs appear",
        "Vomiting 4 or more times: call your vet the same day",
        "Vomiting every hour or unable to keep water down: treat as urgent — same-day vet or emergency",
        "Any vomiting lasting more than 24 hours: veterinary assessment needed",
        "Puppy or senior dog vomiting repeatedly: lower threshold for calling — seek advice promptly",
      ],
    },
    {
      id: "emergency",
      emoji: "🚨",
      title: "Emergency signs — go NOW",
      variant: "urgent",
      paragraphs: [
        "Some combinations of signs cannot safely wait until morning. Gastric dilatation-volvulus (GDV or bloat) kills within hours if untreated. Intestinal obstruction, certain poisonings, and parvovirus in unvaccinated puppies are equally time-critical.",
      ],
      items: [
        "Blood in vomit — fresh red or coffee-ground appearance",
        "Unproductive retching with a distended, hard abdomen (GDV/bloat suspected)",
        "Vomiting with collapse, extreme weakness, or pale gums",
        "Suspected poisoning — chocolate, grapes, xylitol, rat poison, or unknown substance",
        "Severe abdominal pain — crying, hunched posture, unwillingness to move",
        "Puppy vomiting repeatedly, especially if unvaccinated (parvovirus risk)",
        "Vomiting and unable or unwilling to urinate",
        "Vomit that smells like faeces or contains foreign material you did not see them swallow",
      ],
    },
    {
      id: "causes",
      emoji: "🔍",
      title: "Common causes of dog vomiting",
      subsections: [
        {
          title: "Usually not serious",
          items: [
            "Ate too fast or too much in one sitting",
            "Ate grass — common self-soothing behaviour; often followed by one vomit",
            "Dietary indiscretion — scavenged food, rich scraps, or something mildly irritating",
            "Motion sickness during car travel",
            "Empty stomach — bilious vomiting syndrome, especially overnight",
            "Mild stress — new environment, fireworks, or routine change",
            "Sudden diet change without gradual transition",
          ],
        },
        {
          title: "Needs vet attention",
          items: [
            "Gastroenteritis — viral, bacterial, or dietary; may include diarrhoea",
            "Pancreatitis — often after fatty meals; painful abdomen, hunched back",
            "Intestinal obstruction — toys, bones, corn cobs, socks; may progress to emergency",
            "Kidney or liver disease — often with increased thirst, weight loss, or jaundice",
            "Addison's disease — waxing and waning vomiting, weakness, collapse",
            "Parvovirus — puppies, unvaccinated dogs; bloody diarrhoea, profound lethargy",
            "Poisoning — chocolate, grapes, raisins, xylitol, antifreeze, and many household items",
            "Intussusception or twisted gut — severe pain, rapid deterioration",
          ],
        },
      ],
    },
    {
      id: "home-care",
      emoji: "✅",
      title: "Home care for mild vomiting (no emergency signs)",
      paragraphs: [
        "When your dog has vomited once or twice but remains alert, interested in food (even if you temporarily withhold it), and has normal gum colour, home nursing is often appropriate for 12–24 hours. The goal is to rest the stomach, prevent dehydration, and reintroduce food gently.",
        "Never give human anti-nausea drugs, ibuprofen, paracetamol, or aspirin unless your vet specifically instructs you — many are toxic to dogs or mask symptoms that need treatment. Pepto-Bismol and similar products should only be used under veterinary guidance.",
      ],
      numberedItems: [
        "Withhold food for 2–4 hours after the last vomit; offer ice cubes or small sips of water if they are thirsty",
        "If no further vomiting, offer a small bland meal: plain boiled chicken (no skin or seasoning) with white rice",
        "Feed several small portions through the day rather than one large meal",
        "Monitor energy, gum colour, and whether they keep water down",
        "If stable after 24 hours, gradually mix increasing amounts of normal food over 2–3 days",
        "Contact your vet if vomiting resumes, diarrhoea develops, or your dog becomes lethargic",
      ],
    },
  ],
  faq: [
    {
      q: "My dog vomits every morning on an empty stomach — why?",
      a: "This classic pattern fits bilious vomiting syndrome: bile irritates an empty stomach overnight. Try feeding a small snack before bed or offering breakfast earlier. Split daily food into three or four smaller meals. If morning vomiting continues despite these changes, or your dog loses weight, ask your vet to check for gastritis, reflux, or other underlying causes.",
    },
    {
      q: "Is it normal for dogs to eat grass and then vomit?",
      a: "Many dogs eat grass occasionally, and some vomit afterward — owners often wonder if the grass caused the sickness or if the dog ate grass because they already felt nauseous. Occasional grass eating with a single vomit and quick recovery is common. Concern rises if grass eating becomes compulsive, if vomiting is frequent, or if they eat non-food items as well (pica), which can indicate nutritional gaps or gastrointestinal disease.",
    },
    {
      q: "Can I give my dog Pepto-Bismol or antacids?",
      a: "Do not medicate without veterinary advice. Some antacids are safe in correct doses; others interact with prescribed drugs or contain ingredients harmful to dogs. Pepto-Bismol contains salicylates related to aspirin and is not appropriate for every dog. Your vet can recommend safe options based on weight, other medications, and the likely cause of vomiting.",
    },
    {
      q: "My dog vomited once but is acting normally — should I call the vet?",
      a: "A single episode in an otherwise well dog can often be monitored at home: withhold food briefly, offer water in small amounts, and watch for recurrence. Call your vet if they vomit again within 24 hours, refuse food for more than a day, show lethargy, develop diarrhoea, or if you suspect they swallowed something dangerous. When unsure, a quick phone call costs nothing and provides peace of mind.",
    },
    {
      q: "How do I know if my dog has a blockage?",
      a: "Warning signs include repeated vomiting (often with little or no food coming up), inability to keep water down, abdominal pain, hunched posture, lethargy, loss of appetite, and absence of bowel movements or diarrhoea. Some dogs pass small amounts of diarrhoea around an obstruction. Vomit that smells faecal is especially concerning. Blockages can become surgical emergencies — if you suspect one, go to the vet immediately rather than waiting.",
    },
  ],
  faqTitle: "Frequently asked questions",
  relatedTitle: "Related guides",
  relatedLinks: [
    { href: "/dog-not-eating", label: "Dog not eating — causes and when to worry" },
    { href: "/dog-ate-chocolate", label: "Dog ate chocolate — what to do right now" },
    { href: "/dangers", label: "Common dangers and toxins for pets" },
    { href: "/health", label: "Dog and cat health overview" },
  ],
};
