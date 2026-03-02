/**
 * Rooster-module: zones, taken per zone, tijdsloten, vrijwilligerkleuren.
 */
export type ZoneId =
  | "keuken"
  | "vertrek_1"
  | "vertrek_2"
  | "buiten"
  | "zandbak"
  | "binnen_bak"
  | "toiletten";

export type TimeSlotId = "ochtend" | "middag" | "avond";

export const ZONES: Record<
  ZoneId,
  { label: string; color: string; icon: string }
> = {
  keuken: { label: "Keuken", color: "#6C757D", icon: "🍳" },
  vertrek_1: { label: "Vertrek 1", color: "#457B9D", icon: "🛏️" },
  vertrek_2: { label: "Vertrek 2", color: "#7B2D8B", icon: "🛏️" },
  buiten: { label: "Buitenterrein", color: "#2A9D8F", icon: "🌿" },
  zandbak: { label: "Zandbak", color: "#E9C46A", icon: "⛱️" },
  binnen_bak: { label: "Binnen bak", color: "#F4A261", icon: "🐾" },
  toiletten: { label: "Toiletten / Douche", color: "#E63946", icon: "🚽" },
};

export const ZONE_IDS: ZoneId[] = [
  "keuken",
  "vertrek_1",
  "vertrek_2",
  "buiten",
  "zandbak",
  "binnen_bak",
  "toiletten",
];

type TaskId = string;
export const TASKS_BY_ZONE: Record<ZoneId, Record<string, { label: string; icon: string }>> = {
  keuken: {
    koken_ontbijt: { label: "Koken ontbijt", icon: "🍳" },
    koken_lunch: { label: "Koken lunch", icon: "🥗" },
    koken_diner: { label: "Koken diner", icon: "🍽️" },
    voeren_ochtend: { label: "Dieren voeren ochtend", icon: "🐾" },
    voeren_middag: { label: "Dieren voeren middag", icon: "🐾" },
    voeren_avond: { label: "Dieren voeren avond", icon: "🐾" },
    afwassen: { label: "Afwassen", icon: "🍽️" },
    keuken_schoon: { label: "Keuken schoonmaken", icon: "🧹" },
    voorraad: { label: "Voorraden bijvullen", icon: "📦" },
  },
  vertrek_1: {
    vertrek_schoon: { label: "Vertrek schoonmaken", icon: "🧹" },
    bedden: { label: "Bedden verschonen", icon: "🛏️" },
    ventileren: { label: "Ventileren", icon: "🪟" },
    dieren_vertrek: { label: "Dieren verzorgen", icon: "🐾" },
  },
  vertrek_2: {
    vertrek_schoon: { label: "Vertrek schoonmaken", icon: "🧹" },
    bedden: { label: "Bedden verschonen", icon: "🛏️" },
    ventileren: { label: "Ventileren", icon: "🪟" },
    dieren_vertrek: { label: "Dieren verzorgen", icon: "🐾" },
  },
  buiten: {
    buiten_schoon: { label: "Buitenterrein schoonmaken", icon: "🧹" },
    poep_ruimen: { label: "Uitwerpselen opruimen", icon: "💩" },
    tuin: { label: "Tuin onderhoud", icon: "🌿" },
    water_bakken: { label: "Waterbakken vullen", icon: "🚿" },
    honden_uitlaten: { label: "Honden uitlaten", icon: "🐕" },
  },
  zandbak: {
    zandbak_schoon: { label: "Zandbak schoonmaken", icon: "🧹" },
    poep_zandbak: { label: "Uitwerpselen opruimen", icon: "💩" },
    zand_omwoelen: { label: "Zand omwoelen", icon: "🔄" },
  },
  binnen_bak: {
    bakken_schoon: { label: "Bakken schoonmaken", icon: "🧹" },
    bedjes_wassen: { label: "Bedjes wassen", icon: "🛏️" },
    medicatie: { label: "Medicatie toedienen", icon: "💊" },
    dieren_check: { label: "Dieren controleren", icon: "🐾" },
  },
  toiletten: {
    toilet_schoon: { label: "Toiletten schoonmaken", icon: "🚽" },
    douche_schoon: { label: "Douches schoonmaken", icon: "🚿" },
    supplies: { label: "Supplies bijvullen", icon: "🧴" },
    afval: { label: "Afval legen", icon: "🗑️" },
  },
};

export const TIME_SLOTS: Record<
  TimeSlotId,
  { label: string; tijd: string }
> = {
  ochtend: { label: "Ochtend", tijd: "07:00 – 12:00" },
  middag: { label: "Middag", tijd: "12:00 – 17:00" },
  avond: { label: "Avond", tijd: "17:00 – 22:00" },
};

export const TIME_SLOT_IDS: TimeSlotId[] = ["ochtend", "middag", "avond"];

/** Kleuren voor vrijwilligers (automatisch toewijzen in volgorde). */
export const VOLUNTEER_COLORS = [
  "#E63946",
  "#F4A261",
  "#E9C46A",
  "#2A9D8F",
  "#457B9D",
  "#7B2D8B",
  "#A8DADC",
  "#06D6A0",
  "#FFB703",
  "#FB8500",
];

export function getTasksForZone(zone: ZoneId): Record<string, { label: string; icon: string }> {
  return TASKS_BY_ZONE[zone] ?? {};
}
