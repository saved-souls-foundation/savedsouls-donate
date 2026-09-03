"use client";

const ICONS = ["🥣", "🐕", "💉"] as const;
const ACCENTS = ["#7dd3fc", "#86efac", "#fcd34d"] as const;

type Props = {
  intro: string;
  bullets: string[];
};

export default function DonateHelpPoints({ intro, bullets }: Props) {
  return (
    <div className="donate-help max-w-xl">
      <style>{`
        @keyframes donateHelpFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes donateHelpDotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(125, 211, 252, 0.5); }
          50% { transform: scale(1.2); box-shadow: 0 0 0 7px rgba(125, 211, 252, 0); }
        }
        .donate-help-panel {
          animation: donateHelpFadeUp 0.65s ease-out both;
          background: linear-gradient(135deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .donate-help-item {
          animation: donateHelpFadeUp 0.6s ease-out both;
          transition: transform 0.22s ease, background-color 0.22s ease;
        }
        .donate-help-item:nth-child(1) { animation-delay: 0.15s; }
        .donate-help-item:nth-child(2) { animation-delay: 0.28s; }
        .donate-help-item:nth-child(3) { animation-delay: 0.41s; }
        .donate-help-item:hover {
          transform: translateX(3px);
          background-color: rgba(255,255,255,0.1);
        }
        .donate-help-dot {
          animation: donateHelpDotPulse 2.4s ease-in-out infinite;
        }
        .donate-help-item:nth-child(2) .donate-help-dot { animation-delay: 0.4s; }
        .donate-help-item:nth-child(3) .donate-help-dot { animation-delay: 0.8s; }
        @media (prefers-reduced-motion: reduce) {
          .donate-help-panel,
          .donate-help-item,
          .donate-help-dot { animation: none !important; }
        }
      `}</style>

      <div className="donate-help-panel rounded-2xl border border-white/20 px-4 py-4 md:px-5 md:py-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        <p className="text-[15px] md:text-lg text-white font-medium leading-snug tracking-tight mb-4">
          {intro}
        </p>

        <ul className="space-y-2">
          {bullets.slice(0, 3).map((item, i) => (
            <li
              key={item}
              className="donate-help-item flex items-center gap-3 rounded-xl px-2.5 py-2.5"
            >
              <span
                className="donate-help-dot h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENTS[i] }}
                aria-hidden
              />
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                aria-hidden
              >
                {ICONS[i]}
              </span>
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
