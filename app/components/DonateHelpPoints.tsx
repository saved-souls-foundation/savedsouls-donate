"use client";

const ACCENTS = ["#7dd3fc", "#86efac", "#fcd34d"] as const;

type Props = {
  intro: string;
  bullets: [string, string, string];
};

export default function DonateHelpPoints({ intro, bullets }: Props) {
  return (
    <div className="donate-help max-w-xl">
      <style>{`
        @keyframes donateHelpFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes donateHelpDotPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35);
          }
          50% {
            transform: scale(1.25);
            box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
          }
        }
        .donate-help-panel {
          animation: donateHelpFadeUp 0.65s ease-out both;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.06) 100%
          );
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .donate-help-item {
          animation: donateHelpFadeUp 0.55s ease-out both;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .donate-help-item:nth-child(1) { animation-delay: 0.12s; }
        .donate-help-item:nth-child(2) { animation-delay: 0.24s; }
        .donate-help-item:nth-child(3) { animation-delay: 0.36s; }
        .donate-help-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateX(2px);
        }
        .donate-help-dot {
          animation: donateHelpDotPulse 2.6s ease-in-out infinite;
        }
        .donate-help-item:nth-child(2) .donate-help-dot { animation-delay: 0.45s; }
        .donate-help-item:nth-child(3) .donate-help-dot { animation-delay: 0.9s; }
        @media (prefers-reduced-motion: reduce) {
          .donate-help-panel,
          .donate-help-item,
          .donate-help-dot { animation: none !important; }
        }
      `}</style>

      <div className="donate-help-panel rounded-2xl border border-white/25 px-4 py-4 md:px-5 md:py-5 shadow-[0_8px_32px_rgba(0,0,0,0.22)]">
        <p className="text-[15px] md:text-base text-white font-medium leading-snug tracking-tight mb-3.5">
          {intro}
        </p>

        <ul className="space-y-1.5">
          {bullets.map((item, i) => (
            <li
              key={item}
              className="donate-help-item flex items-start gap-3 rounded-xl px-2 py-2"
            >
              <span
                className="donate-help-dot mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENTS[i] }}
                aria-hidden
              />
              <span className="text-sm md:text-[15px] text-white/95 leading-snug font-normal">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
