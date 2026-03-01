"use client";

const BRAND_GREEN = "#2d5a27";

export type ThermometerStep = {
  label: string;
  description: string;
};

type ThermometerProps = {
  steps: ThermometerStep[];
  currentStep: number; // 1-based
  className?: string;
};

export default function Thermometer({
  steps,
  currentStep,
  className = "",
}: ThermometerProps) {
  const safeCurrent = Math.max(1, Math.min(currentStep, steps.length));

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="flex min-w-max items-start gap-0 pb-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < safeCurrent;
          const isCurrent = stepNum === safeCurrent;
          const isFuture = stepNum > safeCurrent;
          const isLast = index === steps.length - 1;

          return (
            <div key={stepNum} className="flex flex-shrink-0 items-center">
              {/* Circle + label */}
              <div className="flex flex-col items-center min-w-[80px] max-w-[120px]">
                <div
                  className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors"
                  style={{
                    backgroundColor: isCompleted ? BRAND_GREEN : isCurrent ? BRAND_GREEN : undefined,
                    borderColor: isCompleted || isCurrent ? BRAND_GREEN : "#d6d3d1",
                    color: isCompleted || isCurrent ? "#fff" : "#a8a29e",
                  }}
                >
                  {isCompleted ? (
                    <span className="text-lg leading-none" aria-hidden>✓</span>
                  ) : (
                    <span className={isCurrent ? "animate-pulse" : ""}>{stepNum}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-center text-xs font-medium md:text-sm ${
                    isCurrent ? "font-bold text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="mx-1 h-0.5 w-6 flex-shrink-0 md:w-10"
                  style={{
                    backgroundColor: isCompleted ? BRAND_GREEN : "#e7e5e4",
                  }}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Current step description */}
      {steps[safeCurrent - 1]?.description && (
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
          {steps[safeCurrent - 1].description}
        </p>
      )}
    </div>
  );
}

export const VRIJWILLIGER_STEPS: ThermometerStep[] = [
  { label: "Aanmelding ontvangen", description: "We hebben je aanmelding ontvangen en nemen zo snel mogelijk contact op." },
  { label: "Intake gepland", description: "Er is een intakegesprek met je gepland." },
  { label: "Intake afgerond", description: "Het intakegesprek is afgerond. We werken je dossier verder uit." },
  { label: "Screening & referenties", description: "We voeren screening en referentiechecks uit." },
  { label: "Opleiding & training", description: "Je volgt opleiding en training om actief te worden." },
  { label: "✅ Actief als vrijwilliger", description: "Je bent actief als vrijwilliger bij Saved Souls Foundation." },
];

export const ADOPTANT_STEPS: ThermometerStep[] = [
  { label: "Aanmelding ontvangen", description: "We hebben je adoptieaanvraag ontvangen en nemen binnen 48 uur contact op." },
  { label: "Intake & huisbezoek of video call", description: "Eén gesprek: intake en huisbezoek of video call. Daarna zoeken we een match voor je." },
  { label: "Match gevonden – documenten", description: "Match gevonden! Upload je documenten (ID, PDF's) net als bij vrijwilligers." },
  { label: "✅ Adoptie afgerond", description: "De adoptie is afgerond. Welkom in de familie! ♥" },
];
