import type { GuideContent } from "@/lib/guides/types";

export const DOG_VOMITING_GUIDE_NL: GuideContent = {
  badgeEmoji: "🤢",
  intro:
    "Een hond die braakt kan enorm schrikken geven, zeker als je niet goed kunt inschatten of het om iets onschuldigs of juist gevaarlijks gaat. Honden braken sneller dan mensen, en dat maakt het lastig: soms is het een eenmalige reactie op gras eten of een lege maag, maar soms is het het eerste teken van een obstructie, vergiftiging of een levensbedreigende maagdraaiing (GDV/bloat). De context bepaalt de ernst: wat komt er precies mee omhoog, welke kleur heeft het, hoe vaak gebeurt het, en hoe gedraagt je hond zich tussen de episodes? Een hond die eenmaal braakt en daarna levendig blijft, heeft meestal een ander risicoprofiel dan een hond die herhaaldelijk braakt, niet kan drinken of buikpijn vertoont. In deze gids lees je hoe je braaksel beter interpreteert, wanneer je thuis kunt observeren, wanneer je dezelfde dag de dierenarts moet bellen en wanneer je direct naar een spoedkliniek moet gaan. Zo kun je snel en rationeel handelen op basis van signalen in plaats van alleen op paniek. Vroege herkenning van rode vlaggen kan het verschil maken tussen eenvoudige ondersteuning thuis en een situatie waarin elk uur telt.",
  sections: [
    {
      id: "by-colour",
      emoji: "🎨",
      title: "Braken per kleur – wat het kan betekenen",
      paragraphs: [
        "Eerst is het belangrijk om onderscheid te maken tussen echt braken en regurgitatie. Bij braken zie je actieve buikpers: kokhalzen, samentrekken van de buik en duidelijke inspanning. Regurgitatie is passiever: voedsel komt vaak zonder waarschuwing weer naar buiten vanuit de slokdarm, meestal zonder krachtig persen. Dat onderscheid is belangrijk, omdat de oorzaken en urgentie verschillen.",
        "Kleur en textuur van braaksel geven aanwijzingen, maar leveren nooit op zichzelf een definitieve diagnose. Gebruik kleur altijd samen met frequentie, gedrag, eetlust, hydratatie en andere klachten zoals diarree, buikpijn of sloomheid.",
      ],
      subsections: [
        {
          title: "Geel of geelgroen (gal)",
          paragraphs: [
            "Dit is een van de meest voorkomende patronen. Gal wordt geproduceerd in de lever en opgeslagen in de galblaas. Wanneer de maag lang leeg is, kan gal de maagwand irriteren en braken uitlokken, vaak vroeg in de ochtend vóór de eerste maaltijd. Dit past bij bilieus braaksyndroom en is regelmatig te verbeteren door kleinere, vaker verdeelde maaltijden of een lichte snack laat op de avond.",
            "Als galbraken dagelijks terugkomt ondanks voedingsaanpassingen, of samengaat met gewichtsverlies, diarree, lusteloosheid of verminderde eetlust, is verder onderzoek nodig om bijvoorbeeld gastritis, reflux of stofwisselingsproblemen uit te sluiten.",
          ],
        },
        {
          title: "Wit schuim",
          paragraphs: [
            "Wit schuim bestaat vaak uit speeksel en lucht bij misselijkheid of kokhalzen op een lege maag. Het kan ook voorkomen na gras eten of bij honden die hoesten en kokhalzen. Let vooral op de combinatie met herhaald vruchteloos kokhalzen en een opgezette, harde buik; dat kan wijzen op een maagdraaiing en is een onmiddellijke spoedsituatie.",
          ],
        },
        {
          title: "Heldere vloeistof",
          paragraphs: [
            "Meestal gaat het om water of verdund speeksel. Dit zie je vaak wanneer een misselijke hond snel veel drinkt en het direct weer uitbraakt. Eenmalig is dit niet altijd ernstig, maar herhaling kan snel uitdroging veroorzaken, vooral bij pups en kleine rassen.",
          ],
        },
        {
          title: "Onverteerd voer (kort na eten)",
          paragraphs: [
            "Voedsel dat er vrijwel hetzelfde uitziet als bij inname en binnen minuten terugkomt, past vaak beter bij regurgitatie dan bij echt braken. Oorzaken kunnen zijn: te snel eten, te grote porties of slokdarmproblemen. Een anti-schrokbak en kleinere porties helpen soms direct. Blijft het probleem bestaan, dan is onderzoek naar onder andere megaoesofagus of andere structurele afwijkingen verstandig.",
          ],
        },
        {
          title: "Deels verteerd voer (uren na eten)",
          paragraphs: [
            "Wanneer voer van een eerdere maaltijd pas veel later wordt uitgebraakt, kan dat wijzen op vertraagde maaglediging, ontsteking van maag/darm, pancreatitis of een gedeeltelijke obstructie. Zeker als je hond zich tegelijk sloom gedraagt of buikpijn heeft, is contact met de dierenarts dezelfde dag verstandig.",
          ],
        },
        {
          title: "Bruin / ontlastingsgeur",
          paragraphs: [
            "Bruin braaksel met fecale geur is alarmerend en kan passen bij ernstige obstructie of reflux van darminhoud. Dit is geen afwacht-situatie. Geef geen eten of drinken en ga direct naar een dierenarts of spoedkliniek.",
          ],
        },
        {
          title: "Rood / bloed",
          paragraphs: [
            "Vers rood bloed kan afkomstig zijn van beschadiging van slokdarm of keel na veel kokhalzen, maar ook van een bloedende maagwand, zweren, ernstig ontstoken darmen of inname van toxische stoffen. Elke zichtbare hoeveelheid bloed in braaksel vereist minimaal overleg op dezelfde dag; bij grote hoeveelheden, zwakte of bleek tandvlees is directe spoed nodig.",
          ],
        },
        {
          title: "Zwart / koffiedikachtig",
          paragraphs: [
            "Dit duidt vaak op verteerd bloed dat al enige tijd in de maag aanwezig was. Het klassieke 'koffiedik'-uiterlijk is een rode vlag voor maag-darmbloeding en vereist onmiddellijke veterinaire beoordeling.",
          ],
        },
      ],
    },
    {
      id: "frequency",
      emoji: "⏱️",
      title: "Frequentie is minstens zo belangrijk",
      paragraphs: [
        "Een enkele braakepisode bij een verder alerte, vrolijke hond met normale eetlust is vaak thuis te volgen. In veel gevallen is tijdelijke maagprikkeling de oorzaak. Toch blijft observatie essentieel: het patroon in de uren daarna vertelt vaak meer dan de eerste episode zelf.",
        "Herhaald braken leidt snel tot verlies van vocht en elektrolyten. Pups, kleine rassen, oudere honden en honden met onderliggende aandoeningen drogen sneller uit en hebben een lagere veiligheidsmarge. Noteer daarom altijd een korte tijdlijn: wat werd uitgebraakt, hoe vaak, wanneer en met welke bijkomende symptomen. Die informatie helpt de dierenarts direct de juiste urgentie in te schatten.",
      ],
      items: [
        "Eenmalig braken, hond verder normaal: observeren; voer 2-4 uur pauzeren, kleine beetjes water aanbieden",
        "2-3 keer braken in 24 uur: nauwlettend volgen; bellen bij geen verbetering of extra klachten",
        "4 keer of vaker braken: dezelfde dag dierenartscontact",
        "Elk uur braken of water niet binnenhouden: urgent, dezelfde dag beoordeling",
        "Braken langer dan 24 uur: altijd diergeneeskundig onderzoek nodig",
        "Pup of senior met herhaald braken: lagere drempel voor direct overleg",
      ],
    },
    {
      id: "emergency",
      emoji: "🚨",
      title: "Spoedsignalen – ga direct",
      variant: "urgent",
      paragraphs: [
        "Sommige combinaties van symptomen zijn potentieel levensbedreigend en mogen niet wachten tot de volgende dag. Bij maagdraaiing, ernstige obstructie, bepaalde vergiftigingen of parvovirose kan snelle behandeling het verschil maken tussen herstel en snelle verslechtering.",
      ],
      items: [
        "Bloed in braaksel, vers rood of koffiedikachtig",
        "Vruchteloos kokhalzen met een opgezette, harde buik (verdenking GDV/bloat)",
        "Braken met instorten, extreme zwakte of bleek tandvlees",
        "Verdenking vergiftiging: chocolade, druiven/rozijnen, xylitol, rattengif of onbekende stof",
        "Ernstige buikpijn: janken, kromme houding, niet willen bewegen",
        "Pup die herhaald braakt, vooral als vaccinatiestatus onvolledig is",
        "Braken gecombineerd met niet kunnen of willen plassen",
        "Braaksel met fecale geur of mogelijk vreemd voorwerp",
      ],
    },
    {
      id: "causes",
      emoji: "🔍",
      title: "Veelvoorkomende oorzaken van braken bij honden",
      subsections: [
        {
          title: "Vaak minder ernstig",
          items: [
            "Te snel of te veel eten in een korte tijd",
            "Gras eten met een eenmalige braakreactie",
            "Dieetfout: vet of sterk afwijkend voedsel, etensresten of afval",
            "Reisziekte in auto of ander transport",
            "Lege maag in de nacht (bilieus braken)",
            "Milde stress door nieuwe omgeving, vuurwerk of routineverandering",
            "Abrupte voerwissel zonder geleidelijke overgang",
          ],
        },
        {
          title: "Vraagt dierenartszorg",
          items: [
            "Gastro-enteritis door virale, bacteriële of nutritionele triggers",
            "Pancreatitis, vaak na vet voedsel, met pijnlijke buik en kromme rug",
            "Darmobstructie door speeltjes, botfragmenten, maïskolven, sokken of ander materiaal",
            "Nier- of leveraandoeningen, vaak met extra symptomen zoals dorstverandering en gewichtsverlies",
            "Addison met terugkerende episodes van braken, zwakte of collaps",
            "Parvovirus bij pups en ongevaccineerde honden, vaak met bloederige diarree",
            "Vergiftiging door voedingsstoffen, medicijnen, antivries of huishoudchemicaliën",
            "Intussusceptie of volvulus van de darm met snelle verslechtering en pijn",
          ],
        },
      ],
    },
    {
      id: "home-care",
      emoji: "✅",
      title: "Thuiszorg bij mild braken (zonder alarmsignalen)",
      paragraphs: [
        "Als je hond een of twee keer braakt maar verder alert blijft, normale slijmvlieskleur heeft en geen ernstige pijn vertoont, kun je meestal 12-24 uur ondersteunende thuiszorg proberen. Doel is de maag rust geven, uitdroging voorkomen en voeding gecontroleerd herintroduceren.",
        "Geef nooit op eigen initiatief humane middelen tegen misselijkheid of pijnstillers zoals ibuprofen, paracetamol of aspirine. Sommige middelen zijn toxisch voor honden of maskeren belangrijke symptomen. Ook producten zoals Pepto-Bismol alleen gebruiken op expliciet advies van je dierenarts.",
      ],
      numberedItems: [
        "Pauzeer voeding 2-4 uur na de laatste braakepisode; bied kleine slokjes water of ijsblokjes aan",
        "Bij uitblijven van nieuw braken: start met kleine portie licht verteerbaar voer (gekookte kip zonder vel/kruiding met witte rijst)",
        "Geef meerdere kleine porties verspreid over de dag in plaats van een grote maaltijd",
        "Controleer energie, tandvleeskleur, hydratatie en of water goed wordt behouden",
        "Bij stabiele situatie na 24 uur: stap in 2-3 dagen geleidelijk terug naar gewone voeding",
        "Neem alsnog contact op als braken terugkeert, diarree ontstaat of je hond duidelijk slomer wordt",
      ],
    },
  ],
  faq: [
    {
      q: "Mijn hond braakt elke ochtend op een lege maag, hoe komt dat?",
      a: "Dit patroon past vaak bij bilieus braaksyndroom: gal irriteert de lege maag in de vroege ochtend. Praktische eerste stappen zijn het dagrantsoen opdelen in kleinere porties, eerder ontbijt geven en eventueel een lichte avondsnack. Verdwijnt het patroon niet, of komen er klachten bij zoals gewichtsverlies, slechte eetlust of diarree, laat dan gericht onderzoek doen naar bijvoorbeeld gastritis, reflux of andere onderliggende aandoeningen.",
    },
    {
      q: "Is het normaal dat honden gras eten en daarna braken?",
      a: "Af en toe gras eten komt vaak voor en kan gevolgd worden door een eenmalige braakepisode zonder verdere problemen. Niet altijd veroorzaakt gras het braken; sommige honden eten juist gras omdat ze zich al misselijk voelen. Zorgen nemen toe als het gedrag frequent wordt, als er herhaald braken ontstaat of als je hond ook andere niet-eetbare materialen opeet. Dan is evaluatie van voeding, stress en mogelijke maag-darmproblemen verstandig.",
    },
    {
      q: "Kan ik mijn hond antacida of Pepto-Bismol geven?",
      a: "Geef geen medicatie zonder dierenartsadvies. Sommige maagmiddelen kunnen in specifieke doseringen veilig zijn, maar andere zijn ongeschikt of interfereren met bestaande medicatie. Producten met salicylaten zijn niet voor elke hond veilig. Je dierenarts kan op basis van gewicht, leeftijd, medische voorgeschiedenis en vermoedelijke oorzaak een passende en veilige keuze maken.",
    },
    {
      q: "Mijn hond braakte een keer maar lijkt nu normaal, moet ik bellen?",
      a: "Een eenmalige episode zonder andere alarmsignalen kun je vaak thuis observeren met korte voerpauze en kleine hoeveelheden water. Bel wel als er binnen 24 uur herhaling optreedt, je hond langer niet wil eten, sloom wordt, diarree krijgt, pijn toont of als je vermoedt dat er iets gevaarlijks is ingeslikt. Bij onzekerheid is vroeg telefonisch overleg altijd zinvol.",
    },
    {
      q: "Hoe herken ik een mogelijke darmobstructie?",
      a: "Let op herhaald braken (vaak met weinig opbrengst), moeite om water binnen te houden, duidelijke buikpijn, kromme houding, lusteloosheid, verminderde eetlust en veranderingen in ontlasting. Sommige honden hebben juist weinig ontlasting, anderen krijgen kleine beetjes diarree rond een obstructie. Fecale geur aan braaksel is extra verdacht. Een obstructie kan snel chirurgische spoed worden; bij verdenking niet afwachten.",
    },
  ],
  faqTitle: "Veelgestelde vragen",
  relatedTitle: "Gerelateerde gidsen",
  relatedLinks: [
    { href: "/dog-not-eating", label: "Hond eet niet: oorzaken en wanneer je je zorgen maakt" },
    { href: "/dog-ate-chocolate", label: "Hond chocolade gegeten: wat je nu moet doen" },
    { href: "/dangers", label: "Veelvoorkomende gevaren en toxines voor huisdieren" },
    { href: "/health", label: "Overzicht gezondheid van hond en kat" },
  ],
};
