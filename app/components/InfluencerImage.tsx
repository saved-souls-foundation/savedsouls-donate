"use client";

type InfluencerImageProps = {
  src: string;
  alt: string;
  placeholder: string;
  filename: string;
  /** Grotere weergave (aspect 4/3 i.p.v. 16/9) */
  large?: boolean;
};

export default function InfluencerImage({ src, alt, placeholder, filename, large }: InfluencerImageProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 ${large ? "aspect-[4/3]" : "aspect-video"}`}>
      <div className="absolute inset-0 z-0 flex items-center justify-center p-4 text-center text-stone-500 dark:text-stone-400 text-sm">
        {placeholder}
        <br />
        <span className="text-xs">{filename}</span>
      </div>
      <img
        src={src}
        alt={alt}
        className="relative z-10 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
