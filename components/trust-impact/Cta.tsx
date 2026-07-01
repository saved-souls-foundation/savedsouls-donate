import Image from "next/image";
import { Link } from "@/i18n/navigation";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";
import DonateQrSeal from "./DonateQrSeal";
import { TI_IMAGES } from "./images";
import Reveal from "./Reveal";

export default function Cta() {
  return (
    <div className="ti-cta text-rice text-center py-[100px]">
      {/* LET OP: black-dog-closeup.png is bewust de achtergrond van deze sectie — niet
          verwijderen of overschrijven bij toekomstige wijzigingen aan Cta.tsx */}
      <Image
        src={TI_IMAGES.blackDogCloseup.src}
        alt=""
        fill
        unoptimized
        loading="eager"
        sizes="100vw"
        className="ti-cta__photo"
        aria-hidden
      />
      <div className="ti-cta__gradient" aria-hidden />
      <div className="ti-wrap relative z-[2]">
        <Reveal>
          <h2 className="font-semibold text-[clamp(2rem,4vw,3rem)] m-0 mb-[18px] text-rice drop-shadow-[0_1px_2px_rgba(19,36,32,0.45)]">
            They came broken.
            <br />
            They leave whole.
          </h2>
        </Reveal>
        <Reveal>
          <p className="max-w-[48ch] mx-auto mb-9 text-[1.05rem] text-[rgba(247,241,227,0.96)] leading-[1.6] drop-shadow-[0_1px_2px_rgba(19,36,32,0.4)]">
            Every fact above is real. So is every dog waiting for a wheelchair, a meal, or someone to say they matter.
          </p>
        </Reveal>
        <Reveal>
          <div className="ti-cta-row">
            <div className="ti-hero-actions justify-center md:justify-start">
              <TrackedDonateLink href="/donate" className="ti-btn ti-btn-primary !bg-ink hover:!bg-[#0d1a17]">
                Donate now →
              </TrackedDonateLink>
              <Link href="/sponsor" className="ti-btn ti-btn-ghost !border-[rgba(247,241,227,0.5)]">
                Sponsor a dog
              </Link>
            </div>
            <DonateQrSeal variant="seal" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
