import Image from "next/image";

const QR_SRC = "/donate-qr-en.png";
const QR_WIDTH = 258;
const QR_HEIGHT = 250;
const DONATE_URL = "https://www.savedsouls-foundation.org/en/r/donate-en";
const DONATE_URL_DISPLAY = "savedsouls-foundation.org/en/r/donate-en";

type DonateQrSealProps = {
  variant: "seal" | "compact";
};

export default function DonateQrSeal({ variant }: DonateQrSealProps) {
  const linkProps = {
    href: DONATE_URL,
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };

  if (variant === "compact") {
    return (
      <a
        {...linkProps}
        className="inline-flex flex-col items-center gap-1.5 no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e8a33d]"
        aria-label="Scan to donate"
      >
        <Image
          src={QR_SRC}
          width={QR_WIDTH}
          height={QR_HEIGHT}
          alt="QR-code om te doneren aan Saved Souls Foundation"
          className="block w-16 h-auto"
        />
        <span className="font-mono text-[0.62rem] tracking-wider uppercase text-white/72">
          Scan to donate
        </span>
      </a>
    );
  }

  return (
    <a
      {...linkProps}
      className="ti-qr-seal ti-qr-seal--seal"
      aria-label="Scan to verify and donate"
    >
      <span className="ti-qr-seal__seal-label">SCAN TO VERIFY &amp; DONATE</span>
      <Image
        src={QR_SRC}
        width={QR_WIDTH}
        height={QR_HEIGHT}
        alt="QR-code om te doneren aan Saved Souls Foundation"
        className="ti-qr-seal__img"
      />
      <span className="ti-qr-seal__url">{DONATE_URL_DISPLAY}</span>
    </a>
  );
}
