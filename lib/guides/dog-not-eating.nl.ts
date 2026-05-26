import type { GuideContent } from "@/lib/guides/types";

export const DOG_NOT_EATING_GUIDE_NL: GuideContent = {
  badgeEmoji: "🍽️",
  intro:
    "Een gezonde hond die een enkele maaltijd overslaat, is meestal geen reden tot paniek. Honden eten niet altijd volgens het stereotype \"altijd honger\": na een grote avondmaaltijd, op warme dagen of bij lichte spanning kan een ontbijt worden overgeslagen. Maar als een hond langer dan 24 tot 48 uur niet eet, meerdere dagen duidelijk minder eet, of voedsel weigert in combinatie met andere klachten, speelt er vaak meer. Verminderde eetlust (anorexie) kan variëren van stress en kieskeurig gedrag tot gebitsproblemen, pancreatitis of ernstige ziekte, vooral bij pups. Deze gids helpt je de urgentie goed in te schatten, de meest voorkomende oorzaken te begrijpen, veilig thuis te ondersteunen en tijdig te herkennen wanneer een dierenarts noodzakelijk is.",
  sections: [
    {
      id: "how-long",
      emoji: "⏱️",
      title: "Hoe lang niet eten is te lang?",
      paragraphs: [
        "Niet alleen het feit dat je hond niet eet is belangrijk, maar vooral ook de duur. Volwassen honden kunnen een korte periode zonder voer vaak beter verdragen dan pups of kleine rassen, maar langdurige weigering vraagt altijd aandacht.",
        "Gebruik onderstaande tijdslijnen als richtlijn. Twijfel je, bel dan je dierenarts. Vroeg bellen en horen dat het meevalt is altijd beter dan te laat handelen wanneer uitdroging, ondervoeding of orgaanbelasting al aanwezig is.",
      ],
      items: [
        "Eén maaltijd overslaan: vaak acceptabel bij een verder alerte, actieve volwassen hond – wel goed monitoren",
        "24 uur zonder eten (gezonde volwassene): nauwlettend volgen; bel de dierenarts bij extra symptomen of aanhoudende weigering",
        "48 uur zonder eten: neem contact op met je dierenarts – verder onderzoek is nodig",
        "Pup eet 12 uur niet: direct dierenarts bellen – risico op hypoglykemie (te lage bloedsuiker)",
        "Senior hond eet 24 uur niet: dierenarts bellen – hogere kans op onderliggende ziekte",
        "Elke hond die niet eet EN braakt, sloom is of pijn toont: direct als urgent behandelen, ongeacht duur",
      ],
    },
    {
      id: "causes",
      emoji: "🔍",
      title: "Meest voorkomende oorzaken van verminderde eetlust",
      paragraphs: [
        "Eetlust wordt gestuurd door geur, smaak, maagcomfort, algemene gezondheid en emotionele toestand. Als een hond stopt met eten, denken dierenartsen grofweg in drie groepen: gedrags- of omgevingsfactoren, medische oorzaken en psychologische factoren. In de praktijk overlappen deze vaak. Een hond kan bijvoorbeeld lichte gebitspijn hebben én stress door een verhuizing.",
      ],
      subsections: [
        {
          title: "Gedrags- en omgevingsfactoren",
          paragraphs: [
            "Dit zijn veelvoorkomende oorzaken bij honden die verder gezond lijken. Vaak verbetert de eetlust zodra de trigger wordt herkend en weggenomen.",
          ],
          items: [
            "Stress door een nieuw huis, nieuw huisdier, verbouwing, vuurwerk of afwezigheid van de eigenaar",
            "Verandering in routine, voerplek of gezinsdynamiek",
            "Afkeer van het voer – receptwijziging, oud brokvoer of onprettige voerbakpositie",
            "Te veel snacks of tafelrestjes – de hond heeft simpelweg geen honger tijdens de maaltijd",
            "Concurrentie of intimidatie door een andere hond/kat bij de voerbak",
            "Warm weer – veel honden eten in de zomer tijdelijk minder",
            "Na vaccinatie – 24 uur minder trek kan mild en tijdelijk normaal zijn",
          ],
        },
        {
          title: "Medische oorzaken",
          paragraphs: [
            "Bij medische anorexie zie je vaak extra signalen, zoals slechte adem, kwijlen, braken, gewichtsverlies of lusteloosheid. Pijn op elke plek in het lichaam kan eetlust onderdrukken, niet alleen pijn in de bek.",
          ],
          items: [
            "Gebitsziekte, afgebroken tand of mondinfectie",
            "Misselijkheid door gastritis, voedingsfout of pancreatitis",
            "Darmafsluiting door een ingeslikt voorwerp",
            "Nierziekte, leverziekte of hartfalen",
            "Parvovirus bij ongevaccineerde pups – spoedgeval",
            "Pijn door artrose, trauma of buikproblemen",
            "Bijwerkingen van medicatie (zoals antibiotica, NSAID's, chemotherapie)",
            "Kanker of andere chronische systemische aandoeningen",
            "Koorts door infectie",
          ],
        },
        {
          title: "Psychologische oorzaken",
          paragraphs: [
            "Honden kunnen stress, verlies en onzekerheid sterk ervaren. Eetlust keert vaak terug wanneer rust, veiligheid en voorspelbaarheid terugkomen. Blijft het probleem bestaan, laat dan lichamelijke oorzaken uitsluiten.",
          ],
          items: [
            "Verlatingsangst bij alleen thuis blijven of veranderde dagindeling",
            "Depressief gedrag na overlijden van eigenaar of diermaatje",
            "Trauma of angst gekoppeld aan de voerplek of eerdere negatieve ervaringen",
          ],
        },
      ],
    },
    {
      id: "when-vet",
      emoji: "🚨",
      title: "Wanneer moet je direct naar de dierenarts?",
      variant: "urgent",
      paragraphs: [
        "Bepaalde combinaties van symptomen wijzen op een mogelijk spoedprobleem. Probeer dan geen huisremedies als eerste stap, maar ga meteen naar je dierenarts of spoedkliniek.",
      ],
      items: [
        "Niet eten EN herhaald braken of diarree",
        "Niet eten EN duidelijke sloomheid, zwakte of instorten",
        "Niet eten EN opgezette, pijnlijke of harde buik – risico op maagtorsie/bloat",
        "Pup eet 12+ uur niet of wordt slap/wankel",
        "Vermoeden van inname van iets giftigs, oneetbaars of bedorven voedsel",
        "Duidelijke pijnsignalen (janken, bolle rug, niet willen bewegen)",
        "Gele slijmvliezen, bleke slijmvliezen of bekende lever-/nierziekte",
        "Zichtbaar of voelbaar gewichtsverlies over dagen tot weken",
      ],
    },
    {
      id: "home-tips",
      emoji: "✅",
      title: "Wat je thuis veilig kunt proberen (zonder alarmsymptomen)",
      paragraphs: [
        "Gebruik deze aanpak alleen als je hond verder alert is, normaal drinkt en korter dan 24 uur voedsel weigert zonder braken of buikpijn. Zie je binnen 24 uur geen verbetering, neem dan contact op met de dierenarts.",
        "Dwangvoeren zonder veterinaire begeleiding is af te raden. Laat pups, diabetische honden of honden op belangrijke medicatie nooit zonder overleg vasten. Eetlustopwekkers bestaan, maar horen bij een diagnosegericht behandelplan.",
      ],
      numberedItems: [
        "Bied een alternatief aan: vers van hetzelfde voer, natvoer van hetzelfde merk of een kleine portie ongekruide gekookte kip kan tijdelijk helpen. Lauwwarm maken van natvoer versterkt geur en vaak ook eetlust.",
        "Voer kleine porties met de hand in een rustige ruimte zonder andere huisdieren. Stress en competitie zijn vaak verborgen oorzaken.",
        "Stop 24-48 uur volledig met snacks en tafelrestjes zodat normale honger terugkeert. Veel honden die \"niet eten\" zijn eigenlijk tussendoor al vol.",
        "Controleer de mond voorzichtig op rood tandvlees, afgebroken tanden, zwelling of vieze geur. Zie je iets afwijkends, plan dan een dierenartsbezoek in plaats van verder thuis uitproberen.",
        "Breng stressprikkels in kaart: bezoekers, lawaai, veranderde wandeluren. Herstel een voorspelbare dagstructuur.",
        "Sla één geplande maaltijd over (alleen met toestemming bij pups, seniors of diabetische honden). Een gezonde volwassene eet daarna vaak beter.",
        "Voeg een klein beetje natriumarme kippenbouillon toe aan brokken, maar vermijd producten met ui of knoflook in de ingrediënten.",
      ],
    },
    {
      id: "specific-situations",
      emoji: "📋",
      title: "Specifieke situaties",
      subsections: [
        {
          title: "Pup eet niet",
          paragraphs: [
            "Pups hebben beperkte energiereserves en kunnen snel hypoglykemie ontwikkelen bij onvoldoende voedselopname. Een pup die meer dan enkele maaltijden weigert, sloom wordt of ook braakt/diarree heeft, moet binnen uren beoordeeld worden en niet pas na meerdere dagen.",
            "Veelvoorkomende oorzaken zijn stress na scheiding van het nest, darmparasieten, infectie of parvovirus bij onvoldoende vaccinatie. Parvo is levensbedreigend: bloederige diarree, braken en sloomheid zijn spoedsignalen. Houd vaccinaties op schema en vermijd risicolocaties tot de serie compleet is.",
          ],
        },
        {
          title: "Senior hond eet niet",
          paragraphs: [
            "Bij oudere honden zijn gebitsproblemen, chronische nierziekte, kanker, cognitieve achteruitgang en artrosepijn frequente oorzaken. Seniors drogen sneller uit en verliezen sneller spiermassa wanneer anorexie aanhoudt.",
            "Neem binnen 24 uur contact op met de dierenarts bij duidelijke eetlustdaling, ook zonder andere opvallende klachten. Bloedonderzoek en grondig mondonderzoek laten vaak behandelbare oorzaken zien.",
          ],
        },
        {
          title: "Hond eet niet na operatie",
          paragraphs: [
            "Minder eetlust in de eerste 12 tot 24 uur na narcose en ingreep komt regelmatig voor. Misselijkheid, sufheid en medicatie spelen hierbij een rol. Geef kleine, lichte porties als de kliniek dat adviseert.",
            "Eet je hond langer dan 24 uur niet na een operatie, of braakt hij erbij, neem dan contact op met de opererende kliniek. Aanhoudende postoperatieve anorexie kan herstel vertragen en wijzen op pijn of complicaties.",
          ],
        },
        {
          title: "Hond eet niet maar drinkt wel",
          paragraphs: [
            "Wel drinken maar geen vaste voeding accepteren past vaker bij misselijkheid, mondpijn of systemische ziekte dan bij puur kieskeurig gedrag. Nierziekte, diabetes, leverproblemen en maagirritatie kunnen zo beginnen.",
            "Controleer urineproductie en energieniveau. Meer drinken in combinatie met minder eten is een reden voor bloedonderzoek. Alleen water drinken is op langere termijn niet voldoende; voedingstekorten en spierafbraak kunnen alsnog ontstaan.",
          ],
        },
        {
          title: "Hond eet niet en braakt",
          paragraphs: [
            "Deze combinatie moet je beschouwen als potentieel ernstig totdat de dierenarts anders aangeeft. Mogelijke oorzaken zijn voedingsfouten, pancreatitis, obstructie, vergiftiging of infectie.",
            "Laat je hond alleen kort vasten als je dierenarts dat aanbeveelt; pups mogen niet zonder professionele begeleiding vasten. Zoek dezelfde dag veterinaire zorg, zeker bij herhaald braken of bloed in braaksel.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is het normaal dat honden soms een maaltijd overslaan?",
      a: "Ja, bij veel volwassen honden kan dat incidenteel voorkomen. Een gemiste maaltijd na opwinding, reizen of hitte is vaak onschuldig als energie en hydratatie goed blijven. Het patroon is belangrijk: regelmatig overslaan, afvallen of bijkomende klachten is niet normaal. Houd bij hoeveel maaltijden worden geweigerd en of je hond nog wel enthousiast is voor snacks. Een hond die het avondeten laat staan maar om kaas bedelt, kan meer selectief dan ziek zijn.",
    },
    {
      q: "Moet ik iets door het voer doen om het aantrekkelijker te maken?",
      a: "Tijdelijke smaakversterkers zoals een lepel natvoer, ongekruide kip of een door de dierenarts geadviseerd supplement kunnen helpen bij herstel of milde misselijkheid. Op lange termijn kan structureel \"opleuken\" van brokken juist kieskeurig eetgedrag versterken. Heb je blijvend toevoegingen nodig, bespreek dan een uitgebalanceerde aanpak met je dierenarts. Sommige dieetvoeders zijn specifiek ontwikkeld voor hoge smakelijkheid zonder voedingsbalans te verstoren.",
    },
    {
      q: "Kan stress ervoor zorgen dat een hond stopt met eten?",
      a: "Absoluut. Verhuizing, nieuwe huisdieren, bezoek, onweer of afwezigheid van de eigenaar zorgen regelmatig voor 24-48 uur minder eetlust. Stressgerelateerde anorexie verbetert meestal zodra routine en veiligheid terugkeren. Herstelt de eetlust niet binnen twee dagen, of zie je verstoppen, trillen of braken, plan dan een dierenartscontrole. Stress en ziekte kunnen tegelijk aanwezig zijn.",
    },
    {
      q: "Mijn hond eet alleen als ik met de hand voer. Hoe komt dat?",
      a: "Handmatig voeren geeft aandacht en kan daardoor \"belonender\" worden dan zelfstandig eten. Het kan ook wijzen op angst, nek-/rugpijn (staan bij de bak is ongemakkelijk) of sociale druk van andere huisdieren. Probeer de voerbak op hoogte te brengen, voer op een rustige plek en bouw handvoeren geleidelijk af met vaste voertijden. Blijft je hond de bak volledig weigeren, laat dan pijn of misselijkheid medisch beoordelen.",
    },
    {
      q: "Wanneer is niet eten echt een spoedgeval?",
      a: "Meteen bij pups die 12 uur niet eten, elke hond met herhaald braken op lege maag, opgezette buik, instorten, vermoeden van toxische inname of bekende ernstige aandoeningen. Bij gezonde volwassenen geldt: 48 uur zonder eten of 24 uur zonder eten met extra symptomen vraagt urgente beoordeling. Twijfel je, bel je dierenarts; een snelle triage aan de telefoon voorkomt vaak grotere problemen.",
    },
  ],
  faqTitle: "Veelgestelde vragen",
  relatedTitle: "Gerelateerde gidsen",
  relatedLinks: [
    { href: "/health", label: "Gezondheid van hond en kat" },
    { href: "/nutrition", label: "Voeding voor huisdieren" },
    { href: "/dog-vomiting-diarrhea", label: "Hond braakt en heeft diarree" },
    { href: "/dog-ate-chocolate", label: "Hond heeft chocolade gegeten" },
    { href: "/puppy-schedule", label: "Puppyschema" },
  ],
};
