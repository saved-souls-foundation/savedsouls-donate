import type { GuideContent } from "@/lib/guides/types";

export const DOG_ATE_CHOCOLATE_GUIDE_NL: GuideContent = {
  badgeEmoji: "🍫",
  intro:
    "Raak niet in paniek, maar handel wel direct. Of je hond nu een chocoladereep van het aanrecht heeft gepakt, aan brownie-beslag heeft gelikt of cacaopoeder uit de kast heeft gevonden: chocolade is echt giftig voor honden. Hoe gevaarlijk het is, hangt vooral af van drie dingen: het soort chocolade, de hoeveelheid die is gegeten en het lichaamsgewicht van je hond. Kleine honden in combinatie met pure chocolade vormen het grootste risico. Klachten kunnen pas na enkele uren zichtbaar worden, dus afwachten omdat je hond nog \"normaal lijkt\" is riskant. In deze gids lees je precies wat je in de eerste minuten moet doen, hoe je de ernst inschat, welke symptomen je moet volgen en wanneer spoedhulp bij de dierenarts noodzakelijk is.",
  sections: [
    {
      id: "immediate-steps",
      emoji: "⚡",
      title: "Directe stappen – de eerste 5 minuten",
      variant: "urgent",
      numberedItems: [
        "Blijf kalm en handel snel. Paniek kost tijd; je hond heeft nu vooral nodig dat jij informatie verzamelt en direct professionele hulp inschakelt.",
        "Achterhaal precies wat er is gebeurd: welk type chocolade (melk, puur, bakchocolade, cacaopoeder), ongeveer hoeveel er is gegeten en wanneer de inname plaatsvond. Controleer verpakkingen, kruimels en lege wikkels.",
        "Bel direct je eigen dierenarts, een spoedkliniek of een diervergiftigingenhulplijn. Wacht niet tot symptomen ontstaan – behandeling werkt aantoonbaar beter als je vroeg begint.",
        "Houd deze gegevens klaar voordat je belt: huidig gewicht van je hond, soort chocolade, geschatte hoeveelheid (liefst in gram), tijdstip van inname en eventueel al aanwezige klachten.",
        "Volg professioneel advies precies op. Laat je hond thuis niet braken tenzij de dierenarts of hulplijn dat expliciet zegt – bij bepaalde producten of neurologische klachten kan dat juist gevaarlijk zijn.",
      ],
      paragraphs: [
        "Als je hond binnen de afgelopen twee uur chocolade heeft gegeten en je dierenarts dat adviseert, kan gevraagd worden om direct langs te komen zodat braken gecontroleerd wordt opgewekt. Gebruik nooit op eigen initiatief waterstofperoxide of andere huismiddeltjes; verkeerde dosering of timing kan ernstige complicaties veroorzaken.",
      ],
    },
    {
      id: "emergency-numbers",
      emoji: "📞",
      title: "Spoednummers diervergiftiging",
      variant: "urgent",
      paragraphs: [
        "Deze hulplijnen kunnen helpen de toxiciteit te berekenen en te bepalen of je meteen naar een spoedkliniek moet. Bij sommige diensten worden kosten in rekening gebracht.",
      ],
      items: [
        "Verenigde Staten - ASPCA Animal Poison Control: (888) 426-4435 (mogelijk betaald)",
        "Verenigd Koninkrijk - Animal PoisonLine: 01202 509000",
        "Nederland - Nationaal Vergiftigingen Informatie Centrum (NVIC): 030 274 8888",
        "Australië - Animal Poisons Helpline: 1300 869 738",
        "Is je hond al aan het braken, trillen, epileptische aanvallen aan het krijgen of ingestort? Ga dan direct naar de dichtstbijzijnde spoeddierenarts en wacht niet in een telefonische wachtrij.",
      ],
    },
    {
      id: "why-toxic",
      emoji: "☠️",
      title: "Waarom is chocolade giftig voor honden?",
      paragraphs: [
        "Chocolade bevat theobromine en cafeïne; beide stoffen behoren tot de methylxanthines. Honden breken theobromine veel langzamer af dan mensen. Bij mensen ligt de halfwaardetijd grofweg tussen de 6 en 10 uur, bij honden rond de 17 uur. Daardoor blijft de stof langer in het bloed en kunnen hogere concentraties ontstaan.",
        "Theobromine beïnvloedt het centrale zenuwstelsel, het hart- en vaatstelsel en de nieren. Het werkt stimulerend: de hartslag gaat omhoog, honden worden onrustig en in ernstige gevallen ontstaan spiertrekkingen, toevallen of gevaarlijke hartritmestoornissen. Omdat honden de stof minder efficiënt via lever en nieren uitscheiden, kan zowel een grote eenmalige dosis als herhaalde kleine blootstelling te veel worden.",
        "Cafeïne geeft extra stimulerende effecten, maar zit meestal in lagere hoeveelheden dan theobromine in chocoladeproducten. Pure chocolade, bakchocolade en cacaopoeder bevatten de hoogste concentraties. Daarom kan een kleine hoeveelheid pure chocolade gevaarlijker zijn dan een grotere hoeveelheid melkchocolade bij een hond van hetzelfde gewicht.",
        "Witte chocolade bevat nauwelijks theobromine, maar wel veel vet en suiker. Daardoor kunnen alvleesklierontsteking of maagdarmklachten ontstaan. Zie witte chocolade dus nooit als veilige snack; het is niet op dezelfde manier toxisch, maar nog steeds ongezond en het stimuleert gevaarlijk schrokgedrag.",
      ],
    },
    {
      id: "toxicity-table",
      emoji: "📊",
      title: "Hoe gevaarlijk is het? Chocoladetoxiciteit per soort",
      paragraphs: [
        "In de tabel hieronder zie je een benadering van het theobrominegehalte per 100 gram. Werkelijke waarden verschillen per merk en cacaopercentage. Ga bij twijfel uit van de hogere kant van de range.",
        "In de diergeneeskunde wordt het risico ingeschat met milligram theobromine per kilogram lichaamsgewicht (mg/kg). Lichte klachten verschijnen vaak rond 20 mg/kg, ernstige klachten rond 40-50 mg/kg en potentieel fatale doseringen vanaf ongeveer 60 mg/kg. Individuele gevoeligheid verschilt: sommige honden worden al bij lagere doseringen ernstig ziek.",
        "Voorbeeldberekening: een hond van 10 kg eet 100 g pure chocolade van 70% met ongeveer 200 mg theobromine per 100 g. Totale inname is dan circa 200 mg, dus dosis = 200 / 10 = 20 mg/kg. Lichte tot matige symptomen zijn dan aannemelijk. Bel altijd je dierenarts voor bevestiging; vertrouw niet alleen op een eigen rekenvoorbeeld.",
      ],
      table: {
        headers: ["Soort chocolade", "Theobromine per 100 g", "Gevaarniveau"],
        rows: [
          ["Witte chocolade", "0,25 mg", "Zeer laag"],
          ["Melkchocolade", "44-60 mg", "Middelmatig"],
          ["Pure chocolade (50%)", "160 mg", "Hoog"],
          ["Pure chocolade (70%+)", "200-450 mg", "Zeer hoog"],
          ["Bak-/kookchocolade", "400-450 mg", "Extreem hoog"],
          ["Cacaopoeder", "400-737 mg", "Extreem hoog"],
          ["Cacaomulch (tuin)", "Zeer hoog", "Extreem hoog"],
        ],
      },
      items: [
        "Drempel voor milde symptomen: ongeveer 20 mg theobromine per kg lichaamsgewicht",
        "Drempel voor ernstige symptomen: ongeveer 40-50 mg per kg",
        "Potentieel fataal: vanaf ongeveer 60+ mg per kg (zoek ruim voor dit niveau al spoedzorg)",
      ],
    },
    {
      id: "symptoms",
      emoji: "🤒",
      title: "Symptomen van chocoladevergiftiging bij honden",
      paragraphs: [
        "Klachten beginnen meestal tussen 30 minuten en 12 uur na inname, afhankelijk van hoeveelheid, chocoladesoort en of je hond tegelijk voer heeft gegeten (dit kan opname vertragen). Een hond die vier uur na pure chocolade nog rustig lijkt, is niet automatisch veilig – blijf actief observeren en volg het advies van je dierenarts.",
      ],
      subsections: [
        {
          title: "Milde symptomen (vaak binnen 1-2 uur)",
          items: [
            "Braken en diarree",
            "Onrust, hyperactiviteit of ijsberen",
            "Veel drinken en veel plassen",
            "Hijgen en versnelde ademhaling",
          ],
        },
        {
          title: "Matige symptomen",
          paragraphs: [
            "Naarmate de intoxicatie toeneemt, worden effecten op hart en spieren duidelijker. Deze signalen vereisen snelle veterinaire zorg, ook als ze geleidelijk zijn ontstaan.",
          ],
          items: [
            "Spiertrekkingen of trillen",
            "Verhoogde hartslag (tachycardie)",
            "Hoge bloeddruk",
            "Hyperthermie (verhoogde lichaamstemperatuur)",
          ],
        },
        {
          title: "Ernstige symptomen (hogere dosis of kleine hond)",
          paragraphs: [
            "Ernstige chocoladevergiftiging is een medisch spoedgeval. Overlijden komt met tijdige behandeling niet vaak voor, maar kan wel gebeuren bij zeer grote innames, vooral van bakchocolade, cacaopoeder of cacaomulch.",
          ],
          items: [
            "Toevallen",
            "Hartritmestoornissen",
            "Instorten of niet meer kunnen staan",
            "Bewustzijnsverlies",
            "Overlijden (mogelijk bij onbehandelde ernstige vergiftiging)",
          ],
        },
      ],
    },
    {
      id: "vet-treatment",
      emoji: "🏥",
      title: "Wat doet de dierenarts?",
      paragraphs: [
        "De behandeling hangt af van hoeveel chocolade is gegeten, wanneer dat gebeurde en welke symptomen aanwezig zijn. Het doel is opname verminderen, uitscheiding versnellen, klachten stabiliseren en hart en zenuwstelsel beschermen.",
        "Bij recente inname (meestal binnen twee uur) en een klinisch stabiele hond kan de dierenarts gecontroleerd braken opwekken om chocolade uit de maag te verwijderen. Daarna wordt vaak geactiveerde kool gegeven om resterende toxines in het maagdarmkanaal te binden.",
        "Honden met matige tot ernstige symptomen krijgen vaak intraveneus vocht om nieren te ondersteunen, uitdroging door braken te corrigeren en theobromine sneller uit te scheiden. Hartslag en hartritme worden continu gemonitord. Zo nodig volgen medicijnen tegen tremoren, toevallen of ernstige ritmestoornissen.",
        "Bij grotere innames is opname in de kliniek voor 12-24 uur (soms langer) gebruikelijk. Er kan bloedonderzoek worden gedaan om orgaanfunctie te controleren. De meeste honden herstellen volledig bij snelle behandeling; uitstel van zorg is de grootste factor die de prognose verslechtert.",
      ],
      items: [
        "Braken opwekken (indien binnen circa 2 uur en klinisch passend)",
        "Geactiveerde kool om resterende toxines te binden",
        "Intraveneuze vochttherapie",
        "Medicatie tegen toevallen of ritmestoornissen indien nodig",
        "Continue monitoring gedurende 12-24 uur of langer",
      ],
    },
    {
      id: "foods-toxic",
      emoji: "🚫",
      title: "Andere voedingsmiddelen die giftig zijn voor honden",
      variant: "muted",
      paragraphs: [
        "Chocolade is slechts een van meerdere alledaagse producten die gevaarlijk kunnen zijn. Denk ook aan druiven en rozijnen (acuut nierfalen), xylitol/berkensuiker (levensbedreigende hypoglykemie en leverbeschadiging), ui en knoflook (schade aan rode bloedcellen), macadamianoten, alcohol en rauw gistdeeg. Veel honden eten opportunistisch: bewaar risicoproducten veilig en zorg dat iedereen in huis weet wat wel en niet mag.",
        "Wil je een compleet overzicht van huishoudelijke risico's, giftige planten en een praktisch noodplan? Bekijk dan ook onze gevarengids. Voorkomen is vrijwel altijd eenvoudiger en veiliger dan behandelen na een ongeluk.",
      ],
      items: [
        "Druiven en rozijnen – kunnen acuut nierfalen veroorzaken",
        "Xylitol (suikervrije kauwgom, sommige pindakaas) – extreem gevaarlijk",
        "Uien, knoflook, prei, bieslook – beschadigen rode bloedcellen",
        "Alcohol en rauw brooddeeg – risico op ethanolvergiftiging",
      ],
    },
  ],
  faq: [
    {
      q: "Mijn hond at maar een klein stukje – moet ik toch de dierenarts bellen?",
      a: "Ja. Zelfs een kleine hoeveelheid pure chocolade of cacao kan gevaarlijk zijn voor toy-rassen en pups. Melkchocolade bevat per gram minder theobromine, maar grotere hoeveelheden blijven risicovol. Met een kort telefoontje kan de dierenarts of hulplijn de dosis berekenen op basis van gewicht en chocoladesoort. Vroeg bellen voorkomt vaak ernstige ziekte en is meestal goedkoper dan spoedzorg wanneer klachten al zijn begonnen.",
    },
    {
      q: "Mogen honden witte chocolade eten?",
      a: "Witte chocolade bevat zeer weinig theobromine en veroorzaakt daardoor minder vaak klassieke chocoladevergiftiging. Toch bevat het veel vet en suiker, wat braken, diarree of pancreatitis kan uitlokken. Daarnaast leert je hond dat zoet menselijk eten \"beschikbaar\" is, waardoor de kans toeneemt dat hij later gevaarlijkere chocolade pakt. Geef het dus niet als snack. Heeft je hond er veel van gegeten, neem alsnog contact op met je dierenarts wegens het vetgehalte en mogelijke maagdarmproblemen.",
    },
    {
      q: "Hoe zit het met chocoladetaart, warme chocolademelk of cacaopoeder?",
      a: "Chocoladetaart en brownies bevatten vaak pure chocolade, cacaopoeder of glazuur met hoge theobrominewaardes; behandel dit even serieus als pure chocolade. Instant cacaomix en chocoladedrank verschillen sterk per product, maar puur cacaopoeder behoort tot de meest geconcentreerde en gevaarlijkste bronnen, zelfs in kleine hoeveelheden. Ook cacaomulch in de tuin heeft al fatale vergiftigingen veroorzaakt. Noem daarom altijd alle ingrediënten en een schatting van de totale chocolade-inname wanneer je met de dierenarts belt.",
    },
    {
      q: "Mijn hond at 4 uur geleden chocolade en lijkt nog normaal – is hij veilig?",
      a: "Niet per se. Symptomen kunnen tot 12 uur vertraagd optreden, vooral na een grote maaltijd die de maaglediging vertraagt of bij een matige dosis. Theobromine blijft langdurig circuleren. Blijf controleren op braken, onrust, tremoren en veel drinken, en volg eerder gegeven advies op. Heb je nog niet gebeld? Doe dat alsnog meteen en ga niet uit van schijnbare rust.",
    },
    {
      q: "Kunnen honden herstellen van chocoladevergiftiging?",
      a: "De meeste honden herstellen volledig met snelle veterinaire zorg, ook wanneer opname nodig was. De prognose is het best als behandeling start voordat ernstige neurologische of cardiale symptomen ontstaan. Honden met toevallen, collaps of ritmestoornissen hebben intensieve zorg nodig, maar herstellen vaak nog steeds. Dodelijke afloop is ongebruikelijk bij behandeling, maar waarschijnlijker bij zeer grote innames van bakchocolade/cacaopoeder, laat ingrijpen of zeer kleine honden. Snelheid maakt echt het verschil.",
    },
  ],
  faqTitle: "Veelgestelde vragen",
  relatedTitle: "Gerelateerde gidsen",
  relatedLinks: [
    { href: "/dangers", label: "Gevaren voor honden en katten" },
    { href: "/health", label: "Gezondheid van hond en kat" },
    { href: "/dog-not-eating", label: "Hond eet niet" },
    { href: "/dog-vomiting-diarrhea", label: "Hond braakt en heeft diarree" },
  ],
};
