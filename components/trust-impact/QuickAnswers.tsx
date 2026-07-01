import Image from "next/image";
import type { CSSProperties } from "react";
import { QUICK_ANSWERS } from "./content";
import { QA_CARD_PHOTOS } from "./images";
import Reveal from "./Reveal";
import StampBadge, { type StampColor } from "./StampBadge";

const QA_LAYOUT: {
  rotation: number;
  rotationMobile: number;
  photoDelta: number;
  photoDeltaMobile: number;
  marginTop: number;
  marginLeft: number;
  stampRotation: number;
  stampColor: StampColor;
  zIndex: number;
}[] = [
  {
    rotation: -4,
    rotationMobile: -2,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: 0,
    marginLeft: 0,
    stampRotation: 14,
    stampColor: "stamp",
    zIndex: 1,
  },
  {
    rotation: 3,
    rotationMobile: 2,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: 36,
    marginLeft: 16,
    stampRotation: -11,
    stampColor: "amethyst",
    zIndex: 2,
  },
  {
    rotation: -2.5,
    rotationMobile: -1.5,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: -24,
    marginLeft: -8,
    stampRotation: 9,
    stampColor: "stamp",
    zIndex: 3,
  },
  {
    rotation: 5,
    rotationMobile: 1.5,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: 20,
    marginLeft: 20,
    stampRotation: -7,
    stampColor: "amethyst",
    zIndex: 4,
  },
  {
    rotation: -3.5,
    rotationMobile: -2,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: -12,
    marginLeft: -4,
    stampRotation: 12,
    stampColor: "stamp",
    zIndex: 5,
  },
  {
    rotation: 2,
    rotationMobile: 1,
    photoDelta: 2,
    photoDeltaMobile: 1,
    marginTop: 28,
    marginLeft: 10,
    stampRotation: -9,
    stampColor: "amethyst",
    zIndex: 6,
  },
];

export default function QuickAnswers() {
  return (
    <section className="ti-qa-section py-24">
      <div className="ti-wrap">
        <Reveal>
          <div className="ti-section-head">
            <p className="ti-eyebrow ti-eyebrow--stamp">Quick answers</p>
            <h2 className="text-ink">The short version, stated plainly</h2>
            <p>
              Written to answer the questions people — and AI search assistants — actually ask about us. No spin, just
              what&apos;s true.
            </p>
          </div>
        </Reveal>
        <div className="ti-qa-wall">
          {QUICK_ANSWERS.map((item, index) => {
            const layout = QA_LAYOUT[index];
            const photo = QA_CARD_PHOTOS[index];
            return (
              <Reveal key={item.question} className="ti-qa-reveal" style={{ zIndex: layout.zIndex }}>
                <article
                  className="ti-qa-card"
                  style={
                    {
                      "--ti-qa-r": `${layout.rotation}deg`,
                      "--ti-qa-r-mobile": `${layout.rotationMobile}deg`,
                      "--ti-qa-mt": `${layout.marginTop}px`,
                      "--ti-qa-ml": `${layout.marginLeft}px`,
                      "--ti-qa-photo-d": `${layout.photoDelta}deg`,
                      "--ti-qa-photo-d-mobile": `${layout.photoDeltaMobile}deg`,
                    } as CSSProperties
                  }
                >
                  <div className="ti-qa-tab" style={{ fontFamily: "var(--ti-mono)" }}>
                    FILE {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="ti-qa-polaroid">
                    <div className="ti-qa-polaroid__frame">
                      <div className="ti-qa-polaroid__img-wrap">
                        <Image
                          src={photo.image.src}
                          alt={photo.alt}
                          fill
                          className="ti-qa-polaroid__img"
                          style={{ objectPosition: photo.objectPosition }}
                          sizes="(max-width: 767px) 100vw, 45vw"
                        />
                      </div>
                      <div
                        className="ti-qa-polaroid__stamp"
                        style={{ "--ti-qa-stamp-r": `${layout.stampRotation}deg` } as CSSProperties}
                      >
                        <StampBadge
                          value=""
                          label="VERIFIED"
                          color={layout.stampColor}
                          rotation={layout.stampRotation}
                          size="mini"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="ti-qa-question" style={{ fontFamily: "var(--ti-sans)" }}>
                    {item.question}
                  </h3>
                  <p className="ti-qa-answer">{item.answer}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
