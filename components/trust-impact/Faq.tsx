"use client";

import { Fragment, useState } from "react";
import { Link } from "@/i18n/navigation";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";
import { FAQ_ITEMS } from "./content";
import Reveal from "./Reveal";

function faqNumber(index: number) {
  return `Q${String(index + 1).padStart(2, "0")}`;
}

export default function Faq() {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set([0]));

  return (
    <section className="py-24" id="faq">
      <div className="ti-wrap">
        <Reveal>
          <div className="ti-section-head mx-auto text-center">
            <p className="ti-eyebrow ti-eyebrow--stamp justify-center">Frequently verified</p>
            <h2 className="text-ink">Common questions, answered once</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="ti-faq-register max-w-[820px] mx-auto">
            {FAQ_ITEMS.map((item, index) => (
              <Fragment key={item.question}>
                {index > 0 && <div className="ti-faq-rule" aria-hidden />}
                <details
                  className="ti-faq-item"
                  open={openItems.has(index)}
                  onToggle={(e) => {
                    const isOpen = e.currentTarget.open;
                    setOpenItems((prev) => {
                      const next = new Set(prev);
                      if (isOpen) next.add(index);
                      else next.delete(index);
                      return next;
                    });
                  }}
                >
                  <summary className="ti-faq-summary">
                    <span className="ti-faq-summary__main">
                      <span
                        className={`ti-faq-qnum ${index % 2 === 0 ? "ti-faq-qnum--stamp" : "ti-faq-qnum--ember"}`}
                      >
                        {faqNumber(index)} —
                      </span>
                      <span className="ti-faq-qtext">{item.question}</span>
                    </span>
                    <span className="ti-plus" aria-hidden>
                      +
                    </span>
                  </summary>
                  <div className="ti-faq-content">
                    <div className="ti-faq-content-inner">
                      <p className="ti-faq-confirmed">Confirmed</p>
                      <p className="ti-faq-answer">{item.answer}</p>
                    </div>
                  </div>
                </details>
                {index === 2 && (
                  <aside className="ti-faq-inline-cta" aria-label="Donation prompt">
                    <p className="ti-faq-inline-cta__text">
                      Convinced? Every answer above is backed by a dog waiting for you.
                    </p>
                    <TrackedDonateLink href="/donate" className="ti-btn ti-btn-primary ti-btn-sm">
                      Donate now →
                    </TrackedDonateLink>
                  </aside>
                )}
              </Fragment>
            ))}

            <div className="ti-faq-rule ti-faq-rule--spaced" aria-hidden />

            <footer className="ti-faq-outro">
              <p className="ti-faq-outro__title">Still have questions?</p>
              <p className="ti-faq-outro__lede">
                We answer every message — or you can put your support where it counts today.
              </p>
              <div className="ti-faq-outro__actions">
                <Link href="/contact" className="ti-btn ti-btn-ghost ti-btn-sm ti-faq-outro__btn">
                  Ask us directly
                </Link>
                <TrackedDonateLink href="/donate" className="ti-btn ti-btn-primary ti-btn-sm">
                  Support a rescue
                </TrackedDonateLink>
              </div>
            </footer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
