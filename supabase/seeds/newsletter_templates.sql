-- Seed 10 pre-written newsletter templates for "Laad voorbeeldnieuwsbrief"
-- Run after migration 20250304_newsletter_templates_and_drafts.sql

INSERT INTO newsletter_templates (id, titel, subject_nl, subject_en, body_nl, body_en, volgorde) VALUES
(
  gen_random_uuid(),
  'Welkom bij de SavedSouls Familie!',
  'Welkom bij de SavedSouls Familie! 🐾',
  'Welcome to the SavedSouls Family! 🐾',
  'Lieve Soul Saver,

Welkom! Je hebt je aangemeld voor onze nieuwsbrief en bent officieel onderdeel van onze familie.

Wie zijn wij?
SavedSouls Foundation is opgericht in 2010 in Ban Khok Ngam, Khon Kaen, Thailand. Meer dan 550 honden, 45 katten en enkele varkens hebben hier een thuis gevonden.

Onze specialiteit
Wij zijn één van de weinige opvangcentra in Thailand voor gehandicapte dieren. Verlamde honden, blinde katten, getraumatiseerde dieren uit de hondenvleeshandel — zij zijn hier thuis.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Welcome! By signing up you have officially become part of our family.

Who are we?
SavedSouls Foundation was founded in 2010 in Ban Khok Ngam, Khon Kaen, Thailand. Over 550 dogs, 45 cats and several pigs have found a home here.

Our speciality
We are one of the very few shelters in Thailand for disabled animals. Paralyzed dogs, blind cats, traumatized animals from the dog meat trade — this is their home.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  1
),
(
  gen_random_uuid(),
  'Gered uit de Hondenvleeshandel',
  'Gered uit de Hondenvleeshandel 🚨',
  'Rescued from the Dog Meat Trade 🚨',
  'Lieve Soul Saver,

Elke maand rijden onze vrijwilligers naar plaatsen waar wij liever niet naartoe zouden hoeven gaan. Maar de dieren hebben ons nodig.

De realiteit
De illegale hondenvleeshandel in Azië treft miljoenen dieren. Wij redden hen uit transporten, slachthuizen en van de straat.

Na redding
Rust, zachte handen, vers eten, schoon water. Het herstelproces kan maanden of jaren duren. Wij hebben alle geduld.

Voedselkosten: 5.000 baht per dag (€135).
Elke donatie gaat rechtstreeks naar de dieren.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Every month our volunteers drive to places we wish we never had to go. But the animals need us.

The reality
The illegal dog meat trade in Asia affects millions of animals. We rescue them from transports, slaughterhouses and the streets.

After rescue
Rest, gentle hands, fresh food, clean water. The healing process can take months or years. We have all the patience in the world.

Food costs: 5,000 baht per day (€135).
Every donation goes directly to the animals.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  2
),
(
  gen_random_uuid(),
  'Zwemtherapie: Hoe Water Wonderen Verricht',
  'Zwemtherapie: Hoe Water Wonderen Verricht 💧',
  'Swim Therapy: How Water Works Wonders 💧',
  'Lieve Soul Saver,

Stel je voor: een hond die nooit meer zou kunnen lopen, die zijn eerste stappen in het water zet.

Waarom zwemtherapie?
Water vermindert druk op gewrichten en versterkt spieren. Honden die aan land nauwelijks bewegen, zwemmen met groot gemak.

Meer dan 80 honden hebben een fysieke beperking. Voor hen is zwemtherapie geen luxe maar noodzaak.

Eén maand therapie sponsoren = slechts €20.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Imagine: a dog that would never walk again, taking its first steps in the water.

Why swim therapy?
Water reduces pressure on joints and strengthens muscles. Dogs that can barely move on land swim with great ease.

Over 80 dogs have a physical disability. For them swim therapy is not a luxury but a necessity.

Sponsor one month of therapy = just €20.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  3
),
(
  gen_random_uuid(),
  'Adoptieverhaal: Luna Vindt Haar Thuis',
  'Adoptieverhaal: Luna Vindt Haar Thuis 🏡',
  'Adoption Story: Luna Finds Her Home 🏡',
  'Lieve Soul Saver,

Sommige honden vinden het allerooiste: een eigen gezin.

Luna''s verhaal
Gevonden langs de weg in Khon Kaen — uitgehongerd, vol teken, gebroken poot. Na maanden van zorg groeide ze uit tot een vrolijke hond met een onstuitbaar staartje.

De adoptie
Een Nederlands gezin zag haar profiel en was direct verliefd. Na vaccinaties, chip en paspoort vloog Luna naar Nederland. Haar eerste nacht sliep ze op de bank.

Interesse in adoptie? Kijk op onze website.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Some dogs find the most beautiful thing of all: their own family.

Luna''s story
Found on the roadside in Khon Kaen — starving, covered in ticks, broken leg. After months of care she blossomed into a cheerful dog with an unstoppable wagging tail.

The adoption
A Dutch family saw her profile and immediately fell in love. After vaccinations, chip and passport Luna flew to the Netherlands. Her first night she slept on the sofa.

Interested in adoption? Check our website.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  4
),
(
  gen_random_uuid(),
  'Vrijwilligers: De Ruggengraat van de Opvang',
  'Vrijwilligers: De Ruggengraat van de Opvang 🤝',
  'Volunteers: The Backbone of the Shelter 🤝',
  'Lieve Soul Saver,

Met 8-10 medewerkers voor 550+ dieren: zonder vrijwilligers redden wij het niet.

Een dag als vrijwilliger
Vroeg beginnen. Hokken schoonmaken, bakjes wassen, eten geven. Daarna socialisatie — honden uitlaten, katten knuffelen, getraumatiseerde dieren begeleiden.

Wie komen er?
Van studenten tot gepensioneerden, uit 12+ landen. Gratis accommodatie op het terrein beschikbaar.

Minimaal één week. Aanmelden via onze website.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

With 8-10 staff for 550+ animals: without volunteers we simply could not manage.

A day as a volunteer
Early start. Clean enclosures, wash bowls, give food. Then socialization — walk dogs, cuddle cats, guide traumatized animals.

Who comes?
From students to retirees, from 12+ countries. Free accommodation on the grounds available.

Minimum one week. Register via our website.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  5
),
(
  gen_random_uuid(),
  'De Kosten van Zorg: Transparantie over Ons Budget',
  'De Kosten van Zorg: Transparantie over Ons Budget 💰',
  'The Cost of Care: Transparency About Our Budget 💰',
  'Lieve Soul Saver,

Wij geloven in volledige transparantie.

Dagelijkse kosten
Voer: 5.000 baht/dag (€135). Daarboven medicijnen, dierenarts, hygiëne, elektriciteit en water. Totaal: €5.000-6.000 per maand.

Waar gaat jouw donatie?
Meer dan 90% direct naar dierzorg. Geen duur kantoor, geen overhead.

€5/maand — voedsel één hond per dag
€20/maand — volledige zorg één dier
€50/maand — revalidatie gehandicapte hond

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

We believe in complete transparency.

Daily costs
Food: 5,000 baht/day (€135). On top: medicine, vet, hygiene, electricity and water. Total: €5,000-6,000 per month.

Where does your donation go?
Over 90% directly to animal care. No expensive office, no overhead.

€5/month — food for one dog per day
€20/month — full care for one animal
€50/month — rehabilitation for disabled dog

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  6
),
(
  gen_random_uuid(),
  'Kerstactie: Warme Maaltijden voor 550 Zielen',
  'Kerstactie: Warme Maaltijden voor 550 Zielen 🎄',
  'Christmas Appeal: Warm Meals for 550 Souls 🎄',
  'Lieve Soul Saver,

Elk jaar bereiden wij een speciale kerstmaaltijd voor alle dieren. Vers vlees, groenten, rijst. De honden weten het — je ziet het aan hun staarten.

Extra kosten: €300 boven dagelijks budget.

Doe mee aan de kerstactie — elke bijdrage gaat direct naar de kerstmaaltijd. Overschot gaat naar ons medisch noodfonds.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Every year we prepare a special Christmas meal for all animals. Fresh meat, vegetables, rice. The dogs know — you can see it in their tails.

Extra cost: €300 above daily budget.

Join the Christmas appeal — every contribution goes directly to the Christmas meal. Surplus goes to our medical emergency fund.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  7
),
(
  gen_random_uuid(),
  'Nieuw Project: Medische Kliniek op het Terrein',
  'Nieuw Project: Medische Kliniek op het Terrein 🏥',
  'New Project: Medical Clinic on the Grounds 🏥',
  'Lieve Soul Saver,

Na jaren plannen zijn wij begonnen met de bouw van een medische kliniek op ons terrein.

Waarom?
Nu: 40 minuten rijden voor elke behandeling. Met eigen kliniek: snellere zorg, lagere kosten, uitgebreidere sterilisatieprogramma''s.

Kosten: €8.000 totaal. Helft al binnen.
Doneer met omschrijving ''kliniek''.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

After years of planning we have started building a medical clinic on our grounds.

Why?
Now: 40 minutes drive for every treatment. With own clinic: faster care, lower costs, expanded sterilization programs.

Cost: €8,000 total. Half already raised.
Donate with description ''clinic''.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  8
),
(
  gen_random_uuid(),
  'Webshop & Affiliate: Shop met een Hart',
  'Webshop & Affiliate: Shop met een Hart 🛍️',
  'Webshop & Affiliate: Shop with a Heart 🛍️',
  'Lieve Soul Saver,

Steun ons zonder extra te betalen via onze affiliate shop. Jij koopt wat je toch al wilt — wij ontvangen een bijdrage. Win-win.

Dierproducten, reisaccessoires, diervriendelijke merken — bewust geselecteerd op onze waarden.

Deel de link met dierenliefhebbers. Hoe meer mensen shoppen, hoe meer wij ontvangen.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

Support us without spending extra via our affiliate shop. You buy what you would buy anyway — we receive a contribution. Win-win.

Animal products, travel accessories, animal-friendly brands — consciously selected on our values.

Share the link with animal lovers. The more people shop, the more we receive.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  9
),
(
  gen_random_uuid(),
  'Een Jaar SavedSouls: Terugblik en Vooruitblik',
  'Een Jaar SavedSouls: Terugblik en Vooruitblik 🌟',
  'A Year of SavedSouls: Look Back and Ahead 🌟',
  'Lieve Soul Saver,

40+ adoptie successen. Zwemtherapie uitgebreid. Vrijwilligers uit 12 landen. Kliniekbouw gestart.

Maar ook moeilijke momenten — ziekte, financiële krapte, afscheid van geliefde dieren. Elk verlies geeft ons meer kracht.

2025: kliniek afmaken, meer adoptanten bereiken, vrijwilligersprogramma uitbreiden.

Dank jij voor je steun dit jaar. Wij kunnen het niet zonder jou.

Met hartelijke groet en pootjes,
Melanie de Wit & alle medewerkers en vrijwilligers
SavedSouls Foundation',
  'Dear Soul Saver,

40+ adoption successes. Swim therapy expanded. Volunteers from 12 countries. Clinic construction started.

But also difficult moments — illness, financial constraints, saying goodbye to beloved animals. Every loss gives us more strength.

2025: finish the clinic, reach more adopters, expand the volunteer program.

Thank you for your support this year. We cannot do it without you.

With warm regards and paws,
Melanie de Wit & all staff and volunteers
SavedSouls Foundation',
  10
)
ON CONFLICT (volgorde) DO UPDATE SET
  titel = EXCLUDED.titel,
  subject_nl = EXCLUDED.subject_nl,
  subject_en = EXCLUDED.subject_en,
  body_nl = EXCLUDED.body_nl,
  body_en = EXCLUDED.body_en;
