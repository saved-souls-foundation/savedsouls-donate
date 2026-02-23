/**
 * Shared data for guides/info pages. Used by /gidsen and /get-involved.
 * labelKey = key in common namespace for the page title.
 */
export type GuideGroup = {
  placeholderKey: string;
  links: { href: string; labelKey: string }[];
};

export const GIDSEN_GROUPS: GuideGroup[] = [
  {
    placeholderKey: "infoPlaceholderGeneral",
    links: [
      { href: "/faq", labelKey: "faq" },
      { href: "/blog", labelKey: "blog" },
      { href: "/donate/causes", labelKey: "donateCauses" },
      { href: "/financial-overview", labelKey: "financialOverview" },
      { href: "/school-project", labelKey: "schoolProject" },
      { href: "/fireworks-pets", labelKey: "fireworksPets" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderHealth",
    links: [
      { href: "/nutrition", labelKey: "nutrition" },
      { href: "/health", labelKey: "health" },
      { href: "/flea-tick-parasite-guide", labelKey: "fleaTickParasiteGuide" },
      { href: "/toxic-plants", labelKey: "toxicPlants" },
      { href: "/pet-loss", labelKey: "petLoss" },
      { href: "/pet-insurance", labelKey: "petInsurance" },
      { href: "/senior-pet", labelKey: "seniorPet" },
      { href: "/dog-vomiting-diarrhea", labelKey: "dogVomitingDiarrhea" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderPractical",
    links: [
      { href: "/microchipping", labelKey: "microchipping" },
      { href: "/sterilization", labelKey: "sterilization" },
      { href: "/pet-proof-house", labelKey: "petProofHouse" },
      { href: "/pet-sitter", labelKey: "petSitter" },
      { href: "/pet-passport", labelKey: "petPassport" },
      { href: "/pet-and-children", labelKey: "petAndChildren" },
      { href: "/overheating", labelKey: "overheating" },
      { href: "/foster", labelKey: "foster" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderBehavior",
    links: [
      { href: "/behavior", labelKey: "behavior" },
      { href: "/toys-training", labelKey: "toysTraining" },
      { href: "/raw-hide", labelKey: "rawHide" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderFirstPet",
    links: [
      { href: "/dog-home-alone", labelKey: "dogHomeAlone" },
      { href: "/walking-dog", labelKey: "walkingDog" },
      { href: "/travel-with-pet", labelKey: "travelWithPet" },
      { href: "/house-training", labelKey: "houseTraining" },
      { href: "/moving-with-pet", labelKey: "movingWithPet" },
      { href: "/puppy-socialization", labelKey: "puppySocialization" },
      { href: "/dog-barking", labelKey: "dogBarking" },
      { href: "/dog-and-cat-together", labelKey: "dogAndCatTogether" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderSavedSouls",
    links: [
      { href: "/disabled-dog-guide", labelKey: "disabledDogGuide" },
      { href: "/dog-meat-survivors", labelKey: "dogMeatSurvivors" },
      { href: "/paralyzed-dogs-guide", labelKey: "paralyzedDogsGuide" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderCats",
    links: [
      { href: "/cat-hairball", labelKey: "catHairball" },
      { href: "/cat-indoor-outdoor", labelKey: "catIndoorOutdoor" },
    ],
  },
  {
    placeholderKey: "infoPlaceholderTravel",
    links: [
      { href: "/william-heinecke-elephants", labelKey: "williamHeineckeElephants" },
      { href: "/minor-hotels", labelKey: "minorHotels" },
      { href: "/partners", labelKey: "partners" },
      { href: "/shelters", labelKey: "shelters" },
    ],
  },
];
