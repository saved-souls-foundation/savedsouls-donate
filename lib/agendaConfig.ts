/**
 * Agenda-module: categorieën en lab-uitslag statussen met kleuren en iconen.
 */
export type EventCategory =
  | "dierenarts"
  | "laboratorium"
  | "medisch_followup"
  | "vrijwilligers"
  | "adoptanten"
  | "evenement"
  | "afspraak"
  | "deadline"
  | "overig";

export type LabResultStatus = "normaal" | "afwijkend" | "kritiek";

export const EVENT_CATEGORIES: Record<
  EventCategory,
  { label: string; color: string; icon: string }
> = {
  // MEDISCH & ZORG
  dierenarts: { label: "Dierenarts afspraak", color: "#E63946", icon: "🏥" },
  laboratorium: { label: "Laboratorium / uitslag", color: "#F4A261", icon: "🧪" },
  medisch_followup: { label: "Medische nacontrole", color: "#E9B4D4", icon: "💊" },
  // VRIJWILLIGERS & MENSEN
  vrijwilligers: { label: "Vrijwilligers", color: "#2A9D8F", icon: "🙋" },
  adoptanten: { label: "Adoptanten afspraak", color: "#457B9D", icon: "🐾" },
  evenement: { label: "Evenement / open dag", color: "#7B2D8B", icon: "🎉" },
  // OPERATIONEEL
  afspraak: { label: "Algemene afspraak", color: "#E9C46A", icon: "📅" },
  deadline: { label: "Deadline / urgent", color: "#E76F51", icon: "🔴" },
  overig: { label: "Overig / intern", color: "#6C757D", icon: "📌" },
};

export const LAB_RESULT_STATUSES: Record<
  LabResultStatus,
  { label: string; color: string; icon: string }
> = {
  normaal: { label: "Normaal", color: "#2A9D8F", icon: "✅" },
  afwijkend: { label: "Afwijkend", color: "#F4A261", icon: "⚠️" },
  kritiek: { label: "Kritiek", color: "#E63946", icon: "🔴" },
};

export const EVENT_CATEGORY_IDS: EventCategory[] = [
  "dierenarts",
  "laboratorium",
  "medisch_followup",
  "vrijwilligers",
  "adoptanten",
  "evenement",
  "afspraak",
  "deadline",
  "overig",
];

export const LAB_STATUS_IDS: LabResultStatus[] = ["normaal", "afwijkend", "kritiek"];
