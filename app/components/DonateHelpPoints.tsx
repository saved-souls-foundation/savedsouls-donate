"use client";

type Props = {
  intro: string;
  points: [string, string, string];
};

export default function DonateHelpPoints({ intro, points }: Props) {
  return (
    <div className="max-w-2xl">
      <style>{`
        @media (min-width: 768px) {
          .donate-impact-point + .donate-impact-point::before {
            content: " · ";
            color: inherit;
            white-space: pre;
          }
        }
      `}</style>
      <p className="text-sm md:text-base text-white leading-snug mb-2.5">{intro}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-0 text-sm text-white/80 tracking-wide font-normal">
        {points.map((point) => (
          <span key={point} className="donate-impact-point whitespace-nowrap">
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}
