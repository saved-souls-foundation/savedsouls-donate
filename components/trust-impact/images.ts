/** Sanctuary-foto's voor /trust-impact — bronnen in public/images/trust-impact/ */
export const TI_IMAGES = {
  dogsGreeting: {
    src: "/images/trust-impact/dogs-greeting.png",
    alt: "Large rescued dog greeting a small puppy at the sanctuary",
    width: 723,
    height: 1024,
  },
  vetCarePuppy: {
    src: "/images/trust-impact/vet-care-puppy.png",
    alt: "Puppy receiving veterinary care with IV fluids at the sanctuary clinic",
    width: 1024,
    height: 714,
  },
  personHuggingDog: {
    src: "/images/trust-impact/person-hugging-dog.png",
    alt: "Volunteer hugging a rescued brindle dog in the grass at the sanctuary",
    width: 510,
    height: 334,
  },
  welcomeSign: {
    src: "/images/trust-impact/welcome-sign.png",
    alt: "Welcome to Saved Souls Foundation hand-painted sign with wheelchair dog mascot",
    width: 1024,
    height: 557,
  },
  blackDogCloseup: {
    src: "/images/trust-impact/black-dog-closeup.png",
    alt: "Close-up portrait of a rescued black dog at the sanctuary",
    width: 930,
    height: 830,
  },
  teamDonations: {
    src: "/images/trust-impact/team-donations.png",
    alt: "Volunteers with donated dog food bags at Saved Souls Foundation, Khon Kaen",
    width: 1024,
    height: 1003,
  },
  volunteerComfortingDog: {
    src: "/images/trust-impact/volunteer-comforting-dog.png",
    alt: "Volunteer in a Saved Souls Foundation shirt gently comforting a scruffy rescued dog at the sanctuary fence",
    width: 674,
    height: 592,
  },
  binSitting: {
    src: "/images/trust-impact/bin-sitting.png",
    alt: "Bin, a rescued dog with disabled front legs, sitting upright against the yellow sanctuary wall",
    width: 772,
    height: 1024,
  },
  volunteerFaceHold: {
    src: "/images/trust-impact/volunteer-face-hold.png",
    alt: "Volunteer gently holding a rescued dog's face outdoors in the grass at the sanctuary",
    width: 758,
    height: 1024,
  },
  cloverPortrait: {
    src: "/images/trust-impact/clover-portrait.png",
    alt: "Close-up portrait of Clover, a scruffy rescued dog held by a volunteer at the sanctuary",
    width: 1024,
    height: 825,
  },
} as const;

/** Per FILE-kaart: foto + specifieke alt en crop */
export const QA_CARD_PHOTOS = [
  {
    image: TI_IMAGES.teamDonations,
    alt: "Saved Souls Foundation team members beside the sanctuary sign with bags of donated pet food",
    objectPosition: "center 42%",
  },
  {
    image: TI_IMAGES.welcomeSign,
    alt: "Hand-painted Welcome to Saved Souls Foundation sign with wheelchair dog mascot at the sanctuary entrance",
    objectPosition: "center 38%",
  },
  {
    image: TI_IMAGES.volunteerFaceHold,
    alt: "Volunteer holding a rescued dog's face in the grass — Saved Souls is a registered Thai charity since 2017",
    objectPosition: "center 15%",
  },
  {
    image: TI_IMAGES.blackDogCloseup,
    alt: "Close-up of a rescued black dog — specialized care for disabled and difficult cases other shelters turn away",
    objectPosition: "center 32%",
  },
  {
    image: TI_IMAGES.cloverPortrait,
    alt: "Close-up of Clover, a scruffy rescued dog — donations fund daily food, medical care, and rehabilitation",
    objectPosition: "center 54%",
  },
  {
    image: TI_IMAGES.personHuggingDog,
    alt: "Volunteer embracing a rescued dog in the grass — visitors are welcome to volunteer at the Khon Kaen sanctuary",
    objectPosition: "center 40%",
  },
] as const;

export const PROGRAM_PHOTOS = [
  {
    image: TI_IMAGES.binSitting,
    alt: "Bin sitting upright — one of 50+ disabled and wheelchair dogs in daily sanctuary care",
    objectPosition: "center 20%",
  },
  {
    image: TI_IMAGES.dogsGreeting,
    alt: "Rescued street dogs greeting at the sanctuary — survivors of neglect and the dog meat trade",
    objectPosition: "center 48%",
  },
  {
    image: TI_IMAGES.vetCarePuppy,
    alt: "Puppy receiving veterinary care with IV fluids during daily rehabilitation at the sanctuary clinic",
    objectPosition: "center 40%",
  },
] as const;
