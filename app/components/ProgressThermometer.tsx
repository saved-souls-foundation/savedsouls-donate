"use client";

export type ThermometerType = "adopt" | "volunteer" | "sponsor";

export interface ThermometerStep {
  id: number;
  label: string;
  done?: boolean;
}

interface ProgressThermometerProps {
  type: ThermometerType;
  steps: ThermometerStep[];
  currentStep: number;
  progressPercent: number;
  /** Extra info below thermometer, e.g. "€120 gesponsord" or "3 documenten ingeleverd" */
  subtitle?: string;
  /** Override step label, e.g. "Stap 2 van 5" */
  stepLabel?: string;
  className?: string;
}

export default function ProgressThermometer({
  type,
  steps,
  currentStep,
  progressPercent,
  subtitle,
  stepLabel,
  className = "",
}: ProgressThermometerProps) {
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className={`w-full ${className}`}>
      {/* Step labels above the bar */}
      <div className="flex justify-between mb-2 px-1">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center min-w-0 flex-1 ${
              step.id <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"
            }`}
          >
            <span className="text-xs md:text-sm font-semibold tabular-nums">
              {step.id}
            </span>
            <span className="text-[10px] md:text-xs text-center truncate max-w-full mt-0.5">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Thermometer bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {/* Progress indicator */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {stepLabel ?? `Stap ${currentStep} van ${steps.length}`}
        </span>
        <span className="text-xs font-medium text-blue-600">
          {Math.round(clampedPercent)}%
        </span>
      </div>

      {subtitle && (
        <p className="text-sm text-gray-600 mt-3">{subtitle}</p>
      )}
    </div>
  );
}
