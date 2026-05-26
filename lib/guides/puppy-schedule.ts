import type { GuideContent } from "@/lib/guides/types";

export const PUPPY_SCHEDULE_GUIDE: GuideContent = {
  badgeEmoji: "🐶",
  intro:
    "Bringing a puppy home is one of the most joyful experiences in dog ownership — and one of the most demanding. Puppies are not small adult dogs; they need frequent meals, enormous amounts of sleep, predictable toilet breaks, and gentle, short training sessions. A clear daily schedule reduces anxiety for both of you: your puppy learns what happens next, toilet accidents decrease, and sleep improves. This week-by-week guide covers feeding times by age, toilet training rhythm, sleep needs, first commands, night routines, and developmental milestones so you can build a routine that fits real life while supporting healthy growth.",
  sections: [
    {
      id: "golden-rule",
      emoji: "📅",
      title: "The golden rule: routine equals security",
      paragraphs: [
        "Puppies learn through repetition and consistency. Same feeding times, same toilet breaks after waking and eating, same sleep spot, and the same calm cues before bedtime help the brain form reliable associations. Within two to three weeks of a steady routine, most puppies begin to anticipate the next activity — that predictability lowers stress and problem behaviours such as excessive crying or destructive chewing.",
        "Flexibility still matters: life happens, and one off-schedule day will not ruin training. But the closer you stay to core anchors (meals, outdoor toilet trips, crate rest), the faster house training and sleep settle. Everyone in the household should follow the same rules so the puppy is not confused by mixed messages.",
        "Adjust times to your lifestyle as long as intervals stay appropriate for age — a puppy fed at 7:00 or 7:30 daily is fine; random meal times are not.",
      ],
    },
    {
      id: "feeding",
      emoji: "🍽️",
      title: "Feeding schedule by age",
      paragraphs: [
        "Puppies need more meals per day than adults because their stomachs are small and their energy demands are high. Follow the portion guidelines on your puppy food packaging based on expected adult weight, not current puppy weight alone — brands calculate daily calories for growth. You should feel ribs with light pressure but not see them prominently; your vet can help you score body condition at each visit.",
        "Always provide fresh water. Do not free-feed large breeds without guidance — scheduled meals make toilet training predictable and help you notice when appetite drops.",
      ],
      subsections: [
        {
          title: "8–12 weeks: four meals per day",
          items: [
            "7:00 AM — Meal 1",
            "12:00 PM — Meal 2",
            "5:00 PM — Meal 3",
            "9:00 PM — Meal 4",
          ],
          paragraphs: [
            "This is the most intensive feeding window. Space meals roughly evenly through waking hours. The last meal should be early enough that a toilet trip afterward still allows a calm wind-down before bed.",
          ],
        },
        {
          title: "3–6 months: three meals per day",
          items: [
            "7:00 AM — Meal 1",
            "1:00 PM — Meal 2",
            "6:00 PM — Meal 3",
          ],
          paragraphs: [
            "Around four months, many puppies transition from four to three meals. Do it gradually over a week if recommended by your food brand or vet. Growth rate starts to slow but nutrient needs remain high.",
          ],
        },
        {
          title: "6–12 months: two meals per day",
          items: [
            "7:00 AM — Meal 1",
            "6:00 PM — Meal 2",
          ],
          paragraphs: [
            "Most dogs move to adult meal frequency between six and twelve months depending on breed size. Large and giant breeds often benefit from staying on puppy-formulated food longer — follow your veterinarian's advice for your breed.",
          ],
        },
        {
          title: "How much to feed",
          paragraphs: [
            "Use the feeding chart on your puppy food bag as a starting point based on expected adult weight. Adjust up or down by roughly 10 percent according to body condition — visible waist from above, ribs palpable without excess fat cover. Treats should not exceed 10 percent of daily calories; too many treats unbalance nutrition and ruin mealtime appetite.",
            "Sudden changes in food should be done over 7–10 days by mixing old and new to avoid diarrhoea. If your puppy has persistent loose stool despite slow transitions, consult your vet.",
          ],
        },
      ],
    },
    {
      id: "toilet",
      emoji: "🚽",
      title: "Toilet training schedule",
      paragraphs: [
        "House training is about preventing accidents by taking your puppy outside at the right moments, then rewarding elimination in the correct place. Punishment after indoor accidents does not teach — it creates fear and hiding. Clean accidents with enzymatic cleaner to remove scent markers.",
        "Take your puppy outside: immediately after waking from any nap; five to fifteen minutes after every meal; after play sessions; before bedtime; and approximately every one to two hours during the day for an eight-week-old puppy.",
        "Rule of thumb for holding capacity: a puppy can often hold their bladder for roughly one hour per month of age plus one (a two-month-old ≈ three hours maximum — and that is optimistic). Overnight is longer because metabolism slows during sleep, but young puppies still need a middle-of-the-night trip.",
        "Use the same outdoor spot and a consistent phrase (\"go potty\") so cues become familiar. Reward calmly immediately after success — not after coming back inside.",
      ],
    },
    {
      id: "sleep",
      emoji: "😴",
      title: "Sleep schedule",
      paragraphs: [
        "Puppies sleep 16 to 18 hours per day spread across naps and night sleep. Sleep is not laziness — it is essential for brain development, immune function, and emotional regulation. Overtired puppies often become bitey and hyper; if your puppy is frantic in the evening, try an enforced nap in the crate.",
        "Sample day for an eight-week-old puppy (adjust times to your routine):",
      ],
      items: [
        "7:00 — Wake up, outside immediately",
        "7:15 — Breakfast",
        "7:30 — Play and exploration (30 minutes maximum — young puppies tire quickly)",
        "8:00 — Nap (1–2 hours)",
        "10:00 — Outside, short walk or supervised play",
        "10:30 — Nap",
        "12:00 — Lunch",
        "12:30 — Short play or training (5 minutes maximum)",
        "1:00 — Nap",
        "3:00 — Outside, play",
        "3:30 — Nap",
        "5:00 — Dinner",
        "5:30 — Play and socialisation (calm, positive experiences)",
        "6:30 — Nap",
        "9:00 — Last meal, then outside",
        "9:30 — Settle for night in crate or puppy pen",
      ],
    },
    {
      id: "training",
      emoji: "🎓",
      title: "Training schedule — first commands",
      paragraphs: [
        "Training sessions for young puppies should be short — five minutes maximum — and end on success. Use tiny soft treats and enthusiastic praise. Harsh corrections damage trust and slow learning.",
        "Focus on one skill per session. Practice in low-distraction environments before adding difficulty outdoors after vaccinations are complete.",
      ],
      subsections: [
        {
          title: "Week 1–2 at home",
          items: [
            "Name recognition — say name, reward eye contact",
            "Sit — lure with treat, mark and reward",
            "Come — short distances indoors, high-value rewards",
            "Crate training — feed meals in crate, door open first",
            "No jumping — turn away, reward four paws on floor",
          ],
        },
        {
          title: "Week 3–4",
          items: [
            "Stay — one to two seconds, build duration slowly",
            "Down — from sit position",
            "Leave it — closed fist, reward for ignoring",
            "Loose leash walking — indoors and garden first",
          ],
        },
        {
          title: "Week 5–8",
          items: [
            "Reinforce all basics with slightly longer duration and distance",
            "Wait at door — sit before going outside",
            "Off furniture — consistent cue and reward for bed/mat",
            "Recall in garden — never punish coming when called",
          ],
        },
      ],
    },
    {
      id: "night-routine",
      emoji: "🌙",
      title: "Night routine — surviving the first weeks",
      paragraphs: [
        "Most puppies cry the first few nights in a new home. This is normal separation distress, not manipulation. Your goal is safety, toilet success, and gradual independence — not instant silence at any cost.",
        "Place the crate near your bed for the first week so the puppy senses your presence; many owners gradually move the crate farther over subsequent weeks. A warm water bottle wrapped in a towel (not leaking) or a commercial heartbeat toy can comfort some pups — never use hot water that could burn.",
        "Do not bring the puppy into your bed if you do not want an adult dog sleeping there — habits formed at eight weeks are hard to change later. A middle-of-the-night toilet trip (around 2:00–3:00 AM for an eight-week-old) prevents crate accidents and speeds house training.",
        "Keep night interactions boring: lights low, no play, straight outside for toilet, then back to crate. Expect two to four weeks before many puppies sleep through the night; small breeds may take longer.",
      ],
      items: [
        "Crate near your bed the first week to reduce crying",
        "Comfort items: ticking clock sound or safe warm bottle — supervise",
        "Avoid bed-sharing unless that is your long-term plan",
        "Alarm for one night toilet break for young puppies",
        "Expect gradual improvement over 2–4 weeks",
      ],
    },
    {
      id: "milestones",
      emoji: "📋",
      title: "Week-by-week milestones",
      subsections: [
        {
          title: "Week 1 at home",
          paragraphs: [
            "Priority is settling in, not impressive tricks. Limit visitors and overwhelming environments. Focus on schedule, crate as safe den, toilet breaks, and gentle handling of paws, ears, and mouth for future grooming and vet exams.",
          ],
        },
        {
          title: "Week 2",
          paragraphs: [
            "Introduce sit and name games in short bursts. Puppy should begin to enter the crate willingly for meals. Continue socialisation with household sounds — vacuum at a distance, doorbell recordings, etc.",
          ],
        },
        {
          title: "Week 3",
          paragraphs: [
            "First short leash experiences in the garden if vet-approved for your vaccination status. Positive meetings with calm, vaccinated adult dogs and friendly people. Never force frightened puppies — go at their pace.",
          ],
        },
        {
          title: "Week 4",
          paragraphs: [
            "Enroll in a positive-reinforcement puppy class if available. Add come and stay with very easy criteria. Toilet accidents should be decreasing if schedule is consistent.",
          ],
        },
        {
          title: "Week 8–12",
          paragraphs: [
            "Vaccination series often completes in this window — your vet will confirm when public walks and dog parks are safe. Expand outdoor socialisation gradually. Avoid dog parks until manners and immunity are solid.",
          ],
        },
        {
          title: "Month 3–6",
          paragraphs: [
            "Adolescence approaches: testing boundaries, increased chewing, and selective listening are normal. Stay consistent with rules and exercise — mental enrichment (puzzle feeders, sniff walks) prevents destructive boredom.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "My puppy won't sleep in the crate — what do I do?",
      a: "Make the crate positive: feed meals inside with the door open, toss treats in for exploration, and cover with a light blanket for den-like feel. Never use the crate only for punishment. Start with short closed-door sessions while you are home. Night crying often improves when the crate is beside your bed initially. If panic is extreme (vomiting, bloody stool from stress, self-injury), ask your vet or a certified trainer about separation training — true isolation distress needs a structured plan.",
    },
    {
      q: "How do I know if my puppy is eating enough?",
      a: "Steady growth on vet weigh-ins, good energy, and a body you can feel ribs on without prominent hip or spine bones usually means adequate intake. Puppies should not look pot-bellied except briefly after meals. Persistent hunger with thin body may mean insufficient portions; leaving food constantly without finishing can mean overfeeding or wrong schedule. Your veterinarian plots growth on a curve for your breed — use that as the gold standard, not guesswork.",
    },
    {
      q: "My puppy bites a lot — is this normal?",
      a: "Yes. Mouthing is normal play and teething behaviour from roughly 8 to 16 weeks. Redirect to appropriate chew toys, use short play sessions, and enforce nap times — overtired puppies bite hardest. Yelp and withdraw attention briefly for hard bites, but expect weeks of consistency. Never hit or squeeze the muzzle; that increases fear biting. If breaking skin or aggression with stiff body language occurs, seek professional help early.",
    },
    {
      q: "When can puppies start going outside?",
      a: "Follow your veterinarian's vaccination timeline. Many puppies can explore private gardens and carry in clean shoes before full immunity, but public parks and unknown dog faeces wait until the vet confirms protection — usually one to two weeks after the final puppy vaccination. Early socialisation still matters: safe exposure to sounds, surfaces, people, and vaccinated dogs in controlled settings prevents fear later.",
    },
    {
      q: "How do I stop my puppy from crying at night?",
      a: "Ensure toilet needs are met, keep the crate comfortable and nearby, and avoid exciting play during night wake-ups. Gradually increase distance from your bed over weeks if desired. Crying for a few minutes during adjustment can be normal; prolonged panic needs a training plan. Avoid letting the puppy out only for crying unless you are certain it is not a toilet need — otherwise crying is rewarded. Daytime exercise and naps prevent overtired night chaos.",
    },
  ],
  faqTitle: "Frequently asked questions",
  relatedTitle: "Related guides",
  relatedLinks: [
    { href: "/nutrition", label: "Pet nutrition" },
    { href: "/dog-home-alone", label: "Dog home alone" },
    { href: "/vaccinations", label: "Vaccinations" },
    { href: "/health", label: "Dog and cat health" },
    { href: "/house-training", label: "House training" },
    { href: "/puppy-socialization", label: "Puppy socialization" },
  ],
};
