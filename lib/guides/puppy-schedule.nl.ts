import type { GuideContent } from "@/lib/guides/types";

export const PUPPY_SCHEDULE_GUIDE_NL: GuideContent = {
  badgeEmoji: "🐶",
  intro:
    "Een pup in huis halen is een van de leukste fases van hondeneigenaarschap, maar ook een van de meest intensieve. Een pup is geen kleine volwassen hond: hij heeft meerdere maaltijden per dag nodig, veel slaap, vaste uitlaatrondes en korte, positieve trainingsmomenten. Een helder dagschema geeft rust voor jullie allebei: je pup leert wat er komt, zindelijkheid gaat sneller en nachten worden voorspelbaarder. Deze gids neemt je stap voor stap mee door voertijden per leeftijd, ritme voor zindelijkheid, slaapbehoefte, eerste commando's, nachtroutine en ontwikkelmijlpalen, zodat je een praktisch schema bouwt dat past bij je dagelijks leven en tegelijk gezonde groei ondersteunt.",
  sections: [
    {
      id: "golden-rule",
      emoji: "📅",
      title: "De gouden regel: routine geeft veiligheid",
      paragraphs: [
        "Pups leren het snelst via herhaling en consistentie. Dezelfde voedertijden, hetzelfde uitlaatschema na slapen en eten, dezelfde slaapplaats en dezelfde rustige signalen voor bedtijd helpen het brein voorspelbare patronen vormen. Na twee tot drie weken met een stabiele routine gaan de meeste pups activiteiten herkennen en verwachten. Die voorspelbaarheid verlaagt stress en beperkt probleemgedrag, zoals overmatig piepen of slopen.",
        "Natuurlijk blijft flexibiliteit belangrijk: het echte leven verloopt niet elke dag exact hetzelfde en een incidentele verschuiving maakt niets kapot. Toch versnellen zindelijkheid, slaap en trainingsprogressie merkbaar wanneer de kernankers (maaltijden, uitlaten, rustmomenten) zo constant mogelijk blijven. Laat alle gezinsleden dezelfde regels hanteren, anders krijgt de pup tegenstrijdige signalen.",
        "Pas tijden gerust aan op jouw dagindeling, zolang de intervallen bij de leeftijd passen. Een pup die dagelijks om 7:00 of 7:30 eet doet het prima; willekeurige tijdstippen maken training onnodig lastig.",
      ],
    },
    {
      id: "feeding",
      emoji: "🍽️",
      title: "Voerschema per leeftijd",
      paragraphs: [
        "Pups hebben meer eetmomenten nodig dan volwassen honden, omdat hun maaginhoud beperkt is en hun energiebehoefte hoog ligt. Gebruik de voeradviezen op de verpakking als startpunt op basis van het verwachte volwassen gewicht, niet alleen op het huidige puppygewicht. Je moet de ribben licht kunnen voelen zonder dat ze duidelijk uitsteken. Je dierenarts kan tijdens controles helpen met een objectieve lichaamsconditiescore.",
        "Zorg altijd voor vers drinkwater. Onbeperkt voer laten staan is meestal onhandig, zeker bij grotere rassen: geplande maaltijden maken zindelijkheid voorspelbaar en helpen je sneller opmerken als de eetlust afneemt.",
      ],
      subsections: [
        {
          title: "8-12 weken: vier maaltijden per dag",
          items: [
            "07:00 – Maaltijd 1",
            "12:00 – Maaltijd 2",
            "17:00 – Maaltijd 3",
            "21:00 – Maaltijd 4",
          ],
          paragraphs: [
            "Dit is de meest intensieve voerfase. Verdeel maaltijden zo gelijkmatig mogelijk over de actieve uren. Plan de laatste maaltijd op tijd, zodat er nog een rustige uitlaatrond kan volgen voor het slapengaan.",
          ],
        },
        {
          title: "3-6 maanden: drie maaltijden per dag",
          items: [
            "07:00 – Maaltijd 1",
            "13:00 – Maaltijd 2",
            "18:00 – Maaltijd 3",
          ],
          paragraphs: [
            "Rond vier maanden stappen veel pups over van vier naar drie maaltijden. Doe dit geleidelijk in ongeveer een week als jouw voermerk of dierenarts dat adviseert. De groeisnelheid daalt langzaam, maar voedingsbehoefte blijft hoog.",
          ],
        },
        {
          title: "6-12 maanden: twee maaltijden per dag",
          items: [
            "07:00 – Maaltijd 1",
            "18:00 – Maaltijd 2",
          ],
          paragraphs: [
            "De meeste honden schakelen ergens tussen zes en twaalf maanden over naar het volwassen maaltijdritme, afhankelijk van rasgrootte. Grote en reuzenrassen blijven vaak langer op puppyvoer. Volg hiervoor het advies van je dierenarts per ras en groeicurve.",
          ],
        },
        {
          title: "Hoeveel moet je voeren?",
          paragraphs: [
            "Gebruik het voedingsschema op de zak als basis, met de verwachte volwassen grootte als referentie. Pas de hoeveelheid daarna met ongeveer 10 procent op of af volgens lichaamsconditie: taille zichtbaar van boven, ribben voelbaar zonder dikke vetlaag. Snacks mogen idealiter niet meer dan 10 procent van de totale dagelijkse calorieën zijn; teveel tussendoortjes verstoren de voedingsbalans en verminderen maaltijdhonger.",
            "Verander je van voer, bouw dan in 7-10 dagen over door oud en nieuw voer te mengen. Zo verklein je de kans op diarree. Blijft de ontlasting ondanks rustige overgang afwijkend, overleg dan met je dierenarts.",
          ],
        },
      ],
    },
    {
      id: "toilet",
      emoji: "🚽",
      title: "Zindelijkheidsschema",
      paragraphs: [
        "Zindelijk maken draait vooral om ongelukken voorkomen door op de juiste momenten naar buiten te gaan en succes op de juiste plek direct te belonen. Straffen na een ongeluk binnen leert je pup niet waar hij wel moet plassen; het vergroot vooral onzekerheid. Gebruik enzymreiniger zodat geuren verdwijnen en plekken binnenshuis niet opnieuw aantrekkelijk worden.",
        "Ga naar buiten: direct na elke slaap, vijf tot vijftien minuten na elke maaltijd, na spelmomenten, voor bedtijd en overdag ongeveer elke één tot twee uur bij een pup van acht weken.",
        "Vuistregel voor ophouden: vaak kan een pup ongeveer één uur per levensmaand plus één uur de blaas vasthouden (een pup van twee maanden dus circa drie uur maximaal, en dat is optimistisch). 's Nachts lukt het meestal langer door lagere activiteit, maar jonge pups hebben vaak toch nog een nachtelijk plasrondje nodig.",
        "Gebruik steeds dezelfde plasplek en hetzelfde korte cuewoord (bijvoorbeeld \"plasje doen\"), zodat herkenning ontstaat. Beloon direct buiten na succes, niet pas als je weer binnen bent.",
      ],
    },
    {
      id: "sleep",
      emoji: "😴",
      title: "Slaapschema",
      paragraphs: [
        "Pups slapen gemiddeld 16 tot 18 uur per etmaal, verdeeld over dutjes en nacht. Dat is geen lui gedrag maar cruciaal voor hersenontwikkeling, immuunsysteem en emotieregulatie. Een oververmoeide pup wordt vaak juist druk, bijterig en moeilijk te sturen. Is je pup 's avonds overprikkeld, plan dan een verplichte rustperiode in bench of puppyren.",
        "Voorbeeld van een dagindeling voor een pup van acht weken (pas tijden aan op je eigen ritme):",
      ],
      items: [
        "07:00 – Wakker worden, direct naar buiten",
        "07:15 – Ontbijt",
        "07:30 – Kort spel en verkennen (maximaal 30 minuten; jonge pups raken snel moe)",
        "08:00 – Dutje (1-2 uur)",
        "10:00 – Naar buiten, korte wandeling of begeleid spel",
        "10:30 – Dutje",
        "12:00 – Lunch",
        "12:30 – Korte training of spel (maximaal 5 minuten)",
        "13:00 – Dutje",
        "15:00 – Naar buiten, spelmoment",
        "15:30 – Dutje",
        "17:00 – Avondmaaltijd",
        "17:30 – Spel en socialisatie (rustig en positief)",
        "18:30 – Dutje",
        "21:00 – Laatste maaltijd, daarna naar buiten",
        "21:30 – Nachtstart in bench of puppyren",
      ],
    },
    {
      id: "training",
      emoji: "🎓",
      title: "Trainingsschema – eerste commando's",
      paragraphs: [
        "Trainingssessies voor jonge pups moeten kort blijven: meestal maximaal vijf minuten, met een duidelijk succesmoment als afsluiting. Gebruik kleine zachte beloningen en enthousiaste, kalme bevestiging. Harde correcties ondermijnen vertrouwen en vertragen het leerproces.",
        "Werk per sessie aan één vaardigheid. Oefen eerst in een omgeving met weinig afleiding en maak het pas later moeilijker, bijvoorbeeld buiten na volledige vaccinatie.",
      ],
      subsections: [
        {
          title: "Week 1-2 thuis",
          items: [
            "Naamherkenning – noem de naam en beloon oogcontact",
            "Zit – lok met een beloning, markeer en beloon",
            "Hier – korte afstand in huis, hoge beloningswaarde",
            "Benchtraining – voer maaltijden in de bench, eerst met deur open",
            "Niet opspringen – draai weg en beloon vier pootjes op de grond",
          ],
        },
        {
          title: "Week 3-4",
          items: [
            "Blijf – start met één à twee seconden, bouw langzaam op",
            "Af/lig – vanuit zitpositie",
            "Laat – gesloten hand, beloon negeren",
            "Netjes meelopen aan lijn – eerst binnen en in de tuin",
          ],
        },
        {
          title: "Week 5-8",
          items: [
            "Alle basiscommando's herhalen met iets meer duur en afstand",
            "Wachten bij de deur – eerst zitten voor naar buiten gaan",
            "Van de bank/stoel – consequent cuewoord, beloon op eigen plek",
            "Recall in tuin – nooit straffen als je pup komt wanneer je roept",
          ],
        },
      ],
    },
    {
      id: "night-routine",
      emoji: "🌙",
      title: "Nachtroutine – de eerste weken doorkomen",
      paragraphs: [
        "Dat pups de eerste nachten piepen is normaal. Ze missen nest, geur en bekende geluiden. Dat is geen manipulatiegedrag. Je doel in deze fase is veiligheid, zindelijkheid en stap voor stap zelfstandigheid opbouwen – niet koste wat kost direct een volledig stille nacht.",
        "Zet de bench in de eerste week naast je bed zodat je pup je hoort en ruikt. Veel eigenaren schuiven de bench daarna geleidelijk verder weg. Een lauwwarme kruik in een handdoek (lekvrij) of een veilige heartbeat-knuffel kan sommige pups helpen ontspannen.",
        "Neem je pup niet in bed als je dat op volwassen leeftijd ook niet wilt. Gewoontes die je op acht weken creëert, zijn later lastig af te leren. Een nachtelijke uitlaatrond (vaak rond 02:00-03:00 bij acht weken) voorkomt benchongelukken en versnelt zindelijkheid.",
        "Houd nachtelijke interacties saai en kort: weinig licht, geen spel, direct naar buiten, daarna rustig terug naar de bench. Bij veel pups zie je in 2-4 weken duidelijke verbetering; kleine rassen kunnen wat langer nodig hebben.",
      ],
      items: [
        "Bench naast je bed in de eerste week vermindert nachtstress",
        "Comforthulpmiddelen: zacht tikkend geluid of veilige warmtebron – altijd onder toezicht",
        "Niet samen slapen tenzij dat je langetermijnplan is",
        "Wekker zetten voor één nachtelijk uitlaatrondje bij jonge pups",
        "Reken op geleidelijke verbetering binnen 2-4 weken",
      ],
    },
    {
      id: "milestones",
      emoji: "📋",
      title: "Mijlpalen per week",
      subsections: [
        {
          title: "Week 1 thuis",
          paragraphs: [
            "De focus ligt op wennen, niet op perfecte trucjes. Beperk drukte, bezoek en overprikkeling. Werk aan ritme, bench als veilige plek, zindelijkheid en zachte gewenning aan aanraking van poten, oren en bek voor latere verzorging en dierenartsbezoeken.",
          ],
        },
        {
          title: "Week 2",
          paragraphs: [
            "Introduceer naamspelletjes en \"zit\" in korte momenten. Je pup mag nu steeds vaker vrijwillig de bench in lopen voor maaltijden. Ga door met socialisatie met huisgeluiden, bijvoorbeeld stofzuiger op afstand of deurbelgeluiden op lage intensiteit.",
          ],
        },
        {
          title: "Week 3",
          paragraphs: [
            "Eerste korte lijnervaringen in de tuin kunnen, mits passend bij vaccinatiestatus volgens je dierenarts. Plan positieve ontmoetingen met rustige, gevaccineerde volwassen honden en vriendelijke mensen. Forceer niets bij angst; tempo van de pup is leidend.",
          ],
        },
        {
          title: "Week 4",
          paragraphs: [
            "Schrijf je eventueel in voor een positieve puppycursus. Voeg \"hier\" en \"blijf\" toe met heel eenvoudige criteria. Bij een consistent schema zouden ongelukjes binnenshuis nu merkbaar moeten afnemen.",
          ],
        },
        {
          title: "Week 8-12",
          paragraphs: [
            "In deze periode wordt de vaccinatieserie vaak afgerond. Je dierenarts geeft aan wanneer openbare wandelingen en drukkere hondenplekken veilig zijn. Breid buitenprikkels geleidelijk uit en vermijd hondenparken tot immuniteit en basisgedrag stevig genoeg zijn.",
          ],
        },
        {
          title: "Maand 3-6",
          paragraphs: [
            "De puberteitsfase komt eraan: grenzen testen, meer kauwdrang en selectief luisteren zijn dan normaal. Blijf consequent met regels, beweging en mentale uitdaging. Verrijking zoals snuffelwandelingen en voerpuzzels voorkomt sloopgedrag door verveling.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Mijn pup wil niet in de bench slapen. Wat moet ik doen?",
      a: "Maak de bench consequent positief: voer maaltijden in de bench met deur open, strooi beloningen om ontdekken te stimuleren en maak de plek knus met een dun kleedje eroverheen. Gebruik de bench niet alleen als strafplek. Start met korte gesloten-deurmomenten terwijl je in de buurt bent. Nachtelijk piepen vermindert vaak als de bench in het begin naast je bed staat. Zie je extreme paniek (braken, bloederige ontlasting door stress, zelfverwonding), vraag dan je dierenarts of een gecertificeerde trainer om een gestructureerd separatieplan.",
    },
    {
      q: "Hoe weet ik of mijn pup genoeg eet?",
      a: "Gestaag groeien op controleweegmomenten, goede energie en een lichaamsvorm waarbij ribben voelbaar maar niet zichtbaar uitgemergeld zijn, wijzen meestal op voldoende inname. Een pup hoort niet blijvend bol te zijn buiten vlak na een maaltijd. Blijvende honger met mager lichaam kan op te kleine porties wijzen; continu voer laten staan zonder opeten kan juist overvoeren of een onhandig schema betekenen. Je dierenarts kan groei op een rasgerichte curve volgen; dat is betrouwbaarder dan gokken.",
    },
    {
      q: "Mijn pup bijt veel. Is dat normaal?",
      a: "Ja. Bekgebruik hoort bij spel en wisselen van tanden, vaak tussen 8 en 16 weken. Stuur om naar geschikte kauwmaterialen, houd speelsessies kort en plan genoeg dutjes - oververmoeide pups bijten meestal harder. Reageer op harde beten met korte aandachtsonderbreking en wees consequent. Slaan of de snuit dichtknijpen werkt averechts en vergroot angst. Ontstaan er wondjes, stijve lichaamstaal of echt agressieve patronen, schakel dan vroeg professionele begeleiding in.",
    },
    {
      q: "Wanneer mag een pup naar buiten?",
      a: "Volg het vaccinatieschema van je dierenarts. Veel pups mogen vóór volledige bescherming wel veilig in een eigen tuin of gecontroleerde schone omgeving komen, maar publieke plekken met onbekende hondenontlasting wacht je uit tot de dierenarts groen licht geeft - vaak één tot twee weken na de laatste puppyvaccinatie. Vroege socialisatie blijft belangrijk: bied veilige prikkels zoals verschillende ondergronden, geluiden, mensen en stabiele gevaccineerde honden.",
    },
    {
      q: "Hoe stop ik nachtelijk huilen van mijn pup?",
      a: "Check eerst toiletbehoefte, zorg voor een comfortabele bench dichtbij en maak nachtelijke momenten saai en voorspelbaar. Verplaats de bench indien gewenst pas geleidelijk verder weg over meerdere weken. Kort piepen tijdens wennen kan normaal zijn; langdurige paniek vraagt een trainingsaanpak. Laat je pup niet alleen uit de bench omdat hij piept, tenzij je vermoedt dat hij echt moet plassen - anders beloon je het piepen onbedoeld. Overdag voldoende beweging én rust helpt veel voor rustige nachten.",
    },
  ],
  faqTitle: "Veelgestelde vragen",
  relatedTitle: "Gerelateerde gidsen",
  relatedLinks: [
    { href: "/nutrition", label: "Voeding voor huisdieren" },
    { href: "/dog-home-alone", label: "Hond alleen thuis" },
    { href: "/vaccinations", label: "Vaccinaties" },
    { href: "/health", label: "Gezondheid van hond en kat" },
    { href: "/house-training", label: "Zindelijkheidstraining" },
    { href: "/puppy-socialization", label: "Puppysocialisatie" },
  ],
};
