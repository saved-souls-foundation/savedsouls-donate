import Image from "next/image";
import type { CSSProperties } from "react";
import { PROGRAMS } from "./content";
import { PROGRAM_PHOTOS } from "./images";
import Reveal from "./Reveal";

const PROGRAM_META = [
  {
    file: "PROGRAM 01",
    rotation: "-2deg",
    badgeRotation: "-4deg",
    accent: "saffron" as const,
    offset: "",
  },
  {
    file: "PROGRAM 02",
    rotation: "1.2deg",
    badgeRotation: "3deg",
    accent: "ember" as const,
    offset: "lg:mt-10",
  },
  {
    file: "PROGRAM 03",
    rotation: "-1.5deg",
    badgeRotation: "-2.5deg",
    accent: "amethyst" as const,
    offset: "lg:-mt-4",
  },
] as const;

function ProgramIcon({ type }: { type: (typeof PROGRAMS)[number]["icon"] }) {
  if (type === "wheelchair") {
    return (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M8 34c0-7 5.4-12 12-12s12 5 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="30" r="2.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="30" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "rescue") {
    return (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M6 22l10-14 10 14M6 22h20M6 22v10h20V22" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M28 14l6 8-6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M4 26c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 32c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="20" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Programs() {
  return (
    <section className="ti-programs py-24 bg-ink text-rice" id="programs">
      <div className="ti-wrap">
        <Reveal>
          <div className="ti-section-head ti-section-head--on-dark">
            <p className="ti-eyebrow ti-eyebrow--on-dark">What we actually do, every day</p>
            <h2>Three commitments, kept daily</h2>
            <p>
              Not a mission statement — a description of what happens at the sanctuary this week, and every week before
              it.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 lg:items-start">
          {PROGRAMS.map((program, index) => {
            const meta = PROGRAM_META[index];
            const photo = PROGRAM_PHOTOS[index];
            return (
              <Reveal key={program.title} className={meta.offset}>
                <article
                  className={`ti-program-card ti-program-card--photo ti-program-card--${meta.accent}`}
                  style={{ "--ti-program-r": meta.rotation } as CSSProperties}
                >
                  <div className="ti-program-photo">
                    <Image
                      src={photo.image.src}
                      alt={photo.alt}
                      fill
                      className="ti-program-photo__img"
                      style={{ objectPosition: photo.objectPosition }}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="ti-program-photo__veil" aria-hidden />
                  </div>
                  <div className="ti-program-card__body">
                    <span className="ti-program-file" style={{ fontFamily: "var(--ti-mono)" }}>
                      {meta.file}
                    </span>
                    <div
                      className={`ti-program-badge ti-program-badge--${meta.accent}`}
                      style={{ "--ti-badge-r": meta.badgeRotation } as CSSProperties}
                      aria-hidden
                    >
                      <ProgramIcon type={program.icon} />
                    </div>
                    <h3 className="font-semibold text-[1.25rem] m-0 mb-3 text-rice">{program.title}</h3>
                    <p className="ti-program-desc m-0">{program.description}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
