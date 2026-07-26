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
      q: "Hoe lang kan een hond zonder eten?",
      a: "De meeste gezonde volwassen honden kunnen 3 tot 5 dagen zonder voedsel voordat ernstige gezondheidsgevolgen ontstaan, maar dat betekent niet dat je zo lang moet wachten. Een hond die langer dan 48 uur niet eet, heeft een dierenartscontrole nodig. Pups moeten binnen 12 uur na voedselweigering gezien worden vanwege het risico op hypoglykemie.",
    },
    {
      q: "Waarom eet mijn hond niet maar gedraagt hij zich normaal?",
      a: "Een hond die voedsel weigert maar speels, alert en actief blijft, heeft meestal een gedragsmatige of milde oorzaak — stress, voerverveling, te veel snacks, of een recente vaccinatie. Monitor 24 uur goed. Als de weigering aanhoudt of andere symptomen ontstaan, neem contact op met je dierenarts.",
    },
    {
      q: "Wat kan ik geven aan een hond die niet wil eten?",
      a: "Probeer ongekruide gekookte kipfilet met witte rijst, licht opgewarmd natvoer, of natriumarme kippenbouillon bij de brokken. Kleine porties met de hand in een rustige ruimte helpen vaak. Voeg nooit ui, knoflook of kruiden toe. Weigert de hond na 24 uur nog steeds, ga naar de dierenarts in plaats van eindeloos andere voeders te proberen.",
    },
    {
      q: "Moet ik me zorgen maken als mijn hond één maaltijd overslaat?",
      a: "Eén maaltijd overslaan bij een verder gezonde volwassen hond is meestal geen spoedgeval. Honden hebben niet elke dag op hetzelfde moment honger — een grote maaltijd de avond ervoor, warm weer of milde stress kan een gemiste maaltijd veroorzaken. Let op andere symptomen. Slaat de hond een tweede opeenvolgende maaltijd over of toont hij ziekteverschijnselen, neem dan contact op met je dierenarts.",
    },
    {
      q: "Mijn hond eet niet en braakt — wat moet ik doen?",
      a: "Niet eten in combinatie met braken is een reden om dezelfde dag je dierenarts te bellen, niet om te wachten. Deze combinatie kan wijzen op gastritis, pancreatitis, darmafsluiting, parvovirus of inname van iets giftigs. Bij herhaald braken, zwakte of sloomheid, een opgezette buik, of bloed in het braaksel: behandel het als spoedgeval en ga meteen naar een kliniek.",
    },
    {
      q: "Waarom eet mijn pup niet?",
      a: "Pups stoppen vaak met eten door stress na scheiding van het nest, darmparasieten, infecties of parvovirus. Anders dan volwassen honden hebben pups zeer kleine energiereserves en kunnen ze binnen uren gevaarlijk lage bloedsuiker (hypoglykemie) ontwikkelen. Een pup die langer dan 12 uur voedsel weigert, of die sloom is, braakt of diarree heeft, heeft dringend veterinaire zorg nodig.",
    },
    {
      q: "Kan een hond niet eten door stress?",
      a: "Ja — stress is een van de meest voorkomende redenen waarom honden voedsel weigeren. Verhuizen, een nieuw huisdier of persoon in huis, hard geluid, vuurwerk of een veranderde routine kunnen allemaal de eetlust onderdrukken. Herstel voorspelbare voertijden, bied voer aan op een rustige plek en haal concurrentie van andere huisdieren weg. De eetlust keert meestal binnen 24 tot 48 uur terug zodra de stress afneemt.",
    },
    {
      q: "Mijn hond eet niet maar drinkt wel water — is dat ernstig?",
      a: "Normaal drinken terwijl hij voedsel weigert wijst vaker op misselijkheid, mondpijn of een onderliggende aandoening zoals nierziekte, diabetes of leverziekte dan op puur kieskeurig gedrag. Let op urineproductie en energieniveau. Houdt de weigering langer dan 24 uur aan of zie je meer drinken, gewichtsverlies of sloomheid, plan dan een dierenartsafspraak voor bloedonderzoek.",
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
