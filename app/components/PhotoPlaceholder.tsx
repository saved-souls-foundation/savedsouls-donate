"use client";

type PhotoPlaceholderProps = {
  aspectRatio?: "16/9" | "4/3" | "3/4" | "1/1";
  label?: string;
  className?: string;
  gradient?: string;
};

export default function PhotoPlaceholder({
  aspectRatio = "16/9",
  label = "Photo",
  className = "",
  gradient = "from-amber-200 via-orange-100 to-amber-50 dark:from-amber-900/40 dark:via-orange-900/30 dark:to-amber-950/40",
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-stone-600 bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspectRatio.replace("/", " / ") }}
    >
      <div className="flex flex-col items-center gap-2 text-stone-500 dark:text-stone-400">
        <svg className="w-12 h-12 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
