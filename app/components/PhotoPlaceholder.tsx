"use client";

/** Ruimte voor foto – vul later in met echte afbeelding */
export default function PhotoPlaceholder({
  className = "",
  aspectRatio = "video",
  label,
}: {
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  label?: string;
}) {
  const aspect = aspectRatio === "video" ? "aspect-video" : aspectRatio === "square" ? "aspect-square" : "aspect-[3/4]";
  return (
    <div
      className={`rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 flex items-center justify-center ${aspect} min-h-[200px] ${className}`}
      role="img"
      aria-label={label || "Foto volgt"}
    >
      <span className="text-stone-400 dark:text-stone-500 text-sm font-medium px-4 text-center">
        {label || "📷 Foto volgt"}
      </span>
    </div>
  );
}
